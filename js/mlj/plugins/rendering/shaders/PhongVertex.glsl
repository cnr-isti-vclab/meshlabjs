#define SMOOTH 2

varying vec3 vViewPosition;
varying vec3 vNormal;
uniform int shading;

void main() {
    vec3 objectNormal = normal;

    #ifdef FLIP_SIDED
	objectNormal = -objectNormal;
    #endif
    
    vec3 transformedNormal = normalMatrix * objectNormal;
    if(shading == SMOOTH) {
        vNormal = normalize( transformedNormal );    
    }
    
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );    

    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
}