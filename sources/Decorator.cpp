#include "mesh_def.h"
#include <vector>

using namespace vcg;
using namespace std;


#define NUM_VERTICES_PER_EDGE 2
#define NUM_VERTICES_PER_FACE 3
#define NUM_FLOATS_PER_VERTEX 3

uintptr_t buildSelectedFacesCoordsVec(uintptr_t _mIn) {

	MyMesh &mIn = *((MyMesh*)_mIn);

	int numSelectedFaces = 0;

	for (MyMesh::FaceIterator fi = mIn.face.begin(); fi != mIn.face.end(); ++fi) {

		if (!fi->IsS()) continue;

		++numSelectedFaces;
	}

	float *facesCoordsVec = (float *)malloc(sizeof(float) + numSelectedFaces * NUM_VERTICES_PER_FACE * NUM_FLOATS_PER_VERTEX * sizeof(float));

	*(facesCoordsVec + 0) = (float)(numSelectedFaces);

	float *facesCoordsVecPtr = facesCoordsVec + 1;

	for (MyMesh::FaceIterator fi = mIn.face.begin(); fi != mIn.face.end(); ++fi) {

    	if (!fi->IsS()) continue;

		Point3f &p0 = fi->V(0)->P();
		Point3f &p1 = fi->V(1)->P();
		Point3f &p2 = fi->V(2)->P();

		*facesCoordsVecPtr++ = p0[0];
		*facesCoordsVecPtr++ = p0[1];
		*facesCoordsVecPtr++ = p0[2];

		*facesCoordsVecPtr++ = p1[0];
		*facesCoordsVecPtr++ = p1[1];
		*facesCoordsVecPtr++ = p1[2];

		*facesCoordsVecPtr++ = p2[0];
		*facesCoordsVecPtr++ = p2[1];
		*facesCoordsVecPtr++ = p2[2];

	}

	return (uintptr_t)((void *)facesCoordsVec);
}



uintptr_t buildSelectedPointsCoordsVec(uintptr_t _mIn) {

	MyMesh &mIn = *((MyMesh*)_mIn);

	int numSelectedPoints = 0;

	for (MyMesh::VertexIterator vi = mIn.vert.begin(); vi != mIn.vert.end(); ++vi) {

    	if (!vi->IsS()) continue;

		++numSelectedPoints;
	}

	float *pointsCoordsVec = (float *)malloc(sizeof(float) + numSelectedPoints * NUM_FLOATS_PER_VERTEX * sizeof(float));

	*(pointsCoordsVec + 0) = (float)(numSelectedPoints);

	float *pointsCoordsVecPtr = pointsCoordsVec + 1;

	for (MyMesh::VertexIterator vi = mIn.vert.begin(); vi != mIn.vert.end(); ++vi) {

		if (!vi->IsS()) continue;

		Point3f &p = vi->P();

		*pointsCoordsVecPtr++ = p[0];
		*pointsCoordsVecPtr++ = p[1];
		*pointsCoordsVecPtr++ = p[2];

	}


	return (uintptr_t)((void *)pointsCoordsVec);
}


