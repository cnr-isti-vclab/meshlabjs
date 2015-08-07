uniform vec3 pntColor;
uniform sampler2D pntTexture;
void main() {
    gl_FragColor = vec4(pntColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pntTexture, gl_PointCoord );
    if ( gl_FragColor.a < ALPHATEST ) discard;
}