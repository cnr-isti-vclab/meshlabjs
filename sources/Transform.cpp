#include "mesh_def.h"
#include <vcg/complex/algorithms/smooth.h>
#include <vcg/complex/algorithms/update/position.h>
#include <vcg/space/box3.h>
using namespace vcg;
using namespace std;

void LaplacianSmooth(uintptr_t _meshPtr, int step, bool useLaplacianWeights)
{
    MyMesh &m = * ((MyMesh*) _meshPtr);
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    tri::Smooth<MyMesh>::VertexCoordLaplacian(m, step, false, useLaplacianWeights);
    tri::UpdateNormal<MyMesh>::PerVertexPerFace(m);
}
void TaubinSmooth(uintptr_t _meshPtr, int step, float lambda, float mu)
{
    MyMesh &m = * ((MyMesh*) _meshPtr);
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    tri::Smooth<MyMesh>::VertexCoordTaubin(m,step,lambda,mu,false);
    tri::UpdateNormal<MyMesh>::PerVertexPerFace(m);
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
    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
}

void Scale(uintptr_t _m, float x,float y, float z,bool uniform, bool unitbox)
{
    MyMesh &m = *((MyMesh*) _m);
	if(uniform)
		tri::UpdatePosition<MyMesh>::Scale(m, Point3< tri::UpdatePosition<MyMesh>::ScalarType>(x,x,x));
	else if(unitbox)
	{
		float maxdim=math::Max(m.bbox.DimX(),m.bbox.DimY(),m.bbox.DimZ());
		vcg::tri::UpdateBounding<MyMesh>::Box(m);
		if(1/maxdim > 1)
		{
		   printf("\nMax dim %f\n", 1/maxdim);
           tri::UpdatePosition<MyMesh>::Scale(m, Point3<tri::UpdatePosition<MyMesh>::ScalarType>(1/maxdim,1/maxdim,1/maxdim));
		}
	}
	else 
		tri::UpdatePosition<MyMesh>::Scale(m, Point3< tri::UpdatePosition<MyMesh>::ScalarType>(x,y,z));
}

void SmoothPluginTEST()
{

}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(MLSmoothPlugin) {
    emscripten::function("LaplacianSmooth", &LaplacianSmooth);
    emscripten::function("TaubinSmooth", &TaubinSmooth);
    emscripten::function("RandomDisplacement", &RandomDisplacement);
    emscripten::function("Scale", &Scale);
}
#endif
