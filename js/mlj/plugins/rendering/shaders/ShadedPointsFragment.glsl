#extension GL_OES_standard_derivatives : enable
#extension GL_EXT_frag_depth : enable

precision highp float;
precision highp int;

#define ALPHATEST 0.5
#define MAX_DIR_LIGHTS 1

#define SHADED 1
#define NO_SHADED 0
#define FIXED 2

varying vec3 vViewPosition;
varying vec3 vViewPositionNormalized;
varying vec3 vNormal;
varying vec3 vLigthDirectionEye;
varying vec3 vColor;

uniform int shading;
uniform vec3 specular;
uniform float shininess;
uniform sampler2D discAlpha;
uniform sampler2D discBorder;
uniform sampler2D discShaded;

//uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

//uniform int backPointsCulling;
varying float flag;
varying float vRadius;

uniform vec3 ambientLightColor;
uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];
uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];

//vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
//	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
//}

// gl_FragCoord.z;

void main() {

    if (flag != 0.0) discard;

    vec3 outputColor = vColor;

    if (texture2D(discAlpha, gl_PointCoord).a < ALPHATEST) discard;

    float u = 2.0*gl_PointCoord.x-1.0;
    float v = 2.0*gl_PointCoord.y-1.0;
    float w = u*u+v*v;
    float wi = 0.0 - w;
    vec4 pos = vec4(-vViewPosition, 1.0);
    pos.z += wi * vRadius;
    vec3 lightPos = normalize(-pos.xyz);
    pos = projectionMatrix * pos;
    pos = pos / pos.w;
    float depth = (pos.z + 1.0) / 2.0;
    gl_FragDepthEXT = depth - 0.0001;

    if (shading != FIXED) {

        if (shading == SHADED) {

            vec3 diffuseColor = outputColor;

            vec3 normal = normalize(vNormal);

            vec3 totalDiffuseLight = vec3( 0.0 );
            vec3 totalSpecularLight = vec3( 0.0 );
            float specularNormalization = ( shininess + 2.0 ) / 8.0;

            vec3 viewPosition = lightPos; //vViewPositionNormalized;

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

        gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(discShaded, gl_PointCoord);

    } else {

        gl_FragColor = vec4(outputColor, 1.0 ) * texture2D(discBorder, gl_PointCoord);
    }


}