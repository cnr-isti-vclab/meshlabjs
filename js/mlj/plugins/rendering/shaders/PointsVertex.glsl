attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float size;


void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.z -= size / 1000.0;

}