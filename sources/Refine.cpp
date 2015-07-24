#include "mesh_def.h"
#include <vcg/complex/algorithms/refine.h>
#include <vcg/complex/algorithms/refine_loop.h>

using namespace vcg;
using namespace std;

void RefineMesh(uintptr_t _baseM, int step, int alg)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateTopology<MyMesh>::FaceFace(m);

  switch(alg)
  {
  case 0: // MidPoint
  {
    tri::MidPoint<MyMesh> MidPointFun(&m);
    tri::EdgeLen<MyMesh,float> edgePred(0);
    for(int i=0;i<step;i++)
      tri::RefineE(m,MidPointFun,edgePred);
  } break;
  case 1: // Butterfly
  {
    for(int i=0;i<step;i++)
      tri::Refine<MyMesh,tri::MidPointButterfly<MyMesh> > (m, tri::MidPointButterfly<MyMesh>(m), 0, false,0);
  } break;

  case 2:// Loop
  {
    for(int i=0;i<step;i++)
      tri::RefineOddEven<MyMesh>(m, tri::OddPointLoop<MyMesh>(m), tri::EvenPointLoop<MyMesh>(), 0, false, 0);
  } break;

  }
  printf("Refined mesh %i vert - %i face \n",m.VN(),m.FN());
}

#ifdef __EMSCRIPTEN__
//Binding code
using namespace emscripten;
EMSCRIPTEN_BINDINGS(MLRefinePlugin) {
  emscripten::function("RefineMesh", &RefineMesh);
}
#endif
