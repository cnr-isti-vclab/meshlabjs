#include "mesh_def.h"
#include <vcg/complex/algorithms/create/platonic.h>

using namespace vcg;
using namespace std;

void CreatePlatonic(uintptr_t _m, int index)
{
    MyMesh &m = *((MyMesh*) _m);
    switch(index)
    {
    case 0: tri::Tetrahedron(m); break;
    case 1: tri::Octahedron(m); break;
    case 2: tri::Hexahedron(m); break;
    case 3: tri::Dodecahedron(m); break;
    case 4: tri::Icosahedron(m); break;
    }
    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
}
void CreateSphere(uintptr_t _m, int refinement)
{
    MyMesh &m = *((MyMesh*) _m);
    tri::Sphere(m,refinement);
    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLCreatePlugin) {
    emscripten::function("CreatePlatonic", &CreatePlatonic);
    emscripten::function("CreateSphere", &CreateSphere);
}
#endif
