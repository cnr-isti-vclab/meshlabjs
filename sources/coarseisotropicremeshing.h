#ifndef COARSEISOTROPICREMESHING_H
#define COARSEISOTROPICREMESHING_H
#endif // COARSEISOTROPICREMESHING_H
#include<vcg/complex/algorithms/update/quality.h>
#include<vcg/complex/algorithms/update/curvature.h>
#include<vcg/complex/algorithms/update/normal.h>
#include<vcg/complex/algorithms/refine.h>
#include<vcg/complex/algorithms/stat.h>
#include<vcg/complex/algorithms/smooth.h>
#include<vcg/complex/algorithms/local_optimization/tri_edge_collapse.h>
#include<vcg/space/index/spatial_hashing.h>

using namespace vcg;
using namespace std;

typedef  face::Pos<MyFace> MyPos;
typedef  BasicVertexPair<MyVertex> MyPair;
typedef  EdgeCollapser<MyMesh, BasicVertexPair<MyVertex>> MyCollapser;
typedef  GridStaticPtr<MyFace, float> MyGrid;
typedef  MyMesh::PerVertexAttributeHandle<int> CornerMap;

struct params {
    float maxLength;
    float minLength;
    float crease;  //cos of the crease threshold
    bool adapt;
} params;


// My lerp (vcg does not implement lerp on scalars as of 30-01-2017)
inline float lerp (float a, float b, float lambda)
{
    math::Clamp(lambda, 0.f, 1.f);
    return a * lambda + (1-lambda) * b;
}
// this returns the value of cos(a) where a is the angle between n0 and n1.
inline float fastAngle(Point3f n0, Point3f n1)
{
    return math::Clamp(n0*n1, -1.f, 1.f);
}

inline bool testCreaseEdge(MyPos &p)
{
    float angle = fastAngle(NormalizedTriangleNormal(*(p.F())), NormalizedTriangleNormal(*(p.FFlip())));
    return (angle <= params.crease && angle >= -params.crease);
}

//here i could also compute corners by using a temp vertexhandle to store the num of incident edges on a vert
//and a bitflag to store the corner bit on vertices
void computeVertexCrease(MyMesh &m, float crease, int creaseBitFlag)
{
    tri::UpdateFlags<MyMesh>::VertexClear(m, creaseBitFlag);
    tri::UpdateFlags<MyMesh>::FaceClearV(m);

    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
            for(auto i=0; i<3; ++i)
            {
                MyPos pi(&*fi, i);
                if(!pi.FFlip()->IsV()) // edge not visited already
                {
                    if(testCreaseEdge(pi))
                    {
                        pi.V()->SetUserBit(creaseBitFlag);
                        pi.VFlip()->SetUserBit(creaseBitFlag);
                    }
                }
            }
            (*fi).SetV();
        }
}

void computeVertexCreaseAndCorner(MyMesh &m, int creaseBitFlag)
{
    tri::UpdateSelection<MyMesh>::VertexClear(m);
    tri::UpdateFlags<MyMesh>::VertexClear(m, creaseBitFlag);
    CornerMap h = tri::Allocator<MyMesh>::GetPerVertexAttribute<int>(m);

    for(auto vi=m.vert.begin(); vi!=m.vert.end(); ++vi)
        h[vi] = 0;

    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
            for(auto i=0; i<3; ++i)
            {
                MyPos pi(&*fi, i);

                if(testCreaseEdge(pi))
                {
                    pi.V()->SetUserBit(creaseBitFlag);
                    pi.VFlip()->SetUserBit(creaseBitFlag);
                    ++h[tri::Index(m, pi.V())];
                }
                pi.FlipE();            // need to flip edge to visit all the incident edges for each vert
                if(testCreaseEdge(pi))
                {
                    pi.V()->SetUserBit(creaseBitFlag);
                    pi.VFlip()->SetUserBit(creaseBitFlag);
                    ++h[tri::Index(m, pi.V())];
                }
            }
        }
    //in a manifold mesh every edge is share by 2 faces => every crease adds 2 to its vertices handles
    //if a vertex has more than 2 incident crease edges is a corner => if h[vi] > 4 it is corner
    for(auto vi=m.vert.begin(); vi!=m.vert.end(); ++vi)
        if(h[vi] > 4)
            (*vi).SetS();

}
//same as before... won't probably use this version..
void selectCreaseCorners(MyMesh &m)
{
    tri::UpdateSelection<MyMesh>::VertexClear(m);
    CornerMap h = tri::Allocator<MyMesh>::GetPerVertexAttribute<int>(m);

    for(auto vi=m.vert.begin(); vi!=m.vert.end(); ++vi)
        h[vi] = 0;

    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
            for(auto i=0; i<3; ++i)
            {
                MyPos pi(&*fi, i);

                if(testCreaseEdge(pi))
                    ++h[tri::Index(m, pi.V())];

                pi.FlipE();

                if(testCreaseEdge(pi))
                    ++h[tri::Index(m, pi.V())];
            }
        }
    //now every crease added 2 to the vertex handle => if h[i] > 4 then corner
    for(auto vi=m.vert.begin(); vi!=m.vert.end(); ++vi)
        if(h[vi] > 4)
            (*vi).SetS();

}

