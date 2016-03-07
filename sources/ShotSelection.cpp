#include "mesh_def.h"

#include <vcg/space/box3.h>
#include <vcg/space/point3.h>
#include <vcg/space/point2.h>
#include <vcg/space/box2.h>
#include <vcg/math/matrix44.h>
#include "SimpleCamera.cpp"

using namespace vcg;
using namespace std;

void initSelection(uintptr_t meshptr, float near, float far, int width, int height, uintptr_t pos, uintptr_t proj, uintptr_t view, uintptr_t mod, uintptr_t box, vcg::SelectionMode smode){
    //recover useful information from javascript
    MyMesh &m = *((MyMesh*) meshptr);
    float* position=((float*)pos);
    float* projmatrix=((float*)proj);
    float* viewmatrix=((float*)view);
    float* modelmatrix=((float*)mod);
    float* bbox=((float*)box);
    //set viewport point
    Point2<int> viewport;
    viewport[0]=width;
    viewport[1]=height;
    //set viewpoint like Point3 type
    Point3<MyMesh::ScalarType> viewpoint;
    viewpoint[0]=position[0];
    viewpoint[1]=position[1];
    viewpoint[2]=position[2];
    //define world to screen projection matrixes
    Matrix44<MyMesh::ScalarType> projMatrix (projmatrix);
    Matrix44<MyMesh::ScalarType> viewMatrix (viewmatrix);
    Matrix44<MyMesh::ScalarType> modelMatrix (modelmatrix);
    //built the camera with its own parameters
    SimpleCamera<MyMesh> camera (near, far, viewport, viewpoint, projMatrix, viewMatrix,modelMatrix);
    //set selected bounding box
    int minx=(bbox[0]<=bbox[2]) ? bbox[0]:bbox[2];
    int miny=(bbox[1]<=bbox[3]) ? bbox[1]:bbox[3];
    int maxx=(bbox[0]>bbox[2]) ? bbox[0]:bbox[2];
    int maxy=(bbox[1]>bbox[3]) ? bbox[1]:bbox[3];
    Box2<int> bBox;
    bBox.Set(minx,miny,maxx,maxy);
    //selection of vertices in the bounding box
    camera.vertSelection(m, bBox,smode);
    //selection of faces with at least one vertex selected
    if(smode==2||smode==3){
        tri::UpdateSelection<MyMesh>::FaceFromVertexLoose(m);
    }
}


#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(ShotPlugin) {
    emscripten::function("initSelection", &initSelection);
    emscripten::enum_<SelectionMode>("SelectionMode")
           .value("vertexOn",  VERTEX_SELECTION_ADD)
           .value("vertexOff", VERTEX_SELECTION_SUB)
           .value("faceOn", FACE_SELECTION_ADD)
           .value("faceOff", FACE_SELECTION_SUB)
           ;
}
#endif
