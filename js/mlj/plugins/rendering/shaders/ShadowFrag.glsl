precision highp float;

uniform mat4 lightViewProjection;
uniform mat4 modelMatrix;
uniform sampler2D colorMap;
uniform sampler2D positionMap;
uniform sampler2D depthMap;

varying vec2 vUv;

float shadowCalc(vec2 vUv){

  vec4 position = texture2D(positionMap, vUv); //posizione mondo
  vec4 lightSpacePosition =  lightViewProjection * position;

  lightSpacePosition.xyz /=  lightSpacePosition.w;

  lightSpacePosition.xyz = lightSpacePosition.xyz * vec3(0.5) + vec3(0.5);

  float closest = texture2D(depthMap, lightSpacePosition.xy).r;
  float current = lightSpacePosition.z;

  float shadow = current  - 0.005 > closest ? 1.0 : 0.0;

  return shadow;
}

void main(){
  vec4 color = texture2D(colorMap, vUv);

  if (color.a == 0.0) discard;

  float lighting = (shadowCalc(vUv) > 0.0) ? 0.3 : 1.0;

  gl_FragColor = vec4(color.rgb * lighting, color.a);
}