//this can be deleted of course
inline int ComputeValence(MyPos &p)
{
    return p.NumberOfIncidentVertices();
}

/*
 Computes the ideal valence for the vertex in pos p:
 4 for border vertices
 6 for internal vertices
*/
inline int idealValence(MyPos p)
{
    if(p.IsBorder()) return 4;
    return 6;
}

float computeMeanValence(MyMesh &m)
{
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::UpdateFlags<MyMesh>::VertexClearV(m);
    int total = 0, count = 0, totalOff = 0;

    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
            for(int i=0; i<3; ++i)
            {
                MyPos p(&*fi, i);
                if(!p.V()->IsV())
                {
                    total += p.NumberOfIncidentVertices();
                    totalOff += abs(idealValence(p)-p.NumberOfIncidentVertices());
                    p.V()->SetV();
                    ++count;
                }
            }
        }
    printf("MEAN IDEAL VALENCE OFFSET: %.15f\n", ((float)totalOff/(float)count));
    return (float) total / (float) count;
}
/*
    Edge Swap Step:
    This method optimizes the valence of each vertex.
    oldDist is the sum of the absolute distance of each vertex from its ideal valence
    newDist is the sum of the absolute distance of each vertex from its ideal valence after
    the edge swap.
    If the swap decreases the total absolute distance, then it's applied, preserving the triangle
    quality.                        +1
            v1                    v1
           / \                   /|\
          /   \                 / | \
         /     \               /  |  \
        /    _*p\           -1/   |   \ -1
      v2--------v0 ========> v2   |   v0
       \        /             \   |   /
        \      /               \  |  /
         \    /                 \ | /
          \  /                   \|/ +1
           v3                     v3
        Before Swap             After Swap
*/

bool testSwap(MyPos p)
{
    //if border or feature, do not swap
    //    if(p.IsBorder() || !p.IsFaux()) return false;
    //  if(p.IsBorder() || p.V()->IsUserBit(creaseBitFlag) || p.VFlip()->IsUserBit(creaseBitFlag)) return false;
    if(p.IsBorder() || testCreaseEdge(p)) return false;


    int oldDist = 0, newDist = 0, idealV, actualV;

    MyPos tp=p;

    MyVertex *v0=tp.V();
    idealV  = idealValence(tp); actualV = tp.NumberOfIncidentVertices();
    oldDist += abs(idealV - actualV); newDist += abs(idealV - (actualV - 1));

    tp.FlipF();tp.FlipE();tp.FlipV();
    MyVertex *v1=tp.V();
    idealV  = idealValence(tp); actualV = tp.NumberOfIncidentVertices();
    oldDist += abs(idealV - actualV); newDist += abs(idealV - (actualV + 1));

    tp.FlipE();tp.FlipV();tp.FlipE();
    MyVertex *v2=tp.V();
    idealV  = idealValence(tp); actualV = tp.NumberOfIncidentVertices();
    oldDist += abs(idealV - actualV); newDist += abs(idealV - (actualV - 1));

    tp.FlipF();tp.FlipE();tp.FlipV();
    MyVertex *v3=tp.V();
    idealV  = idealValence(tp); actualV = tp.NumberOfIncidentVertices();
    oldDist += abs(idealV - actualV); newDist += abs(idealV - (actualV + 1));

    float qOld = std::min(Quality(v0->P(),v2->P(),v3->P()),Quality(v0->P(),v1->P(),v2->P()));
    float qNew = std::min(Quality(v0->P(),v1->P(),v3->P()),Quality(v2->P(),v3->P(),v1->P()));

    return (newDist < oldDist && qNew >= qOld * 0.50f) ||
            (newDist == oldDist && qNew >= qOld * 1.1f) || qNew > 1.5f * qOld;
}

