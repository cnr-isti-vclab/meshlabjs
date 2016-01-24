
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#0277BD'),
        size: 5,
        shading: 1,
        specular: new THREE.Color('#505050'),
        shininess: 15.0,
        texture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png"),
        backPointsCulling: 1
    };

    var UNIFORMS = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            {
                "size": {type: "f", value: DEFAULTS.size},
                "hasPerVertexColor": {type: "i", value: 0},
                "color": {type: "c", value: DEFAULTS.color},
                "shading" : { type: "i", value: DEFAULTS.shading},
                "specular": {type: "c", value: DEFAULTS.specular},
                "shininess": {type: "f", value: DEFAULTS.shininess},
                "texture": {type: "t", value: DEFAULTS.texture},
                "backPointsCulling": { type: "i", value: DEFAULTS.backPointsCulling},
                "screenWidth": {type: "f", value: 0},
                "screenHeight": {type: "f", value: 0},
                "fov": {type: "f", value: 0}
            }
        ])
    };

    var plug = new plugin.Rendering({
        name: "Points",
        tooltip: "Points Tooltip",
        icon: "img/icons/points.png",
        toggle: true,
        on: false,
        loadShader: ["ShadedPointsFragment.glsl", "ShadedPointsVertex.glsl"]
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
            min: 1, max: 50, step: 1,
            defval: DEFAULTS.size,
            bindTo: "size"
        });

        guiBuilder.Choice({
            label: "Shading",
            tooltip: "Activate/Deactivate Shading",
            options: [
                {content: "On", value: 1, selected: true},
                {content: "Off", value: 0 },
                {content: "Fixed", value: 2 }
            ],
            bindTo: "shading"
        });

        guiBuilder.Choice({
            label: "Back Points Culling",
            tooltip: "Activate/Deactivate Back Points Culling",
            options: [
                {content: "On", value: 1, selected: true},
                {content: "Off", value: 0 }
            ],
            bindTo: "backPointsCulling"
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
        layer.normal_buffer = layer.cppMesh.getVertexNormalVector(true);

        var particlesBuffer = new Float32Array(Module.HEAPU8.buffer, layer.__mlj_points_buffer, layer.VN*3);
        var normalsBuffer = new Float32Array(Module.HEAPU8.buffer, layer.normal_buffer, layer.VN*3);

        var geometry = new THREE.BufferGeometry();

        geometry.addAttribute('position', new THREE.BufferAttribute(particlesBuffer, 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normalsBuffer, 3));

        var hasPerVertexColor = 0;

        if (layer.cppMesh.hasPerVertexColor()) {
            layer.color_buffer = layer.cppMesh.getVertexColors();
            var colorsBuffer = new Float32Array(Module.HEAPU8.buffer, layer.color_buffer, layer.VN*3);
            geometry.addAttribute('col', new THREE.BufferAttribute(colorsBuffer, 3));
            hasPerVertexColor = 1;
        }

        var params = layer.overlaysParams.getByKey(plug.getName());

        var pointsUniforms = THREE.UniformsUtils.clone(UNIFORMS.uniforms);
        pointsUniforms.hasPerVertexColor.value = hasPerVertexColor;
        pointsUniforms.color.value = params.color;
        pointsUniforms.size.value = params.size;
        pointsUniforms.shading.value = params.shading;
        pointsUniforms.texture.value = DEFAULTS.texture;
        pointsUniforms.backPointsCulling.value = params.backPointsCulling;
        pointsUniforms.screenWidth.value = scene.get3DSize().width;
        pointsUniforms.screenHeight.value = scene.get3DSize().height;
        pointsUniforms.fov.value = scene.getCamera().fov;


/*
        var pointsUniforms = {
            color: {type: "c", value: params.color},
            size: {type: "f", value: params.size},
            texture: {type: "t", value: DEFAULTS.texture}
        };
*/
        var shaderMaterial = new THREE.RawShaderMaterial({
            uniforms: pointsUniforms,
            attributes: geometry.attributes,
            vertexShader: this.shaders.getByKey("ShadedPointsVertex.glsl"),
            fragmentShader: this.shaders.getByKey("ShadedPointsFragment.glsl"),
            transparent: true,
            lights: true
        });

        var points = new THREE.PointCloud(geometry, shaderMaterial);
/*
        var material = new THREE.PointCloudMaterial(
            {   color: params.color,
                size: params.size,
                sizeAttenuation: true,
                map: DEFAULTS.texture,
                alphaTest: 0.3,
                transparent: true,
                lights: true
            });

        var points = new THREE.PointCloud(geometry, material);
*/
        scene.addOverlayLayer(layer, plug.getName(), points);
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);