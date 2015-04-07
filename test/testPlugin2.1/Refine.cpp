#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vcg/complex/complex.h>
#include <vcg/complex/algorithms/update/topology.h>
#include <vcg/complex/algorithms/update/normal.h>
#include <vcg/complex/algorithms/update/flag.h>
#include <vcg/complex/algorithms/refine.h>
#include <vcg/complex/algorithms/refine_loop.h>


using namespace vcg;
using namespace std;
using namespace emscripten;

class MyVertex; class MyEdge; class MyFace;
struct MyUsedTypes : public vcg::UsedTypes<vcg::Use<MyVertex>   ::AsVertexType,
                                           vcg::Use<MyEdge>     ::AsEdgeType,
                                           vcg::Use<MyFace>     ::AsFaceType>{};

class MyVertex  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};
class MyFace    : public vcg::Face<   MyUsedTypes, vcg::face::FFAdj,  vcg::face::VertexRef, vcg::face::BitFlags > {};
class MyEdge    : public vcg::Edge<   MyUsedTypes> {};

class MyMesh    : public vcg::tri::TriMesh< std::vector<MyVertex>, std::vector<MyFace> , std::vector<MyEdge>  > {};

class MyVertex0  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::BitFlags  >{};
class MyVertex1  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};
class MyVertex2  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Color4b, vcg::vertex::CurvatureDirf,
                                                    vcg::vertex::Qualityf, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};

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