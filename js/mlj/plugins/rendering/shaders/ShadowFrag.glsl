precision highp float;

uniform vec2 textureSize;
uniform vec3 lightPosition;
uniform sampler2D eyeDepthMap;
uniform sampler2D lightDepthMap;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec4 lightFragPos;

void main(){

  //compute lightDirection vector, relative to fragment
  vec3 lightDir = normalize(lightPosition - vFragPos);

  //compute bias based on orientation of fragment
  float bias = max(0.001, 0.01 * (1.0 - dot(vNormal, lightDir)));
  //float eyeBias = max(0.0001, 0.004 * (1.0 - dot(vNormal, lightDir)));

  float eyeClosest = texture2D(eyeDepthMap, vUv).r;

  if (gl_FragCoord.z - 0.0005 > eyeClosest ) discard;

  // world space position
  vec4 position = lightFragPos;
  // clip space position ([0..1])
  position.xyz /= position.w;
  position.xyz = position.xyz * vec3(0.5) + vec3(0.5);

//  float closest = texture2D(lightDepthMap, position.xy).r;
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
      shadows = (current - bias > closest) ? shadows + 1.0 : shadows;
    }
  }

  shadows /= 9.0;

  float a = mix(0.0, 0.2, shadows);
  gl_FragColor = vec4(0, 0, 0, a);


  }
