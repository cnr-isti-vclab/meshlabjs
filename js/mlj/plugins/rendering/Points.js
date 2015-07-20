
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#0277BD'),
        size: 2
    };

    //Shader
    var POINTS = {
        uniforms: THREE.UniformsUtils.merge([
            {
                "size": {type: "f", value: DEFAULTS.size},
                "color": {type: "c", value: DEFAULTS.color}
            }
        ]),
        vertexShader: [
            "uniform float size;",
            "uniform vec3 color;",
            "varying vec3 vColor;",
            "void main() {",
            "   vColor = color;",
            "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "   gl_PointSize = size;",
            "   gl_Position = projectionMatrix * mvPosition;",
            "   gl_Position.z -= (size / 1000.0);",
            "}"

        ].join("\n"),
        fragmentShader: [
            "uniform vec3 color;",
            "varying vec3 vColor;",
            "void main() {",
            "   gl_FragColor = vec4( color * vColor, 1.0 );",
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

        if (on == false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }
        var geom = meshFile.getThreeMesh().geometry.clone();
        var uniforms = THREE.UniformsUtils.clone(POINTS.uniforms);
        var params = meshFile.overlaysParams.getByKey(plug.getName());

        uniforms.color.value = params.color;
        uniforms.size.value = params.size;

        var parameters = {
            fragmentShader: POINTS.fragmentShader,
            vertexShader: POINTS.vertexShader,
            uniforms: uniforms
        };

        var mat = new THREE.ShaderMaterial(parameters);
        var points = new THREE.PointCloud(geom, mat);
        scene.addOverlayLayer(meshFile, plug.getName(), points);


    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);