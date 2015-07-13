#include "mesh_def.h"
#include <vcg/complex/algorithms/point_sampling.h>

using namespace vcg;
using namespace std;

void PoissonDiskSamplingML(uintptr_t _baseM, uintptr_t _newM, float radius, int sampleNum, int randSeed)
{
  MyMesh &baseM = *((MyMesh*) _baseM);
  MyMesh &newM = *((MyMesh*) _newM);

  typedef tri::MeshSampler<MyMesh> BaseSampler;
  typedef tri::MeshSampler<MyMesh> MontecarloSampler;

  tri::SurfaceSampling<MyMesh, BaseSampler>::PoissonDiskParam pp;
  if(radius>0 && sampleNum==0) sampleNum = tri::SurfaceSampling<MyMesh,BaseSampler>::ComputePoissonSampleNum(baseM,radius);

  pp.pds.sampleNum = sampleNum;
  pp.randomSeed = randSeed;
  //  std::vector<Point3f> MontecarloSamples;
  MyMesh MontecarloMesh;

  // First step build the sampling
  MontecarloSampler mcSampler(MontecarloMesh);
  BaseSampler pdSampler(newM);

  if(randSeed) tri::SurfaceSampling<MyMesh,MontecarloSampler>::SamplingRandomGenerator().initialize(randSeed);
  tri::SurfaceSampling<MyMesh,MontecarloSampler>::Montecarlo(baseM, mcSampler, std::max(10000,sampleNum*40));
  tri::UpdateBounding<MyMesh>::Box(MontecarloMesh);
//  tri::Build(MontecarloMesh, MontecarloSamples);

  if(sampleNum==0) tri::SurfaceSampling<MyMesh,BaseSampler>::PoissonDiskPruning(pdSampler, MontecarloMesh, radius,pp);
  else tri::SurfaceSampling<MyMesh,BaseSampler>::PoissonDiskPruningByNumber(pdSampler, MontecarloMesh, sampleNum, radius,pp);
}

void MontecarloSamplingML(uintptr_t _baseM, uintptr_t _newM, int sampleNum)
{
  MyMesh &baseM = *((MyMesh*) _baseM);
  MyMesh &newM = *((MyMesh*) _newM);

  typedef tri::MeshSampler<MyMesh> BaseSampler;
  MeshSampler<MyMesh> mcSampler(newM);
  tri::SurfaceSampling<MyMesh,BaseSampler>::Montecarlo(baseM, mcSampler, sampleNum);
}

#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLSamplingPlugin) {
    emscripten::function("PoissonDiskSampling", &PoissonDiskSamplingML);
    emscripten::function("MontecarloSampling", &MontecarloSamplingML);
}
#endif
