#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "mesh_def.h"
#include <wrap/io_trimesh/export.h>

using namespace vcg;
using namespace std;
using namespace emscripten;

class SaveMesh
{
  public:
    MyMesh *m;
    SaveMesh(uintptr_t _m){
      m = (MyMesh*) _m;
    }
  int saveMesh(string fileName) {

    int ret=vcg::tri::io::Exporter<MyMesh>::Save(*m,fileName.c_str());      
    if(ret!=0) {
      printf("Error in saving file\n");
      
    }
    return ret;
  }

};

//Binding code
EMSCRIPTEN_BINDINGS(SaveMesh) {
  class_<SaveMesh>("SaveMesh")
    .constructor<uintptr_t>()
    .function("saveMesh", &SaveMesh::saveMesh)
    ;
}