uintptr_t buildBoundaryEdgesCoordsVec(uintptr_t _mIn) {

	MyMesh &mIn = *((MyMesh*) _mIn);

	tri::UpdateFlags<MyMesh>::FaceBorderFromNone(mIn);

	size_t numBoundaryEdges = 0;
	size_t numAdjacentFaces = 0;

	for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {

		bool isB=false;

		for(int i=0;i<3;++i) {
			if(fi->IsB(i))
			{
				isB = true;
				++numBoundaryEdges;
			}
		}

		if(isB)
		{
			++numAdjacentFaces;
        }

	}

	size_t totalSizeInBytes = sizeof(float) * (2 + (numBoundaryEdges * NUM_VERTICES_PER_EDGE * NUM_FLOATS_PER_VERTEX) +
							  (numAdjacentFaces * NUM_VERTICES_PER_FACE * NUM_FLOATS_PER_VERTEX));

	float *startBuffer = (float *)malloc(totalSizeInBytes);

	*startBuffer = (float)(numBoundaryEdges); 	// write number of boundary edges
	*(startBuffer + 1) = (float)(numAdjacentFaces);	// write number of adjacent faces

	float *coordsEdgesVecPtr = startBuffer + 2;
	float *coordsFacesVecPtr = coordsEdgesVecPtr + (numBoundaryEdges * NUM_VERTICES_PER_EDGE * NUM_FLOATS_PER_VERTEX);

	for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {

    		bool isB=false;

    		for(int i=0;i<3;++i) {
    			if(fi->IsB(i))
    			{
    				isB = true;

    				Point3f p0 = fi->V0(i)->P();
    				Point3f p1 = fi->V1(i)->P();

    				*coordsEdgesVecPtr++ = p0[0];
    				*coordsEdgesVecPtr++ = p0[1];
    				*coordsEdgesVecPtr++ = p0[2];

    				*coordsEdgesVecPtr++ = p1[0];
                    *coordsEdgesVecPtr++ = p1[1];
                    *coordsEdgesVecPtr++ = p1[2];
    			}
    		}

    		if(isB)
    		{
    			Point3f p0 = fi->V(0)->P();
                Point3f p1 = fi->V(1)->P();
                Point3f p2 = fi->V(2)->P();

    			*coordsFacesVecPtr++ = p0[0];
                *coordsFacesVecPtr++ = p0[1];
                *coordsFacesVecPtr++ = p0[2];

                *coordsFacesVecPtr++ = p1[0];
                *coordsFacesVecPtr++ = p1[1];
                *coordsFacesVecPtr++ = p1[2];

                *coordsFacesVecPtr++ = p2[0];
                *coordsFacesVecPtr++ = p2[1];
                *coordsFacesVecPtr++ = p2[2];
            }

    }


	return (uintptr_t)((void *)startBuffer);
}

/* buildFaceNormalsVec 
 * 
 * builds the three buffers needed for face normal rendering
 *  - Centroid 
 *  - Normal 
 *  - Mask
 * 
 * Centroid and Normal contains duplicated entries, and Mask is an alternating 0/1.
 * The main idea is that the length of the normal is controlled by an attribute,
 * so that the position of the endpoint of the normal is computed in the vertex shader as
 * 
 *  pos = centroid + mask*length*normal 
 * 
 */

class FaceNormalBuilder
{
  public: 
      vector<Point3f> centroidVec;
      vector<Point3f> normalVec;
      vector<float> maskVec;
      
      uintptr_t getCentroidBuf(){ return (uintptr_t)((void *)&(centroidVec[0][0])); }
      uintptr_t getNormalBuf()  { return (uintptr_t)((void *)&(normalVec[0][0])); }
      uintptr_t getMaskBuf()    { return (uintptr_t)((void *)&(maskVec[0])); }
      
void init(uintptr_t _mIn) {
	MyMesh &m = *((MyMesh*)_mIn);
        tri::RequireCompactness(m);
	tri::UpdateNormal<MyMesh>::PerFaceNormalized(m);
        centroidVec.resize(m.fn*2);
        normalVec.resize(m.fn*2);
        maskVec.resize(m.fn*2);
	for(int i=0;i<m.fn;++i) {
            centroidVec[i*2] = Barycenter(m.face[i]);
            centroidVec[i*2+1] = centroidVec[i*2];
            normalVec[i*2] = m.face[i].N();
            normalVec[i*2+1] = m.face[i].N();
            maskVec[i*2]=0;         
            maskVec[i*2+1]=1;                     
        }
}

}; // end FaceNormalBuilder class

