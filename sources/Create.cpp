#include "mesh_def.h"
#include <vcg/complex/algorithms/create/platonic.h>
#include <vcg/math/perlin_noise.h>
#include <vcg/complex/algorithms/create/marching_cubes.h>
#include <vcg/complex/algorithms/create/mc_trivial_walker.h>
#include <vcg/complex/algorithms/point_sampling.h>
#include <vcg/math/gen_normal.h>

using namespace vcg;
using namespace std;

void DuplicateLayer(uintptr_t _baseM, uintptr_t _newM)
{
    MyMesh &baseM = *((MyMesh*) _baseM);
    MyMesh &newM = *((MyMesh*) _newM);
    tri::Append<MyMesh, MyMesh>::Mesh(newM, baseM);
    newM.tr = baseM.tr;
}

void AddLayerToLayer(uintptr_t _baseM, uintptr_t _newM)
{
  DuplicateLayer(_baseM,_newM);
}
void CreatePlatonic(uintptr_t _m, int index)
{
  MyMesh &m = *((MyMesh*) _m);
  switch(index)
  {
  case 0: tri::Tetrahedron(m); break;
  case 1: tri::Octahedron(m); break;
  case 2: tri::Hexahedron(m); break;
  case 3: tri::Dodecahedron(m); break;
  case 4: tri::Icosahedron(m); break;
  }
  m.UpdateBoxAndNormals();
}

void CreateSphere(uintptr_t _m, int refinement)
{
  printf("Creating a sphere with subdivision level %i\n",refinement);
  MyMesh &m = *((MyMesh*) _m);
  tri::Sphere(m,refinement);
  m.UpdateBoxAndNormals();
}

void CreateSphericalCap(uintptr_t _m, float angleDeg, int refinement)
{
  printf("Creating a spherical cap of a given angle aplitude and with specified subdivision level %i\n",refinement);
  MyMesh &m = *((MyMesh*) _m);
  tri::SphericalCap(m,math::ToRad(angleDeg), refinement);    
  m.UpdateBoxAndNormals();
}
 
void CreateTorus(uintptr_t _m, int refinement, float radiusRatio)
{
  MyMesh &m = *((MyMesh*) _m);
  printf("Creating a torus of %i %f\n",refinement, radiusRatio);
  tri::Torus(m,1.0,radiusRatio,refinement*2,refinement);
  m.UpdateBoxAndNormals();
}

void CreateSuperToroid(uintptr_t _m, float radiusRatio, float vSquare, float hSquare, int refinement)
{
    MyMesh &m = *((MyMesh*) _m);
    printf("Creating a supertoroid with subdivision level %i and ratio %f\n",refinement, radiusRatio);
    tri::SuperToroid(m,1.0, radiusRatio,vSquare,hSquare,refinement*2,refinement);
    m.UpdateBoxAndNormals();
}
void CreateSuperEllipsoid(uintptr_t _m, float rFeature, float sFeature, float tFeature, int refinement)
{
    MyMesh &m = *((MyMesh*) _m);
    printf("Creating a superellipsoid with subdivision level %i\n",refinement);
    tri::SuperEllipsoid(m,rFeature,sFeature,tFeature,refinement*2,refinement);
    m.UpdateBoxAndNormals();
}
void CreateNoisyIsosurface(uintptr_t _m, int gridSize)
{
  MyMesh &m = *((MyMesh*) _m);
  SimpleVolume<SimpleVoxel<float> > 	volume;

  typedef vcg::tri::TrivialWalker<MyMesh, SimpleVolume<SimpleVoxel<float> >	> MyWalker;
  typedef vcg::tri::MarchingCubes<MyMesh, MyWalker>	MyMarchingCubes;
  MyWalker walker;

  // Simple initialization of the volume with some cool perlin noise
  volume.Init(Point3i(gridSize,gridSize,gridSize), Box3f(Point3f(0,0,0),Point3f(1,1,1)));
  for(int i=0;i<gridSize;i++)
    for(int j=0;j<gridSize;j++)
      for(int k=0;k<gridSize;k++)
        volume.Val(i,j,k)=(j-gridSize/2)*(j-gridSize/2)+(k-gridSize/2)*(k-gridSize/2) + i*gridSize/5*(float)math::Perlin::Noise(i*.2,j*.2,k*.2);

  printf("[MARCHING CUBES] Building mesh...\n");
  MyMarchingCubes mc(m, walker);
  walker.BuildMesh<MyMarchingCubes>(m, volume, mc, (gridSize*gridSize)/10);
  m.UpdateBoxAndNormals();
}



