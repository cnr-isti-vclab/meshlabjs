precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 frustumCorner;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vViewDirection;

void main()
{
    vUv = uv;
    vViewDirection = frustumCorner;
    gl_Position = vec4(position, 1.0);
}
