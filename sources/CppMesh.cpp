#include <stdlib.h>
#include "mesh_def.h"
#include <wrap/io_trimesh/import.h>
#include <wrap/io_trimesh/export.h>
#include <vcg/complex/complex.h>
#include <vcg/complex/algorithms/attribute_seam.h>
#include "external/miniz.c"
#define STB_IMAGE_IMPLEMENTATION
#include "external/stb_image.c"

using namespace vcg;
using namespace std;

/**
 * @brief The MeshState class
 * This class encodes a differntial state of the a Layer/mesh. 
 * For sake of memory efficiency changes can be differential
 * 
 */

class MeshState {
private:

    enum {
        UNDEF_STATE,
        EMPTY_STATE,
        FULL_STATE,
        SELECTION_STATE,
        GEOMETRY_STATE,
        COLOR_STATE
    };
    int _time;
    int type;
    MyMesh *meshCopyPtr;

public:

    MeshState(int _newTime) : _time(_newTime), type(UNDEF_STATE), meshCopyPtr(0) {
    }

    void Clear() {
        if (meshCopyPtr) {
            delete meshCopyPtr;
            meshCopyPtr = 0;
        }
    }

    int TimeStamp() const {
        return _time;
    }

    void SaveAll(MyMesh &m) {

        //debuggare qui
        meshCopyPtr = new MyMesh();
        tri::Append<MyMesh, MyMesh>::MeshCopy(*meshCopyPtr, m);
        type = FULL_STATE;
    }

    void Restore(MyMesh &m) {
        switch (type) {
            case FULL_STATE:
                tri::Append<MyMesh, MyMesh>::MeshCopy(m, *meshCopyPtr);
                break;
            case EMPTY_STATE:
                m.Clear();
                break;
            default:
                assert(0);
        }
    }
};

/**
 * @brief The MeshHistory class
 * 
 * Functionality that we want to implement
 * 
 *  - Undo/Redo - 
 *  The interface exposes two buttons for going back and forth, globally, in what we have done. 
 * 
 *  - Preview - 
 *  Some filters should offer preview possibility, so that each parameter change corresponds to a 
 *  undo and re-application of the filter itself with the new parameters. 
 * 
 *  - Memory Awareness - 
 *  History of changes is recorded upto a given memory amount. 
 * 
 * == Internal behaviour ==
 * Each Layer has its own History
 * LayerHistory records all the state of the mesh evolution. 
 * There is a global clock
 * Each state has a timestamp. 
 * 
 *  - Changes: 
 * Filter Apply: it is recorded 
 * 
 * Undo: it is a global action that move back the clock and send to all the layer a kind of 
 * message to set the state back to this 'time'
 *
 * Preview:
 * - The user check the Preview button -> Timestamp T0 is recorded. The filter is applied, The state is saved
 * - The user change some params -> RollBack to T0. Purge future, apply filter save state.
 * - The user uncheck the preview button 
 * 
 * 
 * This class encode the sequential history of changes that occourred to a mesh. 
 * For sake of memory efficiency changes can be also differential. 
 * A state encode either a mesh or the difference with the previous state 
 * for a particular data (color, selection, position). 
 * Differential state can exists only if the previous one is not empty. 
 * 
 */


class MeshHistory {
public:
    // STATE MANAGMENT 

private:
    std::vector<MeshState> _stateVec;
    int _currentTime;
public:

    inline void pushState(int currentTime, MyMesh &m) {
        _currentTime = currentTime;
        _stateVec.push_back(MeshState(currentTime));
        _stateVec.back().SaveAll(m);
    }
    // Restore the last state with a Id less or equal than <timeId>
    // The rationale is that if we want to restore a global state at a given time
    // we want to get the most recent state before that

    inline void restoreState(int timeStamp,  MyMesh &m) {
        assert(!_stateVec.empty());
        int i = _stateVec.size()-1;
        while (i>=0 && _stateVec[i].TimeStamp() >= timeStamp) --i;
        assert(i>=0);
        _stateVec[i].Restore(m);
    }

    void Clear(int currentTime) {
        // First we make sure that the we have not undo nothing.
        // We remove everything happened after the given time. 
        while (_stateVec.back().TimeStamp() > currentTime) {
            _stateVec.back().Clear();
            _stateVec.pop_back();
        }
        _currentTime = currentTime;
    }

