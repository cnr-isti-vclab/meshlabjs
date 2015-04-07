#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vcg/complex/complex.h>
#include <wrap/io_trimesh/import.h>

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

class Opener
{
  public:
    MyMesh m;
  int openMesh(string fileName) {
    int loadmask;
    int ret=vcg::tri::io::Importer<MyMesh>::Open(m,fileName.c_str(),loadmask);      
    if(ret!=0) {
      printf("Error in opening file\n");
      exit(-1);
    }
    printf("Read mesh %i %i\n",m.FN(),m.VN());
    return ret;
  }

  uintptr_t getMesh(){
    return (uintptr_t)((void*)(&m)) ;
  }

};

//Binding code
EMSCRIPTEN_BINDINGS(Opener) {
  class_<Opener>("Opener")
    .constructor<>()
    .function("openMesh",        &Opener::openMesh)
    .function("getMesh",         &Opener::getMesh)
    ;
}