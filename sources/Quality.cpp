#include "mesh_def.h"

#include <vcg/complex/algorithms/update/color.h>
#include <vcg/complex/algorithms/update/quality.h>
#include <vcg/complex/algorithms/update/flag.h>
#include <vcg/complex/algorithms/stat.h>
#include <vcg/complex/algorithms/parametrization/distortion.h>
#include <vcg/space/fitting3.h>


using namespace vcg;

void ClampVertexQuality(uintptr_t meshptr, float qMin, float qMax, float perc, bool zerosym)
{
	MyMesh &m = *((MyMesh*) meshptr);
	
	bool usePerc = (perc > 0);
	Distribution<float> H;
	tri::Stat<MyMesh>::ComputePerVertexQualityDistribution(m, H);
	float percLo = H.Percentile(perc/100.0f);
	float percHi = H.Percentile(1.0f - (perc/100.0f));
	
	if (qMin == qMax) {
		std::pair<float, float> minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
		qMin = minmax.first;
		qMax = minmax.second;
	}

	if (zerosym) {
		qMin = std::min(qMin, -math::Abs(qMax));
		qMax = -qMin;
		percLo = std::min(percLo, -math::Abs(percHi));
		percHi = -percLo;
	}

	if (usePerc) {
		tri::UpdateQuality<MyMesh>::VertexClamp(m, percLo, percHi);
		printf("Quality Range: %f %f; Used (%f %f) percentile (%f %f)\n", H.Min(), H.Max(), percLo, percHi, perc, (100.0f-perc));
	} else {
		tri::UpdateQuality<MyMesh>::VertexClamp(m, qMin, qMax);
		printf("Quality Range: %f %f; Used (%f %f)\n", H.Min(), H.Max(), qMin, qMax);
	}
}

void SmoothVertexQuality(uintptr_t meshptr)
{
    MyMesh &m = *((MyMesh*) meshptr);
    
    tri::UpdateFlags<MyMesh>::FaceBorderFromNone(m);
    tri::Smooth<MyMesh>::VertexQualityLaplacian(m);
}

void ComputeQualityAsFaceQuality(uintptr_t meshptr, int metric)
{
    MyMesh &m = *((MyMesh*) meshptr);
    
    float minV = 0;
    float maxV = 1.0;
    Distribution<float> distrib;
    
    switch(metric){
        case 0: { // area / max edge
            minV = 0;
            maxV = sqrt(3.0f)/2.0f;
            for(MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) 
                if(!(*fi).IsD())
                    (*fi).Q() = vcg::Quality((*fi).P(0), (*fi).P(1), (*fi).P(2));
            break;
        } 
       
        case 1: { // inradius / circumradius
            for(MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi)
                if(!(*fi).IsD())
                    (*fi).Q() = vcg::QualityRadii((*fi).P(0), (*fi).P(1), (*fi).P(2));
            break;
        } 

        case 2: { // mean ratio
            for(MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi)
                if(!(*fi).IsD())
                    (*fi).Q() = vcg::QualityMeanRatio((*fi).P(0), (*fi).P(1), (*fi).P(2));
            break;
        } 

        case 3: { // AREA
            for(MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi)
                if(!(*fi).IsD())
                    (*fi).Q() = vcg::DoubleArea((*fi))*0.5f;
            tri::Stat<MyMesh>::ComputePerFaceQualityMinMax(m, minV, maxV);
            break;
        }
        default: assert(0);
    }
    
    tri::UpdateColor<MyMesh>::PerFaceQualityRamp(m, minV, maxV, false);
}

void FaceQualityFromVertex(uintptr_t meshptr)
{
    MyMesh &m = *((MyMesh*) meshptr);
    
    tri::UpdateQuality<MyMesh>::FaceFromVertex(m);
}

void VertexQualityFromFace(uintptr_t meshptr, bool areaWeighted)
{
    MyMesh &m = *((MyMesh*) meshptr);
    
    tri::UpdateQuality<MyMesh>::VertexFromFace(m, areaWeighted);
}

void QualityPluginTEST()
{

}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(QualityPlugin) {
	emscripten::function("ClampVertexQuality", &ClampVertexQuality);
        emscripten::function("SmoothVertexQuality", &SmoothVertexQuality);
        emscripten::function("ComputeQualityAsFaceQuality", &ComputeQualityAsFaceQuality);
        emscripten::function("FaceQualityFromVertex", &FaceQualityFromVertex);
        emscripten::function("VertexQualityFromFace", &VertexQualityFromFace);
}
#endif
