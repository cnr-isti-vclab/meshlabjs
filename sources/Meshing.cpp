#include "mesh_def.h"
#include <vcg/complex/algorithms/local_optimization/tri_edge_collapse_quadric.h>
#include <vcg/complex/algorithms/clustering.h>
#include <vcg/complex/algorithms/convex_hull.h>
#include<vcg/complex/algorithms/point_sampling.h>
#include<vcg/complex/algorithms/voronoi_processing.h>


using namespace vcg;
using namespace std;


typedef	SimpleTempData<MyMesh::VertContainer, math::Quadric<double> > QuadricTemp;

class QHelper
        {
        public:
      QHelper(){}
      static void Init(){}
      static math::Quadric<double> &Qd(MyVertex &v) {return TD()[v];}
      static math::Quadric<double> &Qd(MyVertex *v) {return TD()[*v];}
      static MyVertex::ScalarType W(MyVertex * /*v*/) {return 1.0;}
      static MyVertex::ScalarType W(MyVertex & /*v*/) {return 1.0;}
      static void Merge(MyVertex & /*v_dest*/, MyVertex const & /*v_del*/){}
      static QuadricTemp* &TDp() {static QuadricTemp *td; return td;}
      static QuadricTemp &TD() {return *TDp();}
        };

typedef tri::BasicVertexPair<MyVertex> VertexPair;

class MyTriEdgeCollapse: public vcg::tri::TriEdgeCollapseQuadric< MyMesh, VertexPair , MyTriEdgeCollapse, QHelper > {
                        public:
            typedef  vcg::tri::TriEdgeCollapseQuadric< MyMesh, VertexPair,  MyTriEdgeCollapse, QHelper> TECQ;
            inline MyTriEdgeCollapse(  const VertexPair &p, int i, BaseParameterClass *pp) :TECQ(p,i,pp){}
};

void ClusteringSimplification(uintptr_t _baseM, float threshold)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::Clustering<MyMesh, vcg::tri::AverageColorCell<MyMesh> > ClusteringGrid;
  float cellSize = m.bbox.Diag() * threshold;
  printf("Clustering with a cell size of %6.2f = %4.2f * %6.2f\n",cellSize,threshold,m.bbox.Diag());

  ClusteringGrid.Init(m.bbox,100000,cellSize);
  if(m.FN() ==0)
    ClusteringGrid.AddPointSet(m);
  else
    ClusteringGrid.AddMesh(m);

  ClusteringGrid.ExtractMesh(m);
    printf("Completed Clustering Simplification\n");
}

void QuadricSimplification(uintptr_t _baseM, float TargetFaceRatio, int exactFaceNum, bool qualityQuadric)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::UpdateTopology<MyMesh>::ClearFaceFace(m);
  math::Quadric<double> QZero;
  QZero.SetZero();
  QuadricTemp TD(m.vert,QZero);
  QHelper::TDp()=&TD;

  tri::TriEdgeCollapseQuadricParameter pp;
  pp.NormalCheck = true;
  if(pp.NormalCheck) pp.NormalThrRad = M_PI/4.0;
  if(qualityQuadric) pp.QualityQuadric=true;
  
  vcg::LocalOptimization<MyMesh> DeciSession(m,&pp);
  DeciSession.Init<MyTriEdgeCollapse >();
  int TargetFaceNum;
  if(exactFaceNum==0) TargetFaceNum = m.fn * TargetFaceRatio;
  else TargetFaceNum = exactFaceNum;
  DeciSession.SetTargetSimplices(TargetFaceNum);
  DeciSession.SetTimeBudget(0.1f); // this allow to update the progress bar 10 time for sec...

  while( DeciSession.DoOptimization() && m.fn>TargetFaceNum );
  DeciSession.Finalize<MyTriEdgeCollapse >();
  tri::Allocator<MyMesh>::CompactEveryVector(m);

  printf("Completed Simplification\n");
}

void RemoveUnreferencedVertices(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  int rvn = tri::Clean<MyMesh>::RemoveUnreferencedVertex(m);
  tri::Allocator<MyMesh>::CompactVertexVector(m);
  printf("Removed %i unreferenced vertices\n",rvn);
}

void InvertFaceOrientation(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  tri::Clean<MyMesh>::FlipMesh(m);
}

void RemoveDuplicatedVertices(uintptr_t _baseM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  int cnt = tri::Clean<MyMesh>::RemoveDuplicateVertex(m);
  printf("Removed %i duplicated vertices\n",cnt);
  tri::Allocator<MyMesh>::CompactEveryVector(m);
}

void ConvexHullFilter(uintptr_t _baseM, uintptr_t _newM)
{
  MyMesh &m = *((MyMesh*) _baseM);
  MyMesh &ch = *((MyMesh*) _newM);
  ch.Clear();
  tri::ConvexHull<MyMesh,MyMesh>::ComputeConvexHull(m,ch);
} 

