
(function (plugin, core, scene) {

    var DEFAULTS = {
        specular: new THREE.Color('#505050'),
        emissive: new THREE.Color('#404040'),
        shininess: 15.0,
        lights: true,
        shading: THREE.FlatShading
    };

    var PHONG = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "bump" ],
            THREE.UniformsLib[ "normalmap" ],
            THREE.UniformsLib[ "fog" ],
            THREE.UniformsLib[ "lights" ],
            THREE.UniformsLib[ "shadowmap" ],
            {
                "emissive": {type: "c", value: DEFAULTS.emissive},
                "specular": {type: "c", value: DEFAULTS.specular},
                "shininess": {type: "f", value: DEFAULTS.shininess},
                "lights": {type: "i", value: DEFAULTS.lights},
                "wrapRGB": {type: "v3", value: new THREE.Vector3(1, 1, 1)},                
            }

        ]),
        vertexShader: [
            "#define PHONG",
            "varying vec3 vViewPosition;",
            "uniform int shading;",
            "#ifndef FLAT_SHADED",            
            "	varying vec3 vNormal;",
            "#endif",
            THREE.ShaderChunk[ "common" ],
            THREE.ShaderChunk[ "map_pars_vertex" ],
            THREE.ShaderChunk[ "lightmap_pars_vertex" ],
            THREE.ShaderChunk[ "envmap_pars_vertex" ],
            THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
            THREE.ShaderChunk[ "color_pars_vertex" ],
            THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
            THREE.ShaderChunk[ "skinning_pars_vertex" ],
            THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],
            "void main() {",
            THREE.ShaderChunk[ "map_vertex" ],
            THREE.ShaderChunk[ "lightmap_vertex" ],
            THREE.ShaderChunk[ "color_vertex" ],
            THREE.ShaderChunk[ "morphnormal_vertex" ],
            THREE.ShaderChunk[ "skinbase_vertex" ],
            THREE.ShaderChunk[ "skinnormal_vertex" ],
            THREE.ShaderChunk[ "defaultnormal_vertex" ],
            "#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED
            "	vNormal = normalize( transformedNormal );",
            "#endif",
            THREE.ShaderChunk[ "morphtarget_vertex" ],
            THREE.ShaderChunk[ "skinning_vertex" ],
            THREE.ShaderChunk[ "default_vertex" ],
            THREE.ShaderChunk[ "logdepthbuf_vertex" ],
            "	vViewPosition = -mvPosition.xyz;",
            THREE.ShaderChunk[ "worldpos_vertex" ],
            THREE.ShaderChunk[ "envmap_vertex" ],
            THREE.ShaderChunk[ "lights_phong_vertex" ],
            THREE.ShaderChunk[ "shadowmap_vertex" ],
            "}"

        ].join("\n"),
        fragmentShader: [
            "#define PHONG",
            "uniform vec3 diffuse;",
            "uniform vec3 emissive;",
            "uniform vec3 specular;",
            "uniform float shininess;",
            "uniform float opacity;",
            "uniform int lights;",           
            THREE.ShaderChunk[ "common" ],
            THREE.ShaderChunk[ "color_pars_fragment" ],
            THREE.ShaderChunk[ "map_pars_fragment" ],
            THREE.ShaderChunk[ "alphamap_pars_fragment" ],
            THREE.ShaderChunk[ "lightmap_pars_fragment" ],
            THREE.ShaderChunk[ "envmap_pars_fragment" ],
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
            THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
            THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
            THREE.ShaderChunk[ "normalmap_pars_fragment" ],
            THREE.ShaderChunk[ "specularmap_pars_fragment" ],
            THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],
            "void main() {",           
            "	vec3 outgoingLight = vec3( 0.0 );", 
            "	vec4 diffuseColor = vec4( diffuse, opacity );",
            THREE.ShaderChunk[ "logdepthbuf_fragment" ],
            THREE.ShaderChunk[ "map_fragment" ],
            THREE.ShaderChunk[ "color_fragment" ],
            THREE.ShaderChunk[ "alphamap_fragment" ],
            THREE.ShaderChunk[ "alphatest_fragment" ],
            THREE.ShaderChunk[ "specularmap_fragment" ],            
            THREE.ShaderChunk[ "lights_phong_fragment" ],            
            THREE.ShaderChunk[ "lightmap_fragment" ],
            THREE.ShaderChunk[ "envmap_fragment" ],
            THREE.ShaderChunk[ "shadowmap_fragment" ],
            THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
            THREE.ShaderChunk[ "fog_fragment" ],            
            " if(lights == 0) ",
            "   gl_FragColor = diffuseColor;",
            " else",
            "	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
            "}"

        ].join("\n")

    };

    var plug = new plugin.Rendering({
        name: "Filled",
        tooltip: "Tooltip",
        icon: "img/icons/flat.png",
        toggle: true,
        on: true
    }, DEFAULTS);

    var lightingWidget, shadingWidget, shininessWidget,
            specularColor, emissiveColor;
    plug._init = function (guiBuilder) {
        specularColor = guiBuilder.Color({
            label: "Specular",
            tooltip: "Specular color of the material, i.e. how shiny the material is and the color of its shine. Setting this the same color as the diffuse value (times some intensity) makes the material more metallic-looking; setting this to some gray makes the material look more plastic",
            color: "#" + DEFAULTS.specular.getHexString(),
            bindTo: "specular"
        });

        emissiveColor = guiBuilder.Color({
            label: "Emissive",
            tooltip: "Emissive (light) color of the material, essentially a solid color unaffected by other lighting",
            color: "#" + DEFAULTS.emissive.getHexString(),
            bindTo: "emissive"
        });

        shininessWidget = guiBuilder.Integer({
            label: "Shininess",
            tooltip: "How shiny the specular highlight is. A higher value gives a sharper highlight",
            min: 0, max: 100, step: 1,
            defval: DEFAULTS.shininess,
            bindTo: "shininess"
        });

        shadingWidget = guiBuilder.Choice({
            label: "Shading",
            tooltip: "How the triangles of a curved surface are rendered: as a smooth surface, as flat separate facets, or no shading at all",
            options: [
                {content: "Flat", value: THREE.FlatShading, selected: true},
                {content: "Smooth", value: THREE.SmoothShading}
            ],
            bindTo: "shading"
        });

        lightingWidget = guiBuilder.Choice({
            label: "Lighting",
            tooltip: "Enable/disable lighting",
            options: [
                {content: "on", value: true, selected: true},
                {content: "off", value: false}
            ],
            bindTo: "lights"
        });

//        shininessWidget.onChange(function (val) {
////            var meshFile = scene.getSelectedLayer();
////            meshFile.material.setShininess(val);
//        });

//        shadingWidget.onChange(function (shading) {
////            var meshFile = scene.getSelectedLayer();
////
////            //Set material shading parameter
////            meshFile.material.parameters.shading = shading;
////
////            //The mesh file is no rendered
////            if (!meshFile.isRendered()) {
////                return;
////            }
////
////            if (meshFile.material.parameters.lighting !== true) {
////                meshFile.material.parameters.updateGeometry = true;
////                return;
////            }
////
////            var material = new PhongMaterial(meshFile.material.parameters);
////            //Update material and geometry
////            meshFile.updateMaterial(material, true);
//        });

        lightingWidget.onChange(function (on) {
            var meshFile = scene.getSelectedLayer();            
            plug._applyTo(meshFile,false);            
            plug._applyTo(meshFile,true);
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on) {
            var geom = meshFile.getThreeMesh().geometry.clone();                                   
            
            var uniforms = THREE.UniformsUtils.clone(PHONG.uniforms);
            var params = meshFile.overlaysParams.getByKey(plug.getName());
            
            uniforms.emissive.value = params.emissive;
            uniforms.specular.value = params.specular;
            uniforms.lights.value = params.lights;            

            var parameters = {
                fragmentShader: PHONG.fragmentShader,
                vertexShader: PHONG.vertexShader,
                uniforms: uniforms,
                shading: THREE.FlatShading,
                lights: true,
                side: THREE.DoubleSide
            };

            var mat = new THREE.ShaderMaterial(parameters);
            var filled = new THREE.Mesh(geom, mat);

            scene.addOverlayLayer(meshFile, plug.getName(), filled);

        } else {
            scene.removeOverlayLayer(meshFile, plug.getName());
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);