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


class MeshLabJs {

private: 
  string fileName;
  MyMesh m;

public:
  MeshLabJs(){}

  int openMesh(string x) {
       fileName = x;
    int loadmask;
    int ret=vcg::tri::io::Importer<MyMesh>::Open(m,fileName.c_str(),loadmask);      
    if(ret!=0) {
      printf("Error in opening file\n");
      exit(-1);
    }
    printf("Read mesh %i %i\n",m.FN(),m.VN());
    return ret;
  }

  int getVertexNumber(){ return m.VN(); }

  uintptr_t getVertexVector() { 
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

  int getFaceNumber() { return m.FN(); }

  uintptr_t getFaceVector() { 
    int * f = new int[m.FN()*3];
    int k=0;
    for (int i = 0; i < m.FN(); i++)
      for (int j = 0; j < 3; j++){
        f[k] = (int)tri::Index(m,m.face[i].cV(j));
        k++;
      }
    return (uintptr_t)f;
  }
    
    bool refine(int step){
         int t2=clock();
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::EdgeLen<MyMesh,float> edgePred(0);
    tri::MidPoint<MyMesh> midFun(&m);
        for(int i=0;i<step;i++)
            tri::RefineE(m,midFun,edgePred);
    int t3=clock();
    printf("Refined mesh %i vert - %i face \n",m.VN(),m.FN());
    printf("Refinement time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);
    return true;
    }
        
};

//Binding code
EMSCRIPTEN_BINDINGS(MeshLabJs) {
  class_<MeshLabJs>("MeshLabJs")
    .constructor<>()
 // .property("m",               &MeshLabJs::getMesh, &MeshLabJs::setMesh)
    .function("openMesh",        &MeshLabJs::openMesh)
    .function("getVertexNumber", &MeshLabJs::getVertexNumber)
    .function("getFaceNumber",   &MeshLabJs::getFaceNumber)
    .function("getFaceVector",   &MeshLabJs::getFaceVector)
    .function("getVertexVector", &MeshLabJs::getVertexVector)
    .function("refine", &MeshLabJs::refine)
    ;
}