#include <stdlib.h>
#include <emscripten.h>
#include <vcg/complex/complex.h>
#include <wrap/io_trimesh/import_off.h>

using namespace vcg;
using namespace std;


class MyEdge;
class MyFace;
class MyVertex;
struct MyUsedTypes : public vcg::UsedTypes< vcg::Use<MyVertex>   ::AsVertexType,
                                        vcg::Use<MyEdge>     ::AsEdgeType,
                                        vcg::Use<MyFace>     ::AsFaceType>{};

class MyVertex  : public vcg::Vertex<MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::Color4b, vcg::vertex::Qualityf, vcg::vertex::BitFlags  >{};
class MyFace    : public vcg::Face< MyUsedTypes,  vcg::face::Normal3f, vcg::face::VertexRef, vcg::face::FFAdj,  vcg::face::BitFlags > {};
class MyEdge    : public vcg::Edge<MyUsedTypes>{};
class MyMesh    : public vcg::tri::TriMesh< std::vector<MyVertex>, std::vector<MyFace> , std::vector<MyEdge>  > {};

char *buf=0;
int size;
int vertexNum=0;
int faceNum=0;
MyMesh m;

extern "C" {
  char * allocator(size_t _size)
  {
     size = _size;
     buf = (char *) malloc(size);
     return buf;
  }

  int openMesh(){
    int loadmask;

    int ret = tri::io::ImporterOFF<MyMesh>::OpenMem(m,buf,strlen(buf),loadmask);
    if(ret != 0)
    {
      printf("Error in opening file\n");
      exit(-1);
    }
    printf("Read mesh %i %i\n",m.FN(),m.VN());
    return ret;
  }

  int getVertexNumber(){ return m.VN(); }

  float * getVertexVector() { 
    tri::RequireCompactness(m);
    float * v = new float[m.VN()*3];
    int k=0;
    for (int i = 0; i < m.VN(); i++){
      for (int j = 0; j < 3; j++){
        v[k] = m.vert[i].cP()[j];
         k++;
      }
    }  

    return v; 
  }

  int getFaceNumber() { return m.FN(); }

  int * getFaceVector() { 
    tri::RequireCompactness(m);
    int * f = new int[m.FN()*3];
    int k=0;
    for (int i = 0; i < m.FN(); i++)
      for (int j = 0; j < 3; j++){
        f[k] = (int)tri::Index(m,m.face[i].cV(j));
        k++;
      }

    return f;
  }


}


// #include <stdlib.h>
// #include <vector>
// #include <emscripten.h>
// #include <emscripten/bind.h>

// using namespace std;
// using namespace emscripten;

// extern "C" {
// struct vert {
//  int x;
//  int y;
// };

//   int getLength(){ return 6; }

//   vert* getVector() {
//     vert* v = new vert[3];
//     v[0].x=2;
//     v[0].y=22;
//     v[1].x=4;
//     v[1].y=44;
//     v[2].x=6;
//     v[2].y=66;
//     return v;
//   }
// }

 


