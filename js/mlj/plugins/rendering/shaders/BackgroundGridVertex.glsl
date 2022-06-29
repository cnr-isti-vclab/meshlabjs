precision highp float;

attribute vec3 position;

varying vec3 positionG;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main(void)
{
   vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
   gl_Position = projectionMatrix * mvPosition;

   positionG = position;
}
