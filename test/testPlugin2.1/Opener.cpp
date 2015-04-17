#include "MyMesh.h"

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