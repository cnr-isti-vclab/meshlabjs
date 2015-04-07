#include <emscripten.h>
#include <emscripten/bind.h>
#include "MeshLabJs.h"

using namespace vcg;
using namespace std;
using namespace emscripten;

class Opener
{
    public:
    uintptr_t openMesh(string fileName) {
    MeshLabJs *msp = new MeshLabJs();
    MyMesh &m=msp->m;
    
    int loadmask;
    int ret=vcg::tri::io::Importer<MyMesh>::Open(m,fileName.c_str(),loadmask);      
    if(ret!=0) {
      printf("Error in opening file\n");
      exit(-1);
    }
    printf("Read mesh %i %i\n",m.FN(),m.VN());
    return (uintptr_t) msp;
  }
};

//Binding code
EMSCRIPTEN_BINDINGS(Opener) {
  class_<Opener>("Opener")
    .constructor<>()
    .function("openMesh",        &Opener::openMesh, allow_raw_pointers())
    ;
}