// Edge swap step: edges are flipped in order to optimize valence and triangle quality across the mesh
void ImproveValence(MyMesh &m, float crease)
{
    tri::UpdateTopology<MyMesh>::FaceFace(m); //collapser does not update FF

    //    computeVertexCrease(m, crease, creaseBitFlag);
    tri::UpdateFlags<MyMesh>::FaceClearV(m);
    int swapCnt=0;
    for(auto fi=m.face.begin();fi!=m.face.end();++fi)
        if(!(*fi).IsD())
        {
            for(int i=0;i<3;++i)
            {
                MyPos pi(&*fi,i);

                if(!pi.FFlip()->IsV())
                    if(testSwap(pi) &&
                            face::CheckFlipEdgeNormal(*fi, i, math::ToRad(crease)) &&
                            face::CheckFlipEdge(*fi,i) )
                    {
                        face::FlipEdge(*fi,i);
                        swapCnt++;
                    }
            }
            fi->SetV();
        }

    printf("Performed %i swaps\n",swapCnt);
}
inline float maxLength(float length)
{
    return (4.0f/3.0f)*length;
}

inline float minLength(float length)
{
    return (4.0f/5.0f)*length;
}

// The predicate that defines which edges should be split
class EdgeSplitPred
{
public:
    float length, min, max;
    bool adapt;
    bool operator()(MyPos &ep) const
    { //could adjust mult on corners..accumulation of vertices is cause of nnonmanifoldnes
        float mult = (adapt)? lerp(0.8f, 1.2f, (((math::Abs(ep.V()->Q())+math::Abs(ep.VFlip()->Q()))/2.f)/(max-min))) : 1.f;
        return vcg::Distance(ep.V()->P(), ep.VFlip()->P()) > mult*length ;
    }
};

void SplitLongEdges(MyMesh &m, bool adapt, float length)
{
    tri::UpdateTopology<MyMesh>::FaceFace(m);

    float min,max;

    if(adapt) //if not adaptive, do not compute quality
    {
        Distribution<float> distr;
        tri::Stat<MyMesh>::ComputePerVertexQualityDistribution(m,distr);

        max = distr.Percentile(0.9f);
        min = distr.Percentile(0.1f);
    }

    tri::MidPoint<MyMesh> midFunctor(&m);
    EdgeSplitPred ep;
    ep.min    = min;
    ep.max    = max;
    ep.adapt  = adapt;
    ep.length = maxLength(length);

    //RefineE updates FF topology after doing the refine (not needed in collapse then)
    tri::RefineE(m,midFunctor,ep);
    printf("Split done\n");
}

