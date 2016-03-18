#define SMOOTH 2

attribute vec3 position;
attribute vec3 normal;
attribute vec3 VCGColor;

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vColor;

uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform int shading;

uniform vec3 diffuse;
uniform int mljColorMode;

void main() {
    vec3 objectNormal = normal;
    
    vec3 transformedNormal = normalMatrix * objectNormal;
    if(shading == SMOOTH) {
        vNormal = normalize( transformedNormal );    
    }
    
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );    

    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
    vColor = VCGColor;
}
