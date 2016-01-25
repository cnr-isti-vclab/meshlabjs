#extension GL_OES_standard_derivatives : enable
#extension GL_EXT_frag_depth : enable

precision highp float;
precision highp int;

#define ALPHATEST 0.5

#define SHADING_ON    0
#define SHADING_FIX   1
#define SHADING_FLAT  2
#define SHADING_DOT   3

varying vec3 vViewPosition;
varying vec3 vColor;
varying float vRadius;

uniform int shading;
uniform vec3 specular;
uniform float shininess;
uniform sampler2D discAlpha;
uniform sampler2D discBorder;
uniform sampler2D discShaded;
uniform mat4 projectionMatrix;
uniform int deepSplat;


void main() {

    if (texture2D(discAlpha, gl_PointCoord).a < ALPHATEST) discard;

    vec3 outputColor = vColor;

    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    float wi = 0.0 - w;
    vec4 pos = vec4(-vViewPosition, 1.0);
    pos.z += wi * vRadius;

    if(deepSplat==1)
    {
        pos = projectionMatrix * pos;
        pos = pos / pos.w;
        float depth = (pos.z + 1.0) / 2.0;
        gl_FragDepthEXT = depth - 0.0001;
    }
    else gl_FragDepthEXT = gl_FragCoord.z- 0.0001;

    if (shading == SHADING_DOT) {
        gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(discBorder, gl_PointCoord);
    } 

    if (shading == SHADING_FLAT) {
        gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(discAlpha, gl_PointCoord);
    } 
    
    if (shading == SHADING_FIX) {
        gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(discShaded, gl_PointCoord);
    } 

    if (shading == SHADING_ON) {
       gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(discAlpha, gl_PointCoord);
    } 
}