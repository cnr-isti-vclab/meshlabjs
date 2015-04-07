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

class MeshLabJs {

// private: 
//   string fileName;

public:
  MeshLabJs(){}
      MyMesh m;
  // void setFileName(string x) {
  //   fileName = x;
  // }
inline uintptr_t getMesh(){
    return (uintptr_t)((void*)(&m)) ;
  }
int getVertexNumber(){ return m.VN(); }

  inline uintptr_t getVertexVector() { 
    float * v = new float[m.VN()*3];
    int k=0;
    for (int i = 0; i < m.VN(); i++){
      for (int j = 0; j < 3; j++){
        v[k] = m.vert[i].cP()[j];
        k++;
      }
    }  
    return (uintptr_t)v; 
  }

inline int getFaceNumber() { return m.FN(); }

inline uintptr_t getFaceVector() { 
    int * f = new int[m.FN()*3];
    int k=0;
    for (int i = 0; i < m.FN(); i++)
      for (int j = 0; j < 3; j++){
        f[k] = (int)tri::Index(m,m.face[i].cV(j));
        k++;
      }
    return (uintptr_t)f;
  }
};

EMSCRIPTEN_BINDINGS(MeshLabJs) {
  class_<MeshLabJs>("MeshLabJs")
    .constructor<>()
 // .property("m",               &MeshLabJs::getMesh, &MeshLabJs::setMesh)
    .function("getMesh",        &MeshLabJs::getMesh)
    .function("getVertexNumber", &MeshLabJs::getVertexNumber)
    .function("getFaceNumber",   &MeshLabJs::getFaceNumber)
    .function("getFaceVector",   &MeshLabJs::getFaceVector)
    .function("getVertexVector", &MeshLabJs::getVertexVector)
    // .function("refine", &MeshLabJs::refine)
    ;
}
