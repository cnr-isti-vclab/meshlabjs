#include "MyMesh.cpp"

class MeshLabJs {

public:
  MyMesh *m;
  MeshLabJs(uintptr_t _m){
    m = (MyMesh*) _m;
  }

int getVertexNumber(){ return m->VN(); }

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

inline int getFaceNumber() { return m->FN(); }

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
    .function("getVertexNumber", &MeshLabJs::getVertexNumber)
    .function("getFaceNumber",   &MeshLabJs::getFaceNumber)
    .function("getFaceVector",   &MeshLabJs::getFaceVector)
    .function("getVertexVector", &MeshLabJs::getVertexVector)
    ;
}
