#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vcg/complex/complex.h>
#include <vcg/complex/algorithms/clean.h>

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


class Test {

public:
  
  MyMesh *m;
  Test(uintptr_t _m){
    m = (MyMesh*) _m;
    vcg::tri::Clean<MyMesh>::RemoveDuplicateVertex(*m); 
  }

  void testTest(){
    printf("Read mesh %i %i\n",m->FN(),m->VN());
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Test) {
  class_<Test>("Test")
    .constructor<uintptr_t>()
    .function("testTest", &Test::testTest)
    ;
}