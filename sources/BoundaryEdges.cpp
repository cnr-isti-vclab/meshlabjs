#include "mesh_def.h"
#include <vector>

using namespace vcg;
using namespace std;

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
EMSCRIPTEN_BINDINGS(BoundaryEdgesPlugin) {
	emscripten::function("buildBoundaryEdgesCoordsVec", &buildBoundaryEdgesCoordsVec);
}
#endif