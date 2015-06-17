#include "mesh_def.h"
#include <vcg/complex/algorithms/smooth.h>

using namespace vcg;
using namespace std;

void SmoothPlugin(uintptr_t _meshPtr, int step, bool useLaplacianWeights)
{
    MyMesh &m = * ((MyMesh*) _meshPtr);
    int t2=clock();
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    tri::Smooth<MyMesh>::VertexCoordLaplacian(m, step, false, useLaplacianWeights);
    tri::UpdateNormal<MyMesh>::PerVertexPerFace(m);
    int t3=clock();
    printf("Smooth time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(MLPlugins) {
    emscripten::function("Smooth", &SmoothPlugin);
}
#endif
