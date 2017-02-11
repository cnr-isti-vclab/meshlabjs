#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float pointSize;

void main() {
  if (pointSize != 0.0) {
    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    if (w > 1.0) discard;
  }
  gl_FragColor = vec4(gl_FragCoord.zzz, 1.0);
}
