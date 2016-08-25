precision highp float;

//seguo l'implementazione suggerita qui:
// http://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
// molto interessante la cosa di fare due filtri lineari separati, e il sampling
// che sfrutta la gpu per ottenere un sample già filtrata

uniform sampler2D depthMap;

#define stepCount 9 //35x35 kernel
uniform float gWeights[stepCount];
uniform float gOffsets[stepCount];

varying vec2 vUv;

vec3 GaussianBlur(sampler2D tex0, vec2 centreUV, vec2 pixelOffset) {
     vec3 colOut = vec3( 0, 0, 0 );

     for( int i = 0; i < stepCount; i++ ) {
         vec2 texCoordOffset = gOffsets[i] * pixelOffset;
         vec3 col = texture2D(tex0, centreUV + texCoordOffset).xyz +
                            texture2D(tex0, centreUV - texCoordOffset).xyz;
         colOut += gWeights[i] * col;
     }
     return colOut;
 }

void main() {
  gl_FragColor = vec4(GaussianBlur(depthMap, vUv, vec2(0.0, 1.0 / 512.0)), 1.0);
}
