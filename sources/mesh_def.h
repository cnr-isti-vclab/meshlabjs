#include <stdlib.h>
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#endif
#include <vcg/complex/complex.h>
#include <vcg/complex/algorithms/update/topology.h>
#include <vcg/complex/algorithms/update/normal.h>
#include <vcg/complex/algorithms/update/quality.h>
#include <vcg/complex/algorithms/update/curvature.h>
#include <vcg/complex/algorithms/clean.h>
#include <vcg/complex/algorithms/create/platonic.h>

class MyVertex; class MyEdge; class MyFace;
struct MyUsedTypes : public vcg::UsedTypes<vcg::Use<MyVertex>   ::AsVertexType,
                                           vcg::Use<MyEdge>     ::AsEdgeType,
                                           vcg::Use<MyFace>     ::AsFaceType>{};

class MyVertex  : public vcg::Vertex< MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::Color4b,
                                                   vcg::vertex::Qualityf, vcg::vertex::VFAdj,   vcg::vertex::Mark,
                                                   vcg::vertex::Curvaturef,
                                                   vcg::vertex::BitFlags > {};
class MyFace    : public vcg::Face<   MyUsedTypes, vcg::face::FFAdj,     vcg::face::VFAdj, vcg::face::Color4b,
                                                   vcg::face::Normal3f,  vcg::face::VertexRef, vcg::face::Mark,
                                                   vcg::face::Qualityf, vcg::face::BitFlags > {};
class MyEdge    : public vcg::Edge<   MyUsedTypes> {};

class MyMesh    : public vcg::tri::TriMesh< std::vector<MyVertex>, std::vector<MyFace> , std::vector<MyEdge>  > {
public:
  vcg::Matrix44f tr;
  std::string meshName;
};

bool IsWaterTight(MyMesh &m);
