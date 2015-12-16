#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;

#define ALPHATEST 0.5
#define MAX_DIR_LIGHTS 1

#define SHADED 0
#define NO_SHADED 1
#define FIXED 2

varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vLigthDirectionEye;
varying vec3 vColor;

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

    if (flag != 0.0) discard;

    vec3 outputColor = vColor;

    if (texture2D(texture, gl_PointCoord).a < ALPHATEST) discard;

    if (isShaded != FIXED) {


        if (isShaded != SHADED) {

            vec3 diffuseColor = outputColor;

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

        }

        gl_FragColor = vec4(outputColor, 1.0 );// * texture2D( texture, gl_PointCoord );

    } else {
        //gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(texture, gl_PointCoord);// * texture2D( texture, gl_PointCoord );
        float u = 2.0*gl_PointCoord.x-1.0;
        float v = 2.0*gl_PointCoord.y-1.0;
        float w = u*u+v*v;
        if (w > 0.4) outputColor = vec3(0.0,0.0,0.0);

        gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(texture, gl_PointCoord);

    }
}