precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 lightViewProjection;

attribute vec3 position;

varying vec2 vUv;
varying vec4 lightFragPos;

void main(){

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  lightFragPos = lightViewProjection * (modelMatrix * vec4(position, 1.0));
  vUv = (gl_Position.xy / gl_Position.w) * (0.5) + vec2(0.5);
}