    int CurrentTime() {
        return _currentTime;
    }
    int size()
    {
        return _stateVec.size();
    }

};

class CppMesh {
public:
    MyMesh m;
    MeshHistory history;
    int loadmask;

    void pushState(int timeStamp)
    {
        history.pushState(timeStamp,m);
    }
    void restoreState(int timeStamp)
    {
        history.restoreState(timeStamp,m);
    }
    void Clear(int timeStamp)
    {
        history.Clear(timeStamp);
    }

    CppMesh() {
        loadmask = 0;
        m.tr.SetIdentity();
    }

    void setMeshName(string meshName) {
        m.meshName = meshName;
    }

    std::string getMeshName() {
        return m.meshName;
    }


    bool hasPerVertexNormal() const {
        return loadmask & vcg::tri::io::Mask::IOM_VERTNORMAL;
    }

    bool hasWedgeTextureCoordinates() const{
        return loadmask & vcg::tri::io::Mask::IOM_WEDGTEXCOORD;
        }

    bool hasPerVertexColor() const {
        return loadmask & vcg::tri::io::Mask::IOM_VERTCOLOR;
    }

    bool hasPerFaceColor() const {
        return loadmask & vcg::tri::io::Mask::IOM_FACECOLOR;
    }

    bool hasPerVertexQuality() const {
        return loadmask & vcg::tri::io::Mask::IOM_VERTQUALITY;
    }

    bool hasPerFaceQuality() const {
        return loadmask & vcg::tri::io::Mask::IOM_FACEQUALITY;
    }

    void addPerVertexColor() {
        loadmask |= vcg::tri::io::Mask::IOM_VERTCOLOR;
    }

    void addPerFaceColor() {
        loadmask |= vcg::tri::io::Mask::IOM_FACECOLOR;
    }

    void addPerVertexQuality() {
        loadmask |= vcg::tri::io::Mask::IOM_VERTQUALITY;
    }

    void addPerFaceQuality() {
        loadmask |= vcg::tri::io::Mask::IOM_FACEQUALITY;
    }

    void addPerVertexNormal() {
        loadmask |= vcg::tri::io::Mask::IOM_VERTNORMAL;
    }

    int openMesh(string fileName) {
        m.meshName = fileName;
        int ret = vcg::tri::io::Importer<MyMesh>::Open(m, fileName.c_str(), loadmask);
        if (ret != 0) {
            if (tri::io::Importer<MyMesh>::ErrorCritical(ret)) {
                printf("Error in opening file '%s': %s\n", fileName.c_str(), tri::io::Importer<MyMesh>::ErrorMsg(ret));
            } else {
                printf("Warning in opening file '%s': %s\n", fileName.c_str(), tri::io::Importer<MyMesh>::ErrorMsg(ret));
                ret = 0;
            }
        }
        //       printf("Read mesh with %i faces and %i vertices.\n",m.FN(),m.VN());
        return ret;
    }

    int saveMesh(string fileName) {
        int ret = vcg::tri::io::Exporter<MyMesh>::Save(m, fileName.c_str(), loadmask);
        if (ret != 0) {
            printf("Error in saving file\n");

        }
        return ret;
    }

    int saveMeshZip(string fileName, string archiveName) {
        printf("Trying to add %s to %s", fileName.c_str(), archiveName.c_str());
        mz_zip_archive zip_archive;
        memset(&zip_archive, 0, sizeof (zip_archive)); //Saving memory for the zip archive
        if (!mz_zip_writer_init_file(&zip_archive, archiveName.c_str(), 65537)) {
            printf("Failed creating zip archive");
            mz_zip_writer_end(&zip_archive);
            return 0;
        }

        const char *pTestComment = "test comment";
        //MZ_BEST_COMPRESSION = 9
        if (!mz_zip_writer_add_file(&zip_archive, fileName.c_str(), fileName.c_str(), pTestComment, strlen(pTestComment), MZ_UBER_COMPRESSION)) {
            printf("failed adding %s to %s", fileName.c_str(), archiveName.c_str());
            mz_zip_writer_end(&zip_archive);
            return 0;
        }
        mz_zip_writer_finalize_archive(&zip_archive);
        return 1;
    }

