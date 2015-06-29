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

void CreateTorus(uintptr_t _m, int refinement, float radiusRatio)
{
    MyMesh &m = *((MyMesh*) _m);
    printf("Creating a torus of %i %f\n",refinement, radiusRatio);
    tri::Torus(m,1.0,radiusRatio,refinement*2,refinement);
    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
}

void CreatePluginTEST()
{
  for(int i=0;i<5;++i)
  {
    MyMesh m;
    CreatePlatonic(uintptr_t(&m),i);
    assert(IsWaterTight(m));
  }

  for(int i=0;i<5;++i)
  {
  MyMesh m;
  CreateSphere(uintptr_t(&m),i);
  assert(IsWaterTight(m));
  }

}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLCreatePlugin) {
    emscripten::function("CreatePlatonic", &CreatePlatonic);
    emscripten::function("CreateTorus", &CreateTorus);
    emscripten::function("CreateSphere", &CreateSphere);
}
#endif
