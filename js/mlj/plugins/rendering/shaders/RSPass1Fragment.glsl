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

*/

varying vec3 viewNormal;
varying float depth;

uniform sampler2D nmap;
uniform float foreshortening;

void main(void) {
    const float eps = 0.001;

    vec3 n = normalize(viewNormal);
    if (n == vec3(0.0, 0.0, 0.0)) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        float gs = (n.z < eps) ? (1.0 / eps) : (1.0 / n.z);
        gs = pow(gs, foreshortening);
    
        float gx = -n.x*gs;
        float gy = -n.y*gs;
    
        gl_FragColor = vec4(gx, gy, depth, gl_FragCoord.z);
    }
}
