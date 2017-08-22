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
    vec4 px = texture2D(aomap, vUv);

    if (px == vec4(0.0)) { gl_FragColor = color; return;}

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


        sum += vec2(1.0*px.r, 1.0);
        float i = -1.5, j = -1.5;
        for (int k = 0; k < 16; ++k) {
            vec4 data = texture2D(aomap, vUv + vec2(i, j)*screenStep);
            if (abs(data.a - px.a) <= blurThreshold) {
                sum += vec2(data.r, 1.0);
            }
            j == 1.5 ? (j = -1.5, i += 1.0) : j += 1.0;
        }

        float val = sum.x / sum.y;

        gl_FragColor = vec4(val * color.rgb, 1.0);
    } else {
        gl_FragColor = vec4(texture2D(aomap, vUv).x * color.rgb, 1.0);
    }
}
