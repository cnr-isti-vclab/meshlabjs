#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;

#define ALPHATEST 0.01
#define MAX_DIR_LIGHTS 1

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vLigthDirectionEye;

uniform vec3 color;
uniform int isShaded;
uniform vec3 specular;
uniform float shininess;
uniform sampler2D texture;

uniform mat4 viewMatrix;

//uniform int backPointsCulling;
varying float flag;

uniform vec3 ambientLightColor;
uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];
uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}


void main() {

    vec4 texColor;

    if (flag != 0.0) discard;

    if (texture2D(texture, gl_PointCoord).a < ALPHATEST ) discard;

    vec3 outputColor = color;

    if (isShaded != 0) {

        vec3 diffuseColor = color;

        vec3 normal = normalize(vNormal);

        vec3 totalDiffuseLight = vec3( 0.0 );
        vec3 totalSpecularLight = vec3( 0.0 );
        float specularNormalization = ( shininess + 2.0 ) / 8.0;

        vec3 viewPosition = vViewPosition;

        vec3 dirVector = vLigthDirectionEye; //transformDirection( directionalLightDirection[ i ], viewMatrix );

             // diffuse
        float dotProduct = dot( normal, dirVector );
        float dirDiffuseWeight = max( dotProduct, 0.0 );
        totalDiffuseLight += directionalLightColor[ 0 ] * dirDiffuseWeight;

        // specular
        vec3 dirHalfVector = normalize( dirVector + viewPosition );
        float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
        //float dirSpecularWeight = max( pow( dirDotNormalHalf, shininess ), 0.0 );
        float dirSpecularWeight = pow( dirDotNormalHalf, shininess );

        //float specularNormalization = ( shininess + 2.0 ) / 8.0;
        //vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
        //totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;
        totalSpecularLight += specular * directionalLightColor[ 0 ] * dirSpecularWeight * specularNormalization;


        outputColor = diffuseColor * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight;

        gl_FragColor = vec4(outputColor, 1.0 );// * texture2D( texture, gl_PointCoord );

    }

    gl_FragColor = vec4(outputColor, 1.0 );// * texture2D( texture, gl_PointCoord );
    //if ( gl_FragColor.a < ALPHATEST ) discard;

}