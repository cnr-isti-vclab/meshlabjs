#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "mesh_def.h"

using namespace vcg;
using namespace std;
using namespace emscripten;

class MeshLabJs {

public:
  MyMesh *m;
  MeshLabJs(uintptr_t _m){
    m = (MyMesh*) _m;
  }

  inline uintptr_t getVertexVector() { 
    float * v = new float[m->VN()*3];
    int k=0;
    for (int i = 0; i < m->VN(); i++){
      for (int j = 0; j < 3; j++){
        v[k] = m->vert[i].cP()[j];
        k++;
      }
    }  
    return (uintptr_t)v; 
  }

inline uintptr_t getFaceVector() { 
    int * f = new int[m->FN()*3];
    int k=0;
    for (int i = 0; i < m->FN(); i++)
      for (int j = 0; j < 3; j++){
        f[k] = (int)tri::Index(*m,m->face[i].cV(j));
        k++;
      }
    return (uintptr_t)f;
  }
};

EMSCRIPTEN_BINDINGS(MeshLabJs) {
  class_<MeshLabJs>("MeshLabJs")
    .constructor<uintptr_t>()
    .function("getFaceVector",   &MeshLabJs::getFaceVector)
    .function("getVertexVector", &MeshLabJs::getVertexVector)
    ;
}