void CreateSpherePointCloud(uintptr_t _m, int pointNum, int sphereGenTech)
{
  MyMesh &m = *((MyMesh*) _m);

  math::MarsenneTwisterRNG rng;
  m.Clear();
  std::vector<Point3f> sampleVec;

  switch(sphereGenTech)
  {
  case 0: // Montecarlo
  {
    for(int i=0;i<pointNum;++i)
      sampleVec.push_back(math::GeneratePointOnUnitSphereUniform<MyMesh::ScalarType>(rng));
  } break;
  case 1: // Poisson Disk
  {
    int oversamplingFactor =100;
    if(pointNum <= 100) oversamplingFactor = 1000;
    if(pointNum >= 10000) oversamplingFactor = 50;
    if(pointNum >= 100000) oversamplingFactor = 20;
    MyMesh tt;
    tri::Allocator<MyMesh>::AddVertices(tt,pointNum*oversamplingFactor);
    for(MyMesh::VertexIterator vi=tt.vert.begin();vi!=tt.vert.end();++vi)
      vi->P()=math::GeneratePointOnUnitSphereUniform<MyMesh::ScalarType>(rng);
    tri::UpdateBounding<MyMesh>::Box(tt);

    const float SphereArea = 4*M_PI;
    float poissonRadius = 2.0*sqrt((SphereArea / float(pointNum*2))/M_PI);
    tri::TrivialSampler<MyMesh> pdSampler(sampleVec);
    tri::SurfaceSampling<MyMesh, tri::TrivialSampler<MyMesh> >::PoissonDiskParam pp;
    tri::SurfaceSampling<MyMesh,tri::TrivialSampler<MyMesh> >::PoissonDiskPruning(pdSampler, tt, poissonRadius, pp);
  } break;
  case 2: // Disco Ball
    GenNormal<MyMesh::ScalarType>::DiscoBall(pointNum,sampleVec);
    break;
  case 3: // Recursive Oct
    GenNormal<MyMesh::ScalarType>::RecursiveOctahedron(pointNum,sampleVec);
    break;
  case 4: // Fibonacci
    GenNormal<MyMesh::ScalarType>::Fibonacci(pointNum,sampleVec);
    break;
  }
  for(size_t i=0;i<sampleVec.size();++i)
    tri::Allocator<MyMesh>::AddVertex(m,sampleVec[i],sampleVec[i]);

  m.UpdateBoxAndNormals();
}


void CreatePluginTEST()
{
  for(int i=0;i<5;++i)
  {
    MyMesh m;
    CreatePlatonic(uintptr_t(&m),i);
    assert(IsWaterTight(m));
  }

  for(int i=0;i<4;++i)
  {
  MyMesh m;
  CreateSphere(uintptr_t(&m),i);
  CreateSphericalCap(uintptr_t(&m),30+i*30,i);
  assert(IsWaterTight(m));
  }

  // Parameter space sampling
  // subdiv           8 16 32 48
  // radiusratio      0.25 0.50 0.75 1.00 .. 2.00
  for(int j=1;j<=6;++j)
    for(int i=1;i<=8;++i)
    {
      MyMesh m;
      CreateTorus(uintptr_t(&m),j*8,0.25*i);
      if(i!=4) assert(IsWaterTight(m));
      tri::RequireCompactness(m);
    }


    for(int i=1;i<=8;++i)
    {
      MyMesh m;
      CreateSuperToroid(uintptr_t(&m),1,0.25*i,0.25*i,32);
      assert(IsWaterTight(m));
      tri::RequireCompactness(m);
    }

    for(int i=1;i<=8;++i)
    {
      MyMesh m;
      CreateSuperEllipsoid(uintptr_t(&m),0.5*i,0.5*i,0.5*i,32);
      assert(IsWaterTight(m));
      tri::RequireCompactness(m);
    }
    printf("FINITO\n");
}



#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLCreatePlugin) {
    emscripten::function("CreatePlatonic", &CreatePlatonic);
    emscripten::function("CreateTorus", &CreateTorus);
    emscripten::function("CreateSuperToroid", &CreateSuperToroid);
    emscripten::function("CreateSphere", &CreateSphere);
    emscripten::function("CreateSphericalCap", &CreateSphericalCap);
    emscripten::function("CreateSpherePointCloud", &CreateSpherePointCloud);
    emscripten::function("DuplicateLayer", &DuplicateLayer);
    emscripten::function("AddLayerToLayer", &AddLayerToLayer);
    emscripten::function("CreateNoisyIsosurface", &CreateNoisyIsosurface);
    emscripten::function("CreateSuperEllipsoid", &CreateSuperEllipsoid);
}
#endif
