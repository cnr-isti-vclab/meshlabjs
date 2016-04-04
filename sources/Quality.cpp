#include "mesh_def.h"

#include <vcg/complex/algorithms/update/color.h>
#include <vcg/complex/algorithms/update/flag.h>
#include <vcg/complex/algorithms/stat.h>

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

void QualityPluginTEST()
{

}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(QualityPlugin) {
	emscripten::function("ClampVertexQuality", &ClampVertexQuality);
}
#endif
