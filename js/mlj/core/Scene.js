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
 * @file Defines the functions to manage the scene, e.g. the set of mesh layers that constitute the ''document'' of the MeshLabJS system. 
 * @author Stefano Gabriele
 */

/**
 * MLJ.core.Scene namespace
 * @namespace MLJ.core.Scene
 * @memberOf MLJ.core
 * @author Stefano Gabriele
 */
MLJ.core.Scene = {};

(function () {

    //Contains all mesh in the scene
    var _layers = new MLJ.util.AssociativeArray();

    //Reference to selected layer (type MeshFile)
    var _selectedLayer;

    var _scene, _camera, _renderer;
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

        //INIT LIGHTS 
//        _this.lights.AmbientLight = new MLJ.core.AmbientLight(_scene, _camera, _renderer);
        _this.lights.Headlight = new MLJ.core.Headlight(_scene, _camera, _renderer);

        //EVENT HANDLERS
        var $canvas = $('canvas')[0];
        $canvas.addEventListener('touchmove', controls.update.bind(controls), false);
        $canvas.addEventListener('mousemove', controls.update.bind(controls), false);        
        $canvas.addEventListener('mousewheel', controls.update.bind(controls), false);        
        $canvas.addEventListener('DOMMouseScroll', controls.update.bind(controls), false ); // firefox
        
        controls.addEventListener('change', function () {                  
            MLJ.core.Scene.render();
        });

        $(window).resize(function () {
            var size = get3DSize();

            _camera.aspect = size.width / size.height;
            _camera.updateProjectionMatrix();
            _renderer.setSize(size.width, size.height);

            MLJ.core.Scene.render();
        });

        $(document).on("MeshFileOpened",
                function (event, meshFile) {
                    MLJ.core.Scene.addLayer(meshFile);
                });

        $(document).on("MeshFileReloaded",
                function (event, meshFile) {
                    MLJ.core.Scene.removeLayerByName(meshFile.name);
                    _addLayer(meshFile, true);
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
                });
    }
    
    /* Compute global bounding box and translate and scale every object in proportion 
     * of global bounding box. First translate every object into original position, 
     * then scale all by reciprocal value of scale factor (note that scale factor 
     * and original position are stored into mesh object). Then it computes 
     * global bbox, scale every object, recalculate global bbox and finally
     * translate every object in a right position.
     */
    function _computeGlobalBBbox() {
        var iter = _layers.iterator();        
        
        var threeMesh;
        while (iter.hasNext()) {
            threeMesh = iter.next().getThreeMesh();
            if (threeMesh.scaleFactor) {
                threeMesh.position.x -= threeMesh.offsetVec.x;
                threeMesh.position.y -= threeMesh.offsetVec.y;
                threeMesh.position.z -= threeMesh.offsetVec.z;
                var scaling = threeMesh.scaleFactor;
                threeMesh.scale.multiplyScalar(1 / scaling);
            }
        }

        var BBGlobal = new THREE.Box3();
        iter = _layers.iterator();
        while (iter.hasNext()) {
            threeMesh = iter.next().getThreeMesh();
            var bbox = new THREE.Box3().setFromObject(threeMesh);
            BBGlobal.union(bbox);
        }

        iter = _layers.iterator();
        while (iter.hasNext()) {
            threeMesh = iter.next().getThreeMesh();
            var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
            threeMesh.scale.multiplyScalar(scaleFac);
            threeMesh.scaleFactor = scaleFac;
        }

        BBGlobal = new THREE.Box3();
        iter = _layers.iterator();
        while (iter.hasNext()) {
            threeMesh = iter.next().getThreeMesh();
            var bbox = new THREE.Box3().setFromObject(threeMesh);
            BBGlobal.union(bbox);
        }

        iter = _layers.iterator();
        while (iter.hasNext()) {
            threeMesh = iter.next().getThreeMesh();
            var offset = new THREE.Vector3();
            offset = BBGlobal.center().negate();
            threeMesh.position.x += offset.x;
            threeMesh.position.y += offset.y;
            threeMesh.position.z += offset.z;
            threeMesh.offsetVec = offset;
        }

    }

    function _addLayer(meshFile, reloaded) {
        if (!(meshFile instanceof MLJ.core.MeshFile)) {
            console.error("The parameter must be an instance of MLJ.core.MeshFile");
            return;
        }
        //Add new mesh to associative array _layers            
        _layers.set(meshFile.name, meshFile);

        if (meshFile.cpp === true) {
            meshFile.updateThreeMesh();
        }

        //Set mesh position
        var mesh = meshFile.getThreeMesh();
        var box = new THREE.Box3().setFromObject(mesh);
        mesh.position = box.center();
//        _scene.add(mesh);

        _selectedLayer = meshFile;

        //Compute the global bounding box
        _computeGlobalBBbox();      

        if (!reloaded) {
            var layersIter = _layers.iterator();
            var layer, overlaysIter;
            while(layersIter.hasNext()) {
                layer = layersIter.next();
                overlaysIter = layer.overlays.iterator();
                while(overlaysIter.hasNext()) {
                    mesh = overlaysIter.next();                

                    mesh.position.set(
                        meshFile.threeMesh.position.x,
                        meshFile.threeMesh.position.y,
                        meshFile.threeMesh.position.z);

                    mesh.scale.set(
                        meshFile.threeMesh.scale.x,
                        meshFile.threeMesh.scale.y,
                        meshFile.threeMesh.scale.z);
                }
            }                                   
            
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
        }
        
        //render the scene
        _this.render();
    }

    this.lights = {
        AmbientLight: null,
        Headlight: null
    };

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
        
        MLJ.core.Scene.render();
    };

    /**
     * Adds a new layer in the scene
     * @param {MLJ.core.MeshFile} meshFile The mesh file to add
     * @memberOf MLJ.core.Scene     
     * @author Stefano Gabriele
     */
    this.addLayer = function (meshFile) {
        _addLayer(meshFile, false);
    };       
    
    this.addOverlayLayer = function(meshFile, name, mesh) {
        if(!(mesh instanceof THREE.Object3D)) {
            console.warn("mesh parameter must be an instance of THREE.Mesh");
            return;
        }
        
        mesh.position.set(
            meshFile.threeMesh.position.x,
            meshFile.threeMesh.position.y,
            meshFile.threeMesh.position.z);
            
        mesh.scale.set(
            meshFile.threeMesh.scale.x,
            meshFile.threeMesh.scale.y,
            meshFile.threeMesh.scale.z);
        
        meshFile.overlays.set(name,mesh);
        
        _scene.add(mesh);

        //render the scene
        _this.render();
    };
    
    this.removeOverlayLayer = function(meshFile, name) {        
        var mesh = meshFile.overlays.getByKey(name);
        
        if(mesh !== undefined) {
            mesh = meshFile.overlays.remove(name);            
            
            _scene.remove(mesh);                        
            
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

            //Trigger event
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
            _layers.remove(name);

//            _scene.remove(meshFile.getThreeMesh());
            meshFile.dispose();
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

    /**
     * Renders the scene
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele     
     */
    this.render = function () {
        _renderer.render(_scene, _camera);
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
