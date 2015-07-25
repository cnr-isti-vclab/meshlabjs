#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec3 vCenter;

uniform float thickness;
uniform vec3 color;

float edgeFactor(){
    vec3 d = fwidth(vCenter);
       vec3 a3 = smoothstep(vec3(0.0), d*thickness, vCenter);
       float edgeDist = min(min(a3.x, a3.y), a3.z);
       if(edgeDist > 0.5) discard;
       return 1.0-edgeDist;
}

void main() {
    gl_FragColor = vec4( color, edgeFactor());
}