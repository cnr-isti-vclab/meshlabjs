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
     * Associative array that contains all the scene level "background"
     * decorators (axes, background grid etc..)
     * @type MLJ.util.AssociativeArray
     * @memberOf MLJ.core.Scene
     */
    var _decorators = new MLJ.util.AssociativeArray();

    /**
     * Associative array that contains all the currently active post process
     * rendering passes. For details see {@link MLJ.core.Scene.addPostProcessPass}.
     * @type MLJ.util.AssociativeArray
     * @memberOf MLJ.core.Scene
     */
    var _postProcessPasses = new MLJ.util.AssociativeArray();

    /**
     * Reference to current layer
     * @type MLJ.core.Layer
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
    var _layersGroup;
    var _decoratorsGroup;

    var _camera;

    var _lightControls;
    var _customLight;
    var _lightPressed;

    var _cameraPosition;

    var _cameraPositionCopy; // Used as copy when Shift + C is pressed, so that it stays different from the camera position set in the "Camera Position" dialog

    /**
     * This scene contains 2D overlays that are drawn on top of everything else
     * @memberOf MLJ.core.Scene
     */
    var _scene2D;

    /**
     * "Fake" camera object passed to the renderer when rendering the <code>_scene2D</code>
     */
    var _camera2D;

    var _stats;
    var _controls;

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

    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms
        stats.active = false;

        // Align top-right
        stats.domElement.style.visibility = 'hidden';
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;

        $("#_3D").append( stats.domElement );

        return stats;
    }

