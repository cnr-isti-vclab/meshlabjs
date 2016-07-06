precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 lightViewProjection;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec4 lightFragPos;

void main() {

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  // fragment position in light camera space
  lightFragPos = lightViewProjection * (modelMatrix * vec4(position, 1.0));

  //compute the uv coords to access the viewer camera depth map
  vUv = (gl_Position.xy / gl_Position.w) * (0.5) + vec2(0.5);

  //compute the correct normal in model space
  vNormal = normalize(normalMatrix * normal);

  //compute the world space position of the vertex
  vFragPos = (modelMatrix * vec4(position, 1.0)).xyz;
}
