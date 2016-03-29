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

void SelectionDeleteVertex(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateSelection<MyMesh>::FaceClear(m);
  tri::UpdateSelection<MyMesh>::FaceFromVertexLoose(m);
  for(MyMesh::FaceIterator fi=m.face.begin();fi!=m.face.end();++fi)
      if((*fi).IsS()) tri::Allocator<MyMesh>::DeleteFace(m,*fi);

  for(MyMesh::VertexIterator vi=m.vert.begin();vi!=m.vert.end();++vi)
    if(vi->IsS()) tri::Allocator<MyMesh>::DeleteVertex(m,*vi);
  tri::Allocator<MyMesh>::CompactEveryVector(m);
}

void SelectionDeleteFace(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateSelection<MyMesh>::VertexClear(m);
  tri::UpdateSelection<MyMesh>::VertexFromFaceStrict(m);

  for(MyMesh::FaceIterator fi=m.face.begin();fi!=m.face.end();++fi)
    if(fi->IsS()) tri::Allocator<MyMesh>::DeleteFace(m,*fi);

  for(MyMesh::VertexIterator vi=m.vert.begin();vi!=m.vert.end();++vi)
    if(vi->IsS()) tri::Allocator<MyMesh>::DeleteVertex(m,*vi);

  tri::Allocator<MyMesh>::CompactEveryVector(m);
}
void SelectionMoveToNewLayer(uintptr_t _baseM, uintptr_t _newM,bool deleteOriginalFaceFlag)
{
  MyMesh &m = *((MyMesh*) _baseM);
  MyMesh &newm = *((MyMesh*) _newM);
  tri::UpdateSelection<MyMesh>::VertexClear(m);
  tri::UpdateSelection<MyMesh>::VertexFromFaceLoose(m);
  tri::Append<MyMesh,MyMesh>::Mesh(newm, m, true);

  if(deleteOriginalFaceFlag)
  {
    tri::UpdateSelection<MyMesh>::VertexClear(m);
    tri::UpdateSelection<MyMesh>::VertexFromFaceStrict(m);

    for(MyMesh::FaceIterator fi=m.face.begin();fi!=m.face.end();++fi)
      if(fi->IsS()) tri::Allocator<MyMesh>::DeleteFace(m,*fi);

    for(MyMesh::VertexIterator vi=m.vert.begin();vi!=m.vert.end();++vi)
      if(vi->IsS()) tri::Allocator<MyMesh>::DeleteVertex(m,*vi);

    tri::Allocator<MyMesh>::CompactEveryVector(m);
  }
}

void SelectionNone(uintptr_t _baseM, bool vertFlag, bool faceFlag)
{
  MyMesh &m = *((MyMesh*) _baseM);
  if(vertFlag) tri::UpdateSelection<MyMesh>::VertexClear(m);
  if(faceFlag) tri::UpdateSelection<MyMesh>::FaceClear(m);
}

void SelectionByQuality(uintptr_t _baseM, float threshold, bool vertFlag, int  selectionMode)
{
  MyMesh &m = *((MyMesh*) _baseM);
  int cnt=0;
  Distribution<float> H;
  float actualThr;
  
  if(vertFlag)  tri::Stat<MyMesh>::ComputePerVertexQualityDistribution(m,H);
  else          tri::Stat<MyMesh>::ComputePerFaceQualityDistribution  (m,H);
  
  switch(selectionMode)
  {
  case 0:  actualThr = H.Min() + threshold*(H.Max()-H.Min()); break; // Percentage
  case 1:  actualThr = H.Percentile(threshold);               break; // Precentile
  case 2:  actualThr = threshold;                             break; // Actual Value
  default: assert(0);
  }
  
  if(vertFlag)   cnt = tri::UpdateSelection<MyMesh>::VertexFromQualityRange(m,H.Min(), actualThr,false);
  else           cnt = tri::UpdateSelection<MyMesh>::FaceFromQualityRange  (m,H.Min(), actualThr,false);
  
  printf("Selected %i elems where quality was lower than %f in a range %f %f\n",cnt, actualThr, H.Min(), H.Max());
}

void SelectionByConnectedComponentSize(uintptr_t _baseM, float sizeThreshold)
{
   MyMesh &m = *((MyMesh*) _baseM);
   std::vector< std::pair<int, MyFace *> > CCV;
   tri::UpdateTopology<MyMesh>::FaceFace(m);
   tri::Clean<MyMesh>::ConnectedComponents(m, CCV);
   int maxSize=0;
   for(size_t i=0;i<CCV.size();++i)
   {
     maxSize=std::max(maxSize,CCV[i].first);
     printf("CC %i %i\n",int(i),CCV[i].first);
   }  
   
   tri::UpdateSelection<MyMesh>::Clear(m);
   for(size_t i=0;i<CCV.size();++i)
   {
     if(CCV[i].first < maxSize  * sizeThreshold)
       CCV[i].second->SetS();        
   }   
   int res =    tri::UpdateSelection<MyMesh>::FaceConnectedFF(m,true);
   printf("Max Size = %i = %f * %i : Selected %i faces on %i\n",int(maxSize  * sizeThreshold),sizeThreshold,maxSize , res,m.fn);
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
    emscripten::function("SelectionDeleteVertex",    &SelectionDeleteVertex);
    emscripten::function("SelectionDeleteFace",   &SelectionDeleteFace);
    emscripten::function("SelectionMoveToNewLayer",   &SelectionMoveToNewLayer);
    emscripten::function("SelectionByQuality",   &SelectionByQuality);
    emscripten::function("SelectionByConnectedComponentSize",   &SelectionByConnectedComponentSize);
    emscripten::function("QualitybyPointOutlier", &QualitybyPointOutlier);    
}
#endif
