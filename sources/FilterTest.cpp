#include "mesh_def.h"
#include "FilterTest.h"

using namespace vcg;
using namespace std;

bool IsWaterTight(MyMesh &m)
{
  if(m.vn==0) return false;
  tri::UpdateTopology<MyMesh>::FaceFace(m);
  int n = tri::Clean<MyMesh>::CountNonManifoldEdgeFF(m);
  if(n!=0) return false;

  return true;
}

int main(int /*argc*/, char*/*argv*/[])
{
  CreatePluginTEST();
  MeshingPluginTEST();
  RefinePluginTEST();
  SamplingPluginTEST();
  SelectionPluginTEST();
  SmoothPluginTEST();
  printf("Done");
  return 0;
}
