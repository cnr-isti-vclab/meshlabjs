#include "mesh_def.h"

using namespace vcg;
using namespace std;


void selectRandom(uintptr_t _m) {
		
	MyMesh &m = *((MyMesh*) _m);
	
	tri::UpdateFlags<MyMesh>::Clear(m);

	for(MyMesh::FaceIterator fi=m.face.begin(); fi!=m.face.end(); ++fi) {
		if (rand() % 2) {
			fi->SetS();
		}
	}

	for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
		if (rand() % 2) {
			vi->SetS();
		}		
    }
}

void buildSelectedFacesCoordsVec(uintptr_t _mIn, uintptr_t _fCoords) {

	MyMesh &mIn = *((MyMesh*) _mIn);
	float *coordsVec = 1 + (float *)_fCoords;
	
	size_t numSelectedFaces = 0;
	
	for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {
			
		if (!fi->IsS()) continue;
		
		Point3f &p0 = fi->V(0)->P();
        Point3f &p1 = fi->V(1)->P();
        Point3f &p2 = fi->V(2)->P();
		
		*coordsVec++ = p0[0];
		*coordsVec++ = p0[1];
		*coordsVec++ = p0[2];
		
		*coordsVec++ = p1[0];
		*coordsVec++ = p1[1];
		*coordsVec++ = p1[2];
		
		*coordsVec++ = p2[0];
		*coordsVec++ = p2[1];
		*coordsVec++ = p2[2];
		
		++numSelectedFaces;
	}
	
	*((float *)_fCoords) = (float)numSelectedFaces;

}

void buildSelectedPointsCoordsVec(uintptr_t _mIn, uintptr_t _fCoords) {
	
	MyMesh &mIn = *((MyMesh*) _mIn);
	float *coordsVec = 1 + (float *)_fCoords;
		
	size_t numSelectedPoints = 0;
	
	for (MyMesh::VertexIterator vi = mIn.vert.begin(); vi != mIn.vert.end(); ++vi) {

		if (!vi->IsS()) continue;
			
		Point3f &p = vi->P();
		
		*coordsVec++ = p[0];
		*coordsVec++ = p[1];
		*coordsVec++ = p[2];
		
		++numSelectedPoints;
    }
	
	*((float *)_fCoords) = (float)numSelectedPoints;
}


#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(SelectionPlugin) {
	emscripten::function("selectRandom", &selectRandom);
	emscripten::function("buildSelectedFacesCoordsVec", &buildSelectedFacesCoordsVec);
	emscripten::function("buildSelectedPointsCoordsVec", &buildSelectedPointsCoordsVec);
}
#endif