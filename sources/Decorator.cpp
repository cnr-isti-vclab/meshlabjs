#include "mesh_def.h"
#include <vector>

using namespace vcg;
using namespace std;

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


uintptr_t buildBoundaryEdgesCoordsVec(uintptr_t _mIn) {

	MyMesh &mIn = *((MyMesh*) _mIn);
	vector<Point3f> boundaryEdgesPoints, adjacentFacesPoints;

	tri::UpdateFlags<MyMesh>::FaceBorderFromNone(mIn);

	for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {

		bool isB=false;

		for(int i=0;i<3;++i) {
			if(fi->IsB(i))
			{
				isB = true;

				boundaryEdgesPoints.push_back(fi->V0(i)->P());
				boundaryEdgesPoints.push_back(fi->V1(i)->P());
			}
		}

		if(isB)
		{
			adjacentFacesPoints.push_back(fi->V(0)->P());
			adjacentFacesPoints.push_back(fi->V(1)->P());
			adjacentFacesPoints.push_back(fi->V(2)->P());
        }

	}

	size_t totalSizeInBytes = sizeof(Point3f) * (boundaryEdgesPoints.size() + adjacentFacesPoints.size());
	size_t numFloats = totalSizeInBytes / sizeof(float);

	float *startBuffer = (float *)malloc(sizeof(float) * numFloats); // new float[numFloats]

	*startBuffer = (float)(boundaryEdgesPoints.size()/2); 	// write number of boundary edges
	*(startBuffer + 1) = (float)(adjacentFacesPoints.size()/3);	// write number of adjacent faces

	float *coordsEdgesVec = startBuffer + 2;
	float *coordsFacesVec = coordsEdgesVec + (sizeof(Point3f) / sizeof(float)) * boundaryEdgesPoints.size();

	memcpy(coordsEdgesVec, &boundaryEdgesPoints[0], sizeof(Point3f) * boundaryEdgesPoints.size());
	memcpy(coordsFacesVec, &adjacentFacesPoints[0], sizeof(Point3f) * adjacentFacesPoints.size());

	return (uintptr_t)((void *)startBuffer);
}


#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(DecoratorPlugin) {
	emscripten::function("buildSelectedFacesCoordsVec", &buildSelectedFacesCoordsVec);
	emscripten::function("buildSelectedPointsCoordsVec", &buildSelectedPointsCoordsVec);
	emscripten::function("buildBoundaryEdgesCoordsVec", &buildBoundaryEdgesCoordsVec);
}
#endif