#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float bufWidth;
uniform float bufHeight;
uniform float pointSize;

uniform mat4 lightViewProjection;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 lightDir;
uniform vec3 cameraPosition;

uniform sampler2D colorMap;
uniform sampler2D positionMap;
uniform sampler2D normalMap;
uniform sampler2D depthMap;

uniform float intensity;
uniform float bleedBias;
uniform int blurFlag;

 
varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vPosition;

float shadowCalc(vec4 position){

  vec3 n = (gl_FrontFacing) ? vNormal : -vNormal;
  if(dot(normalize(n), normalize(-lightDir)) <= -0.2) return 1.0;

  vec4 lightSpacePosition =  lightViewProjection * position;

  lightSpacePosition.xyz /=  lightSpacePosition.w;

  lightSpacePosition.xyz = lightSpacePosition.xyz * vec3(0.5) + vec3(0.5);

  float closest = texture2D(depthMap, lightSpacePosition.xy).r;
  float current = lightSpacePosition.z;
  
  float shadow = current - 0.05 > closest ? 1.0 : 0.0;
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

  float lighting = (shadowCalc(vPosition) > 0.0) ? intensity : 1.0;
  gl_FragColor = vec4(color.rgb*(lighting), color.a);
}