//if using bitflags checking the creases is not needed! (thecorner is i think)
bool checkFacesAroundVert(MyPos &p, Point3f &mp, float length)
{
    vector<MyFace*> ff;
    vector<int> vi;

    MyVertex *v1 = p.F()->V1(p.VInd());
    MyVertex *v2 = p.F()->V2(p.VInd());

    face::VFStarVF<MyFace>(p.V(), ff, vi);

    int creases = 0;
    Point3f faceNormal = NormalizedTriangleNormal(*(p.F()));

    for(MyFace *f: ff)
        if(f != p.F())
    {
        MyPos pi(f, p.V()); //same vertex
        //check that collapse do not introduce to long edges
        if(Distance(mp, pi.VFlip()->P()) > length)
            return false;
        if(pi.VFlip()->IsS()) //corner
            return false;

        //-------------proposal: prova a fare tutto qui (crease e corner detection)----------
//        float angle = fastAngle(faceNormal, NormalizedTriangleNormal(*(pi.F())));
//        if(angle <= params.crease && angle >= -params.crease)
//        {
////                this is a crease edge on p.F()
//            if(pi.VFlip() == v1 || pi.VFlip() == v2)
//                ++creases;
//            else
//                return false; //crease on another face touching the vert..can't move this vert
//        }
        //-----------------------------------------------------------------------------------

//        if(pi.VFlip() == v1 || pi.VFlip() == v2) // se sono una faccia adiacente
//        {
//            float angle = fastAngle(faceNormal, NormalizedTriangleNormal(*(pi.F())));
//            if(angle <= params.crease && angle >= -params.crease)
//                ++creases;
//        }

        pi.FlipE();
        //check that collapse do not introduce to long edges
        if(Distance(mp, pi.VFlip()->P()) > length)
            return false;
        if(pi.VFlip()->IsS()) //corner
            return false;
//------------------------------------------------------------------------------------------------
//        if(angle <= params.crease && angle >= -params.crease)
//        {
////                this is a crease edge on p.F()
//            if(pi.VFlip() == v1 || pi.VFlip() == v2)
//                ++creases;
//            else
//                return false; //crease on another face touching the vert..can't move this vert
//        }
//------------------------------------------------------------------------------------------------


//        if(pi.VFlip() == v1 || pi.VFlip() == v2) // se sono una faccia adiacente
//        {
//            float angle = fastAngle(faceNormal, NormalizedTriangleNormal(*(pi.F())));
//            if(angle <= params.crease && angle >= -params.crease)
//                ++creases;
//        }

        //like this i check if the triangle iis on a corner
        //if i had a check on the "crease normals" i could check if tri
        if(creases > 1)
        {
            printf("corner!\n");
            return false;
        }
    }
    return true;
}

// Collapse test: Usual collapse test plus borders and adaptivity management
bool testCollapse(MyPos &p, Point3f &mp, float min, float max, float length, bool adapt)
{
    float mult = (adapt) ? lerp(0.8f, 1.2f, (((math::Abs(p.V()->Q())+math::Abs(p.VFlip()->Q()))/2.f)/(max-min))) : 1.f;
    float dist = Distance(p.V()->P(), p.VFlip()->P());
    if(dist < mult*minLength(length))//if to collapse
    {
//        vector<MyVertex*> vv;

//        face::VVStarVF<MyFace>(p.V(), vv);
//        face::VVOrderedStarFF<MyFace>(p, vv);

//        for(MyVertex *v: vv)
//            if(Distance(mp, v->P()) > mult*maxLength(length))
        if(!checkFacesAroundVert(p, mp, mult*maxLength(length)))
            return false;

        p.FlipV();

//        face::VVStarVF<MyFace>(p.V(), vv);
//        face::VVOrderedStarFF<MyFace>(p, vv);

//        for(MyVertex *v: vv)
            //            if(Distance(mp, v->P()) > mult*maxLength(length))
        if(!checkFacesAroundVert(p, mp, mult*maxLength(length)))
            return false;

        return true;    
    }
    return false;
}

