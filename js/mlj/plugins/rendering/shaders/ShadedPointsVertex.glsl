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
uniform vec3 directionalLightColor;
uniform vec3 directionalLightPosition;

varying vec3 vColor;
varying float vRadius;
varying vec3 vViewPosition;


vec3 computeOutputColor(vec3 normalizedViewPosition, vec3 normalizedLightDir, vec3 normal) {

    vec3 outputColor = (usePerVertexColor != 0) ? col : color;

    if (shading == SHADING_ON) {
        float specularNormalization = ( shininess + 2.0 ) / 8.0;

        // diffuse
        float dotProduct = dot(normal, normalizedLightDir );
        float dirDiffuseWeight = max(dotProduct, 0.0 );
        vec3 totalDiffuseLight = directionalLightColor * dirDiffuseWeight;

        // specular
        vec3 dirHalfVector = normalize(normalizedLightDir + normalizedViewPosition );
        float dirDotNormalHalf = max(dot(normal, dirHalfVector), 0.0);
        float dirSpecularWeight = pow(dirDotNormalHalf, shininess);

        vec3 totalSpecularLight = specular * directionalLightColor * dirSpecularWeight * specularNormalization;
        outputColor = outputColor * (totalDiffuseLight + ambientLightColor ) + totalSpecularLight;
    }

    return outputColor;
}

void main() {

    vec3 tNormal = normalMatrix * normal;

    if (backPointsCulling != 0 && tNormal.z < 0.0) {
        gl_PointSize = 0.0;
    } else {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vViewPosition = -mvPosition.xyz;

        vColor = computeOutputColor(normalize(vViewPosition),
                                    normalize(directionalLightPosition), // untransformed position is intended as the direction
                                    normalize(tNormal));
        gl_PointSize = size;
        gl_Position = projectionMatrix * mvPosition;

        float projFactor = 1.0 / tan(fov / 2.0);
        projFactor /= vViewPosition.z;
        projFactor *= screenHeight / 2.0;
        vRadius = gl_PointSize / projFactor;
    }
}