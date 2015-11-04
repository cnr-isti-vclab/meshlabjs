attribute vec3 position;
attribute vec3 normal;
attribute float mask;

uniform float size;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {

    vec3 pos = position + size * mask * normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}