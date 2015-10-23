/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file 
 *
 * @author Stefano Gabriele
 */

/**
 * The MLJ.core.Scene namespace defines the functions to manage the scene, 
 * i.e. the set of mesh layers that constitute the ''document'' of the MeshLabJS system.
 * This namespace also actually stores the set of meshes, the reference to current mesh, 
 * the threejs container for the scene, the threejs camera and the threejs renderer 
 * (e.g. the webgl context where the scene is rendered).
 *
 * @namespace MLJ.core.Scene
 * @memberOf MLJ.core
 * @author Stefano Gabriele
 *
 */
MLJ.core.Scene = {};

(function () {

    /**
     * Associative Array that contains all the meshes in the scene 
     * @type MLJ.util.AssociativeArray
     * @memberOf MLJ.core.Scene     
     */
    var _layers = new MLJ.util.AssociativeArray();

    /**
     * Reference to current layer 
     * @type MLJ.core.MeshFile
     * @memberOf MLJ.core.Scene     
     */
    var _selectedLayer;

    /**
     * It contains the ThreeJs Representation of the current set of layers. 
     * Each Layer is associated to a ThreeJS mesh whose contained in the MLJ.core.MeshFile object.
     * @type THREE.Scene
     * @memberOf MLJ.core.Scene     
     */
    var _scene;
    
    /**
     * The ThreeJs group that contains all the layers. 
     * It also store the global transformation (scale + translation) 
     * that brings the global bbox of the scene
     * in the origin of the camera reference system. 
     * @type THREE.Object
     * @memberOf MLJ.core.Scene     
     */
    var _group;
    
    var  _camera;

    var _scene2D;
    var _camera2D;
    
    /// @type {Object}
    var _renderer;
    var _this = this;

    function get3DSize() {
        var _3D = $('#_3D');

        return {
            width: _3D.innerWidth (),
            height: _3D.innerHeight()
        };
    }

    function initDragAndDrop() {
        function FileDragHandler(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.target.files || e.dataTransfer.files;
            MLJ.core.File.openMeshFile(files);
        }

        function FileDragHover(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        $(window).ready(function () {
            var ddd = document.getElementById("_3D");
            ddd.addEventListener("dragover", FileDragHover, false);
            ddd.addEventListener("dragleave", FileDragHover, false);
            ddd.addEventListener("drop", FileDragHandler, false);
        });
    }

//SCENE INITIALIZATION  ________________________________________________________

    function initScene() {
        var _3DSize = get3DSize();

        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(45, _3DSize.width / _3DSize.height, 0.1, 1800);
        _camera.position.z = 15;
        _group = new THREE.Object3D();
        _scene.add(_group);

        _scene2D = new THREE.Scene();
        _camera2D = new THREE.OrthographicCamera(0 , _3DSize.width / _3DSize.height, 1, 0, -1, 1);
        _camera2D.position.z = -1;

        _renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true, 
            preserveDrawingBuffer:true});
        _renderer.shadowMapEnabled = true;
        
        _renderer.setPixelRatio( window.devicePixelRatio );
        _renderer.setSize(_3DSize.width, _3DSize.height);
        $('#_3D').append(_renderer.domElement);
        _scene.add(_camera);

        //INIT CONTROLS
        var container = document.getElementsByTagName('canvas')[0];
        var controls = new THREE.TrackballControls(_camera, container);
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 2.0;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];
        
        $(document).keydown(function(event) {           
            if((event.ctrlKey || (event.metaKey && event.shiftKey)) && event.which === 72) {
                event.preventDefault();
                controls.reset();
            }
        });
        
        //INIT LIGHTS 
        _this.lights.AmbientLight = new MLJ.core.AmbientLight(_scene, _camera, _renderer);
        _this.lights.Headlight = new MLJ.core.Headlight(_scene, _camera, _renderer);

        //EVENT HANDLERS
        var $canvas = $('canvas')[0];
        $canvas.addEventListener('touchmove', controls.update.bind(controls), false);
        $canvas.addEventListener('mousemove', controls.update.bind(controls), false);        
        $canvas.addEventListener('mousewheel', controls.update.bind(controls), false);        
        $canvas.addEventListener('DOMMouseScroll', controls.update.bind(controls), false ); // firefox
        
        controls.addEventListener('change', function () {            
            MLJ.core.Scene.render();
            $($canvas).trigger('onControlsChange');
        });

        $(window).resize(function () {
            var size = get3DSize();

            _camera.aspect = size.width / size.height;
            _camera.updateProjectionMatrix();
            _renderer.setSize(size.width, size.height);

            _camera2D.left = size.width / size.height;
            _camera2D.updateProjectionMatrix;

            MLJ.core.Scene.render();
        });

        $(document).on("MeshFileOpened",
                function (event, meshFile) {
                    MLJ.core.Scene.addLayer(meshFile);
                });

        $(document).on("MeshFileReloaded",
                function (event, meshFile) {
                    //remove all overlays from scene
                    var iter = meshFile.overlays.iterator();
                        
                    while(iter.hasNext()) {
                        var overlay = iter.next();
                        _group.remove(overlay);
                        _scene2D.remove(overlay);
                    }

                    if (meshFile.histogram !== undefined) {
                        $(window).off("resize", meshFile.histogram.listener);
                        meshFile.histogram.$tl.remove();
                        meshFile.histogram.$bl.remove();
                    }

                    // Restore three geometry to reflect the new state of the vcg mesh
                    meshFile.updateThreeMesh();

                    /**
                     *  Triggered when a layer is reloaded
                     *  @event MLJ.core.Scene#SceneLayerReloaded
                     *  @type {Object}
                     *  @property {MLJ.core.MeshFile} meshFile The reloaded mesh file
                     *  @example
                     *  <caption>Event Interception:</caption>
                     *  $(document).on("SceneLayerReloaded",
                     *      function (event, meshFile) {
                     *          //do something
                     *      }
                     *  );
                     */                    
                    $(document).trigger("SceneLayerReloaded", [meshFile]);
                });
    }
    
    /* Compute global bounding box and translate and scale every object in proportion 
     * of global bounding box. First translate every object into original position, 
     * then scale all by reciprocal value of scale factor (note that scale factor 
     * and original position are stored into mesh object). Then it computes 
     * global bbox, scale every object, recalculate global bbox and finally
     * translate every object in a right position.
     */
    function _computeGlobalBBbox()
    {
        var BBGlobal = new THREE.Box3();
        iter = _layers.iterator();
        while (iter.hasNext()) {
            threeMesh = iter.next().getThreeMesh();
            var bbox = new THREE.Box3().setFromObject(threeMesh);
            BBGlobal.union(bbox);
        }
        var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
        var offset = BBGlobal.center().negate();;
        _group.scale.set(scaleFac,scaleFac,scaleFac);
        _group.position.set(offset.x*scaleFac,offset.y*scaleFac,offset.z*scaleFac);
        _group.updateMatrix();
//        console.log("Position:" + offset.x +" "+ offset.y +" "+ offset.z );
//        console.log("ScaleFactor:" + scaleFac);
    }
  
    this.lights = {
        AmbientLight: null,
        Headlight: null
    };
    
    this.getCamera = function() {
        return _camera;
    };
    
    this.getThreeJsGroup = function() {
        return _group;
    }

    /**
     * Selects the layer with the name <code>layerName</code>
     * @param {String} layerName The name of the layer
     * @memberOf MLJ.core.Scene     
     * @author Stefano Gabriele
     */
    this.selectLayerByName = function (layerName) {
        _selectedLayer = _layers.getByKey(layerName);
        /**
         *  Triggered when a layer is selected
         *  @event MLJ.core.Scene#SceneLayerSelected
         *  @type {Object}
         *  @property {MLJ.core.MeshFile} meshFile The selected mesh file
         *  @example
         *  <caption>Event Interception:</caption>
         *  $(document).on("SceneLayerSelected",
         *      function (event, meshFile) {
         *          //do something
         *      }
         *  );
         */
        $(document).trigger("SceneLayerSelected", [_selectedLayer]);        
    };

    /**
     * Sets the visibility of layer with the name <code>layerName</code>
     * @param {String} layerName The name of the layer
     * @param {Boolean} visible <code>true</code> if the layers must be visible,
     * <code>false</code> otherwise
     * @memberOf MLJ.core.Scene     
     * @author Stefano Gabriele
     */
    this.setLayerVisible = function (layerName, visible) {
        var layer = _layers.getByKey(layerName);
        layer.getThreeMesh().visible = visible;
        
        var iter = layer.overlays.iterator();
        
        while(iter.hasNext()) {
            iter.next().visible = visible;
        }

        // if histogram overlay is defined show/hide labels
        if (layer.histogram !== undefined) {
            if (visible) {
                layer.histogram.$tl.show();
                layer.histogram.$bl.show();
            } else {
                layer.histogram.$tl.hide();
                layer.histogram.$bl.hide();
            }
        }
        
        MLJ.core.Scene.render();
    };

    /**
     * Adds a new layer in the scene
     * @param {MLJ.core.MeshFile} meshFile The mesh file to add
     * @memberOf MLJ.core.Scene     
     * @author Stefano Gabriele
     */
    this.addLayer = function (meshFile) {
        if (!(meshFile instanceof MLJ.core.MeshFile)) {
            console.error("The parameter must be an instance of MLJ.core.MeshFile");
            return;
        }
        
        // Initialize the THREE geometry used by overlays and rendering params
        meshFile.initializeRenderingAttributes();

        //Add new mesh to associative array _layers            
        _layers.set(meshFile.name, meshFile);
        _selectedLayer = meshFile;

        _computeGlobalBBbox();              

        /**
         *  Triggered when a layer is added
         *  @event MLJ.core.Scene#SceneLayerAdded
         *  @type {Object}
         *  @property {MLJ.core.MeshFile} meshFile The last mesh file added
         *  @property {Integer} layersNumber The number of layers in the scene
         *  @example
         *  <caption>Event Interception:</caption>
         *  $(document).on("SceneLayerAdded",
         *      function (event, meshFile, layersNumber) {
         *          //do something
         *      }
         *  );
         */
        $(document).trigger("SceneLayerAdded", [meshFile, _layers.size()]);
        
        //render the scene
        _this.render();
    };       
    
    this.addOverlayLayer = function(meshFile, name, mesh, useOrthographicProjection) {
        if(!(mesh instanceof THREE.Object3D)) {
            console.warn("mesh parameter must be an instance of THREE.Mesh");
            return;
        }
        
        meshFile.overlays.set(name,mesh);
        mesh.visible = meshFile.getThreeMesh().visible;
        if (useOrthographicProjection === true) {
            _scene2D.add(mesh);
        } else {
            _group.add(mesh);
        }

        //render the scene
        _this.render();
    };
    
    this.removeOverlayLayer = function(meshFile, name) {        
        var mesh = meshFile.overlays.getByKey(name);
        
        if(mesh !== undefined) {
            mesh = meshFile.overlays.remove(name);            
            
            _group.remove(mesh);                        
            _scene2D.remove(mesh);                        
            mesh.geometry.dispose();
            mesh.material.dispose();
            mesh.geometry = null;
            mesh.material = null;            

            if (mesh.texture) {
                mesh.texture.dispose();            
                mesh.texture = null;
            }
            _this.render();                              
        }
        
    };  

    /**
     * Updates a layer. This function should be called if the <code>meshFile</code>
     * geometry or properties was modified.
     * @param {MLJ.core.MeshFile} meshFile The mesh file corresponding to the level
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele
     * @example
     * //Apply Laplacian smooth filter
     * Module.LaplacianSmooth(meshFile.ptrMesh, 1, false);
     * //The filter has changed mesh geometry ...
     * scene.updateLayer(meshFile);
     */
    this.updateLayer = function (meshFile) {
        if (meshFile instanceof MLJ.core.MeshFile) {

            if (_layers.getByKey(meshFile.name) === undefined) {
                console.warn("Trying to update a mesh not in the scene.");
                return;
            }

            meshFile.updateThreeMesh();

            //render the scene
            this.render();

            /**
             *  Triggered when a layer is updated
             *  @event MLJ.core.Scene#SceneLayerUpdated
             *  @type {Object}
             *  @property {MLJ.core.MeshFile} meshFile The updated mesh file
             *  @example
             *  <caption>Event Interception:</caption>
             *  $(document).on("SceneLayerUpdated",
             *      function (event, meshFile) {
             *          //do something
             *      }
             *  );
             */
            $(document).trigger("SceneLayerUpdated", [meshFile]);

        } else {
            console.error("The parameter must be an instance of MLJ.core.MeshFile");
        }
    };

    /**
     * Returns the layer corresponding to the given name
     * @param {String} name The name of the layer     
     * @memberOf MLJ.core.Scene
     * @return {MLJ.core.MeshFile} The layer corresponding to the given name
     * @author Stefano Gabriele     
     */
    this.getLayerByName = function (name) {
        return _layers.getByKey(name);
    };


    /**
     * Removes the layer corresponding to the given name
     * @param {String} name The name of the layer which must be removed  
     * @memberOf MLJ.core.Scene     
     * @author Stefano Gabriele     
     */
    this.removeLayerByName = function (name) {
        var meshFile = this.getLayerByName(name);
        
        if (meshFile !== undefined) {
            //remove layer from list
            _layers.remove(name);
                             
            //remove all overlays from scene
            var iter = meshFile.overlays.iterator();
                        
            while(iter.hasNext()) {
                var overlay = iter.next();
                _group.remove(overlay);
                _scene2D.remove(overlay);
            }

            if (meshFile.histogram !== undefined) {
                $(window).off("resize", meshFile.histogram.listener);
                meshFile.histogram.$tl.remove();
                meshFile.histogram.$bl.remove();
            }
                                                
            $(document).trigger("SceneLayerRemoved", [meshFile]);
            
            meshFile.dispose();
                      
            if(_layers.size() > 0) {
                _this.selectLayerByName(_layers.getFirst().name);
            }
            
            _computeGlobalBBbox();
           
            
            MLJ.core.Scene.render(); 
        }
    };

    /**
     * Returns the currently selected layer     
     * @returns {MLJ.core.MeshFile} The currently selected layer
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele     
     */
    this.getSelectedLayer = function () {
        return _selectedLayer;
    };

    /**
     * Returns the layers list
     * @returns {MLJ.util.AssociativeArray} The layers list
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele     
     */
    this.getLayers = function () {
        return _layers;
    };

    this.get3DSize = function() { return get3DSize(); };
    this.getRenderer = function() { return _renderer; };

    /**
     * Renders the scene
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele     
     */
    this.render = function () {
        _renderer.render(_scene, _camera);
        _renderer.autoClear = false;
        _renderer.render(_scene2D, _camera2D);
        _renderer.autoClear = true;
    };
    
    this.takeSnapshot = function() {
        var canvas = _renderer.context.canvas;        
        // draw to canvas...
        canvas.toBlob(function(blob) {
            saveAs(blob, "snapshot.png");
        });
    };
    
    //INIT
    $(window).ready(function () {
        initScene();
        initDragAndDrop();
    });

}).call(MLJ.core.Scene);
