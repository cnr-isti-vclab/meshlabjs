#include "mesh_def.h"

using namespace vcg;
using namespace std;

void RandomDisplacement(uintptr_t _m, float max_displacement, const bool normalDirected)
{
    MyMesh &m = *((MyMesh*) _m);
    math::MarsenneTwisterRNG rnd;
    tri::UpdateNormal<MyMesh>::NormalizePerVertex(m);
    rnd.initialize(time(NULL));
    for(unsigned int i = 0; i< m.vert.size(); i++){
      if(normalDirected)
        m.vert[i].P() +=  m.vert[i].N()* rnd.generateRange(-1.0f,1.0f)*max_displacement;
        else
        m.vert[i].P() +=  math::GeneratePointInUnitBallUniform<float,math::MarsenneTwisterRNG>(rnd)*max_displacement;
    }
    tri::UpdateNormal<MyMesh>::PerVertexNormalizedPerFace(m);
}

void RandomSelection(uintptr_t _m, float vertProb, float faceprob)
{
    MyMesh &m = *((MyMesh*) _m);
    math::MarsenneTwisterRNG rnd;
    tri::UpdateNormal<MyMesh>::NormalizePerVertex(m);
    rnd.initialize(clock());

    tri::UpdateSelection<MyMesh>::Clear(m);

    for(MyMesh::FaceIterator fi=m.face.begin(); fi!=m.face.end(); ++fi) {
        if (rnd.generate01() < faceprob)
            fi->SetS();
    }

    for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
      if (rnd.generate01() < vertprob)
          vi->SetS();
    }
}


#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLRandomPlugin) {
    emscripten::function("RandomDisplacement", &RandomDisplacement);
    emscripten::function("RandomSelection", &RandomSelection);
}
#endif
