precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying vec4 worldPoint;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  worldPoint = gl_Position;
}
