
(function (plugin, core, scene) {
            
    var DEFAULTS = {
        boxColor: new THREE.Color('#00FF00'),
        boxRatio: 0.3
    };

    var plug = new plugin.Rendering({
        name: "Bounding Box",
        tooltip: "Enable the visualization of mesh bounding box",
        icon: "img/icons/box.png",
        toggle: true,
        on: false,
    }, DEFAULTS);

    
    /// This function is called to build the UI parameters
    plug._init = function (guiBuilder) {
        guiBuilder.Color({
            label: "Box Color",
            tooltip: "The color of the bounding box",
            color: "#" + DEFAULTS.boxColor.getHexString(),
            bindTo: (function() {
                        var bindToFun = function (color, overlay) {
                            overlay.material.color = color;                           
                        };
                        bindToFun.toString = function () { return 'boxColor'; };
                        return bindToFun;
                    }())
        });
        
        guiBuilder.RangedFloat({
            label: "Box Corner Ratio",
            tooltip: "How large is the space between the corners of the wireframe bounding box",
            min: 0, max: 1, step: 0.1,
            defval: DEFAULTS.boxRatio,
            bindTo: (function() {
                var bindToFun = function (size, overlay) {
                    boxRatio = size;
                    plug._rebuild();
                };
                bindToFun.toString = function () { return 'boxRatio'; }
                return bindToFun;
            }())
        });

    };
    
    plug._rebuild = function() {
        var currentLayer = MLJ.core.Scene.getSelectedLayer();
        if (currentLayer.properties.getByKey("Bounding Box") === true) {
            this._applyTo(currentLayer, false);
            this._applyTo(currentLayer, true);
        }
    };
    

    // This function is the one called to actually build the ThreeJS 
    // group that contains the overlay
    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }
        
        var params = meshFile.overlaysParams.getByKey(plug.getName());

        var boxCoordBuf = Module.buildBoxCoordVec(meshFile.ptrMesh(),params.boxRatio);
        var boxCoordArray = new Float32Array(Module.HEAPU8.buffer, boxCoordBuf, 48*3);
            
        var boxGeometry = new THREE.BufferGeometry();
        boxGeometry.addAttribute('position', new THREE.BufferAttribute( boxCoordArray, 3 ) );
        var parameters = {
            color :  DEFAULTS.boxColor
        };
        var boxMaterial = new THREE.LineBasicMaterial(parameters);
        var boxMesh    = new THREE.Line(boxGeometry, boxMaterial,THREE.LinePieces);

        scene.addOverlayLayer(meshFile, plug.getName(), boxMesh);
    };


    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);