/*

Radiance Scaling shader implementation for the MeshLabJS project

Radiance Scaling is a rendering technique described in:

  Romain Vergne, Romain Pacanowski, Pascal Barla, Xavier Granier, Christophe Schlick.
  Radiance Scaling for Versatile Surface Enhancement.
  I3D ’10: Proc. symposium on Interactive 3D graphics and games, Feb 2010, Boston, United States.ACM, 2010.
  <inria-00449828>

The following code is based on

 - The descriptions available in the original paper and in

    * Romain Vergne, Romain Pacanowski, Pascal Barla, Xavier Granier, Christophe Schlick.
      Improving Shape Depiction under Arbitrary Rendering.
      IEEE Transactions on Visualization and Computer Graphics,
      Institute of Electrical and Electronics Engineers, 2011, 17 (8),
      pp.1071 - 1081. <10.1109/TVCG.2010.252>. <inria-00585144>

    * Romain Vergne, Romain Pacanowski, Pascal Barla, Xavier Granier, Christophe Schlick.
      Light Warping for Enhanced Surface Depiction. ACM Transaction on Graphics (Proceedings of
      SIGGRAPH 2009), ACM, 2009, 28 (3), <10.1145/1531326.1531331>. <inria-00400829>

 - The code of the official library developed by the paper's authors and available at
    * http://manao.inria.fr/demos/radiancescaling_demo/

 - MeshLab's Radiance Scaling plugin developed by

    * Vergne Romain, Dumas Olivier
      INRIA - Institut Nationnal de Recherche en Informatique et Automatique

Notes
  2015-10-31: This version implements the simple isotropic curvature mapping, 
    disregarding the light vector direction. Furthermore, it doesn't apply 
    anisotropic diffusion before derivating the gradient map.
*/
precision highp float;
precision highp sampler2D;

uniform float gamma;
uniform float alpha;
uniform float attenuation;
uniform int cflag;

uniform sampler2D gmap;
uniform sampler2D cmap;

uniform float xstep;
uniform float ystep;

varying vec2 vUv;

// 3*3 Sobel operator applyed to gmap(vUv.x,vUv.y) along x and y directions
vec3 depthFieldHessian() 
{
    vec4 A = texture2D(gmap, vec2(vUv.x - xstep , vUv.y + ystep));
    vec4 B = texture2D(gmap, vec2(vUv.x         , vUv.y + ystep));
    vec4 C = texture2D(gmap, vec2(vUv.x + xstep , vUv.y + ystep));
    vec4 D = texture2D(gmap, vec2(vUv.x - xstep , vUv.y        ));
    vec4 E = texture2D(gmap, vec2(vUv.x + xstep , vUv.y        ));
    vec4 F = texture2D(gmap, vec2(vUv.x - xstep , vUv.y - ystep));
    vec4 G = texture2D(gmap, vec2(vUv.x         , vUv.y - ystep));
    vec4 H = texture2D(gmap, vec2(vUv.x + xstep , vUv.y - ystep));

    float xx = 2.0*E.x-2.0*D.x+C.x-A.x+H.x-F.x;
    float yy = 2.0*B.y-2.0*G.y+A.y-F.y+C.y-H.y;

    return vec3(xx, yy, 0.0);
}

float sigma(in float k, in float d)
{
    float expgk = exp(gamma*(-k));
    return (alpha * expgk + d * (1.0 - alpha * (1.0 + expgk))) / (alpha + d * (expgk - alpha * (1.0 + expgk)));
}

float tanh(in float x)
{
    float e = exp(-2.0 * (x*attenuation));
    return clamp((1.0-e)/(1.0+e), -1.0, 1.0);
}

void main(void)
{
    vec3 normalData = texture2D(gmap, vUv).xyz;

    // Compute curvature components (K_u, K_v) by derivating the gradient of the
    // depth field
    vec3 h = depthFieldHessian();
    float ku = -h.x;
    float kv = -h.y;

    vec4 color = texture2D(cmap, vUv);

    // Compute delta factor by clamping pixel intensity to [0,1]
    // Another option is to use the cosine term of Lambert's law, but it
    // requires a buffer with surface normals (that means another rendering pass)
    float delta = clamp(length(color.rgb), 0.0, 1.0);

    // Compute curvature value
    float k = tanh(ku+kv);

    if (normalData.xyz == vec3(0.0, 0.0, 0.0)) {
        gl_FragColor = color;
    } else {
        if (cflag == 0) {
            // Compute scaling value
            float s = sigma(k, delta);
            gl_FragColor = vec4(color.rgb*s, 1.0);
        } else {
            float f = (1.0-abs(k));
            if (k >= 0.0) {
                gl_FragColor = vec4(1.0, f*1.0, f*1.0, 1.0);
            } else {
                gl_FragColor = vec4(f*1.0, f*1.0, 1.0, 1.0);
            }
        }
    }
}

