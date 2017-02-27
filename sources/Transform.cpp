#include "mesh_def.h"
#include <vcg/complex/algorithms/smooth.h>
#include <vcg/complex/algorithms/update/position.h>
#include <vcg/complex/algorithms/local_optimization/tri_edge_flip.h>

using namespace vcg;
using namespace std;

void LaplacianSmooth(uintptr_t _meshPtr, int step, bool useLaplacianWeights)
{
  MyMesh &m = * ((MyMesh*) _meshPtr);
  tri::UpdateTopology<MyMesh>::VertexFace(m);
  tri::Smooth<MyMesh>::VertexCoordLaplacian(m, step, false, useLaplacianWeights);
  m.UpdateBoxAndNormals();
}

void TaubinSmooth(uintptr_t _meshPtr, int step, float lambda, float mu)
{
  MyMesh &m = * ((MyMesh*) _meshPtr);
  tri::UpdateTopology<MyMesh>::VertexFace(m);
  tri::Smooth<MyMesh>::VertexCoordTaubin(m,step,lambda,mu,false);
  m.UpdateBoxAndNormals();
}

void RandomDisplacement(uintptr_t _m, float max_displacement, const bool normalDirected)
{
  MyMesh &m = *((MyMesh*) _m);
  math::MarsenneTwisterRNG rnd;
  tri::UpdateNormal<MyMesh>::NormalizePerVertex(m);
  rnd.initialize(time(NULL));
  for(unsigned int i = 0; i< m.vert.size(); i++){
    if(normalDirected)
      m.vert[i].P() +=  m.vert[i].N()* rnd.generateRange(-1.0f,1.0f)*max_displacement;
    else
      m.vert[i].P() +=  math::GeneratePointInUnitBallUniform<float,math::MarsenneTwisterRNG>(rnd)*max_displacement;
  }
  m.UpdateBoxAndNormals();
}

void Scale(uintptr_t _m, float x,float y, float z,bool uniformFlag, bool unitboxFlag)
{
  MyMesh &m = *((MyMesh*) _m);
  if(uniformFlag) z=y=x;
  if(unitboxFlag)
  {
    float maxdim=math::Max(m.bbox.DimX(),m.bbox.DimY(),m.bbox.DimZ());
    z=y=x=1.0f/maxdim;
  }
  tri::UpdatePosition<MyMesh>::Scale(m, MyMesh::CoordType(x,y,z));
  m.UpdateBoxAndNormals();
}

void Rotate(uintptr_t _m)
{
    MyMesh &m = *((MyMesh*) _m);
}

void Translate(uintptr_t _m,float x,float y, float z, bool centerToOriginFlag)
{
  MyMesh &m = *((MyMesh*) _m);
  if(centerToOriginFlag)
    tri::UpdatePosition<MyMesh>::Translate(m,-m.bbox.Center());
  else
    tri::UpdatePosition<MyMesh>::Translate(m,MyMesh::CoordType(x,y,z));
  m.UpdateBoxAndNormals();
}

class QRadiiEFlip :
public vcg::tri::PlanarEdgeFlip<MyMesh, QRadiiEFlip, QualityRadii>
{
public:
  QRadiiEFlip(PosType pos, int mark,BaseParameterClass *pp) :
    vcg::tri::PlanarEdgeFlip<MyMesh, QRadiiEFlip, QualityRadii>(pos, mark,pp) {}
};


void FlipRelaxOptimize(uintptr_t _m, int iterNum, float CoplanarAngleThresholdDeg)
{
  MyMesh &m = *((MyMesh*) _m);
  tri::Allocator<MyMesh>::CompactEveryVector(m);
  tri::UpdateTopology<MyMesh>::FaceFace(m);
  tri::UpdateFlags<MyMesh>::FaceBorderFromFF(m);
  tri::PlanarEdgeFlipParameter pp;
  pp.CoplanarAngleThresholdDeg = CoplanarAngleThresholdDeg;
  for(int i=0;i<iterNum;++i)
  {
    LocalOptimization<MyMesh> optimiz(m,&pp);
    float limit = -std::numeric_limits<float>::epsilon();  
    optimiz.Init<QRadiiEFlip>();
    optimiz.SetTargetMetric(limit);
    optimiz.DoOptimization();
    printf("Completed optimization; performed ops %i\n",optimiz.nPerformedOps);
    optimiz.h.clear();
    tri::UpdateFlags<MyMesh>::FaceBorderFromFF(m);
    tri::Smooth<MyMesh>::VertexCoordLaplacianBlend(m, 1, 0.3f,false);  
  }
  m.UpdateBoxAndNormals();  
}

void TransformPluginTEST()
{
    MyMesh m0,m1,m2,m3,m4,m5;
    tri::Sphere(m0,3);
    LaplacianSmooth(uintptr_t(&m0),3,true);
    tri::Sphere(m1,3);
    TaubinSmooth(uintptr_t(&m1),5,0.33f,-0.34f);
    tri::Sphere(m2,3);
    RandomDisplacement(uintptr_t(&m2),0.01f,false);
    tri::Sphere(m3,3);
    Scale(uintptr_t(&m3),2,3,4,false,false); //normal scaling with factor for x,y,z
    tri::Sphere(m4,3);
    Scale(uintptr_t(&m4),2,3,4,true,false); //uniform scaling
    tri::Sphere(m5,3);
    Scale(uintptr_t(&m5),2,3,4,false,true); //scale to unit box
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(MLSmoothPlugin) {
    emscripten::function("LaplacianSmooth", &LaplacianSmooth);
    emscripten::function("TaubinSmooth", &TaubinSmooth);
    emscripten::function("RandomDisplacement", &RandomDisplacement);
    emscripten::function("Scale", &Scale);
    emscripten::function("Translate", &Translate);
    emscripten::function("FlipRelaxOptimize", &FlipRelaxOptimize);
}
#endif
