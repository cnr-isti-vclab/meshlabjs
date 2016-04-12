#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float stripe_alpha;
uniform float stripe_width;   // between 0 and 1 .
uniform bool stripe_ramp;

varying float scaled_quality;

void main(void)
{
  if(fract(scaled_quality) > stripe_width) 
     discard;

  float alpha = 1.0;

  if(stripe_ramp) 
     alpha = fract(scaled_quality)/stripe_width;

  vec4 color = vec4(1.0, 1.0, 1.0, stripe_alpha*alpha);
  gl_FragColor = color;
}
