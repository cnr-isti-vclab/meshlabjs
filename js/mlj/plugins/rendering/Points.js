
(function (plugin, core, scene) {

    const COL_FIXED = 0,
          COL_VERTEX = 1;
    var loader = new THREE.TextureLoader();

    var DEFAULTS = {
        color: new THREE.Color('#0277BD'),
        colorSource: COL_FIXED,
        size: 3,
        shading: 0,
        specular: new THREE.Color('#505050'),
        shininess: 15.0,
        //discAlpha: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png"),
        discBorder: loader.load("js/mlj/plugins/rendering/textures/sprites/disc_border.png"),
        discShaded: loader.load("js/mlj/plugins/rendering/textures/sprites/disc_shaded.png"),
        backPointsCulling: 0,
        deepSplat: 1
    };

    var UNIFORMS = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            THREE.UniformsLib[ "ambient" ],            
            {
                "size": {type: "f", value: DEFAULTS.size},
                "usePerVertexColor": {type: "i", value: 0},
                "color": {type: "c", value: DEFAULTS.color},
                "shading" : { type: "i", value: DEFAULTS.shading},
                "specular": {type: "c", value: DEFAULTS.specular},
                "shininess": {type: "f", value: DEFAULTS.shininess},
                //"discAlpha": {type: "t", value: DEFAULTS.discAlpha},
                "discBorder": {type: "t", value: DEFAULTS.discBorder},
                "discShaded": {type: "t", value: DEFAULTS.discShaded},
                "backPointsCulling": { type: "i", value: DEFAULTS.backPointsCulling},
                "deepSplat": { type: "i", value: DEFAULTS.deepSplat},
                "screenWidth": {type: "f", value: 0},
                "screenHeight": {type: "f", value: 0},
                "fov": {type: "f", value: 0},
                "directionalLightPosition" : {type: "v3", value: new THREE.Vector3(0,0,1)},
                "directionalLightColor" : {type: "c", value: new THREE.Color('#ffffff')}
            }
        ])
    };

    var plug = new plugin.Rendering({
        name: "Points",
        tooltip: "Enable the rendering of vertexes of the current mesh layer.",
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

        guiBuilder.Choice({
            label: "Color Source",
            tooltip: "Choose the origin of the color for the points",
            options: [
                {content: "Fixed", value: 0, selected: true },
                {content: "Per Vertex", value: 1}
            ],
            bindTo: (function() {
                    var bindToFun = function (colorSource, overlay) {
                        if (colorSource == COL_VERTEX && overlay.geometry.attributes['col']) {
                            overlay.material.uniforms.usePerVertexColor.value = COL_VERTEX;
                        } else {
                            overlay.material.uniforms.usePerVertexColor.value = COL_FIXED;
                        }
                    };
                    bindToFun.toString = function () { return 'colorSource'; }
                    return bindToFun;
                }())
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
            tooltip:"Shading Modes:<br> "+
                    "<b>On</b>: each splat is shaded using the per vertex normal<br>"+
                    "<b>Fix</b>: a small fix-shaded sphere is drawn; useful when the point cloud has no normal<br>"+
                    "<b>Flat</b>: just a flat unshaded disc is rendered useful when your point cloud came with baked illumination; <br>"+
                    "<b>Dot</b>: a small black-bordered dot is drawn; useful for showing a few vertexes position in low poly models<br>",
            options: [
                {content: "On",  value: 0, selected: true},
                {content: "Fix", value: 1 },
                {content: "Flat", value: 2 },
                {content: "Dot", value: 3 }
            ],
            bindTo: "shading"
        });

        guiBuilder.Choice({
            label: "Back Points Culling",
            tooltip: "Activate/Deactivate Back Points Culling",
            options: [
                {content: "On", value: 1},
                {content: "Off", value: 0, selected: true }
            ],
            bindTo: "backPointsCulling"
        });
        
        guiBuilder.Choice({
            label: "Deep Splat",
            tooltip: "Activate/Deactivate depth management for splats",
            options: [
                {content: "On", value: 1, selected: true },
                {content: "Off", value: 0}
            ],
            bindTo: "deepSplat"
        });

    };

    plug._applyTo = function (layer, on) {
        if (on === false) {
            scene.removeOverlayLayer(layer, plug.getName());
            if (layer.position_buffer) {
                Module._free(layer.position_buffer);
                delete layer.position_buffer;
            }
            if (layer.normal_buffer) {
                Module._free(layer.normal_buffer);
                delete layer.normal_buffer;
            }
            if (layer.color_buffer) {
                Module._free(layer.color_buffer);
                delete layer.color_buffer;
            }
            return;
        }

        layer.position_buffer = layer.cppMesh.getVertexVector(true);
        layer.normal_buffer = layer.cppMesh.getVertexNormalVector(true);

        var particlesBuffer = new Float32Array(Module.HEAPU8.buffer, layer.position_buffer, layer.VN*3);
        var normalsBuffer   = new Float32Array(Module.HEAPU8.buffer, layer.normal_buffer,   layer.VN*3);
        var geometry = new THREE.BufferGeometry();

        geometry.addAttribute('position', new THREE.BufferAttribute(particlesBuffer, 3));
        geometry.addAttribute('normal',   new THREE.BufferAttribute(normalsBuffer, 3));

        var params = layer.overlaysParams.getByKey(plug.getName());

        if (layer.cppMesh.hasPerVertexColor()) {
            layer.color_buffer = layer.cppMesh.getVertexColors();
            var colorsBuffer = new Float32Array(Module.HEAPU8.buffer, layer.color_buffer, layer.VN*3);
            geometry.addAttribute('col', new THREE.BufferAttribute(colorsBuffer, 3));
        }

        var usePerVertexColor = (params.colorSource == COL_VERTEX && geometry.attributes['col']) ? 1 : 0;

        var pointsUniforms = THREE.UniformsUtils.clone(UNIFORMS.uniforms);
        pointsUniforms.usePerVertexColor.value = usePerVertexColor;
        pointsUniforms.color.value = params.color;
        pointsUniforms.size.value = params.size;
        pointsUniforms.shading.value = params.shading;
        pointsUniforms.backPointsCulling.value = params.backPointsCulling;
        pointsUniforms.deepSplat.value = params.deepSplat;
        pointsUniforms.screenWidth.value = scene.get3DSize().width;
        pointsUniforms.screenHeight.value = scene.get3DSize().height;
        pointsUniforms.fov.value = scene.getCamera().fov;
        //pointsUniforms.discAlpha.value = DEFAULTS.discAlpha;
        pointsUniforms.discBorder.value = DEFAULTS.discBorder;
        pointsUniforms.discShaded.value = DEFAULTS.discShaded;
        pointsUniforms.directionalLightPosition.value = scene.lights.Headlight.position;
        pointsUniforms.directionalLightColor.value = scene.lights.Headlight.color;
        var shaderMaterial = new THREE.RawShaderMaterial({
            uniforms: pointsUniforms,
//            attributes: geometry.attributes,
//            vertexShader: THREE.ShaderChunk[ "lights_pars" ]+this.shaders.getByKey("ShadedPointsVertex.glsl"),
              vertexShader: this.shaders.getByKey("ShadedPointsVertex.glsl"),
            fragmentShader: this.shaders.getByKey("ShadedPointsFragment.glsl"),
            lights: true
        });

        var points = new THREE.Points(geometry, shaderMaterial);
        scene.addOverlayLayer(layer, plug.getName(), points);
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);