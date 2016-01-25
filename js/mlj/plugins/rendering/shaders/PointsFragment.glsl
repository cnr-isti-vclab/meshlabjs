precision highp float;
precision highp int;

#define ALPHA_TEST 0.5

uniform vec3 color;
uniform sampler2D discAlpha;

void main() {

    if (texture2D(discAlpha, gl_PointCoord).a < ALPHA_TEST) discard;

    gl_FragColor = vec4(color, 1.0 ) * texture2D(discAlpha, gl_PointCoord);

}