void VoronoiClustering(uintptr_t _baseM, uintptr_t _newM, float clusteringRatio, int iterNum, int relaxType, int postRelaxStep, int postRefineStep, bool colorizeMeshFlag)
{
  MyMesh &origMesh = *((MyMesh*) _baseM);
  MyMesh &clusteredMesh = *((MyMesh*) _newM);
  MyMesh baseMesh;
  tri::Append<MyMesh,MyMesh>::MeshCopy(baseMesh,origMesh);
  tri::Clean<MyMesh>::RemoveUnreferencedVertex(baseMesh);
  tri::Allocator<MyMesh>::CompactEveryVector(baseMesh);
  
  // if you ask too many seeds wrt to mesh size we must refine the base mesh.
  int seedNum=baseMesh.vn*clusteringRatio;
  while(baseMesh.fn / 30 < seedNum )
  {
   tri::TrivialMidPointRefine(baseMesh);
   printf("refined from %i to %i\n",origMesh.vn, baseMesh.vn);
  }
  
  clusteredMesh.Clear();
  printf("Starting Voronoi Clustering of a mesh of %i vert targeting %i seeds\n",baseMesh.vn,seedNum);
  tri::UpdateTopology<MyMesh>::VertexFace(baseMesh);
  tri::TrivialPointerSampler<MyMesh> cs;
  tri::SurfaceSampling<MyMesh, tri::TrivialPointerSampler<MyMesh> >::VertexUniform(baseMesh,cs,seedNum);
  tri::VoronoiProcessingParameter vpp;
  
  if(relaxType==0) vpp.geodesicRelaxFlag=false; // 0 -> Quadric
  else vpp.geodesicRelaxFlag=true; //              1 -> Geodesic
  
  vpp.deleteUnreachedRegionFlag=true;
  
  tri::EuclideanDistance<MyMesh> df;
  printf("Relaxing %i times\n",iterNum);
  tri::VoronoiProcessing<MyMesh>::VoronoiRelaxing(baseMesh, cs.sampleVec, iterNum, df, vpp);
  tri::VoronoiProcessing<MyMesh>::ConvertDelaunayTriangulationToMesh(baseMesh,clusteredMesh,cs.sampleVec,false);
  printf("Completed. Created Mesh of %i v and %i f\n",clusteredMesh.vn,clusteredMesh.fn);
  printf("Relaxing %i steps Refining %i steps\n",postRelaxStep,postRefineStep);
  tri::VoronoiProcessing<MyMesh>::RelaxRefineTriangulationSpring(baseMesh,clusteredMesh,postRelaxStep,postRefineStep);
  
  if(colorizeMeshFlag)
  {
    std::vector<Point3f> seedPVec;
    std::vector<MyVertex *>seedVVec;
    for(size_t i=0;i<cs.sampleVec.size();++i) 
      seedPVec.push_back(cs.sampleVec[i]->P());
    tri::UpdateTopology<MyMesh>::VertexFace(origMesh);  
    tri::VoronoiProcessing<MyMesh>::SeedToVertexConversion(origMesh,seedPVec,seedVVec);
    tri::VoronoiProcessing<MyMesh>::ComputePerVertexSources(origMesh,seedVVec,df);
    tri::VoronoiProcessing<MyMesh>::VoronoiColoring(origMesh,false); 
  }
}

void MeshingPluginTEST()
{
  for(int i=1;i<5;++i)
  {
    MyMesh mq,mc,mv,ch;
    Torus(mq,10*i,5*i);
    Torus(mc,10*i,5*i);
    int t0=clock();
    QuadricSimplification(uintptr_t(&mq),0.5f,0,false);
    int t1=clock();
    printf("Quadric    simplification in  %6.3f sec\n",float(t1-t0)/CLOCKS_PER_SEC);
    ClusteringSimplification(uintptr_t(&mc),0.01f);
    int t2=clock();
    printf("Clustering simplification in  %6.3f sec\n",float(t2-t1)/CLOCKS_PER_SEC);
    ConvexHullFilter(uintptr_t(&mc),uintptr_t(&ch));
    int t3=clock();
    printf("Computed Convex Hull %i %i -> %i %i  in  %6.3f sec\n",mc.vn,mc.fn,ch.vn,ch.fn,float(t3-t2)/CLOCKS_PER_SEC);
    VoronoiClustering(uintptr_t(&mc),uintptr_t(&ch),0.01*i, i%2, 3,0,i,i);
    int t4=clock();
    printf("Voronoi Clustering %i %i -> %i %i  in  %6.3f sec\n",mc.vn,mc.fn,ch.vn,ch.fn,float(t4-t3)/CLOCKS_PER_SEC);
  }
}
 

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLMeshingPlugin) {
    emscripten::function("ConvexHullFilter",           &ConvexHullFilter);
    emscripten::function("QuadricSimplification",      &QuadricSimplification);
    emscripten::function("ClusteringSimplification",   &ClusteringSimplification);
    emscripten::function("RemoveUnreferencedVertices", &RemoveUnreferencedVertices);
    emscripten::function("RemoveDuplicatedVertices",   &RemoveDuplicatedVertices);
    emscripten::function("InvertFaceOrientation",      &InvertFaceOrientation);
    emscripten::function("VoronoiClustering",          &VoronoiClustering);
}
#endif

