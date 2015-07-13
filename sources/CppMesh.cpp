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
  int openMesh(string fileName) {
    int loadmask;
    int ret=vcg::tri::io::Importer<MyMesh>::Open(m,fileName.c_str(),loadmask);
    if(ret!=0) {
      printf("Error in opening file\n");

    }
    // printf("Read mesh with %i faces and %i vertices.\n",m.FN(),m.VN());
    return ret;
  }

  uintptr_t getMesh(){
    return (uintptr_t)((void*)(&m)) ;
  }

};

//Binding code
EMSCRIPTEN_BINDINGS(CppMesh) {
  class_<CppMesh>("CppMesh")
    .constructor<>()
    .function("openMesh",        &CppMesh::openMesh)
    .function("getMesh",         &CppMesh::getMesh)
    ;
}
