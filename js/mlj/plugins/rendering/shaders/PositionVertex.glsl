precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;

varying vec4 vPosition;

void main(){
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  vPosition =  modelMatrix * vec4(position, 1.0);
}
