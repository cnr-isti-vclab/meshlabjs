attribute vec3 position;
attribute vec3 center;

varying vec3 vCenter;
varying vec3 vViewPosition;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    vCenter = center;
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
    //gl_Position.z -= 0.00001;
}