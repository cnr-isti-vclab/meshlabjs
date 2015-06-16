/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


WIREFRAME = {
    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib[ "common" ],
        THREE.UniformsLib[ "bump" ],
        THREE.UniformsLib[ "normalmap" ],
        THREE.UniformsLib[ "fog" ],
        THREE.UniformsLib[ "lights" ],
        THREE.UniformsLib[ "shadowmap" ],
        {
            "emissive": {type: "c", value: new THREE.Color(0x000000)},
            "specular": {type: "c", value: new THREE.Color(0x111111)},
            "shininess": {type: "f", value: 30},
            "wrapRGB": {type: "v3", value: new THREE.Vector3(1, 1, 1)},
            
            "lineWidth": {type: "f", value: 1.5},
            "lineColor": {type: "c", value: new THREE.Color(0x000000)}
        }

    ]),
    vertexShader: [
        "#define PHONG",
        "varying vec3 vViewPosition;",
        "#ifndef FLAT_SHADED",
        "	varying vec3 vNormal;",
        "#endif",
        "attribute vec3 center;", //********************************************
        "varying vec3 vCenter;", //*********************************************
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
        "vCenter = center;", //**************************************************
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
        "#extension GL_OES_standard_derivatives : enable", //******************      
        "varying vec3 vCenter;", //********************************************
        "uniform vec3 diffuse;",
        "uniform vec3 emissive;",
        "uniform vec3 specular;",
        "uniform float shininess;",
        "uniform float opacity;",
        "uniform float lineWidth;",
        "uniform vec3 lineColor;",
        "float edgeFactor(){", //********************************************
        "vec3 d = fwidth(vCenter);", //********************************************
        "vec3 a3 = smoothstep(vec3(0.0), d*lineWidth, vCenter);", //********************************************
        "return min(min(a3.x, a3.y), a3.z);", //********************************************
        "}", //********************************************
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
        "	vec3 outgoingLight = vec3( 0.0 );", // outgoing light does not have an alpha, the surface does
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
        "	//gl_FragColor = vec4( outgoingLight, diffuseColor.a );", // TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects
        
        "gl_FragColor.rgb = mix(lineColor, outgoingLight, edgeFactor());",
        "gl_FragColor.a = diffuseColor.a;",
        "}"

    ].join("\n")

};