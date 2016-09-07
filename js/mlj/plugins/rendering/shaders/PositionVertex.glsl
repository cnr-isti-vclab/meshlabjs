precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float pointSize;

attribute vec3 position;

varying vec4 vPosition;

void main(){
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  gl_PointSize = pointSize;
  gl_Position.z -= pointSize / 1000.0;
  vPosition =  modelMatrix * vec4(position, 1.0);
}
