#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace std;
using namespace emscripten;


char *fileName;
int size;
int vertexNum=0;
int faceNum=0;


class MeshLabJs {
public:
  MeshLabJs(){}
  char * getFileName(size_t _size) {
    fileName=0;
    size = _size;
    fileName = (char *) malloc(size);
    return fileName;
  }
  int openMesh() {
    int loadmask;
    int ret=0;      
    return ret;
  }

  int getVertexNumber(){ return 5; }

  float * getVertexVector() { 
    float * v = new float[5*3];
    int k=0;
    for (int i = 0; i < 5; i++){
      for (int j = 0; j < 3; j++){
        v[k] = j+1;
        k++;
      }
    }  
    return v; 
  }

  int getFaceNumber() { return 5; }

  int * getFaceVector() { 
    int * f = new int[5*3];
    int k=0; 
    for (int i = 0; i < 5; i++)
      for (int j = 0; j < 3; j++){
        f[k] = k+1;
        k++;
      }
    return f;
  }
};

//Binding code
EMSCRIPTEN_BINDINGS(MeshLabJs) {
  class_<MeshLabJs>("MeshLabJs")
    .constructor<>()
    .function("getFileName"     , &MeshLabJs::getFileName)
    .function("openMesh"        , &MeshLabJs::openMesh)
    .function("getVertexNumber" , &MeshLabJs::getVertexNumber)
    .function("getFaceNumber"   , &MeshLabJs::getFaceNumber)
    .function("getFaceVector"   , &MeshLabJs::getFaceVector)
    .function("getVertexVector" , &MeshLabJs::getVertexVector)
    ;
}

