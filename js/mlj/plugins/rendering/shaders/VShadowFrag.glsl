precision highp float;

uniform mat4 lightViewProjection;
uniform mat4 modelMatrix;

uniform sampler2D colorMap;
uniform sampler2D positionMap;
uniform sampler2D depthMap;
uniform sampler2D vBlurMap;
uniform sampler2D hBlurMap;

uniform float intensity;

varying vec2 vUv;

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

  variance = max(variance, 0.00002);

  float d = t - moments.x;
  float pmax = variance / (variance + (d*d));

//  return pmax;
  return containBleed(pmax, 0.2);
}

float shadowCalc(vec4 position){

  vec4 lightSpacePosition =  lightViewProjection * position;

  //perspective devide
  //lightSpacePosition.xyz /=  lightSpacePosition.w;

  //linearize in [0..1]
  lightSpacePosition.xyz = lightSpacePosition.xyz * vec3(0.5) + vec3(0.5);

  //sample texture
  vec2 moments = mix(texture2D(hBlurMap, lightSpacePosition.xy).xy,
                        texture2D(vBlurMap, lightSpacePosition.xy).xy, 0.5);

  float fragDepth = lightSpacePosition.z;

  return shadowContribution(moments, fragDepth);
}

void main(){
  vec4 color = texture2D(colorMap, vUv);

  //anticipating position sampling, in order to fast discard
  vec4 posSample = texture2D(positionMap, vUv);
  if(posSample == vec4(0.0)){ gl_FragColor = color; return;}

  float chebishev = shadowCalc(posSample);

  if (chebishev > 0.4)
    gl_FragColor = vec4(color.rgb, color.a);
  else {
    //float shadowing = clamp(0.6 + chebishev, 0.7, 1.0) * intensity;
    float shadowing = (chebishev + 0.6) * intensity;
    gl_FragColor = vec4(color.rgb * (shadowing), color.a);
  }
}
