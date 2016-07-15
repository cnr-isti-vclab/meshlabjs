#include "mesh_def.h"
#include "ColorHistogram.h"

using namespace vcg;
using namespace std;

#define NUM_VERTICES_PER_EDGE 2
#define NUM_VERTICES_PER_FACE 3
#define NUM_FLOATS_PER_VERTEX 3


// This function build a vector of coords that define the 24 half-edges of a box. 
// it returns a vector of 48 x 3 float.
// Ratio is the normalized lenght of two half edges: 
//    1 means that the two half edges are connected 
//    0 means that the two half edges are just points

uintptr_t buildBoxCoordVec(uintptr_t _mIn, float ratio)
{
  MyMesh &mIn = *( (MyMesh*)( _mIn));
  Point3f *vVec = new Point3f[48];
  tri::UpdateBounding<MyMesh>::Box(mIn);
  Box3f bb=mIn.bbox;
  Point3f mi=bb.min;
  Point3f ma=bb.max;
  Point3f d3=(bb.max-bb.min)*0.5*ratio;
  Point3f zz(0,0,0);
  int i=0;
  vVec[i++]=Point3f(mi[0],mi[1],mi[2]); vVec[i++]=Point3f(mi[0]+d3[0],mi[1]+zz[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],mi[1],mi[2]); vVec[i++]=Point3f(mi[0]+zz[0],mi[1]+d3[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],mi[1],mi[2]); vVec[i++]=Point3f(mi[0]+zz[0],mi[1]+zz[1],mi[2]+d3[2]);

  vVec[i++]=Point3f(ma[0],mi[1],mi[2]); vVec[i++]=Point3f(ma[0]-d3[0],mi[1]+zz[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],mi[1],mi[2]); vVec[i++]=Point3f(ma[0]+zz[0],mi[1]+d3[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],mi[1],mi[2]); vVec[i++]=Point3f(ma[0]+zz[0],mi[1]+zz[1],mi[2]+d3[2]);

  vVec[i++]=Point3f(mi[0],ma[1],mi[2]); vVec[i++]=Point3f(mi[0]+d3[0],ma[1]+zz[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],ma[1],mi[2]); vVec[i++]=Point3f(mi[0]+zz[0],ma[1]-d3[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],ma[1],mi[2]); vVec[i++]=Point3f(mi[0]+zz[0],ma[1]+zz[1],mi[2]+d3[2]);

  vVec[i++]=Point3f(ma[0],ma[1],mi[2]); vVec[i++]=Point3f(ma[0]-d3[0],ma[1]+zz[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],ma[1],mi[2]); vVec[i++]=Point3f(ma[0]+zz[0],ma[1]-d3[1],mi[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],ma[1],mi[2]); vVec[i++]=Point3f(ma[0]+zz[0],ma[1]+zz[1],mi[2]+d3[2]);

  vVec[i++]=Point3f(mi[0],mi[1],ma[2]); vVec[i++]=Point3f(mi[0]+d3[0],mi[1]+zz[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],mi[1],ma[2]); vVec[i++]=Point3f(mi[0]+zz[0],mi[1]+d3[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],mi[1],ma[2]); vVec[i++]=Point3f(mi[0]+zz[0],mi[1]+zz[1],ma[2]-d3[2]);

  vVec[i++]=Point3f(ma[0],mi[1],ma[2]); vVec[i++]=Point3f(ma[0]-d3[0],mi[1]+zz[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],mi[1],ma[2]); vVec[i++]=Point3f(ma[0]+zz[0],mi[1]+d3[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],mi[1],ma[2]); vVec[i++]=Point3f(ma[0]+zz[0],mi[1]+zz[1],ma[2]-d3[2]);

  vVec[i++]=Point3f(mi[0],ma[1],ma[2]); vVec[i++]=Point3f(mi[0]+d3[0],ma[1]+zz[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],ma[1],ma[2]); vVec[i++]=Point3f(mi[0]+zz[0],ma[1]-d3[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(mi[0],ma[1],ma[2]); vVec[i++]=Point3f(mi[0]+zz[0],ma[1]+zz[1],ma[2]-d3[2]);

  vVec[i++]=Point3f(ma[0],ma[1],ma[2]); vVec[i++]=Point3f(ma[0]-d3[0],ma[1]+zz[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],ma[1],ma[2]); vVec[i++]=Point3f(ma[0]+zz[0],ma[1]-d3[1],ma[2]+zz[2]);
  vVec[i++]=Point3f(ma[0],ma[1],ma[2]); vVec[i++]=Point3f(ma[0]+zz[0],ma[1]+zz[1],ma[2]-d3[2]);
  
  assert(i==48);
  return (uintptr_t)((void *)vVec);
}

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

uintptr_t buildNonManifoldEdgeCoordsVec(uintptr_t _mIn) {

    MyMesh &mIn = *((MyMesh*) _mIn);

    tri::UpdateTopology<MyMesh>::FaceFace(mIn);

    set<std::pair<MyVertex*,MyVertex*>> edgeSet;

    size_t numNonManifEdges = 0;
    size_t numAdjacentFaces = 0;

    for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {
      if(!(*fi).IsD()) {
        for(int i=0;i<3;++i)
        {
           face::Pos<MyFace> pos(&*fi,i);
           const int faceOnEdgeNum =  min(pos.NumberOfFacesOnEdge(),4);

           if(faceOnEdgeNum == 2 || faceOnEdgeNum == 1) continue;

           bool edgeNotPresent; // true if the edge was not present in the set
           if ( (*fi).V0(i)<(*fi).V1(i)) edgeNotPresent = edgeSet.insert(make_pair((*fi).V0(i),(*fi).V1(i))).second;
           else edgeNotPresent = edgeSet.insert(make_pair((*fi).V1(i),(*fi).V0(i))).second;

           if(edgeNotPresent){
              ++numNonManifEdges;
           }

           ++numAdjacentFaces;
        }
      }
    }

    edgeSet.clear();

    size_t totalSizeInBytes = sizeof(float) * (2 +
                              numNonManifEdges * NUM_VERTICES_PER_EDGE * NUM_FLOATS_PER_VERTEX +
                              numAdjacentFaces * NUM_VERTICES_PER_FACE * NUM_FLOATS_PER_VERTEX);

    float *startBuffer = (float *)malloc(totalSizeInBytes);

    *startBuffer = (float)(numNonManifEdges);// write number of non manifold edges
    *(startBuffer + 1) = (float)(numAdjacentFaces);	// write number of adjacent faces

    if (numNonManifEdges == 0) {
        return (uintptr_t)((void *)startBuffer);
    }

    float *coordsEdgesVecPtr = startBuffer + 2;
    float *coordsFacesVecPtr = coordsEdgesVecPtr + (numNonManifEdges * NUM_VERTICES_PER_EDGE * NUM_FLOATS_PER_VERTEX);

    for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {
          if(!(*fi).IsD()) {
            for(int i=0;i<3;++i)
            {
               face::Pos<MyFace> pos(&*fi,i);
               const int faceOnEdgeNum =  min(pos.NumberOfFacesOnEdge(),4);

               if(faceOnEdgeNum == 2 || faceOnEdgeNum == 1) continue;

               bool edgeNotPresent; // true if the edge was not present in the set
               if ( (*fi).V0(i)<(*fi).V1(i)) edgeNotPresent = edgeSet.insert(make_pair((*fi).V0(i),(*fi).V1(i))).second;
               else edgeNotPresent = edgeSet.insert(make_pair((*fi).V1(i),(*fi).V0(i))).second;

               Point3f p0, p1, p2;

               p0 = fi->V0(i)->P();
               p1= fi->V1(i)->P();
               p2= fi->V2(i)->P();

               if(edgeNotPresent){
                    *coordsEdgesVecPtr++ = p0[0];
                    *coordsEdgesVecPtr++ = p0[1];
                    *coordsEdgesVecPtr++ = p0[2];

                    *coordsEdgesVecPtr++ = p1[0];
                    *coordsEdgesVecPtr++ = p1[1];
                    *coordsEdgesVecPtr++ = p1[2];
               }

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
    }

    return (uintptr_t)((void *)startBuffer);
}

uintptr_t buildNonManifoldVertexCoordsVec(uintptr_t _mIn) {

    MyMesh &mIn = *((MyMesh*) _mIn);

    //mIn.face.EnableFFAdjacency();
    tri::UpdateTopology<MyMesh>::FaceFace(mIn);
    tri::SelectionStack<MyMesh> ss(mIn);
    ss.push();

    tri::UpdateSelection<MyMesh>::VertexClear(mIn);
    tri::Clean<MyMesh>::CountNonManifoldVertexFF(mIn,true);
    tri::UpdateFlags<MyMesh>::VertexClearV(mIn);

    size_t numNonManifVerts = 0;
    size_t numAdjacentFaces = 0;

    for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {
        if(!(*fi).IsD()) {
            for(int i=0;i<3;++i)
            {
                if((*fi).V(i)->IsS())
                {
                    if(!(*fi).V0(i)->IsV())
                    {
                           ++numNonManifVerts;
                           (*fi).V0(i)->SetV();
                    }

                    ++numAdjacentFaces;
                }
            }
        }
    }

    tri::UpdateFlags<MyMesh>::VertexClearV(mIn);

    size_t totalSizeInBytes = sizeof(float) * (2 +
                                    numNonManifVerts * NUM_FLOATS_PER_VERTEX +
                                    numAdjacentFaces * NUM_VERTICES_PER_FACE * NUM_FLOATS_PER_VERTEX);

    float *startBuffer = (float *)malloc(totalSizeInBytes);

    *startBuffer = (float)(numNonManifVerts);// write number of non manifold vertices
    *(startBuffer + 1) = (float)(numAdjacentFaces);	// write number of adjacent faces

    if (numNonManifVerts == 0) {
        return (uintptr_t)((void *)startBuffer);
    }

    float *coordsVecPtr = startBuffer + 2;
    float *coordsFacesVecPtr = coordsVecPtr + (numNonManifVerts * NUM_FLOATS_PER_VERTEX);

    for(MyMesh::FaceIterator fi=mIn.face.begin(); fi!=mIn.face.end(); ++fi) {
        if(!(*fi).IsD()) {
            for(int i=0;i<3;++i)
            {
                 if((*fi).V(i)->IsS())
                 {
                    if(!(*fi).V0(i)->IsV())
                    {
                        Point3f p = fi->V0(i)->P();
                        *coordsVecPtr++ = p[0];
                        *coordsVecPtr++ = p[1];
                        *coordsVecPtr++ = p[2];
                        (*fi).V0(i)->SetV();
                    }

                    Point3f p0 = fi->V0(i)->P();
                    Point3f p1= fi->V1(i)->P(); //(fi->V0(i)->P() + fi->V1(i)->P())/2.0f;
                    Point3f p2= fi->V2(i)->P(); //(fi->V0(i)->P() + fi->V2(i)->P())/2.0f;

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
        }
    }

    ss.pop();
    return (uintptr_t)((void *)startBuffer);
}

uintptr_t buildBitBorderEdgesCoordsVec(uintptr_t _mIn) {
    MyMesh &mIn = *((MyMesh*) _mIn);    

    size_t numBoundaryEdges = 0;
    size_t numBoundaryFaces = 0;

    for (MyMesh::FaceIterator fi = mIn.face.begin(); fi != mIn.face.end(); ++fi) {
        bool isB = false;

        for (int i = 0; i < 3; ++i) {
            if (fi->IsB(i)) {
                isB = true;
                ++numBoundaryEdges;
            }
        }
        if (isB)  ++numBoundaryFaces;
    }

    size_t totalSizeInBytes = sizeof (float) * (2 + (numBoundaryEdges * NUM_VERTICES_PER_EDGE * NUM_FLOATS_PER_VERTEX) +
            (numBoundaryFaces * NUM_VERTICES_PER_FACE * NUM_FLOATS_PER_VERTEX));

    float *startBuffer = (float *) malloc(totalSizeInBytes);

    *startBuffer = (float) (numBoundaryEdges); // write number of boundary edges
    *(startBuffer + 1) = (float) (numBoundaryFaces); // write number of adjacent faces

    float *coordsEdgesVecPtr = startBuffer + 2;
    float *coordsFacesVecPtr = coordsEdgesVecPtr + (numBoundaryEdges * NUM_VERTICES_PER_EDGE * NUM_FLOATS_PER_VERTEX);

    for (MyMesh::FaceIterator fi = mIn.face.begin(); fi != mIn.face.end(); ++fi) {

        bool isB = false;

        for (int i = 0; i < 3; ++i) {
            if (fi->IsB(i)) {
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

        if (isB) {
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

    return (uintptr_t) ((void *) startBuffer);
}

uintptr_t buildBoundaryEdgesCoordsVec(uintptr_t _mIn) {
    MyMesh &mIn = *((MyMesh*) _mIn);

    tri::UpdateFlags<MyMesh>::FaceBorderFromNone(mIn);
    return  buildBitBorderEdgesCoordsVec(_mIn);
}

uintptr_t buildTextureSeamCoordVector(uintptr_t _mIn) {
    MyMesh &mIn = *((MyMesh*) _mIn);

    tri::UpdateTopology<MyMesh>::FaceFaceFromTexCoord(mIn);
    tri::UpdateFlags<MyMesh>::FaceBorderFromFF(mIn);
    return buildBitBorderEdgesCoordsVec(_mIn);
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

ColorHistogramf ComputeColorHistogram(
		uintptr_t meshptr, bool vertexQuality, int binNum, bool areaWeighted, bool customRange, float rangeMin, float rangeMax)
{
	MyMesh &m = *((MyMesh*) meshptr); 
	ColorHistogramf ch;

	if (binNum <= 2) {
		binNum = 2;
		printf("Warning(Histogram): forcing bin number to %d\n", binNum);
	}

	std::pair<float,float> minmax;
	if (customRange) {
		minmax.first = rangeMin;
		minmax.second = rangeMax;
	} else {
		if (vertexQuality) minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
		else minmax = tri::Stat<MyMesh>::ComputePerFaceQualityMinMax(m);
	}

	ch.SetRange(minmax.first, minmax.second, binNum);

	if (vertexQuality) {
		if (areaWeighted) {
			for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
				if (!fi->IsD()) {
					float contribution = DoubleArea(*fi)/6.0f;
					for (int i = 0; i < 3; ++i) ch.Add(fi->V(i)->Q(), fi->V(i)->C(), contribution);
				}
			}
		} else {
			for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
				if (!vi->IsD()) ch.Add(vi->Q(), vi->C(), 1.0f);
			}
		}
	} else {
		if (areaWeighted) {
			for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
				if (!fi->IsD()) ch.Add(fi->Q(), fi->C(), DoubleArea(*fi)*0.5f);
			}
		} else {
			for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
				if (!fi->IsD()) ch.Add(fi->Q(), fi->C(), 1.0f);
			}
		}
	}

	for(MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
		if (!vi->IsD()) {
			ch.Add(vi->Q(), vi->C(), 1.0f);
		}
	}
	return ch;
}

float qualityMin(uintptr_t meshptr) {
    MyMesh &m = *((MyMesh*) meshptr);
    std::pair<float, float> minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
    return minmax.first;
}

float qualityMax(uintptr_t meshptr) {
    MyMesh &m = *((MyMesh*) meshptr);
    std::pair<float, float> minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
    return minmax.second;
}

uintptr_t buildVertexQualityVec(uintptr_t _mIn) {
    MyMesh &mIn = *((MyMesh*)_mIn);

    size_t numBytesVertices = mIn.VN() * sizeof(float);

    float *vec = (float *) malloc(numBytesVertices);

    int i = 0;

    for (MyMesh::VertexIterator vi = mIn.vert.begin(); vi != mIn.vert.end(); ++vi) 
        vec[i++] = vi->Q();
    
    return (uintptr_t) ((void *)vec);
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
    emscripten::function("buildTextureSeamCoordVector", &buildTextureSeamCoordVector);
    emscripten::function("buildNonManifoldVertexCoordsVec", &buildNonManifoldVertexCoordsVec);
    emscripten::function("buildNonManifoldEdgeCoordsVec", &buildNonManifoldEdgeCoordsVec);
    emscripten::function("buildVertexNormalsVec", &buildVertexNormalsVec);
    emscripten::function("buildAttributesVecForWireframeRendering", &buildAttributesVecForWireframeRendering);
    emscripten::function("buildBoxCoordVec", &buildBoxCoordVec);
    emscripten::function("ComputeColorHistogram", &ComputeColorHistogram);
    emscripten::function("buildVertexQualityVec", &buildVertexQualityVec);
    emscripten::function("qualityMin", &qualityMin);
    emscripten::function("qualityMax", &qualityMax);
}
#endif