       int openMeshZip(string archiveFileName, string archiveFolder){
        printf("\nOpening zip file");
        std::string meshFileName = "";
        std::string meshExt = "";
        std::string fileName = "";
        std::string fileExt = "";
        std::string mtlFileName = "";
        
        mz_zip_archive zip_archive; 
        memset(&zip_archive, 0, sizeof(zip_archive)); //Saving memory for the zip archive
        mz_zip_reader_init_file(&zip_archive, archiveFileName.c_str(), 0); //Initializing the zip file reader
        int meshIndex = 1;
        //Iterate through each file inside the zip file
        printf("\nExtracting %d files: ", ((int)mz_zip_reader_get_num_files(&zip_archive)));
        for (int i = 0; i < (int)mz_zip_reader_get_num_files(&zip_archive); i++){
            mz_zip_archive_file_stat file_stat; //Get the info about each file and store them into file_stat
            mz_zip_reader_file_stat(&zip_archive, i, &file_stat);
            
            fileName = file_stat.m_filename; //Get the file extension
            fileExt = fileName.substr(fileName.find_last_of(".") + 1);
            
            if(fileExt == "off" || fileExt == "obj" || fileExt == "ply" || fileExt == "stl"){
                meshIndex = i; //Estraggo la mesh per ultima così da avere sia il file mtl che l'immagine della texture                
            }else {
                //Layer folder stesting
//               std::string dest = archiveFolder +"/"+file_stat.m_filename; 
//               printf("\nDestination %s ", dest.c_str());
//               mz_zip_reader_extract_file_to_file(&zip_archive, file_stat.m_filename, dest.c_str(), 0);
                
               mz_zip_reader_extract_file_to_file(&zip_archive, file_stat.m_filename, file_stat.m_filename, 0);
               printf("%s, ",  file_stat.m_filename);
               
               if(fileExt == "mtl")
                mtlFileName = fileName;
            }   
        }
        
        //Se è stata trovata una mesh valida, la apro con openMesh che leggerà i file necessarai
        if(meshIndex > -1){
            mz_zip_archive_file_stat file_stat; //Get the info about each file and store them into file_stat
            mz_zip_reader_file_stat(&zip_archive, meshIndex, &file_stat);    
            meshFileName = file_stat.m_filename; //Get the file extension
            meshExt = meshFileName.substr(meshFileName.find_last_of(".") + 1);  
            
            //extract and open the mesh file
            mz_zip_reader_extract_file_to_file(&zip_archive, file_stat.m_filename, file_stat.m_filename, 0);
            printf("%s",  meshFileName.c_str());
            
            //apro la mesh, che avrà il supporto texture (WedgeTextureCoord) da cui posso prendere la lista delle texture che utilizza
            openMesh(meshFileName);            
        }
        
        mz_zip_reader_end(&zip_archive);    //Close the zip file
        
        //remove the mesh file from the emscripten file system
        printf("\nDeleting mesh %s from FS... ", meshFileName.c_str());
        int res = std::remove(meshFileName.c_str());
        if(res != 0)
            printf("ERROR!");
        else
            printf("Success!");
        
        if(mtlFileName != ""){
            printf("\nDeleting material %s from FS... ", mtlFileName.c_str());
            res = std::remove(mtlFileName.c_str());
            if(res != 0)
                printf("ERROR!\n\n");
            else
                printf("Success!\n\n");   
        }
        
        return 0;
    }    

    int VN() {
        return m.VN();
    }

    int FN() {
        return m.FN();
    }

    uintptr_t getMeshPtr() {
        return (uintptr_t) ((void*) (&m));
    }

