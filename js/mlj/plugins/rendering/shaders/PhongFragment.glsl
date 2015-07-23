#extension GL_OES_standard_derivatives : enable
precision highp float;
precision highp int;

#define MAX_DIR_LIGHTS 0
#define MAX_POINT_LIGHTS 1
#define GAMMA_FACTOR 2
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
#define PI 3.14159
#define PI2 6.28318
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6

float square( in float a ) { return a*a; }
vec2  square( in vec2 a )  { return vec2( a.x*a.x, a.y*a.y ); }
vec3  square( in vec3 a )  { return vec3( a.x*a.x, a.y*a.y, a.z*a.z ); }
vec4  square( in vec4 a )  { return vec4( a.x*a.x, a.y*a.y, a.z*a.z, a.w*a.w ); }
float saturate( in float a ) { return clamp( a, 0.0, 1.0 ); }
vec2  saturate( in vec2 a )  { return clamp( a, 0.0, 1.0 ); }
vec3  saturate( in vec3 a )  { return clamp( a, 0.0, 1.0 ); }
vec4  saturate( in vec4 a )  { return clamp( a, 0.0, 1.0 ); }
float average( in float a ) { return a; }
float average( in vec2 a )  { return ( a.x + a.y) * 0.5; }
float average( in vec3 a )  { return ( a.x + a.y + a.z) / 3.0; }
float average( in vec4 a )  { return ( a.x + a.y + a.z + a.w) * 0.25; }
float whiteCompliment( in float a ) { return saturate( 1.0 - a ); }
vec2  whiteCompliment( in vec2 a )  { return saturate( vec2(1.0) - a ); }
vec3  whiteCompliment( in vec3 a )  { return saturate( vec3(1.0) - a ); }
vec4  whiteCompliment( in vec4 a )  { return saturate( vec4(1.0) - a ); }
vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}
// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
vec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {
	float distance = dot( planeNormal, point-pointOnPlane );
	return point - distance * planeNormal;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return pointOnLine + lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) );
}
float calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {
	if ( decayExponent > 0.0 ) {
	  return pow( saturate( 1.0 - lightDistance / cutoffDistance ), decayExponent );
	}
	return 1.0;
}

vec3 inputToLinear( in vec3 a ) {
    #ifdef GAMMA_INPUT
	return pow( a, vec3( float( GAMMA_FACTOR ) ) );
    #else
	return a;
    #endif
}
vec3 linearToOutput( in vec3 a ) {
    #ifdef GAMMA_OUTPUT
	return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );
    #else
	return a;
    #endif
}

uniform vec3 ambientLightColor;

#if MAX_DIR_LIGHTS > 0
    uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
    uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
#endif

#if MAX_POINT_LIGHTS > 0
	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];
	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];
	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];
#endif

#ifdef WRAP_AROUND
	uniform vec3 wrapRGB;
#endif

varying vec3 vViewPosition;

//if FLAT SHADED
varying vec3 vNormal;

void main() {
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor = vec4( diffuse, opacity );
    float specularStrength;

    #ifdef USE_SPECULARMAP
        vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;
    #else
        specularStrength = 1.0;
    #endif
    
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

    #ifdef USE_NORMALMAP
        normal = perturbNormal2Arb( -vViewPosition, normal );
    #elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );
    #endif

    vec3 totalDiffuseLight = vec3( 0.0 );
    vec3 totalSpecularLight = vec3( 0.0 );

    #if MAX_POINT_LIGHTS > 0
	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {

            vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );
            vec3 lVector = lPosition.xyz + vViewPosition.xyz;
            float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );
            lVector = normalize( lVector );
            // diffuse
            float dotProduct = dot( normal, lVector );
            
            #ifdef WRAP_AROUND
                float pointDiffuseWeightFull = max( dotProduct, 0.0 );
                float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );
                vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );
            #else
                float pointDiffuseWeight = max( dotProduct, 0.0 );
            #endif

            totalDiffuseLight += pointLightColor[ i ] * pointDiffuseWeight * attenuation;

            // specular
            vec3 pointHalfVector = normalize( lVector + viewPosition );
            float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );
            float pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );
            float specularNormalization = ( shininess + 2.0 ) / 8.0;
            vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );
            totalSpecularLight += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * attenuation * specularNormalization;
        }
    #endif

    #if MAX_DIR_LIGHTS > 0

	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {
            vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );

            // diffuse
            float dotProduct = dot( normal, dirVector );

            #ifdef WRAP_AROUND
                float dirDiffuseWeightFull = max( dotProduct, 0.0 );
                float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );
                vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );
            #else
                float dirDiffuseWeight = max( dotProduct, 0.0 );

            #endif

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

    #ifdef METAL
	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) * specular + totalSpecularLight + emissive;
    #else
        outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + ambientLightColor ) + totalSpecularLight + emissive;
    #endif

    if(lights == 0)
        gl_FragColor = diffuseColor;
    else
	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}
