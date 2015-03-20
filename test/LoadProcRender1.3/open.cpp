#include <stdlib.h>
#include <fstream>
#include <emscripten.h>
#include <vcg/complex/complex.h>
#include <wrap/io_trimesh/import_stl.h>
#include <vcg/complex/algorithms/update/topology.h>
#include <vcg/complex/algorithms/update/normal.h>

using namespace vcg;
using namespace std;

class MyVertex; class MyEdge; class MyFace;
struct MyUsedTypes : public vcg::UsedTypes<vcg::Use<MyVertex>   ::AsVertexType,
                                           vcg::Use<MyEdge>     ::AsEdgeType,
                                           vcg::Use<MyFace>     ::AsFaceType>{};

class MyVertex  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};
class MyFace    : public vcg::Face<   MyUsedTypes, vcg::face::FFAdj,  vcg::face::VertexRef, vcg::face::BitFlags > {};
class MyEdge    : public vcg::Edge<   MyUsedTypes> {};

class MyMesh    : public vcg::tri::TriMesh< std::vector<MyVertex>, std::vector<MyFace> , std::vector<MyEdge>  > {};

class MyVertex0  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::BitFlags  >{};
class MyVertex1  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};
class MyVertex2  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Color4b, vcg::vertex::CurvatureDirf,
                                                    vcg::vertex::Qualityf, vcg::vertex::Normal3f, vcg::vertex::BitFlags  >{};

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
  printf("creazione file of size %i\n",size);
  ofstream f("tmp_p.stl", std::ofstream::binary);
  f.write(buf,size);
  f.close();
//  for(int qq=0;qq<40;++qq)
//  printf("%04i '%02x %02x %02x %02x'\n", qq*4, buf[qq*4+0]&0xff, buf[qq*4+1]&0xff, buf[qq*4+2]&0xff, buf[qq*4+3]&0xff );
  printf("fine creazione e caricamento\n");
  //for(int i=0;i<100;++i) printf("%c",buf[i]); printf("\n");
  int loadmask;
  int ret=vcg::tri::io::ImporterSTL<MyMesh>::Open(m,"tmp_p.stl",loadmask);      
  if(ret!=0)
    {
      printf("Error in opening file\n");
      exit(-1);
    }
    printf("Read mesh %i %i\n",m.FN(),m.VN());
    return ret;
  }

  int getVertexNumber(){ return m.VN(); }

  float * getVertexVector() { 
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



