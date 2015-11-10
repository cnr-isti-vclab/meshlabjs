
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#0277BD'),
        size: 1,
        //PRELOADING NEEDED ...
        texture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png")
    };

    var plug = new plugin.Rendering({
        name: "Points",
        tooltip: "Points Tooltip",
        icon: "img/icons/points.png",
        toggle: true,
        on: false,
        loadShader: ["PointsFragment.glsl", "PointsVertex.glsl"]
    }, DEFAULTS);


    var pointColorWidget, pointSizeWidget;
    plug._init = function (guiBuilder) {
        pointColorWidget = guiBuilder.Color({
            label: "Color",
            tooltip: "The color of points",
            color: "#" + DEFAULTS.color.getHexString(),
            bindTo: "color"
        });

        pointSizeWidget = guiBuilder.RangedFloat({
            label: "Point Size",
            tooltip: "The size of the points in pixels",
            min: 0.5, max: 16, step: 0.5,
            defval: DEFAULTS.size,
            bindTo: "size"
        });
    };

    plug._applyTo = function (layer, on) {
        if (on === false) {
            scene.removeOverlayLayer(layer, plug.getName());
            if (layer.__mlj_points_buffer) {
                Module._free(layer.__mlj_points_buffer);
                delete layer.__mlj_points_buffer;
            }
            return;
        }

        layer.__mlj_points_buffer = layer.cppMesh.getVertexVector(true);

        var particlesBuffer = new Float32Array(Module.HEAPU8.buffer, layer.__mlj_points_buffer, layer.VN*3);
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(particlesBuffer, 3));


        var params = layer.overlaysParams.getByKey(plug.getName());

        var pointsUniforms = {
            color: {type: "c", value: params.color},
            size: {type: "f", value: params.size},
            texture: {type: "t", value: DEFAULTS.texture}
        };

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: pointsUniforms,
            attributes: geometry.attributes,
            vertexShader: this.shaders.getByKey("PointsVertex.glsl"),
            fragmentShader: this.shaders.getByKey("PointsFragment.glsl"),
            alphaTest: 0.9
        });

        var points = new THREE.PointCloud(geometry, shaderMaterial);

        scene.addOverlayLayer(layer, plug.getName(), points);
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);