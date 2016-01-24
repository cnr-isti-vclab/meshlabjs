#extension GL_EXT_frag_depth : enable
precision highp float;
precision highp int;

#define ALPHATEST 0.5

uniform vec3 color;
uniform sampler2D texture;

uniform mat4 projectionMatrix;

varying vec3 vViewPosition;
varying float vRadius;

void main() {
    vec4 texel = texture2D(texture, gl_PointCoord);
    if (texel.a < ALPHATEST) discard;
    gl_FragColor = vec4(color, 1.0 );

    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    float wi = 0.0 - w;
    vec4 pos = vec4(-vViewPosition, 1.0);
    pos.z += wi * vRadius;
    pos = projectionMatrix * pos;
    pos = pos / pos.w;
    float depth = (pos.z + 1.0) / 2.0;
    gl_FragDepthEXT = depth - 0.0001;

}