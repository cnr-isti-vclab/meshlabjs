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
uniform mat4 lightModelView;

uniform vec3 lightDir;
uniform vec3 cameraPosition;

uniform sampler2D colorMap;
uniform sampler2D depthMap;

uniform float intensity;
uniform float bleedBias;
uniform int pcfSize;
uniform int pcfTot;
uniform float offBias;
uniform int blurFlag;
uniform int normalFlag;

varying vec3 vNormal;
varying vec4 vPosition;
varying vec3 vViewPosition;

const int max_pcf = 3;

float PCF(vec3 depthPosition) {
  float texelSize = 1.0 / texSize;
  float shadow = 0.0;


  for(int i=-max_pcf; i<=max_pcf; i+=1)
    if ( i >= -pcfSize && i <= pcfSize)
      for(int j=-max_pcf; j<=max_pcf; j+=1) 
        if ( j >= -pcfSize && j <= pcfSize )
        {
          float closest = texture2D(depthMap, depthPosition.xy + vec2(i,j)*texelSize).r;
          shadow = (depthPosition.z - offBias > closest) ? shadow + 1.0 : shadow;
        }

  return shadow / float(pcfTot);
}

float shadowCalc(vec4 position){
  // vec4 lightD = viewMatrix * vec4(-lightDir,1.0);

  vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
  vec3 n = normalize( cross( fdx, fdy ) );
  // normalcheck with light direction
  // #if MAX_DIR_LIGHTS > 0   
    // if(normalFlag == 1 && dot(n, transformDirection(directionalLightDirection[ 0 ], viewMatrix)) <= -0.02) return 0.0;
  // #endif
  if(normalFlag == 1 && dot(n, transformDirection(lightDir, viewMatrix)) <= -0.02) return 0.0;

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

  //early discard fragments
  // sample is the fragment x,y position in [0..1] space (needed for texture sampling)
  vec2 sample = vec2(gl_FragCoord.x / bufWidth, gl_FragCoord.y / bufHeight);
  vec4 color = texture2D(colorMap, sample);
  if(color.a == 0.0) discard;

  if (pointSize != 0.0) {
    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    if (w > 1.0) discard;
  }

  float shadow = shadowCalc(vPosition);
  vec3 col = mix((1.0-shadow) * color.rgb, color.rgb, intensity); 

  gl_FragColor = vec4(col, color.a);
}