void CollapseShortEdges(MyMesh &m, bool adapt, int creaseBitFlag, float length)
{
    float min,max;
    int count = 0, candidates = 0;

    if(adapt)
    {
        Distribution<float> distr;
        tri::Stat<MyMesh>::ComputePerVertexQualityDistribution(m,distr);


        max = distr.Percentile(0.9f);
        min = distr.Percentile(0.1f);
    }

    computeVertexCreaseAndCorner(m, creaseBitFlag); //this uses the selection bit to flag corners!!!

    //if using edgecollapser;
    //tri::UpdateTopology<MyMesh>::ClearFaceFace(m);
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    int oncorner = 0;
    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
           //per ora se tocchi un corner non collassare...pensa a cosa più elegante (sembra non bastare tra l'altro
            if((*fi).V0(0)->IsS() || (*fi).V1(0)->IsS() || (*fi).V2(0)->IsS())
            {
                ++oncorner;
                continue;
            }

            for(auto i=0; i<3; ++i)
            {
                //if using edgecollapser;
                MyPos pi(&*fi, i);
                if(pi.V()->IsD() || pi.VFlip()->IsD())
                    continue;
                //---------ALT FF-----------//
                //being forced to always collaps on a vertex is a limitation if my observation are right..
                // discuss about them with prof!
//                MyVertex *v0 = (*fi).V0(i); //pi.V()
//                MyVertex *v1 = (*fi).V1(i);// pi.VFlip()

//                if(v0->IsUserBit(creaseBitFlag) && v1->IsUserBit(creaseBitFlag) &&
//                        !v0->IsS() && !v1->IsS())
//                {
//                    if(testCollapse(pi, v1->P(), min, max, length, adapt) && face::FFLinkCondition(*fi, i))
//                    {
//                        face::FFEdgeCollapse(m, *fi, i);
//                        ++count;
//                        break;
//                    }
//                }

                //----------ALT-MIGLIORE--------------//
                //adaptive fast gets messy, spawning nonmanifold edges...shouldn't it be avoided by linkconditions?
                //like this, the uniform version seems almost good, adaptive is still  problematic sometimes,
                //but overall seems to work: bad edges in trim star are collapsed, doing uniforma fter adaptive collapses the small edges
                //even after 1 step it creates T intersections ... i'm doing something wrong somewherE!!!!!
                //both on crease...inside we do check on corners
                if(pi.V()->IsUserBit(creaseBitFlag) && pi.VFlip()->IsUserBit(creaseBitFlag) &&
                        !pi.V()->IsS() && !pi.VFlip()->IsS())
                {
                    ++candidates;
                    MyPair bp(pi.V(), pi.VFlip());

                    Point3f mp;
                    //if one is corner choose the collapse point accordingly
                    if(pi.V()->IsS())
                        mp = pi.V()->P();
                    else if(pi.VFlip()->IsS())
                        mp = pi.VFlip()->P();
                    else
                        mp = (bp.V(1)->P()+bp.V(0)->P())/2.f;

                    if(testCollapse(pi, mp, min, max, length, adapt) && MyCollapser::LinkConditions(bp))
                    {
                        MyCollapser::Do(m, bp, mp);
                        ++count;
                        break;
                    }
                }


                //no crease and no border on both vert => internal edge
                if(!pi.V()->IsUserBit(creaseBitFlag) && !pi.VFlip()->IsUserBit(creaseBitFlag) &&
                        !pi.V()->IsB() && !pi.VFlip()->IsB())
                {
                    ++candidates;
                    MyPair bp(pi.V(), pi.VFlip());
                    Point3f mp = (bp.V(1)->P()+bp.V(0)->P())/2.f;
                    if(testCollapse(pi, mp, min, max, length, adapt) && MyCollapser::LinkConditions(bp))
                    {
                        MyCollapser::Do(m, bp, mp);
                        ++count;
                        break;
                    }
                }
            }
        }
    printf("Collapse candidate edges: %d\n", candidates);
    printf("Collapsed edges: %d\n", count);
    printf("oncorner: %d\n", oncorner);
    //compact vectors, since we killed vertices
    Allocator<MyMesh>::CompactEveryVector(m);
    Clean<MyMesh>::RemoveDegenerateFace(m);
}

// This function sets the selection bit on vertices that lie on creases
int selectVertexFromCrease(MyMesh &m, int creaseBitFlag)
{
    int count = 0;
    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
            for(int i=0; i<3; ++i)
            {
                MyPos p(&*fi, i);
                if(testCreaseEdge(p))
                {
                    p.V()->SetS();
                    p.VFlip()->SetS();
                    ++count;
                }
            }

    return count; //count is not accurate atm
}

/*
    Simple Laplacian Smoothing step - Border and crease vertices are ignored.
*/
void ImproveByLaplacian(MyMesh &m, int creaseBitFlag, bool DEBUGCREASE)
{
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::UpdateFlags<MyMesh>::VertexBorderFromFaceAdj(m);
    tri::UpdateSelection<MyMesh>::VertexFromBorderFlag(m);
    selectVertexFromCrease(m, creaseBitFlag);
    int i = tri::UpdateSelection<MyMesh>::VertexInvert(m);
    tri::Smooth<MyMesh>::VertexCoordPlanarLaplacian(m,1,math::ToRad(15.f),true);
    printf("Laplacian done (selected vertices: %d)\n", i);
    if(!DEBUGCREASE)
        tri::UpdateSelection<MyMesh>::Clear(m);
}

