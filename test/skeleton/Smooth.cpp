#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "mesh_def.h"
#include <vcg/complex/algorithms/update/topology.h>
#include <vcg/complex/algorithms/update/normal.h>
#include <vcg/complex/algorithms/clean.h>
#include <vcg/complex/algorithms/smooth.h>

using namespace vcg;
using namespace std;
using namespace emscripten;

class MySmooth {

public:

MyMesh *m;
MySmooth(uintptr_t _m){
    m = (MyMesh*) _m;
}
void smooth(int step)
{
    int t2=clock();

    // MyMesh::PerVertexAttributeHandle <Point3f>  avgH =
    //     tri::Allocator<MyMesh*>::GetPerVertexAttribute<Point3f>(*m,"avg");

    // for(MyMesh::VertexIterator vi=m->vert.begin();vi!=m->vert.end();++vi) {
    //    std::vector<MyVertex *> starVec;
    //    face::VVStarVF<MyFace>(&*vi,starVec);
    //    avgH[vi] = Point3f(0,0,0);

    //    for(size_t i=0;i<starVec.size();++i)
    //    {
    //      avgH[vi] +=starVec[i]->P();
    //    }
    //    avgH[vi] /= float(starVec.size());
    // }

    // for(MyMesh::VertexIterator vi=m->vert.begin();vi!=m->vert.end();++vi)
    //     vi->P() = avgH[vi];
    int dup = tri::Clean<MyMesh>::RemoveDuplicateVertex(*m);
    int unref = tri::Clean<MyMesh>::RemoveUnreferencedVertex(*m);
    printf("Removed %i duplicate and %i unreferenced vertices from mesh \n",dup,unref);

    tri::UpdateTopology<MyMesh>::VertexFace(*m);
     for(int i=0;i<step;++i)
    {
    tri::UpdateNormal<MyMesh>::PerFaceNormalized(*m);
    tri::Smooth<MyMesh>::VertexCoordPasoDoble(*m,3);
    }
    int t3=clock();
    printf("Smooth mesh %i vert - %i face \n",m->VN(),m->FN());
    printf("Smooth time %5.2f\n",float(t3-t2)/CLOCKS_PER_SEC);
    }
};

//Binding code
EMSCRIPTEN_BINDINGS(MySmooth) {
  class_<MySmooth>("MySmooth")
    .constructor<uintptr_t>()
    .function("smooth", &MySmooth::smooth)
    ;
}