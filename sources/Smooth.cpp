#include "mesh_def.h"
#include <vcg/complex/algorithms/smooth.h>

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

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(MLSmoothPlugin) {
    emscripten::function("LaplacianSmooth", &LaplacianSmooth);
    emscripten::function("TaubinSmooth", &TaubinSmooth);
}
#endif
