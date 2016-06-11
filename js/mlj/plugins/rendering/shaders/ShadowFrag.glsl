precision highp float;

uniform sampler2D eyeDepthMap;
uniform sampler2D lightDepthMap;

varying vec4 lightFragPos;


void main(){


  float eyeClosest = texture2D(eyeDepthMap, gl_FragCoord.xy).r;

//  if (gl_FragCoord.z > eyeClosest ) discard;

  vec4 position = lightFragPos;
  position.xyz /= position.w;
  position.xyz = position.xyz * vec3(0.5) + vec3(0.5);

  float closest = texture2D(lightDepthMap, position.xy).r;
  float current = position.z;

// DEBUG...USE IT TO LOOK AT lightDepthBuffer or cameraDepthBuffer
  gl_FragColor.xyzw = vec4(vec3(closest), 1.0);
  return;

  if (current - 0.005 > closest){
    gl_FragColor = vec4(0, 0, 0, 0.3);
  } else {
    gl_FragColor = vec4(1, 0, 0, 0.002);
  }

  }
