#include "mesh_def.h"
#include <vcg/complex/algorithms/create/platonic.h>

using namespace vcg;
using namespace std;

void DuplicateLayer(uintptr_t _baseM, uintptr_t _newM)
{
    MyMesh &baseM = *((MyMesh*) _baseM);
    MyMesh &newM = *((MyMesh*) _newM);
    tri::Append<MyMesh, MyMesh>::Mesh(newM, baseM);
    newM.tr = baseM.tr;
}

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
  printf("Creating a sphere with subdivision level %i\n",refinement);
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

  // Parameter space sampling
  // subdiv           8 16 32 48
  // radiusratio      0.25 0.50 0.75 1.00 .. 2.00
  for(int j=1;j<=6;++j)
    for(int i=1;i<=8;++i)
    {
      MyMesh m;
      CreateTorus(uintptr_t(&m),j*8,0.25*i);
      if(i!=4) assert(IsWaterTight(m));
      tri::RequireCompactness(m);
    }
}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLCreatePlugin) {
    emscripten::function("CreatePlatonic", &CreatePlatonic);
    emscripten::function("CreateTorus", &CreateTorus);
    emscripten::function("CreateSphere", &CreateSphere);
    emscripten::function("DuplicateLayer", &DuplicateLayer);
}
#endif
