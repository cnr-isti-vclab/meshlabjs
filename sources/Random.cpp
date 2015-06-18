#include "mesh_def.h"

using namespace vcg;
using namespace std;

void RandomPlugin(uintptr_t _m, float max_displacement)
{
    MyMesh &m = *((MyMesh*) _m);
    srand(time(NULL));
    math::MarsenneTwisterRNG rnd;

    for(unsigned int i = 0; i< m.vert.size(); i++){
        m.vert[i].P() +=  math::GeneratePointInUnitBallUniform<float,math::MarsenneTwisterRNG>(rnd)*max_displacement;
    }
    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLRandomPlugin) {
    emscripten::function("RandomDisplacement", &RandomPlugin);
}
#endif
