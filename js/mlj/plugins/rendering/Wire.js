
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
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }
        var geom = meshFile.getThreeMesh().geometry.clone();

        //setup attributes
        var attributes = {center: {type: 'v3', boundTo: 'faceVertices', value: []}};
        var attrVal = attributes.center.value;

        for (var f = 0; f < geom.faces.length; f++) {
            attrVal[ f ] = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
        }

        var uniforms = {
            "thickness": {type: "f", value: DEFAULTS.thickness},
            "color": {type: "c", value: DEFAULTS.color}
        };

        var params = meshFile.overlaysParams.getByKey(plug.getName());

        uniforms.color.value = params.color;
        uniforms.thickness.value = params.thickness;

        var parameters = {
            vertexShader: this.shaders.getByKey("WireVertex.glsl"),
            fragmentShader: this.shaders.getByKey("WireFragment.glsl"),
            uniforms: uniforms,
            attributes: attributes,
            shading: THREE.FlatShading,
            transparent: true,
            side: THREE.DoubleSide
        };

        var mat = new THREE.RawShaderMaterial(parameters);
        var wireframe = new THREE.Mesh(geom, mat);

        scene.addOverlayLayer(meshFile, plug.getName(), wireframe);
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
        