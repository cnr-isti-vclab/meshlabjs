
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

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        var geom = meshFile.getThreeMesh().geometry.clone();
                
        var params = meshFile.overlaysParams.getByKey(plug.getName());
        var attributes = {
            minSize: {type: 'f', value: []}
        };
                        
        var uniforms = {
            color: {type: "c", value: params.color},
            size: {type: "f", value: params.size},
            texture: {type: "t", value: DEFAULTS.texture}
        };
                        
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            attributes: attributes,
            vertexShader: this.shaders.getByKey("PointsVertex.glsl"),
            fragmentShader: this.shaders.getByKey("PointsFragment.glsl"),
            alphaTest: 0.9
        });
                
        var points = new THREE.PointCloud(geom, shaderMaterial);
        var values_minSize = attributes.minSize.value;
        
        for (var v = 0, vl = geom.vertices.length; v < vl; v++) {
            values_minSize[ v ] = 10;
        }

        scene.addOverlayLayer(meshFile, plug.getName(), points);
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);