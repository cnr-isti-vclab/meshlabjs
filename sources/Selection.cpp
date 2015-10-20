#include "mesh_def.h"

using namespace vcg;
using namespace std;

void SelectionRandom(uintptr_t _m, float vertprob, float faceprob)
{
    MyMesh &m = *((MyMesh*) _m);
    math::MarsenneTwisterRNG rnd;
    tri::UpdateNormal<MyMesh>::NormalizePerVertex(m);
    rnd.initialize(clock());

    tri::UpdateSelection<MyMesh>::Clear(m);

    for(MyMesh::FaceIterator fi=m.face.begin(); fi!=m.face.end(); ++fi) {
        if (rnd.generate01() < faceprob)
            fi->SetS();
    }

    for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
      if (rnd.generate01() < vertprob)
          vi->SetS();
    }
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

void SelectionPluginTEST()
{

}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLRandomPlugin) {
    emscripten::function("SelectionRandom", &RandomSelection);
    emscripten::function("SelectionErode", &SelectionErode);
    emscripten::function("SelectionDilate", &SelectionDilate);
    emscripten::function("SelectionInvert", &SelectionInvert);
    emscripten::function("SelectionAll",  &SelectionAll);
    emscripten::function("SelectionNone", &SelectionNone);
}
#endif