    uintptr_t getMatrixPtr() {
        return (uintptr_t) ((void*) (&m.tr));
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

inline uintptr_t getWedgeTextureCoordinates(int textureIndex)
  {
    
   float *c = new float[m.FN()*6];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
      for (int j = 0; j < 3; ++j) {
            if(fi->WT(j).N() == textureIndex){ //useful for future multiple texture implementation
                c[k++] = fi->WT(j).u();
                c[k++] = fi->WT(j).v();
//                printf("\nTx %d:   %f, %f",fi->WT(j).N(), fi->WT(j).u(), fi->WT(j).v());
            }
      }
    }
    return (uintptr_t) c;
  }

inline uintptr_t getUvParamCoordinates(int textureIndex)
  {    
   float *c = new float[m.FN()*9];
    int k = 0;
    for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
            for (int j = 0; j < 3; ++j) {
                if(fi->WT(j).N() == textureIndex){ //useful for future multiple texture implementation
                    c[k++] = fi->WT(j).u();
                    c[k++] = fi->WT(j).v();
                    c[k++] = 0;
                }
            }
    }
    return (uintptr_t) c;
  }
  
  inline std::string getTextureName(int textureIndex)
  {
      return m.textures[textureIndex].c_str();
  }
  
 int getTextureNumber()
  {
      return m.textures.size();
  }
  
  inline uintptr_t getTextureImage(int textureIndex)
  {
      //texture laading
       int textureWidth = -1;
       int textureHeight = -1;
       int textureComponents = -1;
       unsigned char *data = stbi_load(m.textures[textureIndex].c_str(), &textureWidth, &textureHeight, &textureComponents, 0);       
       int imageInfo[4] = {textureWidth, textureHeight, textureComponents, (int) data};
       //No kidding, removing this printing actually break the code, no idea why, if I remove it, the returned parameters will be wrong
       printf("\nTexture Info W: %d, H: %d, Ch: %d, TexPtr: %d", textureWidth, textureHeight, textureComponents, *data);
       
       return (uintptr_t) imageInfo;
  }
  
};

#ifdef __EMSCRIPTEN__
//Binding code

EMSCRIPTEN_BINDINGS(CppMesh) {
    emscripten::class_<CppMesh>("CppMesh")
            .constructor<>()
            .function("setMeshName", &CppMesh::setMeshName)
            .function("getMeshName", &CppMesh::getMeshName)
            .function("openMesh", &CppMesh::openMesh)
            .function("saveMesh", &CppMesh::saveMesh)
            .function("openMeshZip", &CppMesh::openMeshZip)
            .function("saveMeshZip", &CppMesh::saveMeshZip)
            .function("VN", &CppMesh::VN)
            .function("FN", &CppMesh::FN)
            .function("hasWedgeTextureCoordinates",     &CppMesh::hasWedgeTextureCoordinates)
            .function("hasPerVertexColor", &CppMesh::hasPerVertexColor)
            .function("hasPerVertexQuality", &CppMesh::hasPerVertexQuality)
            .function("hasPerVertexNormal", &CppMesh::hasPerVertexNormal)
            .function("hasPerFaceColor", &CppMesh::hasPerFaceColor)
            .function("hasPerFaceQuality", &CppMesh::hasPerFaceQuality)
            .function("addPerVertexColor", &CppMesh::addPerVertexColor)
            .function("addPerVertexQuality", &CppMesh::addPerVertexQuality)
            .function("addPerVertexNormal", &CppMesh::addPerVertexNormal)
            .function("addPerFaceColor", &CppMesh::addPerFaceColor)
            .function("addPerFaceQuality", &CppMesh::addPerFaceQuality)
            .function("getMeshPtr", &CppMesh::getMeshPtr)
            .function("getMatrixPtr", &CppMesh::getMatrixPtr)
            .function("getVertexVector", &CppMesh::getVertexVector)
            .function("getVertexNormalVector", &CppMesh::getVertexNormalVector)
            .function("getFaceIndex", &CppMesh::getFaceIndex)
            .function("getVertexColors", &CppMesh::getVertexColors)
            .function("getFaceColors", &CppMesh::getFaceColors)
            .function("restoreState", &CppMesh::restoreState)
            .function("pushState", &CppMesh::pushState)
            .function("Clear", &CppMesh::Clear)
            .function("getWedgeTextureCoordinates",         &CppMesh::getWedgeTextureCoordinates)
            .function("getUvParamCoordinates",         &CppMesh::getUvParamCoordinates)
            .function("getTextureName",         &CppMesh::getTextureName)
            .function("getTextureNumber",         &CppMesh::getTextureNumber)
            .function("getTextureImage",        &CppMesh::getTextureImage)
            ;

}

EMSCRIPTEN_BINDINGS(MeshHistory) {
    emscripten::class_<MeshHistory>("MeshHistory").constructor<>()
            .function("pushState", &MeshHistory::pushState)
            .function("Clear", &MeshHistory::Clear)
            .function("restoreState", &MeshHistory::restoreState)
            .function("CurrentTime", &MeshHistory::CurrentTime)
            .function("size", &MeshHistory::size);
}
#endif
