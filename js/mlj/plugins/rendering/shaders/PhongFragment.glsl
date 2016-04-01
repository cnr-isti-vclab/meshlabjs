#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;

#define COLOR_UNIFORM   0
#define COLOR_ATTRIBUTE 1

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
uniform int mljColorMode;
uniform vec3 directionalLightColor;
uniform vec3 directionalLightPosition;
uniform vec3 ambientLightColor;

varying vec3 vViewPosition;

//if FLAT SHADED
varying vec3 vNormal;

varying vec3 vColor;

void main() {
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor;
    if (mljColorMode == 0) {
        diffuseColor = vec4( diffuse, opacity );
    } else {
        diffuseColor = vec4( vColor, opacity );
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

    //vec3 dirVector = transformDirection( directionalLightDirection, viewMatrix );
    vec3 dirVector = normalize(directionalLightPosition); // untransformed position is intended as the direction
    float dotProduct = dot( normal, dirVector );

    float dirDiffuseWeight = max( dotProduct, 0.0 );

    totalDiffuseLight += directionalLightColor * dirDiffuseWeight;

    // specular

    vec3 dirHalfVector = normalize( dirVector + viewPosition );
    float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
    float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );

    float specularNormalization = ( shininess + 2.0 ) / 8.0;
    // 		dirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization * fresnel;
    vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
    totalSpecularLight += schlick * directionalLightColor * dirSpecularWeight * dirDiffuseWeight * specularNormalization;

    outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight + emissive;
    
    if(lights == 0)
        gl_FragColor = diffuseColor;
    else
	   gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
