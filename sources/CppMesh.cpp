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

    bool hasPerVertexNormal() const { return  loadmask & vcg::tri::io::Mask::IOM_VERTNORMAL; }
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

  inline uintptr_t getVertexVector(bool indexing)
  {
    float *v;
    int k = 0;
    if (indexing) {
      tri::Allocator<MyMesh>::CompactVertexVector(m);
      v = new float[m.VN()*3];
      for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi ) {
        v[k++] = vi->cP()[0];
        v[k++] = vi->cP()[1];
        v[k++] = vi->cP()[2];
      }
    } else {
      tri::Allocator<MyMesh>::CompactFaceVector(m);
      v = new float[m.FN()*9];
      for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
        for (int j = 0; j < 3; ++j) {
          v[k++] = fi->cV(j)->cP()[0];
          v[k++] = fi->cV(j)->cP()[1];
          v[k++] = fi->cV(j)->cP()[2];
        }
      }
    }
    return (uintptr_t) v;
  }

  inline uintptr_t getVertexNormalVector(bool indexing)
  {
    float *n;
    int k = 0;

    if (hasPerVertexNormal()) {
          tri::Allocator<MyMesh>::CompactVertexVector(m);
          n = new float[m.VN()*3];
          for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
            n[k++] = vi->cN()[0];
            n[k++] = vi->cN()[1];
            n[k++] = vi->cN()[2];
          }
          return (uintptr_t) n;
    }

    tri::UpdateNormal<MyMesh>::PerFaceNormalized(m);
    tri::UpdateNormal<MyMesh>::PerVertexFromCurrentFaceNormal(m);
    if (indexing) {
      tri::Allocator<MyMesh>::CompactVertexVector(m);
      n = new float[m.VN()*3];
      for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
        n[k++] = vi->cN()[0];
        n[k++] = vi->cN()[1];
        n[k++] = vi->cN()[2];
      }
    } else {
      tri::Allocator<MyMesh>::CompactFaceVector(m);
      n = new float[m.FN()*9];
      for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
        for (int j = 0; j < 3; ++j) {
          n[k++] = fi->cV(j)->N()[0];
          n[k++] = fi->cV(j)->N()[1];
          n[k++] = fi->cV(j)->N()[2];
        }
      }
    }
    return (uintptr_t) n;
  }

  inline uintptr_t getFaceIndex() {
    uint32_t * idx = new uint32_t[m.FN()*3];
    int k = 0;
    tri::Allocator<MyMesh>::CompactFaceVector(m);
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      idx[k++] = tri::Index(m, fi->cV(0));
      idx[k++] = tri::Index(m, fi->cV(1));
      idx[k++] = tri::Index(m, fi->cV(2));
    }
    return (uintptr_t) idx;
  }

  // colors are passed as floats in [0,1] since the three.js version in use (r71)
  // does not allow to pass attributes of type other than Float32
  inline uintptr_t getFaceColors()
  {
    float *c = new float[m.FN()*9];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      for (int j = 0; j < 3; ++j) {
        c[k++] = fi->cC()[0] / 255.0f;
        c[k++] = fi->cC()[1] / 255.0f;
        c[k++] = fi->cC()[2] / 255.0f;
      }
    }
    return (uintptr_t) c;
  }

  inline uintptr_t getVertexColors()
  {
    
    float *c = new float[m.VN()*3];
    int k = 0;
    for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
      c[k++] = vi->cC()[0] / 255.0f;
      c[k++] = vi->cC()[1] / 255.0f;
      c[k++] = vi->cC()[2] / 255.0f;
    }
    return (uintptr_t) c;
  }

};

//Binding code
EMSCRIPTEN_BINDINGS(CppMesh) {
  class_<CppMesh>("CppMesh")
    .constructor<>()
    .function("setMeshName",           &CppMesh::setMeshName)
    .function("getMeshName",           &CppMesh::getMeshName)
    .function("openMesh",              &CppMesh::openMesh)
    .function("VN",                    &CppMesh::VN)
    .function("FN",                    &CppMesh::FN)
    .function("hasPerVertexColor",     &CppMesh::hasPerVertexColor)
    .function("hasPerVertexQuality",   &CppMesh::hasPerVertexColor)
    .function("hasPerFaceColor",       &CppMesh::hasPerFaceColor)
    .function("hasPerFaceQuality",     &CppMesh::hasPerFaceColor)
    .function("addPerVertexColor",     &CppMesh::hasPerVertexColor)
    .function("addPerVertexQuality",   &CppMesh::hasPerVertexColor)
    .function("addPerFaceColor",       &CppMesh::hasPerFaceColor)
    .function("addPerFaceQuality",     &CppMesh::hasPerFaceColor)
    .function("getMeshPtr",            &CppMesh::getMeshPtr)
    .function("getMatrixPtr",          &CppMesh::getMatrixPtr)
    .function("getVertexVector",       &CppMesh::getVertexVector)
    .function("getVertexNormalVector", &CppMesh::getVertexNormalVector)
    .function("getFaceIndex",          &CppMesh::getFaceIndex)
    .function("getVertexColors",       &CppMesh::getVertexColors)
    .function("getFaceColors",         &CppMesh::getFaceColors)
    ;
}