//SCENE INITIALIZATION  ________________________________________________________

    function initScene() {
        var _3DSize = get3DSize();

        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(45, _3DSize.width / _3DSize.height, 0.1, 1800);
        
        _camera.position.z = 15;

        _group = new THREE.Object3D();
        _scene.add(_group);

        _layersGroup = new THREE.Object3D();
        _group.add(_layersGroup);
        _decoratorsGroup = new THREE.Object3D();
        _group.add(_decoratorsGroup);

        _scene2D = new THREE.Scene();
        _camera2D = new THREE.OrthographicCamera(0 , _3DSize.width / _3DSize.height, 1, 0, -1, 1);
        _camera2D.position.z = -1;

        _renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer:true});
        //_renderer.shadowMapEnabled = true;
        //_renderer.context.getSupportedExtensions();
        _renderer.context.getExtension("EXT_frag_depth");


        _renderer.setPixelRatio( window.devicePixelRatio );
        _renderer.setSize(_3DSize.width, _3DSize.height);
        $('#_3D').append(_renderer.domElement);
        _scene.add(_camera);

        _stats = initStats();
        /*
        requestAnimationFrame(function updateStats() {
                                _stats.update();
                                requestAnimationFrame(updateStats); });
        */
        //INIT LIGHTS
        _this.lights.AmbientLight = new MLJ.core.AmbientLight(_scene, _camera, _renderer);
        _this.lights.Headlight = new MLJ.core.Headlight(_scene, _camera, _renderer);

        _this.lights.Headlight.setPosition(_camera.position);

        _lightPressed = false;
        _customLight = false;

        //INIT CONTROLS
        var container = document.getElementsByTagName('canvas')[0];
        _controls = new THREE.TrackballControls(_camera, container);
        _controls.rotateSpeed = 4.0;
        _controls.zoomSpeed = 1.2;
        _controls.panSpeed = 2.0;
        _controls.noZoom = false;
        _controls.noPan = false;
        _controls.staticMoving = true;
        _controls.dynamicDampingFactor = 0.3;
        _controls.keys = [65, 83, 68];

        let prepareLightControls = () => {

            var bbox = _this.getBBox();
            var distance = bbox.min.distanceTo(bbox.max);
            var offset = bbox.center();

            dummyOrigin = new THREE.Object3D();               
            dummyOrigin.position.set(offset.x,offset.y,offset.z);

            _lightControls = new THREE.TransformControls(_camera, container);
            _lightControls.setMode('rotate');
            _lightControls.setSpace('local');
            _lightControls.setSize((bbox.min.distanceTo(bbox.max)) / 15.0);
            _lightControls.name = 'lightControls';

            _lightControls.attach(_this.lights.Headlight.getMesh());
            _lightControls.update();

            var lightp = new THREE.Vector3().copy(_this.lights.Headlight.getLocalPosition());
                        
            var geo = new THREE.Geometry();
            geo.vertices.push(
                new THREE.Vector3(lightp.x, lightp.y, lightp.z).multiplyScalar(distance / 25),
                new THREE.Vector3(-lightp.x, -lightp.y, -lightp.z).multiplyScalar(distance / 25)
            );
            var lineMaterial = new THREE.LineBasicMaterial({
                color: 0xFF0000
            });

            var line = new THREE.Line(geo, lineMaterial);
            var line1 = line.clone(), line2 = line.clone(), line3 = line.clone(), line4 = line.clone();
            var line5 = line.clone(), line6 = line.clone(), line7 = line.clone(), line8 = line.clone();

            line1.translateX( distance / 4); line2.translateX(-distance / 4); 
            line3.translateY( distance / 4); line4.translateY(-distance / 4); 

            line5.translateX( distance / 4); line5.translateY( distance / 4);
            line6.translateX(-distance / 4); line6.translateY( distance / 4);
            line7.translateX(-distance / 4); line7.translateY(-distance / 4);
            line8.translateX( distance / 4); line8.translateY(-distance / 4);

            var lines = new THREE.Object3D();
            lines.add(line); lines.add(line1); lines.add(line2); lines.add(line3); lines.add(line4); 
            lines.add(line5); lines.add(line6); lines.add(line7); lines.add(line8);

            lines.quaternion.copy(_this.lights.Headlight.getMesh().getWorldQuaternion());

            /* every time TransformControls gets updated, update the guidelines rotation */
            _lightControls.addEventListener('change', () => {
                _lightControls.update();
                lines.quaternion.copy(_this.lights.Headlight.getMesh().getWorldQuaternion());
                _this.render();
            });

            /* add lightControls to dummyOrigin, this way it will always be centered */
            dummyOrigin.add(_lightControls);
            dummyOrigin.add(lines);
            dummyOrigin.updateMatrix();
            dummyOrigin.updateMatrixWorld(true);

            _this.addSceneDecorator(_lightControls.name, dummyOrigin);
        }

        $(document).keyup(function (event) {
            if(event.ctrlKey || event.shiftKey || event.altKey) {
              event.preventDefault();
              if (_lightPressed) {
                _this.removeSceneDecorator(_lightControls.name);
                _lightControls.detach();
                _lightPressed = false;
                _controls.enabled = true;
                _this.render();
              }
            }
        });

        $(document).keydown(function(event) {
            /* CTRL+ALT+SHIFT+H => reset */
            if(event.ctrlKey && event.shiftKey && event.altKey && event.which === 72) {
                event.preventDefault();
                _customLight = false;
                // reset transformations applied on light 
                _this.lights.Headlight.getMesh().position.set(0,0,0);
                _this.lights.Headlight.getMesh().scale.set(1,1,1);
                _this.lights.Headlight.getMesh().quaternion.set(0,0,0,1);
                _this.lights.Headlight.getMesh().updateMatrix();
                _this.lights.Headlight.getMesh().updateMatrixWorld(true);
                // center light back in camera position (with small offset)
                _this.lights.Headlight.setPosition(_camera.position);
                // draw scene
                _this.render();
                return;
            }
            /* CTRL+ALT+SHIFT (keep pressed) => light moving */
            if(event.ctrlKey && event.shiftKey && event.altKey) {
              // if already moving don't do everything again
              event.preventDefault();
              if(_lightPressed) return;

              _lightPressed = true;
              _customLight = true;
              _controls.enabled = false;
              prepareLightControls();     
              _this.render();
            }

            if((event.ctrlKey || (event.metaKey && event.shiftKey)) && event.which === 72) {
                event.preventDefault();
                _controls.reset();
            }

            // Shift + C -> copies camera position
            if((event.shiftKey || (event.metaKey && event.shiftKey)) && event.which === 67) {
                event.preventDefault();
                _this.copyCameraPositionJSON();
                console.log("Viewpoint copied");
            }

            // Shift + V -> sets camera position
            if((event.shiftKey || (event.metaKey && event.shiftKey)) && event.which === 86) {
                event.preventDefault();

                if(_cameraPositionCopy)
                {
                    _this.setCameraPositionJSON(JSON.stringify(_cameraPositionCopy, null, 4));
                    console.log("Viewpoint pasted");
                }
            }
        });

        //EVENT HANDLERS
        var $canvas = $('canvas')[0];
        $canvas.addEventListener('touchmove', _controls.update.bind(_controls), false);
        $canvas.addEventListener('mousemove', _controls.update.bind(_controls), false);
        $canvas.addEventListener('mousewheel', _controls.update.bind(_controls), false);
        $canvas.addEventListener('DOMMouseScroll', _controls.update.bind(_controls), false ); // firefox

        /* 
            Light is now bound to the scene (not the camera) so I have to update its location
            every time the camera move, if the light is not locked up by user
        */
        _controls.addEventListener('change', function () {       
            if(!_customLight) 
                _this.lights.Headlight.setPosition(_camera.position);
        
            MLJ.core.Scene.render();
            $($canvas).trigger('onControlsChange');
        });

        $(window).resize(function () {
            var size = get3DSize();

            _camera.aspect = size.width / size.height;
            _camera.updateProjectionMatrix();
            _renderer.setSize(size.width, size.height);


            colorBuffer.setSize(size.width, size.height);
            targetBuffer.setSize(size.width, size.height);

            _camera2D.left = size.width / size.height;
            _camera2D.updateProjectionMatrix;

            MLJ.core.Scene.render();
        });

        $(document).on("MeshFileOpened",
                function (event, layer) {
                    MLJ.core.Scene.addLayer(layer);
                });

        $(document).on("MeshFileReloaded",
                function (event, layer) {

                    // Restore three geometry to reflect the new state of the vcg mesh
                    layer.updateThreeMesh();

                    /**
                     *  Triggered when a layer is reloaded
                     *  @event MLJ.core.Scene#SceneLayerReloaded
                     *  @type {Object}
                     *  @property {MLJ.core.Layer} layer The reloaded mesh file
                     *  @example
                     *  <caption>Event Interception:</caption>
                     *  $(document).on("SceneLayerReloaded",
                     *      function (event, layer) {
                     *          //do something
                     *      }
                     *  );
                     */
                    $(document).trigger("SceneLayerReloaded", [layer]);
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
        console.time("Time to update bbox: ");
        _group.scale.set(1,1,1);
        _group.position.set(0,0,0);
        _group.updateMatrixWorld();

        if (_layers.size() === 0) // map to the canonical cube
            BBGlobal = new THREE.Box3(new THREE.Vector3(-1,-1,-1), new THREE.Vector3(1,1,1));
        else {
            // Defining the starting bounding box as the one from the first layer
            BBGlobal = new THREE.Box3().setFromObject(_layers.getFirst().getThreeMesh());

            var iter = _layers.iterator();

            // Iterating over all the layers
            while(iter.hasNext()) {
               // Getting the bounding box of the current layer
               var bbox = new THREE.Box3().setFromObject(iter.next().getThreeMesh());

               // Applying the union of the previous bounding box to the current one
               BBGlobal.union(bbox);
            }
        }
        var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
        var offset = BBGlobal.center().negate();
        offset.multiplyScalar(scaleFac);
        _group.scale.set(scaleFac,scaleFac,scaleFac);
        _group.position.set(offset.x,offset.y,offset.z);
        _group.updateMatrixWorld();
        //console.log("Position:" + offset.x +" "+ offset.y +" "+ offset.z );
        //console.log("ScaleFactor:" + _group.scale.x  +" "+ _group.scale.x  +" "+ _group.scale.x);
        //console.timeEnd("Time to update bbox: ");
        return BBGlobal;
    }

    this.getBBox = function () {
        return _computeGlobalBBbox();
    }

    this.lights = {
        AmbientLight: null,
        Headlight: null
    };

    this.getCamera = function() {
        return _camera;
    };

    this.getStats = function() {
        return _stats;
    }

    this.getThreeJsGroup = function() {
        return _group;
    }

    this.getLayersGroup = function () {
      return _layersGroup;
    }

    this.getDecoratorsGroup = function () {
      return _decoratorsGroup;
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
         *  @property {MLJ.core.Layer} layer The selected mesh file
         *  @example
         *  <caption>Event Interception:</caption>
         *  $(document).on("SceneLayerSelected",
         *      function (event, layer) {
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
        if (layer.__mlj_histogram) {
            if (visible) layer.__mlj_histogram.show();
            else layer.__mlj_histogram.hide();
        }

        MLJ.core.Scene.render();
    };

    /**
     * Adds a new layer in the scene
     * @param {MLJ.core.Layer} layer The mesh file to add
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele
     */
    this.addLayer = function (layer) {
        if (!(layer instanceof MLJ.core.Layer)) {
            console.error("The parameter must be an instance of MLJ.core.Layer");
            return;
        }

        // Initialize the THREE geometry used by overlays and rendering params
        layer.initializeRenderingAttributes();
        _layersGroup.add(layer.getThreeMesh());

        //Add new mesh to associative array _layers

        _layers.set(layer.name, layer);
        _selectedLayer = layer;

        _computeGlobalBBbox();

        /**
         *  Triggered when a layer is added
         *  @event MLJ.core.Scene#SceneLayerAdded
         *  @type {Object}
         *  @property {MLJ.core.Layer} layer The last mesh file added
         *  @property {Integer} layersNumber The number of layers in the scene
         *  @example
         *  <caption>Event Interception:</caption>
         *  $(document).on("SceneLayerAdded",
         *      function (event, layer, layersNumber) {
         *          //do something
         *      }
         *  );
         */
        $(document).trigger("SceneLayerAdded", [layer, _layers.size()]);

        //render the scene
        _this.render();
    };

    this.addOverlayLayer = function(layer, name, mesh, overlay2D) {
        if(!(mesh instanceof THREE.Object3D)) {
            console.warn("mesh parameter must be an instance of THREE.Object3D");
            return;
        }

        layer.overlays.set(name,mesh);
        mesh.name = name;

        mesh.visible = layer.getThreeMesh().visible;
        if (overlay2D) {
            _scene2D.add(mesh);
        } else {
//            _group.add(mesh);
            layer.getThreeMesh().add(mesh);
        }

        _this.render();
    };

    function disposeObject(obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
        if (obj.texture) obj.texture.dispose();
    }

    this.removeOverlayLayer = function(layer, name, overlay2D) {
        var mesh = layer.overlays.getByKey(name);

        if (mesh !== undefined) {
            mesh = layer.overlays.remove(name);

            if (overlay2D) {
                _scene2D.remove(mesh);
            } else {
                layer.getThreeMesh().remove(mesh);
//                _group.remove(mesh);
            }

            mesh.traverse(disposeObject);
            disposeObject(mesh);

            _this.render();
        }
    };

    /**
     * Updates a layer. This function should be called if the <code>layer</code>
     * geometry or properties was modified.
     * @param {MLJ.core.Layer} layer The mesh file corresponding to the level
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele
     * @example
     * //Apply Laplacian smooth filter
     * Module.LaplacianSmooth(layer.ptrMesh, 1, false);
     * //The filter has changed mesh geometry ...
     * scene.updateLayer(layer);
     */
    this.updateLayer = function (layer) {
        if (layer instanceof MLJ.core.Layer) {

            if (_layers.getByKey(layer.name) === undefined) {
                console.warn("Trying to update a layer not in the scene.");
                return;
            }

            layer.updateThreeMesh();
            _computeGlobalBBbox();

            //render the scene
            this.render();

            /**
             *  Triggered when a layer is updated
             *  @event MLJ.core.Scene#SceneLayerUpdated
             *  @type {Object}
             *  @property {MLJ.core.Layer} layer The updated mesh file
             *  @example
             *  <caption>Event Interception:</caption>
             *  $(document).on("SceneLayerUpdated",
             *      function (event, layer) {
             *          //do something
             *      }
             *  );
             */
            $(document).trigger("SceneLayerUpdated", [layer]);

        } else {
            console.error("The parameter must be an instance of MLJ.core.Layer");
        }
    };

    /**
     * Returns the layer corresponding to the given name
     * @param {String} name The name of the layer
     * @memberOf MLJ.core.Scene
     * @return {MLJ.core.Layer} The layer corresponding to the given name
     * @author Stefano Gabriele
     */
    this.getLayerByName = function (name) {
        return _layers.getByKey(name);
    };

    function disambiguateName(meshName) {
        var prefix, ext;
        var ptIndex = meshName.lastIndexOf('.');
        if (ptIndex > 0) {
            prefix = meshName.substr(0, ptIndex);
            ext = meshName.substr(ptIndex);
        } else {
            prefix = meshName;
            ext = "";
        }

        if (/\[(\d+)\]$/.test(prefix)) {
            prefix = prefix.substr(0, prefix.lastIndexOf("["));
        }

        var maxNumTag = 0;
        while (true) {
            var collision = false;
            var layerIterator = MLJ.core.Scene.getLayers().iterator();
            while (layerIterator.hasNext() && !collision) {
                if (meshName === layerIterator.next().name) collision = true;
            }
            if (collision) meshName = prefix + "[" + ++maxNumTag + "]" + ext;
            else break;
        }
        return meshName;
    }


    /**
     * Creates a new mesh file using the c++ functions bound to JavaScript
     * @param {String} name The name of the new mesh file
     * @memberOf MLJ.core.File
     * @returns {MLJ.core.Layer} The new layer
     * @author Stefano Gabriele
     */
    this.createLayer = function (name) {
        var layerName = disambiguateName(name);
        var layer = new MLJ.core.Layer(layerName, new Module.CppMesh());
        return layer;
    };

    /**
     * Removes the layer corresponding to the given name
     * @param {String} name The name of the layer which must be removed
     * @memberOf MLJ.core.Scene
     * @author Stefano Gabriele
     */
    this.removeLayerByName = function (name) {
        var layer = this.getLayerByName(name);

        if (layer !== undefined) {
            //remove layer from list
            _layers.remove(name);
            _layersGroup.remove(layer.getThreeMesh());
            $(document).trigger("SceneLayerRemoved", [layer, _layers.size()]);

            layer.dispose();

            if(_layers.size() > 0) {
                _this.selectLayerByName(_layers.getFirst().name);
            } else {
                _this._selectedLayer = undefined;
            }

            _computeGlobalBBbox();


            MLJ.core.Scene.render();
        }
    };

    /**
     * Adds a scene decorator. A scene decorator differs fron an overlay layer in
     * that it's not tied to a particular layer, but to the scene as a whole (for
     * example an axes descriptor that highlights the direction of the x, y, and z
     * coordinates).
     * @param {String} name - The name of the decorator
     * @param {THREE.Object3D} decorator - The decorator object
     * @memberOf MLJ.core.Scene
     */
    this.addSceneDecorator = function(name, decorator) {
        if(!(decorator instanceof THREE.Object3D)) {
            console.warn("MLJ.core.Scene.addSceneDecorator(): decorator parameter not an instance of THREE.Object3D");
            return;
        }

        _decorators.set(name, decorator)
        _decoratorsGroup.add(decorator);

        _this.render();
    };

    /**
     * Removes a decorator object from the scene.
     * @param {String} name - The name of the decorator to remove
     * @memberOf MLJ.core.Scene
     */
    this.removeSceneDecorator = function(name) {
        var decorator = _decorators.getByKey(name)

        if (decorator !== undefined) {
            var mesh = _decorators.remove(name);
            _decoratorsGroup.remove(decorator);

            mesh.traverse(disposeObject);
            disposeObject(mesh);
        } else {
            console.warn("Warning: " + name + " decorator not in the scene");
        }

        //render the scene
        _this.render();
    };

    /**
     * Returns the currently selected layer
     * @returns {MLJ.core.Layer} The currently selected layer
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

    this.getDecorators = function () {
      return _decorators;
    }

    this.get3DSize = function() { return get3DSize(); };
    this.getRenderer = function() { return _renderer; };

    this.getScene = function () {return _scene;};

    /**
     * Adds a post process pass to the rendering chain. As of now the interface
     * to post process effects is minimal: an effect is simply a callable object
     * that must accept two render buffers as parameters. The first buffer
     * contains the color generated by the rendering chain of MeshLabJS up to
     * the effect invocation, (this includes the basic scene rendering plus the
     * result of any post process effect that was applied before the current
     * one). The second buffer must be used as the render target of the pass,
     * will be forwarded as input to the next effect, or will be transfered to
     * the canvas if no other effects are active. Both buffers have the same
     * size as the page canvas. Any other information that may be needed by an
     * effect must be passed with closure variables or queried directly to
     * {@link MLJ.core.Scene}.
     *
     * @param {String} name - The name of the pass
     * @param {Object} pass - The callable (function) object that will apply the pass
     * @memberOf MLJ.core.Scene
     */
    this.addPostProcessPass = function (name, pass) {
        if(!jQuery.isFunction(pass)) {
            console.warn("MLJ.core.Scene.addPostProcessPass(): pass parameter must be callable");
            return;
        }
        _postProcessPasses.set(name, pass);
    }

    /**
     * Removes a post process effect from the rendering chain.
     * @param {String} name - The name of the pass to remove
     * @memberOf MLJ.core.Scene
     */
    this.removePostProcessPass = function (name) {
        var pass = _postProcessPasses.remove(name);
        if (pass == undefined) {
            console.warn("Warning: " + name + " pass not enabled");
        }

        _this.render();
    }

    var colorBuffer = new THREE.WebGLRenderTarget(0, 0, {
        type: THREE.FloatType,
        minFilter: THREE.NearestFilter
    });
    var targetBuffer = new THREE.WebGLRenderTarget(0, 0, {
        type: THREE.FloatType,
        minFilter: THREE.NearestFilter
    });

    var plane = new THREE.PlaneBufferGeometry(2, 2);
    var quadMesh = new THREE.Mesh(
        plane
    );

    var quadScene = new THREE.Scene();
    quadScene.add(quadMesh);

    quadMesh.material = new THREE.ShaderMaterial({
        vertexShader:
            "varying vec2 vUv; \
             void main(void) \
             { \
                 vUv = uv; \
                 gl_Position = vec4(position.xyz, 1.0); \
             }",
        fragmentShader:
            "uniform sampler2D offscreen; \
             varying vec2 vUv; \
             void main(void) { gl_FragColor = texture2D(offscreen, vUv.xy); }"
    });
    quadMesh.material.uniforms = {
            offscreen: { type: "t", value: null }
    };


    /**
     * Renders the scene. If there are no post process effects enabled, the
     * THREE.js scene that contains all the scene decorators and the overlay
     * layers is rendered straight to the canvas. Otherwise, the basic scene is
     * rendered to an off screen render target, and post process effects are
     * applied one after the other (according to the user's activation order)
     * before displaying the result.
     * @memberOf MLJ.core.Scene
     */
    this.render = function (fromReqAnimFrame) {

        if (_stats.active && !fromReqAnimFrame) {
            return;
        }

        if (_postProcessPasses.size() > 0) {
            _renderer.render(_scene, _camera, colorBuffer, true);

            var it = _postProcessPasses.iterator();

            while (it.hasNext()) {
                var pass = it.next();
                pass(colorBuffer, targetBuffer);
                // Swap rendering targets for the next pass
                var tmp = colorBuffer;
                colorBuffer = targetBuffer;
                targetBuffer = tmp;
            }

            // final pass, render colorBuffer to the screen
            quadMesh.material.uniforms.offscreen.value = colorBuffer;
            _renderer.render(quadScene, _camera2D);
        } else {
            _renderer.render(_scene, _camera);
        }

        // render the 2D overlays
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


    this.takeCameraPositionJSON = function() {
        // The JSON is a simple javascript object that will get "stringified" with the JSON object function
        _cameraPosition = {
            camera: _controls.object.position.clone(),
            fov: _controls.object.fov,
            up: _controls.object.up.clone(),
            target: _controls.target.clone()
        };

        // We stringify the object; the other parameters define the spacing between the elements
        return JSON.stringify(_cameraPosition, null, 4);
    };

    // This function behaves like the function above, only it saves the values in a different variable and doesn't stringify the object
    this.copyCameraPositionJSON = function() {
        // The JSON is a simple javascript object that will get "stringified" with the JSON object function
        _cameraPositionCopy = {
            camera: _controls.object.position.clone(),
            fov: _controls.object.fov,
            up: _controls.object.up.clone(),
            target: _controls.target.clone()
        };
    };


    this.setCameraPosition = function (cameraPos, target, up, fov) {
        // Changing the parameters
        _controls.target.copy(target );
        _controls.object.position.copy(cameraPos);
        _controls.object.up.copy(up);
        _controls.object.fov = fov;

        // Updating the camera projection matrix; needed if the view was changed
        _controls.object.updateProjectionMatrix();

        // Changing the view direction
        _controls.object.lookAt( _controls.target );

        // Event taken from the TrackballControls class
        var changeEvent = { type: 'change' }

        // Notifying the controls object of the event and updating
        _controls.dispatchEvent( changeEvent);
        _controls.update();
    };

    this.setCameraPositionJSON = function(cameraJSON) {
        var success = true;

        try {
            var parsedJSON = JSON.parse(cameraJSON);

            // If any of the properties of the parsed JSON object is undefined (that is, it wasn't found), there is an error in the JSON syntax
            if (parsedJSON.camera.x === undefined || parsedJSON.camera.y === undefined || parsedJSON.camera.z === undefined ||
                parsedJSON.up.x === undefined || parsedJSON.up.y === undefined || parsedJSON.up.z === undefined ||
                parsedJSON.target.x === undefined|| parsedJSON.target.y === undefined || parsedJSON.target.z === undefined ||  parsedJSON.fov === undefined)
            {
                success = false;
            }
            // If the "up" vector is the zero vector, it's not valid
            else if(!parsedJSON.up.x && !parsedJSON.up.y && !parsedJSON.up.z)
                success = false;
            // If the fov is below 1, throw an error
            else if(parsedJSON.fov < 1)
                success = false;
            // Otherwise, we're good to go
            else
            {
                // If the parameters taken for the camera position are all 0, it would break the camera; it's not worth to throw an error, so we
                // just set the z value to be a little more than 0
                if(!parsedJSON.camera.x && !parsedJSON.camera.y && !parsedJSON.camera.z)
                    parsedJSON.camera.z = 0.1;

                // Now that we have all parameters, we can change the viewpoint
                _this.setCameraPosition(parsedJSON.camera, parsedJSON.target, parsedJSON.up, parsedJSON.fov);
            }
        }
        catch(e) {
            success = false;
        }

        return success;
    }


    this.resetTrackball = function() {
        _controls.reset();
    };


    //INIT
    $(window).ready(function () {
        initScene();
        initDragAndDrop();
    });

}).call(MLJ.core.Scene);
