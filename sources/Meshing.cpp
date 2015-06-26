#include "mesh_def.h"
#include <vcg/complex/algorithms/local_optimization/tri_edge_collapse_quadric.h>

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

void QuadricSimplification(uintptr_t _baseM, float TargetFaceRatio, int exactFaceNum, bool qualityQuadric)
{
  MyMesh &m = *((MyMesh*) _baseM);

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

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLMeshingPlugin) {
    emscripten::function("QuadricSimplification", &QuadricSimplification);
//    emscripten::function("MontecarloSampling", &MontecarloSamplingML);
}
#endif

