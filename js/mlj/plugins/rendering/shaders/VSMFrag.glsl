#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float pointSize;

varying vec4 worldPoint;

void main() {

  if (pointSize != 0.0) {
    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    if (w > 1.0) discard;
  }

  float d = worldPoint.z / worldPoint.w;   //posizione ndc [-1..1]
  d = d * 0.5 + 0.5;        //scalo su [0..1]

  float dx = dFdx(d);
  float dy = dFdy(d);

  gl_FragColor = vec4(d, d * d + 0.25*(dx*dx + dy*dy), 0.0, 1.0);
}
