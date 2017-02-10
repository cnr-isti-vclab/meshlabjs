precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform float pointSize;

attribute vec3 position;

varying vec4 vPosition;

void main(){
  vec4 mvP = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvP;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_PointSize = pointSize;
  vPosition =  modelMatrix * vec4(position, 1.0);
}
