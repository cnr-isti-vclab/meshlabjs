#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float bufWidth;
uniform float bufHeight;
uniform float texSize;
uniform float pointSize;

uniform mat4 lightViewProjection;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 lightDir;
uniform vec3 cameraPosition;

uniform sampler2D colorMap;
uniform sampler2D depthMap;

uniform float intensity;
uniform float bleedBias;
uniform float offBias;
uniform int blurFlag;
uniform int normalFlag;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vPosition;

float PCF(vec3 depthPosition) {
  float texelSize = 1.0 / texSize;
  float shadow = 0.0;

  for(int i=-1; i<2; ++i)
    for(int j=-1; j<2; ++j) {
      float closest = texture2D(depthMap, depthPosition.xy + vec2(i,j)*texelSize).r;
      shadow = (depthPosition.z - offBias > closest) ? shadow + 1.0 : shadow;
    }

  return shadow / 9.0;
}

float shadowCalc(vec4 position){

  vec3 n = (gl_FrontFacing) ? vNormal : -vNormal;
  if(normalFlag == 1 && dot(normalize(n), normalize(-lightDir)) <= -0.2) return 1.0;

  vec4 lightSpacePosition =  lightViewProjection * position;

  //lightSpacePosition.xyz /=  lightSpacePosition.w;

  lightSpacePosition.xyz = lightSpacePosition.xyz * vec3(0.5) + vec3(0.5);

  if(blurFlag == 1)
    return PCF(lightSpacePosition.xyz);
  
  float closest = texture2D(depthMap, lightSpacePosition.xy).r;
  float current = lightSpacePosition.z;
  
  float shadow = current - offBias > closest ? 1.0 : 0.0;
  return shadow;
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

  float shadow = shadowCalc(vPosition);
  vec3 col = mix((1.0-shadow) * color.rgb, color.rgb, intensity); 

  gl_FragColor = vec4(col, color.a);
}