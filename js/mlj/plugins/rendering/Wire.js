
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#505050'),
        thickness: 1.5,
        lighting: true
    };

    //Shader
    var WIREFRAME = {
        uniforms: THREE.UniformsUtils.merge([
            {
                "lineWidth": {type: "f", value: DEFAULTS.thickness},
                "lineColor": {type: "c", value: DEFAULTS.color}
            }
        ]),
        vertexShader: [
            "attribute vec3 center;",
            "varying vec3 vCenter;",
            "void main() {",
            "   vCenter = center;",
            "   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "   gl_Position.z -= 0.00001;",
            "}"

        ].join("\n"),
        fragmentShader: [
            "#extension GL_OES_standard_derivatives : enable",
            "varying vec3 vCenter;",
            "uniform float lineWidth;",
            "uniform vec3 lineColor;",
            "float edgeFactor(){",
            "   vec3 d = fwidth(vCenter);",
            "   vec3 a3 = smoothstep(vec3(0.0), d*lineWidth, vCenter);",
            "   return min(min(a3.x, a3.y), a3.z);",
            "}",
            "void main() {",
            "   gl_FragColor = mix( vec4( lineColor,1.0 ), vec4(0.0), edgeFactor());",
            "}"

        ].join("\n")

    };

    var plug = new plugin.Rendering({
        name: "Wire",
        tooltip: "Wire Tooltip",
        icon: "img/icons/wire.png",
        toggle: true,
        on: false
    });

    var wireColor, thicknessWidget, lightingWidget;
    plug._init = function (guiBuilder) {
        wireColor = guiBuilder.Color({
            label: "Color",
            tooltip: "The wireframe color",
            color: "#" + DEFAULTS.color.getHexString(),
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                var overlay = meshFile.overlays.getByKey("wireframe");
                overlay.mesh.material.uniforms.lineColor.value = new THREE.Color("#" + hex);
                scene.render();
            }
        });

        thicknessWidget = guiBuilder.Float({
            label: "Thickness",
            tooltip: "The thickenss of the lines",
            min: 1, max: 10, step: 0.5,
            defval: DEFAULTS.thickness
        });

        thicknessWidget.onChange(function (val) {
            var meshFile = scene.getSelectedLayer();
            var overlay = meshFile.overlays.getByKey("wireframe");
            overlay.mesh.material.uniforms.lineWidth.value = val;
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

    plug._update = function (meshFile) {
        var wireframe = meshFile.overlays.getByKey("wireframe");
        var thickness, color;
        if (wireframe === undefined) {
            color = "#" + DEFAULTS.color.getHexString();
            thickness = DEFAULTS.thickness;
        } else {            
            thickness = wireframe.userData.uniforms.lineWidth.value;            
            color = "#" + wireframe.userData.uniforms.lineColor.value.getHexString();
//        lightingWidget.selectByValue(meshFile.material.parameters.lighting);
        }
        wireColor.setColor(color);
        thicknessWidget.setValue(thickness);
    };

    plug._applyTo = function (meshFile, on) {
        if (on) {
            var geom = meshFile.getThreeMesh().geometry.clone();

            var attributes = {center: {type: 'v3', boundTo: 'faceVertices', value: []}};
            var attrVal = attributes.center.value;

            setupAttributes(geom, attrVal);

            function setupAttributes(geometry, values) {
                for (var f = 0; f < geometry.faces.length; f++) {
                    values[ f ] = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
                }
            }

            var uniforms = THREE.UniformsUtils.clone(WIREFRAME.uniforms);

            var overlay = meshFile.overlays.getByKey("wireframe");

            var parameters;
            if (overlay === undefined) {
                uniforms.lineColor.value = DEFAULTS.color;
                uniforms.lineWidth.value = DEFAULTS.thickness;

                parameters = {
                    fragmentShader: WIREFRAME.fragmentShader,
                    vertexShader: WIREFRAME.vertexShader,
                    uniforms: uniforms,
                    attributes: attributes,
//                lights: true, // set this flag and you have access to scene lights
                    shading: THREE.FlatShading,
                    transparent: true
                };
            } else {
                parameters = overlay.userData;
            }

            var mat = new THREE.ShaderMaterial(parameters);
            var wireframe = new THREE.Mesh(geom, mat);
            scene.addOverlayLayer(meshFile, "wireframe", wireframe, parameters);

        } else {            
            scene.removeOverlayLayer(meshFile, "wireframe");
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
        