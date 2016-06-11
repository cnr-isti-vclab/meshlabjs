precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 lightViewProjection;

attribute vec3 position;

varying vec4 lightFragPos;

void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  lightFragPos = lightViewProjection * (modelMatrix * vec4(position, 1.0));
}
