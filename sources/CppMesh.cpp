#include <stdlib.h>
#include "mesh_def.h"
#include <wrap/io_trimesh/import.h>
#include <wrap/io_trimesh/export.h>
#include <vcg/complex/complex.h>
#include <vcg/complex/algorithms/attribute_seam.h>
#include "miniz/miniz.c"
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.c"

using namespace vcg;
using namespace std;

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
    bool hasWedgeTextureCoordinates() const    { return loadmask & vcg::tri::io::Mask::IOM_WEDGTEXCOORD; }

    void addPerVertexColor()     { loadmask |= vcg::tri::io::Mask::IOM_VERTCOLOR; }
    void addPerFaceColor()       { loadmask |= vcg::tri::io::Mask::IOM_FACECOLOR; }
    void addPerVertexQuality()   { loadmask |= vcg::tri::io::Mask::IOM_VERTQUALITY; }
    void addPerFaceQuality()     { loadmask |= vcg::tri::io::Mask::IOM_FACEQUALITY; }
    void addPerVertexNormal()    { loadmask |= vcg::tri::io::Mask::IOM_VERTNORMAL; }

    
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
//       printf("Read mesh with %i faces and %i vertices.\n",m.FN(),m.VN());
      return ret;
  }
    
    int saveMesh(string fileName) {
        int ret=vcg::tri::io::Exporter<MyMesh>::Save(m,fileName.c_str(), loadmask);      
        if(ret!=0) {
          printf("Error in saving file\n");
        }
        return ret;
    }

    

    int saveMeshZip(string fileName, string archiveName) {
        printf("Trying to add %s to %s", fileName.c_str(), archiveName.c_str());
        mz_zip_archive zip_archive;
        memset(&zip_archive, 0, sizeof(zip_archive)); //Saving memory for the zip archive
        if(!mz_zip_writer_init_file(&zip_archive, archiveName.c_str(), 65537)){
            printf("Failed creating zip archive");
            mz_zip_writer_end(&zip_archive);
            return 0;
    }
        
         const char *pTestComment = "test comment";
        //MZ_BEST_COMPRESSION = 9
        if(!mz_zip_writer_add_file(&zip_archive, fileName.c_str(), fileName.c_str(), pTestComment, strlen(pTestComment), MZ_UBER_COMPRESSION )){
            printf("failed adding %s to %s", fileName.c_str(), archiveName.c_str());
            mz_zip_writer_end(&zip_archive);
            return 0;
        }
        mz_zip_writer_finalize_archive(&zip_archive);
        return 1;
      }
    
   
    int openMeshZip(string fileName){
        printf("\nOpening zip file");
        mz_zip_archive zip_archive; 
        memset(&zip_archive, 0, sizeof(zip_archive)); //Saving memory for the zip archive
        mz_zip_reader_init_file(&zip_archive, fileName.c_str(), 0); //Initializing the zip file reader
        int meshIndex = 1;
        //Iterate through each file inside the zip file
        for (int i = 0; i < (int)mz_zip_reader_get_num_files(&zip_archive); i++){
            mz_zip_archive_file_stat file_stat; //Get the info about each file and store them into file_stat
            mz_zip_reader_file_stat(&zip_archive, i, &file_stat);
            std::string meshFileName = file_stat.m_filename; //Get the file extension
            std::string fileExt = meshFileName.substr(meshFileName.find_last_of(".") + 1);
            
            if(fileExt == "off" || fileExt == "obj" || fileExt == "ply" || fileExt == "stl"){
                meshIndex = i;
                //Estraggo la mesh per ultima così da avere sia il filt mtl che l'immagine della texture
            }else {
               mz_zip_reader_extract_file_to_file(&zip_archive, file_stat.m_filename, file_stat.m_filename, 0);
               printf("\nExtracting %s",  file_stat.m_filename);
            }
        }
        
        //Se è stata trovata una mesh valida, la apro con openMesh che leggerà i file necessarai
        if(meshIndex > -1){
            mz_zip_archive_file_stat file_stat; //Get the info about each file and store them into file_stat
            mz_zip_reader_file_stat(&zip_archive, meshIndex, &file_stat);    
            std::string meshFileName = file_stat.m_filename; //Get the file extension
            std::string fileExt = meshFileName.substr(meshFileName.find_last_of(".") + 1);        
            //extract and open the mehs file
            mz_zip_reader_extract_file_to_file(&zip_archive, file_stat.m_filename, file_stat.m_filename, 0);
            printf("\nExtracting %s",  meshFileName.c_str());
            
            //apro la mesh, che avrà il supporto texture (WedgeTextureCoord) da cui posso prendere la lista delle texture che utilizza
            openMesh(meshFileName);            

            //remove the mesh file from the emscripten file system
            if(std::remove(meshFileName.c_str()) != 0 )
                printf("\nError deleting %s", meshFileName.c_str());
            else
                printf("\n%s successfully deleted", meshFileName.c_str());
            
        }
        
        mz_zip_reader_end(&zip_archive);    //Close the zip file
        return 0;
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

  inline uintptr_t getVertexColors(bool indexed)
  {
      float *c;
      int k = 0;
        
    if(indexed)
    {
        c= new float[m.VN()*3];
        for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
          c[k++] = vi->cC()[0] / 255.0f;
          c[k++] = vi->cC()[1] / 255.0f;
          c[k++] = vi->cC()[2] / 255.0f;
        }
    }else
    {
        c = new float[m.FN()*9];
        for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
            for (int j = 0; j < 3; ++j) {
                c[k++] = fi->V(j)->cC()[0] / 255.0f;
                c[k++] = fi->V(j)->cC()[1] / 255.0f;
                c[k++] = fi->V(j)->cC()[2] / 255.0f;
            }
        }        
    }
    return (uintptr_t) c;
  }
  
