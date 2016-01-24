attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float size;

uniform float screenWidth;
uniform float screenHeight;
uniform float fov;

varying vec3 vViewPosition;
varying float vRadius;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec3 viewPosition = -mvPosition.xyz;
    vViewPosition = viewPosition;

    gl_PointSize = 5.0 + size;
    gl_Position = projectionMatrix * mvPosition;
    //gl_Position.z -= (10.0 / 1000.0); // (size / 1000.0);

    float projFactor = 1.0 / tan(fov / 2.0);
    projFactor /= viewPosition.z;
    projFactor *= screenHeight / 2.0;
    vRadius = gl_PointSize / projFactor;
}