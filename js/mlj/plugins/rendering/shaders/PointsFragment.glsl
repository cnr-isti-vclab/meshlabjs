precision highp float;
precision highp int;

//#define ALPHA_TEST 0.5
//uniform sampler2D discAlpha;

uniform vec3 color;
uniform float pointOpacity;

void main() {

    //if (texture2D(discAlpha, gl_PointCoord).a < ALPHA_TEST) discard;

    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    if (w > 1.0) discard;

    gl_FragColor = vec4(color, pointOpacity);

}