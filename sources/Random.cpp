#include "mesh_def.h"

using namespace vcg;
using namespace std;

void RandomPlugin(uintptr_t _m, float max_displacement)
{
    MyMesh &m = *((MyMesh*) _m);
    int t2=clock();
    srand(time(NULL));

    for(unsigned int i = 0; i< m.vert.size(); i++){
        float rndax = (float(2.0*rand())/RAND_MAX - 1.0 ) *max_displacement;
        float rnday = (float(2.0*rand())/RAND_MAX - 1.0 ) *max_displacement;
        float rndaz = (float(2.0*rand())/RAND_MAX - 1.0 ) *max_displacement;
        m.vert[i].P() += Point3f(rndax,rnday,rndaz);
    }

    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
    int t3=clock();
    printf("Random time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);
}
#ifdef __EMSCRIPTEN__
using namespace emscripten;
//Binding code
EMSCRIPTEN_BINDINGS(MLRandomPlugin) {
    emscripten::function("RandomDisplacement", &RandomPlugin);
}
#endif
