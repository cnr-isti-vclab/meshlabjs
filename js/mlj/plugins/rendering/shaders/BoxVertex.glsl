uniform float pntSize;
attribute float pntType;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = pntSize * pntType;
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.z -= (pntSize / 1000.0);
}