/*
    Reprojection step, this method reprojects each vertex on the original surface
    sampling the nearest point onto it using a uniform grid MyGrid t
*/
void ProjectToSurface(MyMesh &m, MyGrid t, FaceTmark<MyMesh> mark)
{
    face::PointDistanceBaseFunctor<float> distFunct;
    float maxDist = 100.f, minDist = 0.f;
    int cnt = 0;
    for(auto vi=m.vert.begin();vi!=m.vert.end();++vi)
        if(!(*vi).IsD())
        {
            Point3f newP;
            t.GetClosest(distFunct, mark, vi->P(), maxDist, minDist, newP);
            vi->P() = newP;
            ++cnt;
        }
    printf("projected %d\n", cnt);

}
/*
 * TODO: Think about using tri::Clean<MyMesh>::ComputeValence to compute the valence in the flip stage
 */
void CoarseIsotropicRemeshing(uintptr_t _baseM, int iter, bool adapt, bool refine, bool swap, float crease,
                              bool DEBUGLAPLA, bool DEBUGPROJ, bool DEBUGCREASE, bool DEBUGCOLLAPSE, bool DEBUGSPLIT)
{
    MyMesh &original = *((MyMesh*) _baseM), m;

    //turn params into a proper objecT (struct with constructor)
    params.crease = math::Cos(math::ToRad(crease));
    params.adapt = adapt;

    // Mesh cleaning
    int dup      = tri::Clean<MyMesh>::RemoveDuplicateVertex(original);
    int unref    = tri::Clean<MyMesh>::RemoveUnreferencedVertex(original);
    //int zeroArea = tri::Clean<MyMesh>::RemoveZeroAreaFace(original);
    Allocator<MyMesh>::CompactEveryVector(original);

    //Updating box before constructing the grid, otherwise we get weird results
    original.UpdateBoxAndNormals(); //per face normalized and per vertex

    //Build a uniform grid with the orignal mesh. Needed to apply the reprojection step.
    vcg::tri::Append<MyMesh,MyMesh>::MeshCopy(m,original);

    MyGrid t;
    t.Set(original.face.begin(), original.face.end());
    tri::FaceTmark<MyMesh> mark;
    mark.SetMesh(&original);

    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    tri::UpdateFlags<MyMesh>::VertexBorderFromFaceAdj(m);

    /* Manifold(ness) check*/
    if(tri::Clean<MyMesh>::CountNonManifoldEdgeFF(m) != 0 ||
            tri::Clean<MyMesh>::CountNonManifoldVertexFF(m) != 0)
    {
        printf("Input mesh is non-manifold, manifoldness is required!\nInterrupting filter");
        return;
    }

    tri::UpdateCurvature<MyMesh>::MeanAndGaussian(m);
    tri::UpdateQuality<MyMesh>::VertexFromMeanCurvatureHG(m);

    int creaseBitFlag = MyVertex::NewBitFlag();

    tri::UpdateTopology<MyMesh>::AllocateEdge(m);
    float length = tri::Stat<MyMesh>::ComputeEdgeLengthAverage(m);
    printf("Initial Mean edge size: %.6f\n", length);
    printf("Initial Mean Valence:   %.15f\n", computeMeanValence(m));

    for(int i=0; i < iter; ++i)
    {
        printf("iter %d \n", i+1);
        if(refine)
        {
//           selectCreaseCorners(m);
            if(DEBUGSPLIT)
                SplitLongEdges(m, adapt, length);
            if(DEBUGCOLLAPSE){
                CollapseShortEdges(m, adapt, creaseBitFlag, length);
            }
        }

        if(swap)
            ImproveValence(m, crease);
        if(DEBUGLAPLA)
            ImproveByLaplacian(m, creaseBitFlag, DEBUGCREASE);
        if(DEBUGPROJ)
            ProjectToSurface(m, t, mark);
    }

    tri::UpdateTopology<MyMesh>::AllocateEdge(m);
    printf("Final Mean edge size: %.6f\n", tri::Stat<MyMesh>::ComputeEdgeLengthAverage(m));
    printf("Final Mean Valence: %.15f \n", computeMeanValence(m));

    m.UpdateBoxAndNormals();
    vcg::tri::Append<MyMesh,MyMesh>::MeshCopy(original,m);
}
