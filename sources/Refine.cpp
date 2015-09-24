#include "mesh_def.h"
#include <vcg/complex/algorithms/refine.h>
#include <vcg/complex/algorithms/refine_loop.h>

using namespace vcg;
using namespace std;

void RefineMesh(uintptr_t _baseM, int step, int alg)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateTopology<MyMesh>::FaceFace(m);
  int nonManifCount = tri::Clean<MyMesh>::CountNonManifoldEdgeFF(m);
  if(nonManifCount > 0)
  {
    printf("Refinement algorithms can be applied only on 2-manifold meshes. Current mesh has %i non manifold edges\n",nonManifCount);
    return;
  }

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

void SelectionDilate(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateSelection<MyMesh>::VertexFromFaceLoose(m);
  tri::UpdateSelection<MyMesh>::FaceFromVertexLoose(m);
}

void SelectionErode(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateSelection<MyMesh>::VertexFromFaceStrict(m);
  tri::UpdateSelection<MyMesh>::FaceFromVertexStrict(m);
}

void SelectionInvert(uintptr_t _baseM, bool vertFlag, bool faceFlag)
{
  MyMesh &m = *((MyMesh*) _baseM);
  if(vertFlag) tri::UpdateSelection<MyMesh>::VertexInvert(m);
  if(faceFlag) tri::UpdateSelection<MyMesh>::FaceInvert(m);
}

void SelectionAll(uintptr_t _baseM, bool vertFlag, bool faceFlag)
{
  MyMesh &m = *((MyMesh*) _baseM);
  if(vertFlag) tri::UpdateSelection<MyMesh>::VertexAll(m);
  if(faceFlag) tri::UpdateSelection<MyMesh>::FaceAll(m);
}

void SelectionNone(uintptr_t _baseM, bool vertFlag, bool faceFlag)
{
  MyMesh &m = *((MyMesh*) _baseM);
  if(vertFlag) tri::UpdateSelection<MyMesh>::VertexClear(m);
  if(faceFlag) tri::UpdateSelection<MyMesh>::FaceClear(m);
}


#ifdef __EMSCRIPTEN__
//Binding code
using namespace emscripten;
EMSCRIPTEN_BINDINGS(MLRefinePlugin) {
  emscripten::function("RefineMesh", &RefineMesh);
  emscripten::function("SelectionErode", &SelectionErode);
  emscripten::function("SelectionDilate", &SelectionDilate);
  emscripten::function("SelectionInvert", &SelectionInvert);
  emscripten::function("SelectionAll",  &SelectionAll);
  emscripten::function("SelectionNone", &SelectionNone);
}
#endif