uintptr_t buildVertexNormalsVec(uintptr_t _mIn) {

	MyMesh &mIn = *((MyMesh*)_mIn);

	tri::UpdateNormal<MyMesh>::PerVertexFromCurrentFaceNormal(mIn);
        tri::UpdateNormal<MyMesh>::NormalizePerVertex(mIn);

	size_t numBytesPointsCoords = mIn.VN() * 2 * NUM_FLOATS_PER_VERTEX * sizeof(float);
	size_t numBytesMasks = mIn.VN() * 2 * sizeof(float);
	size_t numByesNormalsCoords = mIn.VN() * 2 * NUM_FLOATS_PER_VERTEX * sizeof(float);

	float *startBuffer = (float *)malloc(numBytesPointsCoords + numBytesMasks + numByesNormalsCoords);

	float *centroidsCoordsPtr = startBuffer;
	float *masksPtr = startBuffer + numBytesPointsCoords / sizeof(float);
	float *normalsCoordsPtr = startBuffer + (numBytesPointsCoords + numBytesMasks) / sizeof(float);

	for (MyMesh::VertexIterator vi = mIn.vert.begin(); vi != mIn.vert.end(); ++vi) {

		Point3f p = vi->P();

		*centroidsCoordsPtr++ = p[0];
		*centroidsCoordsPtr++ = p[1];
		*centroidsCoordsPtr++ = p[2];

		*centroidsCoordsPtr++ = p[0];
        *centroidsCoordsPtr++ = p[1];
        *centroidsCoordsPtr++ = p[2];

		*masksPtr++ = 0;
		*masksPtr++ = 1;

		Point3f n = vi->N();

		*normalsCoordsPtr++ = n[0];
	    *normalsCoordsPtr++ = n[1];
        *normalsCoordsPtr++ = n[2];

		*normalsCoordsPtr++ = n[0];
        *normalsCoordsPtr++ = n[1];
        *normalsCoordsPtr++ = n[2];

	}

	return (uintptr_t)((void *)startBuffer);

}

uintptr_t buildAttributesVecForWireframeRendering(uintptr_t _mIn) {

	MyMesh &mIn = *((MyMesh*)_mIn);

	size_t numBytesVertices = mIn.FN() * NUM_VERTICES_PER_FACE * NUM_FLOATS_PER_VERTEX * sizeof(float);

	float *startBuffer = (float *)malloc(numBytesVertices * 2);

	float *verticesCoordsPtr = startBuffer;
	float *centersCoordsPtr = startBuffer + numBytesVertices / sizeof(float);

	for (MyMesh::FaceIterator fi = mIn.face.begin(); fi != mIn.face.end(); ++fi) {

		MyFace &fp = *fi;

        Point3f &p0 = fp.V(0)->P();
        Point3f &p1 = fp.V(1)->P();
        Point3f &p2 = fp.V(2)->P();

		*centersCoordsPtr++ = 1;
		*centersCoordsPtr++ = 0;
		*centersCoordsPtr++ = 0;

        *verticesCoordsPtr++ = p0[0];
        *verticesCoordsPtr++ = p0[1];
        *verticesCoordsPtr++ = p0[2];

		*centersCoordsPtr++ = 0;
        *centersCoordsPtr++ = 1;
        *centersCoordsPtr++ = 0;

        *verticesCoordsPtr++ = p1[0];
        *verticesCoordsPtr++ = p1[1];
        *verticesCoordsPtr++ = p1[2];

		*centersCoordsPtr++ = 0;
        *centersCoordsPtr++ = 0;
        *centersCoordsPtr++ = 1;

        *verticesCoordsPtr++ = p2[0];
        *verticesCoordsPtr++ = p2[1];
        *verticesCoordsPtr++ = p2[2];

	}

	return (uintptr_t)((void *)startBuffer);
}


#ifdef __EMSCRIPTEN__
using namespace emscripten;

//Binding code
EMSCRIPTEN_BINDINGS(DecoratorPlugin) {
    class_<FaceNormalBuilder>("FaceNormalBuilder")
    .constructor<>()
    .function("init",             &FaceNormalBuilder::init)
    .function("getCentroidBuf",   &FaceNormalBuilder::getCentroidBuf)
    .function("getNormalBuf",     &FaceNormalBuilder::getNormalBuf)
    .function("getMaskBuf",       &FaceNormalBuilder::getMaskBuf)
    ;
    
    emscripten::function("buildSelectedFacesCoordsVec", &buildSelectedFacesCoordsVec);
    emscripten::function("buildSelectedPointsCoordsVec", &buildSelectedPointsCoordsVec);
    emscripten::function("buildBoundaryEdgesCoordsVec", &buildBoundaryEdgesCoordsVec);
    emscripten::function("buildVertexNormalsVec", &buildVertexNormalsVec);
    emscripten::function("buildAttributesVecForWireframeRendering", &buildAttributesVecForWireframeRendering);
}
#endif