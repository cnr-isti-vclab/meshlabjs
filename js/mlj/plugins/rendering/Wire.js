
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#505050'),
        specular: new THREE.Color('#505050'),
        shininess: 15.0,
        thickness: 1.5,
        isShaded: 0,
        sides : THREE.DoubleSide // for backface culling
    };


    var SHADING = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            THREE.UniformsLib[ "ambient" ],          
            {
                "color": {type: "c", value: DEFAULTS.color},
                "thickness": {type: "f", value: DEFAULTS.thickness},
                "isShaded" : { type: "i", value: DEFAULTS.isShaded},
                "specular": {type: "c", value: DEFAULTS.specular},
                "shininess": {type: "f", value: DEFAULTS.shininess},
                "directionalLightPosition" : {type: "v3", value: new THREE.Vector3(0,0,1)},
                "directionalLightColor" : {type: "c", value: new THREE.Color('#ffffff')}
            }

        ])
    };


    var plug = new plugin.Rendering({
        name: "Wire",
        tooltip: "Enable the visualization of the mesh edges for the current layer",
        icon: "img/icons/wire.png",
        toggle: true,
        on: false,
        loadShader: ["WireFragment.glsl", "WireVertex.glsl"]
    }, DEFAULTS);

    var wireColor, thicknessWidget;

    plug._init = function (guiBuilder) {

        wireColor = guiBuilder.Color({
            label: "Color",
            tooltip: "The wireframe color",
            color: "#" + DEFAULTS.color.getHexString(),
            bindTo: "color"
        });

        thicknessWidget = guiBuilder.RangedFloat({
            label: "Thickness",
            tooltip: "The thickenss of the lines",
            min: 1, max: 10, step: 0.5,
            defval: DEFAULTS.thickness,
            bindTo: "thickness"
        });

        guiBuilder.Choice({
            label: "Shading",
            tooltip: "Activate/Deactivate Shading",
            options: [
                {content: "Off", value: 0, selected: true},
                {content: "On", value: 1 }
            ],
            bindTo: "isShaded"
        });

        guiBuilder.Choice({
            label: "Back Face Culling",
            tooltip: "Activate/Deactivate Back Face Culling",
            options: [
                {content: "Off", value: THREE.DoubleSide, selected: true},
                {content: "On", value: THREE.FrontSide }
            ],
            bindTo: (function() {
                var bindToFun = function (sideValue, overlay) {
                    overlay.material.side = sideValue;
                };
                bindToFun.toString = function () { return 'sides'; };
                return bindToFun;
            }())
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            Module._free(meshFile.attributesVecPtr);
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        const SIZEOF_FLOAT = 4;
        const NUM_VERTICES_PER_FACE = 3;
        const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;


        var positionPtr = Module.buildAttributesVecForWireframeRendering(meshFile.ptrMesh());
        meshFile.attributesVecPtr = positionPtr;
        var centerPtr = positionPtr + meshFile.FN * NUM_VERTICES_PER_FACE * NUM_BYTES_PER_VERTEX;
        var numFloats = (meshFile.FN * NUM_VERTICES_PER_FACE * NUM_BYTES_PER_VERTEX) / SIZEOF_FLOAT;
        var positions = new Float32Array(Module.HEAPU8.buffer, positionPtr, numFloats);
        var centers = new Float32Array(Module.HEAPU8.buffer, centerPtr, numFloats);
        var bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
        bufferGeometry.addAttribute('center', new THREE.BufferAttribute( centers, 3 ) );

        var params = meshFile.overlaysParams.getByKey(plug.getName());
        var attributes = {center: {type: 'v3', value: []}};


        var wireuniforms = THREE.UniformsUtils.clone(SHADING.uniforms);
        wireuniforms.color.value = params.color;
        wireuniforms.thickness.value = params.thickness;
        wireuniforms.isShaded.value = params.isShaded;
        wireuniforms.directionalLightPosition.value = scene.lights.Headlight.position;
        wireuniforms.directionalLightColor.value = scene.lights.Headlight.color;
        
        var parameters = {
            vertexShader: this.shaders.getByKey("WireVertex.glsl"),
            fragmentShader: this.shaders.getByKey("WireFragment.glsl"),
            uniforms: wireuniforms,
//            attributes: attributes,
            transparent: true,
            lights: true,
            side: params.sides
        };

        var mat = new THREE.RawShaderMaterial(parameters);
        var wireframe = new THREE.Mesh(bufferGeometry, mat);

        scene.addOverlayLayer(meshFile, plug.getName(), wireframe);
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
        