inline uintptr_t getWedgeTextureCoordinates()
  {
    
   float *c = new float[m.FN()*6];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      for (int j = 0; j < 3; ++j) {
        c[k++] = fi->WT(j).u();
        c[k++] = fi->WT(j).v();
      }
    }
    return (uintptr_t) c;
  }
  
  
  inline std::string getTextureName()
  {
      return m.textures[0].c_str();
  }
  
   inline uintptr_t getTextureImage()
  {
       printf("\nGetTexImage");
       int width = -1;
       int height = -1;
       int n = -1;
       unsigned char *data = stbi_load(m.textures[0].c_str(), &width, &height, &n, 4);
       
       printf("\nYOLO");
      return (uintptr_t) data;
  }
  
  inline bool checkFile(std::string fileName)
  {
        printf("\n%s Esiste?: ", fileName.c_str());
        std::ifstream ifile(fileName.c_str());
        if(ifile.good()){              
            printf("YYYEP\n");
            return true;
        }
        else{ 
            printf("NO SHIT\n");
            return false;
        }
  }
};

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(CppMesh) {
   emscripten::class_<CppMesh>("CppMesh")
    .constructor<>()
    .function("setMeshName",           &CppMesh::setMeshName)
    .function("getMeshName",           &CppMesh::getMeshName)
    .function("openMesh",              &CppMesh::openMesh)
    .function("saveMesh",              &CppMesh::saveMesh)
    .function("openMeshZip",           &CppMesh::openMeshZip)
    .function("saveMeshZip",           &CppMesh::saveMeshZip)
    .function("VN",                    &CppMesh::VN)
    .function("FN",                    &CppMesh::FN)
    .function("hasWedgeTextureCoordinates",     &CppMesh::hasWedgeTextureCoordinates)
    .function("hasPerVertexColor",     &CppMesh::hasPerVertexColor)
    .function("hasPerVertexQuality",   &CppMesh::hasPerVertexQuality)
    .function("hasPerVertexNormal",    &CppMesh::hasPerVertexNormal)
    .function("hasPerFaceColor",       &CppMesh::hasPerFaceColor)
    .function("hasPerFaceQuality",     &CppMesh::hasPerFaceQuality)
    .function("addPerVertexColor",     &CppMesh::addPerVertexColor)
    .function("addPerVertexQuality",   &CppMesh::addPerVertexQuality)
    .function("addPerVertexNormal",    &CppMesh::addPerVertexNormal)
    .function("addPerFaceColor",       &CppMesh::addPerFaceColor)
    .function("addPerFaceQuality",     &CppMesh::addPerFaceQuality)
    .function("getMeshPtr",            &CppMesh::getMeshPtr)
    .function("getMatrixPtr",          &CppMesh::getMatrixPtr)
    .function("getVertexVector",       &CppMesh::getVertexVector)
    .function("getVertexNormalVector", &CppMesh::getVertexNormalVector)
    .function("getFaceIndex",          &CppMesh::getFaceIndex)
    .function("getVertexColors",       &CppMesh::getVertexColors)
    .function("getFaceColors",         &CppMesh::getFaceColors)
    .function("getWedgeTextureCoordinates",         &CppMesh::getWedgeTextureCoordinates)
    .function("getTextureName",         &CppMesh::getTextureName)
    .function("getTextureImage",         &CppMesh::getTextureImage)
    .function("checkFile",              &CppMesh::checkFile)
    ;
}
#endif
