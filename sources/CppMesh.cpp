#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "mesh_def.h"
#include <wrap/io_trimesh/import.h>

using namespace vcg;
using namespace std;
using namespace emscripten;

class CppMesh
{
  public:
    MyMesh m;
    Matrix44f tr;
  int openMesh(string fileName) {
    int loadmask;
    int ret=vcg::tri::io::Importer<MyMesh>::Open(m,fileName.c_str(),loadmask);
    if(ret!=0) {
      printf("Error in opening file\n");
    }
    // printf("Read mesh with %i faces and %i vertices.\n",m.FN(),m.VN());
    return ret;
  }
  
  int VN() { return m.VN();}
  int FN() { return m.FN();}
  
  uintptr_t getMeshPtr(){
    return (uintptr_t)((void*)(&m)) ;
  }
  
  uintptr_t getMatrixPtr()
  {
    return (uintptr_t)((void*)(&tr));
  }
  
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

//Binding code
EMSCRIPTEN_BINDINGS(CppMesh) {
  class_<CppMesh>("CppMesh")
    .constructor<>()
    .function("openMesh",        &CppMesh::openMesh)
    .function("getMeshPtr",      &CppMesh::getMeshPtr)
    .function("getMatrixPtr",    &CppMesh::getMatrixPtr)
    .function("getVertexVector", &CppMesh::getVertexVector)
    .function("getFaceVector",   &CppMesh::getFaceVector)
    .function("VN",&CppMesh::VN)
    .function("FN",&CppMesh::FN)
    ;
}
