#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;

#define COLOR_UNIFORM   0
#define COLOR_ATTRIBUTE 1

#define MAX_DIR_LIGHTS 1
#define DOUBLE_SIDED
#define SMOOTH 2

uniform mat4 viewMatrix;

uniform int shading;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform int lights;
uniform int meshColorMapping;

#define PI 3.14159

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}

uniform vec3 ambientLightColor;

#if MAX_DIR_LIGHTS > 0
    uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
    uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
#endif

varying vec3 vViewPosition;

//if FLAT SHADED
varying vec3 vNormal;

varying vec3 vColor;

void main() {
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor;
    if (meshColorMapping == COLOR_UNIFORM) {
        diffuseColor = vec4( diffuse, opacity );
    } else if (meshColorMapping == COLOR_ATTRIBUTE) {
        diffuseColor = vec4( vColor, opacity );
    } else {
        diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
    }
    float specularStrength = 1.0;
    
    vec3 normal;
    if(shading == SMOOTH) {
        normal = normalize( vNormal );
    
        #ifdef DOUBLE_SIDED
            normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );
        #endif
    } else {    
        vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	normal = normalize( cross( fdx, fdy ) );
    }    

    vec3 viewPosition = normalize( vViewPosition );  

    vec3 totalDiffuseLight = vec3( 0.0 );
    vec3 totalSpecularLight = vec3( 0.0 );

    #if MAX_DIR_LIGHTS > 0

	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {
            vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );

            // diffuse
            float dotProduct = dot( normal, dirVector );
            
            float dirDiffuseWeight = max( dotProduct, 0.0 );

            totalDiffuseLight += directionalLightColor[ i ] * dirDiffuseWeight;

            // specular

            vec3 dirHalfVector = normalize( dirVector + viewPosition );
            float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
            float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );

            /*
            // fresnel term from skin shader
            const float F0 = 0.128;

            float base = 1.0 - dot( viewPosition, dirHalfVector );
            float exponential = pow( base, 5.0 );

            float fresnel = exponential + F0 * ( 1.0 - exponential );
            */

            /*
            // fresnel term from fresnel shader
            const float mFresnelBias = 0.08;
            const float mFresnelScale = 0.3;
            const float mFresnelPower = 5.0;
            float fresnel = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( -viewPosition ), normal ), mFresnelPower );
            */
            float specularNormalization = ( shininess + 2.0 ) / 8.0;
            // 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;
            vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
            totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;
	}

    #endif

    outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight + emissive;
    
    if(lights == 0)
        gl_FragColor = diffuseColor;
    else
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
