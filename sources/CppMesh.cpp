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
    int loadmask;
    CppMesh()
    {
      loadmask =0;
      m.tr.SetIdentity();
    }
    void setMeshName(string meshName) {
      m.meshName = meshName;
    }
    
    std::string getMeshName() { 
      return m.meshName;
    }

    bool hasPerVertexColor() const    { return loadmask & vcg::tri::io::Mask::IOM_VERTCOLOR; }
    bool hasPerFaceColor() const      { return loadmask & vcg::tri::io::Mask::IOM_FACECOLOR; }
    bool hasPerVertexQuality() const  { return loadmask & vcg::tri::io::Mask::IOM_VERTQUALITY; }
    bool hasPerFaceQuality() const    { return loadmask & vcg::tri::io::Mask::IOM_FACEQUALITY; }

    void addPerVertexColor()     { loadmask |= vcg::tri::io::Mask::IOM_VERTCOLOR; }
    void addPerFaceColor()       { loadmask |= vcg::tri::io::Mask::IOM_FACECOLOR; }
    void addPerVertexQuality()   { loadmask |= vcg::tri::io::Mask::IOM_VERTQUALITY; }
    void addPerFaceQuality()     { loadmask |= vcg::tri::io::Mask::IOM_FACEQUALITY; }

    
    int openMesh(string fileName) {
      m.meshName=fileName;
      int ret=vcg::tri::io::Importer<MyMesh>::Open(m,fileName.c_str(),loadmask);
      if(ret!=0) {
          if (tri::io::Importer<MyMesh>::ErrorCritical(ret))
          {
              printf("Error in opening file '%s': %s\n",fileName.c_str(),tri::io::Importer<MyMesh>::ErrorMsg(ret));
          }
          else
          {
              printf("Warning in opening file '%s': %s\n",fileName.c_str(),tri::io::Importer<MyMesh>::ErrorMsg(ret));
              ret=0;
          }
      }
      // printf("Read mesh with %i faces and %i vertices.\n",m.FN(),m.VN());
      return ret;
  }

  int VN() { return m.VN(); }
  int FN() { return m.FN(); }
  
  
  uintptr_t getMeshPtr(){
    return (uintptr_t)((void*)(&m)) ;
  }

  uintptr_t getMatrixPtr()
  {
    return (uintptr_t)((void*)(&m.tr));
  }

  inline uintptr_t getVertexVector() {
    float * v = new float[m.VN()*3];
    int k=0;
    tri::Allocator<MyMesh>::CompactVertexVector(m);
    for (int i = 0; i < m.VN(); i++) {
      for (int j = 0; j < 3; j++) {
        v[k] = m.vert[i].cP()[j];
        k++;
      }
    }
    return (uintptr_t)v;
  }

  inline uintptr_t getFaceVector() {
    uint32_t * f = new uint32_t[m.FN()*3];
    int k=0;
    tri::Allocator<MyMesh>::CompactFaceVector(m);
    for (int i = 0; i < m.FN(); i++)
      for (int j = 0; j < 3; j++){
        f[k] = tri::Index(m,m.face[i].cV(j));
        k++;
      }
    return (uintptr_t)f;
  }

  inline uintptr_t getVertexNormalsVector() {
    tri::UpdateNormal<MyMesh>::PerFaceNormalized(m);
    tri::UpdateNormal<MyMesh>::PerVertexFromCurrentFaceNormal(m);
    float *n = new float[m.VN()*4];
    int k = 0;
    tri::Allocator<MyMesh>::CompactVertexVector(m);
    for (int i = 0; i < m.VN(); ++i) {
        n[k++] = m.vert[i].cN()[0];
        n[k++] = m.vert[i].cN()[1];
        n[k++] = m.vert[i].cN()[2];
    }
    return (uintptr_t) n;
  }

  inline uintptr_t getVertexColorVector() {
    float *c = new float[m.VN()*3];
    int k = 0;
    for (int i = 0; i < m.VN(); ++i) {
        c[k++] = m.vert[i].cC()[0] / 255.0;
        c[k++] = m.vert[i].cC()[1] / 255.0;
        c[k++] = m.vert[i].cC()[2] / 255.0;
    }
    return (uintptr_t) c;
  }

  inline uintptr_t getFaceColorVector() {
    uint8_t *c = new uint8_t[m.FN()*4];
    int k = 0;
    for (int i = 0; i < m.FN(); ++i) {
      for (int j = 0; j < 4; ++j) {
        c[k++] = m.face[i].cC()[j];
      }
    }
    return (uintptr_t) c;
  }

  inline uintptr_t getTriangleSoup() {
    float * v = new float[m.FN()*9];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      if (!fi->IsD()) {
        for (int i = 0; i < 3; ++i) {
          v[k++] = fi->cV(i)->cP()[0];
          v[k++] = fi->cV(i)->cP()[1];
          v[k++] = fi->cV(i)->cP()[2];
        }
      }
    }

    return (uintptr_t) v;
  }

  inline uintptr_t getDuplicatedNormals() {
    tri::UpdateNormal<MyMesh>::PerFaceNormalized(m);
    tri::UpdateNormal<MyMesh>::PerVertexFromCurrentFaceNormal(m);
    float * n = new float[m.FN()*9];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      if (!fi->IsD()) {
        for (int i = 0; i < 3; ++i) {
          n[k++] = fi->cV(i)->cN()[0];
          n[k++] = fi->cV(i)->cN()[1];
          n[k++] = fi->cV(i)->cN()[2];
        }
      }
    }
    return (uintptr_t) n;
  }

  inline uintptr_t getDuplicatedVertexColors() {
    float * c = new float[m.FN()*9];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      if (!fi->IsD()) {
        for (int i = 0; i < 3; ++i) {
          c[k++] = fi->cV(i)->cC()[0] / 255.0;
          c[k++] = fi->cV(i)->cC()[1] / 255.0;
          c[k++] = fi->cV(i)->cC()[2] / 255.0;
        }
      }
    }
    return (uintptr_t) c;
  }

  inline uintptr_t getDuplicatedFaceColors() {
    float * c = new float[m.FN()*9];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      if (!fi->IsD()) {
        for (int i = 0; i < 3; ++i) {
          c[k++] = fi->cC()[0] / 255.0;
          c[k++] = fi->cC()[1] / 255.0;
          c[k++] = fi->cC()[2] / 255.0;
        }
      }
    }
    return (uintptr_t) c;
  }
};

