#extension GL_OES_standard_derivatives : enable

precision highp float;

varying float vDistance;
varying vec3 vModelViewPos;

void main()
{
    // interpolated vertex normals cause fake occlusions, so use face normals
    vec3 v1 = dFdx(vModelViewPos);
    vec3 v2 = dFdy(vModelViewPos);
    vec3 vn = normalize(cross(v1, v2));
    gl_FragColor = vec4(vn, vDistance);
}
