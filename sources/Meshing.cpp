#include "mesh_def.h"
#include <vcg/complex/algorithms/local_optimization/tri_edge_collapse_quadric.h>
#include <vcg/complex/algorithms/clustering.h>
#include <vcg/complex/algorithms/create/platonic.h>

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
  if(pp.NormalCheck) pp.NormalThrRad = M_PI/4.0;

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

void MeshingPluginTEST()
{
  for(int i=1;i<5;++i)
  {
    MyMesh mq,mc;
    Torus(mq,10*i,5*i);
    Torus(mc,10*i,5*i);
    int t0=clock();
    QuadricSimplification(uintptr_t(&mq),0.5f,0,false);
    int t1=clock();
    printf("Quadric    simplification in  %6.3f sec\n",float(t1-t0)/CLOCKS_PER_SEC);
    ClusteringSimplification(uintptr_t(&mc),0.01f);
    int t2=clock();
    printf("Clustering simplification in  %6.3f sec\n",float(t2-t1)/CLOCKS_PER_SEC);
  }
}


#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLMeshingPlugin) {
    emscripten::function("QuadricSimplification", &QuadricSimplification);
    emscripten::function("ClusteringSimplification", &ClusteringSimplification);
}
#endif

