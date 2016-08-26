precision highp float;

uniform mat4 projectionMatrix;

uniform sampler2D dmap;
uniform sampler2D noise;
uniform vec2 uvMultiplier;

uniform vec3 samples[32];
uniform float sampleRadius;

uniform float occlusionPower;

varying vec2 vUv;
varying vec3 vViewDirection;

void main()
{
    vec4 textData = texture2D(dmap, vUv);
    vec4 noiseData = texture2D(noise, vUv * uvMultiplier);

    if (textData == vec4(0.0)) discard;

    // reconstruct the view space position of this fragmrnt
    float fragmentDistance = textData.w;
    vec3 fragmentViewPos  = normalize(vViewDirection) * fragmentDistance;

    // build the sample's transform

    // orthonormal basis with the stored fragment normal as the z-axis
    // (reference: Moller, Haines and Hoffman - "Real-Time Rendering", 3rd ed. pp. 70-71)
    vec3 n = textData.xyz;

    vec3 v1;
    vec3 a = abs(n);
    if (a.x <= a.y && a.x <= a.z) {
        v1 = vec3(0.0, -n.z, n.y);
    } else if (a.y <= a.x && a.y <= a.z) {
        v1 = vec3(-n.z, 0.0, n.x);
    } else {
        v1 = vec3(-n.y, n.x, 0.0);
    }
    v1 = normalize(v1);
    vec3 v2 = cross(n, v1);

    mat3 frame = mat3(v1, v2, n);

    // random rotation around the z-axis
    float s = noiseData.x;
    float c = noiseData.y;
    mat3 Rz = mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);

    mat3 sampleTransform = frame * Rz;

    // compute ambient occlusion
    float ambientOcclusion = 0.0;
    float contribution = 1.0 / 32.0;
    for (int i = 0; i < 32; ++i) {
        vec3 viewSpaceSample = fragmentViewPos + (sampleTransform * (sampleRadius * samples[i]));

        vec4 projSample = projectionMatrix * vec4(viewSpaceSample, 1.0);
        vec2 sampleUvCoords = ((projSample.xy / projSample.w) * 0.5 + vec2(0.5, 0.5));
        float sampleFragCoordsSceneDistance = texture2D(dmap, sampleUvCoords).w;

        if (length(viewSpaceSample) > sampleFragCoordsSceneDistance && !(sampleFragCoordsSceneDistance == 0.0)) {
            ambientOcclusion += contribution;
        }
    }

    //gl_FragColor = vec4(vec3(pow(1.0-ambientOcclusion, occlusionPower)), 1.0);
    gl_FragColor = vec4(vec3(pow(1.0-ambientOcclusion, occlusionPower)), fragmentDistance);
}
