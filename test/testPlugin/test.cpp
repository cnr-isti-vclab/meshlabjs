#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vcg/complex/complex.h>
#include <vcg/complex/append.h>
#include <vcg/complex/algorithms/clean.h>

using namespace vcg;
using namespace std;
using namespace emscripten;

class MyVertexF; class MyEdgeF; class MyFaceF;
struct MyUsedTypesF : public vcg::UsedTypes<vcg::Use<MyVertexF>   ::AsVertexType,
                                           vcg::Use<MyEdgeF>     ::AsEdgeType,
                                           vcg::Use<MyFaceF>     ::AsFaceType>{};

class MyVertexF  : public vcg::Vertex< MyUsedTypesF, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};
class MyFaceF    : public vcg::Face<   MyUsedTypesF, vcg::face::FFAdj,  vcg::face::VertexRef, vcg::face::BitFlags > {};
class MyEdgeF    : public vcg::Edge<   MyUsedTypesF> {};

class MyMeshF    : public vcg::tri::TriMesh< std::vector<MyVertexF>, std::vector<MyFaceF> , std::vector<MyEdgeF>  > {};

class MyVertex0F  : public vcg::Vertex< MyUsedTypesF, vcg::vertex::Coord3f, vcg::vertex::BitFlags  >{};
class MyVertex1F  : public vcg::Vertex< MyUsedTypesF, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};
class MyVertex2F  : public vcg::Vertex< MyUsedTypesF, vcg::vertex::Coord3f, vcg::vertex::Color4b, vcg::vertex::CurvatureDirf,
                                                    vcg::vertex::Qualityf, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};

class Test {

private: 

public:
  
  MyMeshF m;
  Test(MyMeshF _m){ 
    vcg::tri::Append<MyMeshF,MyMeshF>::Mesh(m,_m);
    vcg::tri::Clean<MyMeshF>::RemoveDuplicateVertex(m); 
  }

  void testTest(){
    printf("Read mesh %i %i\n",m.FN(),m.VN());
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Test) {
  class_<Test>("Test")
    .function("testTest", &Test::testTest)
    ;
}