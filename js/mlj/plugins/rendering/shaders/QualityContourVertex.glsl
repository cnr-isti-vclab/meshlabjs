precision highp float;

uniform float quality_min;
uniform float quality_max;
uniform float stripe_num;  
uniform float stripe_width;   // between 0 constant and 1 binary.

attribute float vert_quality;
attribute vec3 position;

varying float scaled_quality;


uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main(void)
{
   vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
   gl_Position = projectionMatrix * mvPosition;

   scaled_quality = ((vert_quality - quality_min)/(quality_max - quality_min)) * stripe_num;
}
