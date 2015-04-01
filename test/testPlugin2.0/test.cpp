#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "MeshLab.h"

using namespace vcg;
using namespace std;
using namespace emscripten;



class Test {


public:
void refine(MeshLabJs &mjs, int step)
{
     MyMesh &m=mjs.m;
    
         int t2=clock();
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::EdgeLen<MyMesh,float> edgePred(0);
    tri::MidPoint<MyMesh> midFun(&m);
        for(int i=0;i<step;i++)
            tri::RefineE(m,midFun,edgePred);
    int t3=clock();
    printf("Refined mesh %i vert - %i face \n",m.VN(),m.FN());
    printf("Refinement time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);
    }
    
};

//Binding code
EMSCRIPTEN_BINDINGS(Test) {
  class_<Test>("Test")
    .constructor<>()
    .function("refine", &Test::refine)
    ;
}