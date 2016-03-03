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

MLJ.core.SceneHistory = function () { //class SceneHistory, stores a list of SceneChange
    var listSceneChange=new Array();
    var tmpSC; //temporary object to store the actual scene changes
    
    this.openSC=function () //aggiungere mandante della applyto
    //creates a new SceneChange object to store LayerChanges
    {
        tmpSC=new MLJ.core.SceneChange();
    }
    //"closes" the registration of LayerChanges and stores it in the array.
    //This is called at every Filter applied, Layer selected or deleted
    this.closeSC=function () 
    {
        listSceneChange.push(tmpSC);
        tmpSC=undefined;
    }
    this.addLC=function(newLC) //adds a new LayerChange to the actual SceneChange
    {
        if(tmpSC==undefined) //if it's the first LayerChange, creates a new SceneChange
            this.openSC();
        tmpSC.add(newLC);
    }
    this.toString=function () //debug function to see the result
    {
        return "SceneChange: "+listSceneChange.map(function(e){return e.toString()}).toString();
    }
};
MLJ.core.SceneChange = function () { //Scene Changes class, stores a list of LayerChanges
    var listLayerChange=new Array();
    this.add=function (newLC) //adds a new LayerChange to the array
    {
        if(newLC instanceof MLJ.core.LayerChange)
        {
            listLayerChange.push(newLC);
            MLJ.widget.Log.append(newLC.toString());
        }
    }
    this.toString=function () //debug function to see the content
    {
        return listLayerChange.map(function (e) {return e.toString()}).toString();
    }
};
MLJ.core.LayerChange=function (id,type) //LayerChange class, structured as 
{
    var LayerID; //id of the layer changed
    var ChangeType; //type of the change applied to the layer - structure ahead
    LayerID=id;
    ChangeType=type;
    
    this.toString=function()
    {
        return "LayerID: "+LayerID+ " "+ ChangeType;
    }
    
};
MLJ.core.ChangeType= //ChangeType is structured like an enumerator which map every type as an integer *provvisory*
{
    Creation:"Create",
    Deletion:"Delete", 
    Modification:"Modify",
    Selection:"Select",
    Unselection:"UnSelect"

};
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
MLJ.core.Scene.history=new MLJ.core.SceneHistory();
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
    
    var _camera;

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
        
        $(document).keydown(function(event) {           
            if((event.ctrlKey || (event.metaKey && event.shiftKey)) && event.which === 72) {
                event.preventDefault();
                _controls.reset();
            }
        });
        
        //INIT LIGHTS 
        _this.lights.AmbientLight = new MLJ.core.AmbientLight(_scene, _camera, _renderer);
        _this.lights.Headlight = new MLJ.core.Headlight(_scene, _camera, _renderer);

        //EVENT HANDLERS
        var $canvas = $('canvas')[0];
        $canvas.addEventListener('touchmove', _controls.update.bind(_controls), false);
        $canvas.addEventListener('mousemove', _controls.update.bind(_controls), false);        
        $canvas.addEventListener('mousewheel', _controls.update.bind(_controls), false);        
        $canvas.addEventListener('DOMMouseScroll', _controls.update.bind(_controls), false ); // firefox
        
        _controls.addEventListener('change', function () {            
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
        var BBGlobal;
        if (_layers.size() === 0) // map to the canonical cube
            BBGlobal = new THREE.Box3(new THREE.Vector3(-1,-1,-1), new THREE.Vector3(1,1,1));
        else {
            BBGlobal = new THREE.Box3(); // map to the layers' boxes union
            iter = _layers.iterator();
            while (iter.hasNext()) {
                threeMesh = iter.next().getThreeMesh();
                var bbox = new THREE.Box3().setFromObject(threeMesh);
                BBGlobal.union(bbox);
            }
        }
        var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
        var offset = BBGlobal.center().negate();;
        _group.scale.set(scaleFac,scaleFac,scaleFac);
        _group.position.set(offset.x*scaleFac,offset.y*scaleFac,offset.z*scaleFac);
        _group.updateMatrix();
//        console.log("Position:" + offset.x +" "+ offset.y +" "+ offset.z );
//        console.log("ScaleFactor:" + scaleFac);
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
        MLJ.core.Scene.history.addLC(new MLJ.core.LayerChange(_selectedLayer.id,MLJ.core.ChangeType.Selection));
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

       
        MLJ.core.Scene.history.addLC(new MLJ.core.LayerChange(layer.id,MLJ.core.ChangeType.Modification));
        MLJ.core.Scene.history.closeSC();
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
            console.error("The parameter must be an instance of MLJ.core.MeshFile");
            return;
        }
        
        // Initialize the THREE geometry used by overlays and rendering params
        layer.initializeRenderingAttributes();

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

        mesh.visible = layer.getThreeMesh().visible;
        if (overlay2D) {
            _scene2D.add(mesh);
        } else {
            _group.add(mesh);
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
                _group.remove(mesh);                        
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
    var lastID=0;
    this.createLayer = function (name) {
        var layerName = disambiguateName(name);
        var layer = new MLJ.core.Layer(lastID++,layerName, new Module.CppMesh());
        MLJ.core.Scene.history.addLC(new MLJ.core.LayerChange(layer.id,MLJ.core.ChangeType.Creation));
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
            layer.deleted=true;
            $(document).trigger("SceneLayerRemoved", [layer, _layers.size()]);     
            if(_layers.size() > 0) {
                _this.selectLayerByName(_layers.getFirst().name);
            } else {
                _this._selectedLayer = undefined;
            }
            _computeGlobalBBbox();
            MLJ.core.Scene.history.addLC(new MLJ.core.LayerChange(layer.id,MLJ.core.ChangeType.Deletion));
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
        _group.add(decorator);

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
            _decorators.remove(name);
            _group.remove(decorator);
            decorator.geometry.dispose();
            decorator.material.dispose();  
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
    
    this.resetTrackball = function() {
        _controls.reset();
    };
    
    
    //INIT
    $(window).ready(function () {
        initScene();
        initDragAndDrop();
    });

}).call(MLJ.core.Scene);
