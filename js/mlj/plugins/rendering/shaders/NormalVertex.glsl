precision highp float;

uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

uniform float pointSize;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;

void main(){
  vec4 mvP = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvP;
  gl_PointSize = pointSize;

  vNormal = vec3(vec4(normal, 0.0));
}
