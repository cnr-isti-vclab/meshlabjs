// #include <stdlib.h>
// #include <vector>
// #include <emscripten.h>
// #include <emscripten/bind.h>
// #include <vcg/complex/complex.h>
// #include <wrap/io_trimesh/import_off.h>
// #include <wrap/io_trimesh/export_off.h>

// #include <vcg/complex/algorithms/refine.h>
// using namespace vcg;
// using namespace std;
// using namespace emscripten;


// class MyEdge;
// class MyFace;
// class MyVertex;
// struct MyUsedTypes : public vcg::UsedTypes< vcg::Use<MyVertex>   ::AsVertexType,
//                                         vcg::Use<MyEdge>     ::AsEdgeType,
//                                         vcg::Use<MyFace>     ::AsFaceType>{};

// class MyVertex  : public vcg::Vertex<MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::Color4b, vcg::vertex::Qualityf, vcg::vertex::BitFlags  >{};
// class MyFace    : public vcg::Face< MyUsedTypes,  vcg::face::Normal3f, vcg::face::VertexRef, vcg::face::FFAdj,  vcg::face::BitFlags > {};
// class MyEdge    : public vcg::Edge<MyUsedTypes>{};
// class MyMesh    : public vcg::tri::TriMesh< std::vector<MyVertex>, std::vector<MyFace> , std::vector<MyEdge>  > {};

// char *buf=0;
// int size;
// int vertexNum=0;

// extern "C" {
//   char * allocator(size_t _size)
//   {
//      size = _size;
//      buf = (char *) malloc(size);
//      return buf;
//   }

//   int getVertexNumber(){ return vertexNum; }

//   int* getVertexes() {
//     MyMesh m;
//     int t0=clock();
//     int loadmask;

//     int ret = tri::io::ImporterOFF<MyMesh>::OpenMem(m,buf,strlen(buf),loadmask);
//     int t1=clock();
//     if(ret != 0)
//     {
//       printf("Error in opening file\n");
//       exit(-1);
//     }
//     int t2=clock();
//     printf("Read mesh %i %i\n",m.FN(),m.VN());
//     vertexNum=n.VN();

//     return v;
//   }
// }


#include <stdlib.h>
#include <vector>
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace std;
using namespace emscripten;

extern "C" {
struct vert {
 int x;
 int y;
};

  int getLength(){ return 6; }

  vert* getVector() {
    vert* v = new vert[3];
    v[0].x=2;
    v[0].y=22;
    v[1].x=4;
    v[1].y=44;
    v[2].x=6;
    v[2].y=66;
    return v;
  }
}

 


