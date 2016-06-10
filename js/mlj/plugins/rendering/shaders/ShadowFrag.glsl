precision highp float;

uniform sampler2D depthMap;

varying vec4 lightFragPos;


void main(){
  //could skip while using ortho camera for lights
  vec4 position = lightFragPos;
  position.xyz /= position.w;
  position.xyz = position.xyz * vec3(0.5) + vec3(0.5);

  float closest = texture2D(depthMap, position.xy).r;
  float current = position.z;

//  gl_FragColor.rgba = vec4(vec3(current),1.0);

  if (current - 0.005 > closest){
    gl_FragColor = vec4(0, 0, 0, 0.8);
  } else {
    discard;
  }

  }
