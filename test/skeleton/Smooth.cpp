#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "mesh_def.h"
#include <vcg/complex/algorithms/update/topology.h>
#include <vcg/complex/algorithms/update/normal.h>
#include <vcg/complex/algorithms/clean.h>
#include <vcg/complex/algorithms/smooth.h>

using namespace vcg;
using namespace std;
using namespace emscripten;

class MySmooth {

public:

MyMesh *n;
MySmooth(uintptr_t _m){
    n = (MyMesh*) _m;
}
void mySmooth(int step)
{
    int t2=clock();
    
  tri::RequirePerVertexNormal(*n);
  tri::UpdateTopology<MyMesh>::VertexFace(*n);
    
    
  tri::Smooth<MyMesh>::VertexCoordLaplacian(*n, step, false, true);
  
  tri::UpdateNormal<MyMesh>::PerVertexPerFace(*n);
    int t3=clock();
    printf("Smooth mesh %i vert - %i face \n",n->VN(),n->FN());
    printf("Smooth time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);

}
};

//Binding code
EMSCRIPTEN_BINDINGS(MySmooth) {
  class_<MySmooth>("MySmooth")
    .constructor<uintptr_t>()
    .function("mySmooth", &MySmooth::mySmooth)
    ;
}