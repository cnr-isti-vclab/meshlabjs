precision highp float;

uniform sampler2D aomap;
uniform sampler2D cmap;

uniform vec2 screenStep;
uniform int blurFlag;

varying vec2 vUv;

void main()
{
    vec4 color = texture2D(cmap, vUv);

    if (color.a == 0.0) discard;

    if (blurFlag == 1) {

        vec2 sum = vec2(0.0);
        sum += texture2D(aomap, vUv + vec2(-1.5, -1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-1.5, -0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-1.5,  0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-1.5,  1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-0.5, -1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-0.5, -0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-0.5,  0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2(-0.5,  1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 0.5, -1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 0.5, -0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 0.5,  0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 0.5,  1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 1.5, -1.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 1.5, -0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 1.5,  0.5)*screenStep).ra;
        sum += texture2D(aomap, vUv + vec2( 1.5,  1.5)*screenStep).ra;
        float val = sum.x / sum.y;

        gl_FragColor = vec4(val * color.rgb, 1.0);
    } else {
        gl_FragColor = vec4(texture2D(aomap, vUv).x * color.rgb, 1.0);
    }
}
