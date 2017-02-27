precision highp float;

uniform float pointSize;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform sampler2D depthMap;
uniform sampler2D positionMap;
uniform sampler2D normalMap;
uniform sampler2D colorMap;

varying vec3 vNormal;
varying vec4 vPosition;
varying vec3 vViewPosition;

void main(){
  vec4 mvP = modelViewMatrix * vec4(position,1.0);

  vNormal = normal;
  vPosition = modelMatrix * vec4(position,1.0);
  vViewPosition = -mvP.xyz;
  
  gl_Position = projectionMatrix * mvP;
  gl_PointSize = pointSize;
}
