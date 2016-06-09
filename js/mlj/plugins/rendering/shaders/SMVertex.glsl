precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
