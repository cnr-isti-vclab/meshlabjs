#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;

#define MAX_DIR_LIGHTS 1

varying vec3 vCenter;
varying vec3 vViewPosition;

uniform float thickness;
uniform vec3 color;
uniform int isShaded;
uniform vec3 specular;
uniform float shininess;

uniform mat4 viewMatrix;


uniform vec3 ambientLightColor;
uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}

float edgeFactor(){
    vec3 d = fwidth(vCenter);
       vec3 a3 = smoothstep(vec3(0.0), d*thickness, vCenter);
       float edgeDist = min(min(a3.x, a3.y), a3.z);
       if(edgeDist > 0.5) discard;
       return 1.0-edgeDist;
}

void main() {

    float opacityEdgeFactor = edgeFactor();
    vec3 outputColor = color;

    if (isShaded != 0) {

        vec3 diffuseColor = color;
        vec3 fdx = dFdx( vViewPosition );
        vec3 fdy = dFdy( vViewPosition );
        vec3 normal = normalize( cross( fdx, fdy ) );

        // fix normal sign
        normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );

        vec3 outgoingLight = vec3( 0.0 );
        vec3 totalDiffuseLight = vec3( 0.0 );
        vec3 totalSpecularLight = vec3( 0.0 );
        float specularStrength = 1.0;

        vec3 viewPosition = normalize( vViewPosition );

        for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {
            vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );

            // diffuse
            float dotProduct = dot( normal, dirVector );
            float dirDiffuseWeight = max( dotProduct, 0.0 );
            totalDiffuseLight += directionalLightColor[ i ] * dirDiffuseWeight;

            // specular
            vec3 dirHalfVector = normalize( dirVector + viewPosition );
            float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
            float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );

             float specularNormalization = ( shininess + 2.0 ) / 8.0;
             vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
             totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;

        }

        outputColor = diffuseColor * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight;
    }

    gl_FragColor = vec4(outputColor, opacityEdgeFactor);

}