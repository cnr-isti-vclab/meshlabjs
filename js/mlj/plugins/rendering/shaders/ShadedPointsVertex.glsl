//attribute float minSize;
attribute vec3 position;
attribute vec3 normal;
attribute vec3 col;

varying vec3 vViewPosition;
varying vec3 vViewPositionNormalized;
varying vec3 vNormal;
varying vec3 vColor;

uniform int hasPerVertexColor;
uniform vec3 color;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform float size;

uniform float screenWidth;
uniform float screenHeight;
uniform float fov;
varying float vRadius;

varying vec3 vLigthDirectionEye;
vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}
uniform vec3 directionalLightDirection[1];

uniform int backPointsCulling;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec3 viewPosition = -mvPosition.xyz;

    vViewPosition = viewPosition;
    vViewPositionNormalized = normalize(viewPosition);
    vNormal = normalMatrix * normal;
    vLigthDirectionEye = transformDirection(directionalLightDirection[0],viewMatrix);
    vColor = (hasPerVertexColor != 0) ? col : color;

    gl_PointSize = 5.0 + size;
    gl_Position = projectionMatrix * mvPosition;

    if (backPointsCulling != 0 && vNormal.z < 0.0) gl_PointSize = 0.0;

    float projFactor = 1.0 / tan(fov / 2.0);
    projFactor /= viewPosition.z;
    projFactor *= screenHeight / 2.0;
    vRadius = gl_PointSize / projFactor;

}