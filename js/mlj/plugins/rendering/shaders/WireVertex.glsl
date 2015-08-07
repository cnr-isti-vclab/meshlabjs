attribute vec3 center;
attribute vec3 position;

varying vec3 vCenter;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    vCenter = center;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position.z -= 0.00001;
}