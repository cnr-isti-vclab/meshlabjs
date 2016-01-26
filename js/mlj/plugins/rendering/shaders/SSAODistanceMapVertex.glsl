precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;

varying vec3 vModelViewPos;
varying float vDistance;


void main()
{
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vModelViewPos = mvPosition.xyz;
    vDistance = length(mvPosition.xyz);
    
    gl_Position = projectionMatrix * mvPosition; 
}
