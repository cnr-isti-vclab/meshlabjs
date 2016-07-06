precision highp float;

uniform sampler2D eyeDepthMap;
uniform sampler2D lightDepthMap;
uniform vec2 textureSize;

varying vec4 lightFragPos;
varying vec2 vUv;

void main(){

  float eyeClosest = texture2D(eyeDepthMap, vUv).r;

  if (gl_FragCoord.z - 0.0001 > eyeClosest ) discard;

  vec4 position = lightFragPos;
  position.xyz /= position.w;
  position.xyz = position.xyz * vec3(0.5) + vec3(0.5);

  float closest = texture2D(lightDepthMap, position.xy).r;
  float current = position.z;

// DEBUG...USE IT TO LOOK AT lightDepthBuffer or cameraDepthBuffer
//  gl_FragColor.xyzw = vec4(vec3(eyeClosest), 1.0);
//  return;

// PCF
  float shadows = 0.0;
  vec2 texelSz = 1.0 / textureSize;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      float closest = texture2D(lightDepthMap, vec2(position.xy + vec2(i, j) * texelSz)).r;
      shadows = (current - 0.005 > closest) ? shadows + 1.0 : shadows;
    }
  }

  shadows /= 9.0;
  float a = mix(0.0, 0.3, shadows);


  gl_FragColor = vec4(0, 0, 0, a);


  }
