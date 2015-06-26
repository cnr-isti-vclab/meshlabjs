#include "mesh_def.h"
#include <vcg/complex/algorithms/refine.h>
#include <vcg/complex/algorithms/refine_loop.h>

using namespace vcg;
using namespace std;

void RefineMesh(uintptr_t _baseM, int step)
{
  MyMesh &m = *((MyMesh*) _baseM);

  tri::UpdateTopology<MyMesh>::FaceFace(m);
  tri::EdgeLen<MyMesh,float> edgePred(0);
  tri::MidPoint<MyMesh> midFun(&m);
  for(int i=0;i<step;i++)
    tri::RefineE(m,midFun,edgePred);
  printf("Refined mesh %i vert - %i face \n",m.VN(),m.FN());
}

#ifdef __EMSCRIPTEN__
//Binding code
using namespace emscripten;
EMSCRIPTEN_BINDINGS(MLRefinePlugin) {
  emscripten::function("RefineMesh", &RefineMesh);
}
#endif
