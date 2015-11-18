precision highp float;

uniform sampler2D aomap;
uniform sampler2D cmap;

uniform vec2 screenStep;
uniform int blurFlag;
uniform float blurThreshold;

varying vec2 vUv;

void main()
{
    vec4 color = texture2D(cmap, vUv);

    if (color.a == 0.0) discard;

    if (blurFlag == 1) {

        vec2 sum = vec2(0.0);
        //sum += texture2D(aomap, vUv + vec2(-1.5, -1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-1.5, -0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-1.5,  0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-1.5,  1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-0.5, -1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-0.5, -0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-0.5,  0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2(-0.5,  1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 0.5, -1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 0.5, -0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 0.5,  0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 0.5,  1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 1.5, -1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 1.5, -0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 1.5,  0.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv + vec2( 1.5,  1.5)*screenStep).ra;
        //sum += texture2D(aomap, vUv).ra;

        vec4 px = texture2D(aomap, vUv);
        sum += vec2(1.0*px.r, 1.0);
        float i = -1.5, j = -1.5;
        for (int k = 0; k < 16; ++k) {
            vec4 data = texture2D(aomap, vUv + vec2(i, j)*screenStep);
            if (abs(data.a - px.a) <= blurThreshold) {
                sum += vec2(data.r, 1.0);
            }
            if (j == 1.5) {
                j = -1.5;
                i += 1.5;
            } else {
                j += 1.5;
            }
        }

        float val = sum.x / sum.y;

        gl_FragColor = vec4(val * color.rgb, 1.0);
    } else {
        gl_FragColor = vec4(texture2D(aomap, vUv).x * color.rgb, 1.0);
    }
}
