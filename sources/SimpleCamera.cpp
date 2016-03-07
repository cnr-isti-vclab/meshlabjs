#include <vcg/space/point3.h>
#include <vcg/space/point2.h>
#include <vcg/math/matrix44.h>
#include <vcg/space/box2.h>
#include <vector>
namespace vcg{
enum SelectionMode {
    VERTEX_SELECTION_ADD,
    VERTEX_SELECTION_SUB,
    FACE_SELECTION_ADD,
    FACE_SELECTION_SUB
};

template <class MESH_TYPE>
class SimpleCamera
{
    typedef typename MESH_TYPE::ScalarType ScalarType;
    typedef typename MESH_TYPE::CoordType CoordType;
    typedef typename MESH_TYPE::FaceIterator FaceIterator;
    typedef typename MESH_TYPE::VertexIterator VertexIterator;
    typedef typename MESH_TYPE::FacePointer  FacePointer;
    typedef typename MESH_TYPE::VertexPointer  VertexPointer;
    typedef typename MESH_TYPE::VertexType  VertexType;

    public:
        ScalarType near;
        ScalarType far;
        Point2<int> viewport;
        Point3<ScalarType> viewpoint;
        Matrix44<ScalarType> viewMatrix;
        Matrix44<ScalarType> modelMatrix;
        Matrix44<ScalarType> projMatrix;
        SimpleCamera(ScalarType n, ScalarType f, Point2<int> vport, Point3<ScalarType> vpoint, Matrix44<ScalarType> proj, Matrix44<ScalarType> view, Matrix44<ScalarType> model){
            near=n;
            far=f;
            viewport=vport;
            viewpoint=vpoint;
            modelMatrix=model.transpose();
            viewMatrix=view.transpose();
            projMatrix=proj.transpose();

        };
        Point3<ScalarType> WorldToCamera(const Point3<ScalarType>& pw){
            Point3<ScalarType> res;
            return res=viewMatrix*modelMatrix*pw;
        }
        //camera in the range [-1,1] both axes
        Point3<ScalarType> CameraToNormalisedCamera(const Point3<ScalarType>& pc){
            Point3<ScalarType> res;
            return res=projMatrix*pc;
        }
        Point2<int> NormalizedCameraToScreen(const Point3<ScalarType>& pc){
            Point2<int> ps;
            ps[0]=round(((pc[0]+1)/2)*viewport[0]);
            ps[1]=round(((1-pc[1])/2)*viewport[1]);
            return ps;
        }
        int vertSelection(MESH_TYPE &m, Box2<int> bBox, SelectionMode smode){
            int selectedVert=0;
            for(size_t i=0;i<m.vert.size();++i)
            {
                Point2<int> pvec;
                Point3<ScalarType> vert=m.vert[i].P();
                pvec=NormalizedCameraToScreen(CameraToNormalisedCamera(WorldToCamera(vert)));
                if(bBox.IsIn(pvec)){
                    selectedVert++;
                    if(smode==0||smode==2) m.vert[i].SetS();
                    else m.vert[i].ClearS();
                }
            }
            return selectedVert;
        }
};

}
