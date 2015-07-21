
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#0277BD'),
        size: 1,
        //PRELOADING NEEDED ...
        texture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png")
    };

    //Shader
    var POINTS = {

        vertexShader: [
            "uniform float size;",
            "attribute float minSize;",
            "void main() {",
            "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "   gl_PointSize = minSize + size;",
            "   gl_Position = projectionMatrix * mvPosition;",
            "   gl_Position.z -= (size / 1000.0);",
            "}"

        ].join("\n"),
        fragmentShader: [
            "uniform vec3 color;",
            "uniform sampler2D texture;",
            "void main() {",
            "   gl_FragColor = vec4(color, 1.0 );",
            "   gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",
            "   if ( gl_FragColor.a < ALPHATEST ) discard;",
            "}"

        ].join("\n")

    };

    var plug = new plugin.Rendering({
        name: "Points",
        tooltip: "Points Tooltip",
        icon: "img/icons/points.png",
        toggle: true,
        on: false
    }, DEFAULTS);


    var pointColorWidget, pointSizeWidget;
    plug._init = function (guiBuilder) {
        pointColorWidget = guiBuilder.Color({
            label: "Color",
            tooltip: "The color of points",
            color: "#" + DEFAULTS.color.getHexString(),
            bindTo: "color"
        });

        pointSizeWidget = guiBuilder.Float({
            label: "Size",
            tooltip: "The size of the points",
            min: 1, max: 10, step: 0.5,
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
            vertexShader: POINTS.vertexShader,
            fragmentShader: POINTS.fragmentShader,
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