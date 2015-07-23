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
  if(radius==0)
    radius = tri::SurfaceSampling<MyMesh,BaseSampler>::ComputePoissonDiskRadius(baseM,sampleNum);

  pp.pds.sampleNum = sampleNum;
  pp.randomSeed = randSeed;
  //  std::vector<Point3f> MontecarloSamples;
  MyMesh MontecarloMesh;

  // First step build the sampling
  MontecarloSampler mcSampler(MontecarloMesh);
  BaseSampler pdSampler(newM);

  if(randSeed) tri::SurfaceSampling<MyMesh,MontecarloSampler>::SamplingRandomGenerator().initialize(randSeed);
  tri::SurfaceSampling<MyMesh,MontecarloSampler>::Montecarlo(baseM, mcSampler, std::max(10000,sampleNum*20));
  tri::UpdateBounding<MyMesh>::Box(MontecarloMesh);

  printf("Using radius %f\n",radius);

  tri::SurfaceSampling<MyMesh,BaseSampler>::PoissonDiskPruning(pdSampler, MontecarloMesh, radius,pp);
}

void MontecarloSamplingML(uintptr_t _baseM, uintptr_t _newM, int sampleNum)
{
  MyMesh &baseM = *((MyMesh*) _baseM);
  MyMesh &newM = *((MyMesh*) _newM);

  typedef tri::MeshSampler<MyMesh> BaseSampler;
  MeshSampler<MyMesh> mcSampler(newM);
  tri::SurfaceSampling<MyMesh,BaseSampler>::Montecarlo(baseM, mcSampler, sampleNum);
}


void SamplingPluginTEST()
{
  for(int i=0;i<5;++i)
  {
    MyMesh m,p;
    Torus(m,10,5);
    int sampleNum = 1000+i*i*1000;
    int t0=clock();
    MontecarloSamplingML(uintptr_t(&m),uintptr_t(&p),sampleNum);
    int t1=clock();
    printf("MontecarloSamplingML  a mesh of %i f with %i sample. Obtained %i samples in %6.3f sec\n",m.fn, sampleNum,p.vn,float(t1-t0)/CLOCKS_PER_SEC);
    PoissonDiskSamplingML(uintptr_t(&m),uintptr_t(&p),0,sampleNum,0);
    int t2=clock();
    printf("PoissonDiskSamplingML a mesh of %i f with %i sample. Obtained %i samples in %6.3f sec\n",m.fn, sampleNum,p.vn,float(t2-t1)/CLOCKS_PER_SEC);
    fflush(stdout);
  }
}


#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLSamplingPlugin) {
    emscripten::function("PoissonDiskSampling", &PoissonDiskSamplingML);
    emscripten::function("MontecarloSampling", &MontecarloSamplingML);
}
#endif