//Binding code
EMSCRIPTEN_BINDINGS(CppMesh) {
  class_<CppMesh>("CppMesh")
    .constructor<>()
    .function("openMesh",             &CppMesh::openMesh)
    .function("setMeshName",          &CppMesh::setMeshName)
    .function("getMeshName",          &CppMesh::getMeshName)
    .function("getMeshPtr",           &CppMesh::getMeshPtr)
    .function("getMatrixPtr",         &CppMesh::getMatrixPtr)
    .function("getVertexVector",      &CppMesh::getVertexVector)
    .function("getVertexNormalsVector",      &CppMesh::getVertexNormalsVector)
    .function("getVertexColorVector", &CppMesh::getVertexColorVector)
    .function("getFaceVector",        &CppMesh::getFaceVector)
    .function("getFaceColorVector",   &CppMesh::getFaceColorVector)
    .function("hasPerVertexColor",    &CppMesh::hasPerVertexColor)
    .function("hasPerVertexQuality",  &CppMesh::hasPerVertexColor)
    .function("hasPerFaceColor",      &CppMesh::hasPerFaceColor)
    .function("hasPerFaceQuality",    &CppMesh::hasPerFaceColor)
    .function("addPerVertexColor",    &CppMesh::hasPerVertexColor)
    .function("addPerVertexQuality",  &CppMesh::hasPerVertexColor)
    .function("addPerFaceColor",      &CppMesh::hasPerFaceColor)
    .function("addPerFaceQuality",    &CppMesh::hasPerFaceColor)
    .function("getTriangleSoup",    &CppMesh::getTriangleSoup)
    .function("getDuplicatedNormals",    &CppMesh::getDuplicatedNormals)
    .function("getDuplicatedVertexColors",    &CppMesh::getDuplicatedVertexColors)
    .function("getDuplicatedFaceColors",    &CppMesh::getDuplicatedFaceColors)
    .function("VN",&CppMesh::VN)
    .function("FN",&CppMesh::FN)
    ;
}
