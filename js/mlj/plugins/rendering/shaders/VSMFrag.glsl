#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec4 worldPoint;

void main() {
  float d = worldPoint.z;   //posizione ndc [-1..1]
  d = d * 0.5 + 0.5;        //scalo su [0..1]

  float dx = dFdx(d);
  float dy = dFdy(d);

  gl_FragColor = vec4(d, d * d + 0.25*(dx*dx + dy*dy), 0.0, 1.0);
}
