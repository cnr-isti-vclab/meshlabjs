#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float bufWidth;
uniform float bufHeight;
uniform float texSize;
uniform float pointSize;

uniform mat4 lightViewProjection;
uniform mat4 modelViewMatrix;

uniform vec3 lightDir;
uniform vec3 cameraPosition;

uniform sampler2D colorMap;
uniform sampler2D depthMap;
uniform sampler2D blurMap;

uniform float intensity;
uniform float bleedBias;
uniform float offBias;
uniform int blurFlag;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vPosition;

/* implementing bleed containment as described in GPU Gems */

float linearStep(float min, float max, float v) {
  return clamp((v-min)/(max-min), 0.0, 1.0);
}

float containBleed(float cheb, float thresh) {
  return linearStep(thresh, 1.0, cheb);
}

float shadowContribution(vec2 moments, float t) {

  if (t <= moments.x) return 1.0;//bound della funzione di Chebyshev

  float m1_2 = moments.x * moments.x;
  float variance = moments.y - m1_2; // var = E(x^2) - E(x)^2;

  variance = max(variance, 0.002);

  float d = moments.x - t;
  float pmax = variance / (variance + (d*d));

  // return pmax;
  return containBleed(pmax, bleedBias);
}

float shadowCalc(vec4 position){

  vec3 n = (gl_FrontFacing) ? vNormal : -vNormal;
  if(dot(normalize(n), normalize(-lightDir)) <= -0.2) return 0.0;

  vec4 lightSpacePosition =  lightViewProjection * position;

  //perspective devide
 // lightSpacePosition.xyz /=  lightSpacePosition.w;

  //linearize in [0..1]
  lightSpacePosition.xyz = lightSpacePosition.xyz * vec3(0.5) + vec3(0.5);

  //sample texture
  vec2 moments = (blurFlag == 1) ? texture2D(blurMap, lightSpacePosition.xy).xy :
                                      texture2D(depthMap, lightSpacePosition.xy).xy;

  float fragDepth = lightSpacePosition.z - offBias;

  return shadowContribution(moments, fragDepth);
  // return 1.0;
}

void main(){
  if (pointSize != 0.0) {
    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    if (w > 1.0) discard;
  }
  vec2 sample = vec2(gl_FragCoord.x / bufWidth, gl_FragCoord.y / bufHeight);
  
  vec4 color = texture2D(colorMap, sample);
  if(color.a == 0.0) discard;

  float chebishev = shadowCalc(vPosition);

  vec3 col = mix(color.rgb*chebishev, color.rgb, intensity);
  gl_FragColor = vec4(col, color.a);


}
