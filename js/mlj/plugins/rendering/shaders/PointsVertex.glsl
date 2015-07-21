uniform float size;
attribute float minSize;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = minSize + size;
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.z -= (size / 1000.0);
}