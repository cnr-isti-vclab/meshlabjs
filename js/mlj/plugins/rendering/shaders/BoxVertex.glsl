uniform float pntSize;
attribute float pntType;
attribute float pntMinSize;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = pntMinSize + (pntSize * pntType);
    gl_Position = projectionMatrix * mvPosition;
    gl_Position.z -= (pntSize / 1000.0);
}