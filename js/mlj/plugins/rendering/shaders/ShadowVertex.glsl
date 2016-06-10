precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;

uniform sampler2D depthMap;
uniform sampler2D positionMap;
uniform sampler2D colorMap;

varying vec2 vUv;

void main(){
  gl_Position = vec4(position, 1.0);
  vUv = uv;
}
