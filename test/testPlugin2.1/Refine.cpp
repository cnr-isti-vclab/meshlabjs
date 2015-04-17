#include "MyMesh.h"

class MyRefine {

public:

MyMesh *m;
MyRefine(uintptr_t _m){
    m = (MyMesh*) _m;
}
void refinement(int step)
{
    int t2=clock();
    tri::UpdateTopology<MyMesh>::FaceFace(*m);
    tri::EdgeLen<MyMesh,float> edgePred(0);
    tri::MidPoint<MyMesh> midFun(m);
    for(int i=0;i<step;i++)
        tri::RefineE(*m,midFun,edgePred);
    int t3=clock();
    printf("Refined mesh %i vert - %i face \n",m->VN(),m->FN());
    printf("Refinement time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);
    }
};

//Binding code
EMSCRIPTEN_BINDINGS(MyRefine) {
  class_<MyRefine>("MyRefine")
    .constructor<uintptr_t>()
    .function("myRefine", &MyRefine::refinement)
    ;
}