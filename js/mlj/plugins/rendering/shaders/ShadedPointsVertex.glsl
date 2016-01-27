attribute vec3 position;
attribute vec3 normal;
attribute vec3 col;

uniform int backPointsCulling;

uniform int usePerVertexColor;
uniform vec3 color;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform float size;

uniform float screenWidth;
uniform float screenHeight;
uniform float fov;

#define SHADING_ON    0
#define MAX_DIR_LIGHTS 1
uniform int shading;
uniform vec3 specular;
uniform float shininess;
uniform vec3 ambientLightColor;
uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];
uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];

varying vec3 vColor;
varying float vRadius;
varying vec3 vViewPosition;

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}

vec3 computeOutputColor(vec3 viewPositionNormalized, vec3 ligthDirectionEye, vec3 normal) {

    vec3 outputColor = (usePerVertexColor != 0) ? col : color;

    if (shading == SHADING_ON) {
        vec3 diffuseColor = outputColor;
        vec3 totalDiffuseLight = vec3( 0.0 );
        vec3 totalSpecularLight = vec3( 0.0 );
        float specularNormalization = ( shininess + 2.0 ) / 8.0;
        vec3 viewPosition = viewPositionNormalized; //vViewPositionNormalized;
        vec3 dirVector = ligthDirectionEye; //transformDirection( directionalLightDirection[ i ], viewMatrix );

        // diffuse
        float dotProduct = dot(normal, dirVector );
        float dirDiffuseWeight = max(dotProduct, 0.0 );
        totalDiffuseLight += directionalLightColor[0] * dirDiffuseWeight;

        // specular
        vec3 dirHalfVector = normalize(dirVector + viewPosition );
        float dirDotNormalHalf = max(dot(normal, dirHalfVector), 0.0);
        //float dirSpecularWeight = max( pow( dirDotNormalHalf, shininess ), 0.0 );
        float dirSpecularWeight = pow(dirDotNormalHalf, shininess);

        //float specularNormalization = ( shininess + 2.0 ) / 8.0;
        //vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );
        //totalSpecularLight += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;
        totalSpecularLight += specular * directionalLightColor[0] * dirSpecularWeight * specularNormalization;
        outputColor = diffuseColor * (totalDiffuseLight + ambientLightColor ) + totalSpecularLight;
    }

    return outputColor;
}

void main() {

    vec3 tNormal = normalMatrix * normal;

    if (backPointsCulling != 0 && tNormal.z < 0.0) {
        gl_PointSize = 0.0;
    } else {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec3 viewPosition = -mvPosition.xyz;

        vViewPosition = viewPosition;
        vColor = computeOutputColor(normalize(viewPosition),
                                    transformDirection(directionalLightDirection[0],viewMatrix),
                                    normalize(tNormal));

        gl_PointSize = size;
        gl_Position = projectionMatrix * mvPosition;

        float projFactor = 1.0 / tan(fov / 2.0);
        projFactor /= viewPosition.z;
        projFactor *= screenHeight / 2.0;
        vRadius = gl_PointSize / projFactor;
    }
}