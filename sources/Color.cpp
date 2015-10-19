#include "mesh_def.h"
#include "ColorHistogram.h"

#include <vcg/complex/algorithms/update/color.h>
#include <vcg/complex/algorithms/update/flag.h>
#include <vcg/complex/algorithms/geodesic.h>
#include <vcg/complex/algorithms/stat.h>

using namespace vcg;

/*
 * FIXME remove this
 */
void ColorizeByVertexQualityTEST(uintptr_t meshptr)
{
	MyMesh &m = *((MyMesh*) meshptr);
	for(MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
		if (!vi->IsD()) {
			vi->Q() = vi->cP()[0] + vi->cP()[1] + vi->cP()[2];
		}
	}
	std::pair<float, float> minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
	std::printf("Vertex quality range: %f %f\n", minmax.first, minmax.second);
	tri::UpdateColor<MyMesh>::PerVertexQualityRamp(m, minmax.first, minmax.second);

	for (MyMesh::FaceIterator fi = m.face.begin(); fi != m.face.end(); ++fi) {
		if (!fi->IsD()) {
			fi->C()[0] = std::rand()%256;
			fi->C()[1] = std::rand()%256;
			fi->C()[2] = std::rand()%256;
		}
	}
}

void ColorizeByVertexQuality(uintptr_t meshptr, float qMin, float qMax, float perc, bool zerosym)
{
	MyMesh &m = *((MyMesh*) meshptr);
	
	bool usePerc = perc > 0;	
	Histogramf H;
	tri::Stat<MyMesh>::ComputePerVertexQualityHistogram(m, H);
	float percLo = H.Percentile(perc/100.0f);
	float percHi = H.Percentile(1.0f - (perc/100.0f));
		
	if (zerosym) {
		qMin = std::min(qMin, -math::Abs(qMax));
		qMax = std::max(math::Abs(qMin), qMax);
		percLo = std::min(percLo, -math::Abs(percHi));
		percHi = std::max(math::Abs(percLo), percHi);
	}

	if (usePerc) {
		tri::UpdateColor<MyMesh>::PerVertexQualityRamp(m, percLo, percHi);
		printf("Quality Range: %f %f; Used (%f %f) percentile (%f %f)\n", H.MinV(), H.MaxV(), percLo, percHi, perc, (100.0f-perc));
	} else {
		tri::UpdateColor<MyMesh>::PerVertexQualityRamp(m, qMin, qMax);
		printf("Quality Range: %f %f; Used (%f %f)\n", H.MinV(), H.MaxV(), qMin, qMax);
	}
}

void ColorizeByBorderDistance(uintptr_t meshptr)
{
	MyMesh &m = *((MyMesh*) meshptr);
	tri::UpdateTopology<MyMesh>::VertexFace(m);
	tri::UpdateFlags<MyMesh>::FaceBorderFromVF(m);
	tri::UpdateFlags<MyMesh>::VertexBorderFromFaceBorder(m);

	bool ret = tri::Geodesic<MyMesh>::DistanceFromBorder(m);
	// Clean up
	int unreachedCnt = 0;
	for (MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
		if (vi->Q() == std::numeric_limits<float>::max()) {
			unreachedCnt++;
			vi->Q() = 0;
		}
	}
	if(unreachedCnt > 0) printf("Warning: %i vertices unreachable from borders\n", unreachedCnt);

	if (ret) {
		tri::UpdateColor<MyMesh>::PerVertexQualityRamp(m);
	} else {
		printf("Mesh has no borders. No geodesic distance was computed.\n");
	}
}

ColorHistogramf ComputeColorHistogram(uintptr_t meshptr)
{
	MyMesh &m = *((MyMesh*) meshptr); 
	ColorHistogramf ch;
	std::pair<float,float> minmax = tri::Stat<MyMesh>::ComputePerVertexQualityMinMax(m);
	ch.SetRange(minmax.first, minmax.second, 256);
	for(MyMesh::VertexIterator vi = m.vert.begin(); vi != m.vert.end(); ++vi) {
		if (!vi->IsD()) {
			ch.Add(vi->Q(), vi->C(), 1.0f);
		}
	}
	return ch;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(ColorizePlugin) {
	emscripten::function("ColorizeByVertexQualityTEST", &ColorizeByVertexQualityTEST);
	emscripten::function("ColorizeByVertexQuality", &ColorizeByVertexQuality);
	emscripten::function("ColorizeByBorderDistance", &ColorizeByBorderDistance);
	emscripten::function("ComputeColorHistogram", &ComputeColorHistogram);
}
#endif