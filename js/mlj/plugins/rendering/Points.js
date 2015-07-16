
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#0277BD'),
        size: 2,
        lighting: true
    };

    //Shader
    var POINTS = {
        uniforms: THREE.UniformsUtils.merge([
            {
                "pointSize": {type: "f", value: DEFAULTS.size},
                "pointColor": {type: "c", value: DEFAULTS.color}
            }
        ]),
        vertexShader: [            
            "uniform float pointSize;",
            "uniform vec3 pointColor;",
            "varying vec3 vColor;",
            "void main() {",
            "   vColor = pointColor;",
            "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "   gl_PointSize = pointSize;",
            "   gl_Position = projectionMatrix * mvPosition;",
            "   gl_Position.z -= (pointSize / 1000.0);",
            "}"

        ].join("\n"),
        fragmentShader: [
            "uniform vec3 pointColor;",
            "varying vec3 vColor;",
            "void main() {",
            "   gl_FragColor = vec4( pointColor * vColor, 1.0 );",
            "}"

        ].join("\n")

    };

    var plug = new plugin.Rendering({
        name: "Points",
        tooltip: "Points Tooltip",
        icon: "img/icons/points.png",
        toggle: true,
        on: false
    });


    var pointColorWidget, pointSizeWidget;
    plug._init = function (guiBuilder) {
        pointColorWidget = guiBuilder.Color({
            label: "Color",
            tooltip: "The color of points",
            color: "#" + DEFAULTS.color.getHexString(),
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                var overlay = meshFile.overlays.getByKey("points");
                overlay.mesh.material.uniforms.pointColor.value = new THREE.Color("#" + hex);
                scene.render();
            }
        });

        pointSizeWidget = guiBuilder.Float({
            label: "Size",
            tooltip: "The size of the points",
            min: 1, max: 10, step: 0.5,
            defval: DEFAULTS.thickness
        });

        pointSizeWidget.onChange(function (val) {
            var meshFile = scene.getSelectedLayer();
            var overlay = meshFile.overlays.getByKey("points");
            overlay.mesh.material.uniforms.pointSize.value = val;
            scene.render();
        });

//        lightingWidget = guiBuilder.Choice({
//            label: "Lighting",
//            tooltip: "Enable/disable lighting",
//            options: [
//                {content: "on", value: true, selected: true},
//                {content: "off", value: false}
//            ]
//        });
//
//        lightingWidget.onChange(function (on) {
//
//        });
    };

    plug._updateOnChangeMesh = function (meshFile) {
        var points = meshFile.overlays.getByKey("points");
        var size, color;
        if (points === undefined) {
            color = "#" + DEFAULTS.color.getHexString();
            size = DEFAULTS.size;
        } else {
            size = points.userData.uniforms.pointSize.value;
            color = "#" + points.userData.uniforms.pointColor.value.getHexString();
//        lightingWidget.selectByValue(meshFile.material.parameters.lighting);
        }
        pointColorWidget.setColor(color);
        pointSizeWidget.setValue(size);
    };

    plug._applyTo = function (meshFile, on, defaults) {

        if (on) {
            var geom = meshFile.getThreeMesh().geometry.clone();

//            var attributes = {center: {type: 'v3', boundTo: 'faceVertices', value: []}};

//            var attributes = {
//                size: {type: 'f', value: []},
//                customColor: {type: 'c', value: []}
//            };

            var uniforms = THREE.UniformsUtils.clone(POINTS.uniforms);

            var overlay = meshFile.overlays.getByKey("points");

            var parameters;
            if (overlay === undefined) {
                uniforms.pointColor.value = DEFAULTS.color;
                uniforms.pointSize.value = DEFAULTS.size;
//
                parameters = {
                    fragmentShader: POINTS.fragmentShader,
                    vertexShader: POINTS.vertexShader,
                    uniforms: uniforms
//                    attributes: attributes,
//                lights: true, // set this flag and you have access to scene lights
//                    transparent: true,
                };
            } else {
                parameters = overlay.userData;
            }

            var mat = new THREE.ShaderMaterial(parameters);
            var points = new THREE.PointCloud(geom, mat);
            scene.addOverlayLayer(meshFile, "points", points, parameters);

        } else {
            scene.removeOverlayLayer(meshFile, "points");
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);