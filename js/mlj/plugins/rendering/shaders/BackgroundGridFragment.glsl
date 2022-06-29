precision highp float;

uniform vec3 backColor;
uniform vec3 frontColor;
uniform float alpha;
uniform vec3 normal;
uniform vec3 cameraPosition;
uniform bool frontGridCulling;
uniform float scaleFactor;
uniform vec3 offset;

varying vec3 positionG;

void main() 
{
    // Compute the absolute camera position
    vec3 cameraAbs = cameraPosition - offset;
    cameraAbs = cameraAbs / scaleFactor;

    // The camera position vector is with respect of the center of the scene. We need the view direction with respect of
    // the position of the vertex, so we need to get the difference between the two vectors
    vec3 viewDir = cameraAbs - positionG;

    // The default color is the backColor
    vec3 color = backColor;

    bool dotProdNegative = dot(normal, normalize(viewDir)) < 0.0;

    // If the scalar product between the normal and the view direction is below 0, we are facing the fragment, so we don't draw it
    if(frontGridCulling && dotProdNegative)
        discard;
    else if(!frontGridCulling && dotProdNegative)
        color = frontColor;

    gl_FragColor = vec4(color, alpha);
}