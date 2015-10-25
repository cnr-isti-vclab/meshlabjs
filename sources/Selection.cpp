#include "mesh_def.h"
#include <vcg/complex/algorithms/point_outlier.h>
#include <vcg/complex/algorithms/convex_hull.h>
#include <vcg/complex/algorithms/stat.h>

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

void SelectionByQuality(uintptr_t _baseM, float threshold, bool vertFlag)
{
  MyMesh &m = *((MyMesh*) _baseM);
  int cnt=0;
  std::pair<float,float> minmax;

  if(vertFlag) {
    minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
    cnt = tri::UpdateSelection<MyMesh>::VertexFromQualityRange(m,-std::numeric_limits<float>::max(),
                                                               minmax.first + threshold * (minmax.second-minmax.first));
  }
  else {
    minmax = tri::Stat<MyMesh>::ComputePerFaceQualityMinMax(m);
    cnt = tri::UpdateSelection<MyMesh>::FaceFromQualityRange(m,-std::numeric_limits<float>::max(),
                                                       minmax.first + threshold * (minmax.second-minmax.first));
  }
  printf("Selected %i elems where quality was lower than %f in a range %f %f\n",cnt,
         minmax.first + threshold * (minmax.second-minmax.first),minmax.first,minmax.second);
}



void QualitybyPointOutlier(uintptr_t _baseM, int kNearestNum)
{
  MyMesh &mesh = *((MyMesh*) _baseM);
  VertexConstDataWrapper<MyMesh> ww(mesh);

  KdTree<float> kdTree(ww);
  OutlierRemoval<MyMesh>::ComputeLoOPScore(mesh, kdTree, kNearestNum);

  MyMesh::PerVertexAttributeHandle<float> outlierScore = vcg::tri::Allocator<MyMesh>::GetPerVertexAttribute<float>(mesh, std::string("outlierScore"));

  for(MyMesh::VertexIterator vi=mesh.vert.begin();vi!=mesh.vert.end();++vi)
    vi->Q() = outlierScore[vi];
}

void SelectionPluginTEST()
{

}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLRandomPlugin) {
    emscripten::function("SelectionRandom", &SelectionRandom);
    emscripten::function("SelectionErode",  &SelectionErode);
    emscripten::function("SelectionDilate", &SelectionDilate);
    emscripten::function("SelectionInvert", &SelectionInvert);
    emscripten::function("SelectionAll",    &SelectionAll);
    emscripten::function("SelectionNone",   &SelectionNone);
    emscripten::function("SelectionByQuality",   &SelectionByQuality);
    emscripten::function("QualitybyPointOutlier", &QualitybyPointOutlier);
}
#endif
