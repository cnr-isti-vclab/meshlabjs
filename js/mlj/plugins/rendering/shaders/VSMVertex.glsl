precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying vec4 worldPoint;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 3.00005;
  worldPoint = gl_Position; //posizione mondo dal punto di vista luce
}
