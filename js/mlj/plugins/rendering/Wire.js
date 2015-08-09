
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#505050'),
        thickness: 1.5
    };

    var plug = new plugin.Rendering({
        name: "Wire",
        tooltip: "Wire Tooltip",
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
        var uniforms = {
            "thickness": {type: "f", value: params.thickness},
            "color": {type: "c", value: params.color}
        };

        var parameters = {
            vertexShader: this.shaders.getByKey("WireVertex.glsl"),
            fragmentShader: this.shaders.getByKey("WireFragment.glsl"),
            uniforms: uniforms,
            attributes: attributes,
            transparent: true,
            side: THREE.DoubleSide
        };

        var mat = new THREE.RawShaderMaterial(parameters);
        var wireframe = new THREE.Mesh(bufferGeometry, mat);

        scene.addOverlayLayer(meshFile, plug.getName(), wireframe);
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
        