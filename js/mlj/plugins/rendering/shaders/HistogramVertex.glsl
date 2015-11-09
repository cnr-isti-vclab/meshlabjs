precision highp float;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;

void main()
{
	gl_Position = vec4(2.0*position - vec3(1.0,1.0,0.0), 1.0);
	vColor = color;
}
