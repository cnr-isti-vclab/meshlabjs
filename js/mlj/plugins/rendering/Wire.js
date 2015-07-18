
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#505050'),
        thickness: 1.5
    };

    //Shader
    var WIREFRAME = {
        uniforms: THREE.UniformsUtils.merge([
            {
                "thickness": {type: "f", value: DEFAULTS.thickness},
                "color": {type: "c", value: DEFAULTS.color}
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
            "uniform float thickness;",
            "uniform vec3 color;",
            "float edgeFactor(){",
            "   vec3 d = fwidth(vCenter);",
            "   vec3 a3 = smoothstep(vec3(0.0), d*thickness, vCenter);",
            "   float edgeDist = min(min(a3.x, a3.y), a3.z);",
            "   if(edgeDist > 0.5) discard;",
            "   return 1.0-edgeDist;",
            "}",
            "void main() {",
            "   gl_FragColor = vec4( color, edgeFactor());",
            "}"

        ].join("\n")

    };

    var plug = new plugin.Rendering({
        name: "Wire",
        tooltip: "Wire Tooltip",
        icon: "img/icons/wire.png",
        toggle: true,
        on: false
    }, DEFAULTS);

    var wireColor, thicknessWidget;
    plug._init = function (guiBuilder) {
        wireColor = guiBuilder.Color({
            label: "Color",
            tooltip: "The wireframe color",
            color: "#" + DEFAULTS.color.getHexString(),
            bindTo: "color"
        });

        thicknessWidget = guiBuilder.Float({
            label: "Thickness",
            tooltip: "The thickenss of the lines",
            min: 1, max: 10, step: 0.5,
            defval: DEFAULTS.thickness,
            bindTo: "thickness"
        });        
    };

    plug._applyTo = function (meshFile, on) {

        if (on) {
            var geom = meshFile.getThreeMesh().geometry.clone();

            //setup attributes
            var attributes = {center: {type: 'v3', boundTo: 'faceVertices', value: []}};
            var attrVal = attributes.center.value;

            for (var f = 0; f < geom.faces.length; f++) {
                attrVal[ f ] = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
            }

            var uniforms = THREE.UniformsUtils.clone(WIREFRAME.uniforms);
            var params = meshFile.overlaysParams.getByKey(plug.getName());

            uniforms.color.value = params.color;
            uniforms.thickness.value = params.thickness;

            var parameters = {
                fragmentShader: WIREFRAME.fragmentShader,
                vertexShader: WIREFRAME.vertexShader,
                uniforms: uniforms,
                attributes: attributes,
                shading: THREE.FlatShading,
                transparent: true,
                side: THREE.DoubleSide
            };

            var mat = new THREE.ShaderMaterial(parameters);
            var wireframe = new THREE.Mesh(geom, mat);

            scene.addOverlayLayer(meshFile, plug.getName(), wireframe);

        } else {
            scene.removeOverlayLayer(meshFile, plug.getName());
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
        