#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform mat4 lightViewProjection;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform vec3 lightDir;
uniform vec3 cameraPosition;

uniform sampler2D colorMap;
uniform sampler2D positionMap;
uniform sampler2D depthMap;
uniform sampler2D blurMap;

uniform float intensity;
uniform float bleedBias;
uniform int blurFlag;

varying vec2 vUv;

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

  vec4 lightSpacePosition =  lightViewProjection * position;

  //perspective devide
  //lightSpacePosition.xyz /=  lightSpacePosition.w;

  //linearize in [0..1]
  lightSpacePosition.xyz = lightSpacePosition.xyz * vec3(0.5) + vec3(0.5);

  //sample texture
  vec2 moments;
  if (blurFlag == 1)
    moments = texture2D(blurMap, lightSpacePosition.xy).xy;
  else
    moments = texture2D(depthMap, lightSpacePosition.xy).xy;


  float fragDepth = lightSpacePosition.z;


  //Per face normals make way too blocky shadows obviuosly
  vec3 v1 = dFdx(position.xyz);
  vec3 v2 = dFdy(position.xyz);
  vec3 vn = normalize(cross(v1, v2));
  float p = (dot(vn, -lightDir));
  // if (p < -0.05) return 0.0;


  return shadowContribution(moments, fragDepth);
  // return 1.0;
}

void main(){
  vec4 color = texture2D(colorMap, vUv);

  //anticipating position sampling, in order to fast discard
  vec4 posSample = texture2D(positionMap, vUv);
  if(posSample == vec4(0.0)){ gl_FragColor = color; return; }

  float chebishev = shadowCalc(posSample);

  // if (chebishev > 0.4)
  //   gl_FragColor = vec4(color.rgb, color.a);
  // else
  // // gl_FragColor = vec4(vec3(0.0), 0.5 - shadow);
  //   gl_FragColor = vec4(vec3(0.0), (intensity-chebishev)*color.a);

  if (chebishev > 0.4)
    gl_FragColor = vec4(color.rgb, color.a);
  else {
    float shadowing = (intensity <= 0.5) ? mix(0.0, (chebishev), 2.0*intensity) : mix(chebishev, 1.0, 2.0*intensity-1.0);
    gl_FragColor = vec4(shadowing*color.rgb, color.a);
  }
}
