#ifndef COARSEISOTROPICREMESHING_H
#define COARSEISOTROPICREMESHING_H

#endif // COARSEISOTROPICREMESHING_H

#include<vcg/complex/algorithms/update/color.h>
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


// My lerp (vcg does not implement lerp on scalars as of 30-01-2017)
inline float lerp (float a, float b, float lambda)
{
    math::Clamp(lambda, 0.f, 1.f);
    return a * lambda + (1-lambda) * b;
}

void MapErrorColor(MyMesh &m)
{
    static float minQ=0, maxQ=0;
    if(minQ==maxQ)
        tri::Stat<MyMesh>::ComputePerFaceQualityMinMax(m,minQ,maxQ);
    tri::UpdateColor<MyMesh>::PerFaceQualityRamp(m,minQ,maxQ);
}

void MapCreaseColor(MyMesh &m)
{
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::UpdateFlags<MyMesh>::FaceClearV(m);
    tri::UpdateFlags<MyMesh>::VertexClearV(m);
    tri::UpdateFlags<MyMesh>::FaceFauxCrease(m,math::ToRad(15.f));
    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {

            for(auto i=0; i<3; ++i)
            {
                MyPos pi(&*fi, i);
                if(!pi.F()->IsF(i))
                {
                    pi.V()->C() = vcg::Color4b::Red;
                    pi.V()->SetV();
                }
                else
                {
                    if(!pi.V()->IsV())
                        pi.V()->C() = vcg::Color4b::White;
                    pi.V()->SetV();
                }
            }
        }
    tri::UpdateColor<MyMesh>::PerFaceFromVertex(m);
}
//This could be used in place of FaceFauxCrease to avoid using the Faux bit
void computeCrease(MyMesh &m, float crease)
{
    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
            for(auto i=0; i<3; ++i)
            {
                MyPos pi(&*fi, i);
                Point3f n0,n1;

                n0 = NormalizedTriangleNormal(*(pi.F()));
                n1 = NormalizedTriangleNormal(*(pi.FFlip()));

                float angle = math::ToDeg(AngleN(n0, n1));
                if(angle >= crease || angle <= -crease)
                {
                    pi.F()->SetCrease(i);
                    pi.FlipF();
                    pi.FFlip()->SetCrease(pi.E());

                }
            }
        }
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

// su trim star non fa scomparire proprio tutti i problemi sulle punte, probabilmente anche perché
// hanno angoli tali da risultare di crease.
//think about refactoring this using tri::Clean<MyMesh>::ComputeValence() and using a valence vector
// PRO using pervertex handle: seems faster (about 500ms on 100k vert remeshed twirl.off)
// CONS : bigger memory footprint, might be a problem for big meshes => can exceed memory limits imposed by browsers
bool testSwap(MyMesh &m, MyPos p, typename MyMesh::PerVertexIntHandle &h)
{
    //if border or feature, do not swap
    if(p.IsBorder() || !p.IsFaux()) return false;
    //gathering the vertices interested by this swap
    int oldDist = 0, newDist = 0, idealV, actualV;

    MyPos tp=p;
    //starting pos v0: here we decrease the edge count by 1
    MyVertex *v0=p.V();
    idealV  = idealValence(tp); actualV = h[tri::Index(m, v0)]; //actualV = ComputeValence(tp);
    oldDist += abs(idealV - actualV);
    newDist += abs(idealV - (actualV - 1));
    // pos v1: here we increment the edge count by 1
    tp.FlipF();tp.FlipE();tp.FlipV();
    MyVertex *v1=tp.V();
    idealV  = idealValence(tp); actualV = h[tri::Index(m, v1)]; //actualV = ComputeValence(tp);
    oldDist += abs(idealV - actualV);
    newDist += abs(idealV - (actualV + 1));
    // pos v2: here we decrease the edge count by 1
    tp.FlipE();tp.FlipV();tp.FlipE();
    MyVertex *v2=tp.V();
    idealV  = idealValence(tp); actualV = h[tri::Index(m, v2)]; //actualV = ComputeValence(tp);
    oldDist += abs(idealV - actualV);
    newDist += abs(idealV - (actualV - 1));
    // pos v3: here we increment the edge count by 1
    tp.FlipF();tp.FlipE();tp.FlipV();
    MyVertex *v3=tp.V();
    idealV  = idealValence(tp); actualV = h[tri::Index(m, v3)]; //actualV = ComputeValence(tp);
    oldDist += abs(idealV - actualV);
    newDist += abs(idealV - (actualV + 1));

    float qOld = std::min(Quality(v0->P(),v2->P(),v3->P()),Quality(v0->P(),v1->P(),v2->P()));
    float qNew = std::min(Quality(v0->P(),v1->P(),v3->P()),Quality(v2->P(),v3->P(),v1->P()));

    return (newDist < oldDist && qNew >= qOld * 0.50f) ||
            (newDist == oldDist && qNew >= qOld * 1.1f) || qNew > 1.5f * qOld;
}

// Edge swap step: edges are flipped in order to optimize valence and triangle quality across the mesh
void ImproveValence(MyMesh &m, float crease)
{
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::UpdateFlags<MyMesh>::FaceClearV(m);
    //feature conservative
    tri::UpdateFlags<MyMesh>::FaceFauxCrease(m, math::ToRad(crease));

    MyMesh::PerVertexIntHandle h = tri::Allocator<MyMesh>::AddPerVertexAttribute<int>(m, std::string("Valence"));
    tri::Clean<MyMesh>::ComputeValence(m, h);

    int swapCnt=0;
    for(auto fi=m.face.begin();fi!=m.face.end();++fi)
        if(!(*fi).IsD())
        {
            for(int i=0;i<3;++i)
            {
                MyPos pi(&*fi,i);

                if(!pi.FFlip()->IsV())
                    if(testSwap(m, pi, h) &&
                            face::CheckFlipEdgeNormal(*fi, i, math::ToRad(crease)) &&
                            face::CheckFlipEdge(*fi,i) )
                    {
                        face::FlipEdge(*fi,i);
                        swapCnt++;
                    }
            }
            fi->SetV();
        }

    tri::Allocator<MyMesh>::DeletePerVertexAttribute(m, h);
    printf("Performed %i swaps\n",swapCnt);
}

// The predicate that defines which edges should be split
class EdgeSplitPred
{
public:
    float length, min, max;
    bool adapt;
    bool operator()(MyPos &ep) const
    {
        float mult = (adapt)? lerp(1.f/10.f, 10.f, (ep.V()->Q()/(max-min))) : 1.f;
        return vcg::Distance(ep.V()->P(), ep.VFlip()->P()) > mult*length;
    }
};

void SplitLongEdges(MyMesh &m, bool adapt, float crease, float length)
{
    tri::UpdateTopology<MyMesh>::FaceFace(m);

    Distribution<float> distr;
    tri::Stat<MyMesh>::ComputePerVertexQualityDistribution(m,distr);
    float min,max;
    max = distr.Percentile(0.9f);
    min = distr.Percentile(0.1f);

    tri::MidPoint<MyMesh> midFunctor(&m);
    EdgeSplitPred ep;
    ep.min = min;
    ep.max = max;
    ep.adapt = adapt;
    ep.length =(4.0f/3.0f)*length;

    //RefineE updates FF topology after doing the refine (not needed in collapse then)
    tri::RefineE(m,midFunctor,ep);
}

// Collapse test: Usual collapse test plus borders and adaptivity management
inline bool testCollapse(MyPair &p, MyCollapser &eg, float min, float max, float length, bool adapt)
{
    float mult = (adapt) ? lerp(1.f/10.f, 10.f, (((p.V(0)->Q()+p.V(1)->Q())/2.f)/(max-min))) : 1.f;
    float dist = Distance(p.V(0)->P(), p.V(1)->P());
    return  dist < mult*(4.0f/5.0f)*length &&
            !p.V(0)->IsB() && !p.V(1)->IsB() &&
            eg.LinkConditions(p);
}

void CollapseShortEdges(MyMesh &m, bool adapt, float crease, float length)
{
    tri::UpdateTopology<MyMesh>::VertexFace(m);
    //tri::UpdateTopology<MyMesh>::FaceFace(m); //FF is updated by the preceding RefineE
    tri::UpdateFlags<MyMesh>::FaceClearV(m);

    tri::UpdateFlags<MyMesh>::FaceFauxCrease(m, math::ToRad(crease));

    Distribution<float> distr;
    tri::Stat<MyMesh>::ComputePerVertexQualityDistribution(m,distr);

    float min,max;
    max = distr.Percentile(0.9f);
    min = distr.Percentile(0.1f);

    MyCollapser eg;
    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
        {
            for(auto i=0; i<3; ++i)
            {
                MyPos pi(&*fi, i);
                if(!pi.F()->IsAnyF() && !pi.FFlip()->IsAnyF() && // se collassarmi non sposta un crease vertex
                        //should be: if the edge is crease or we don't have creases on the face
//                        (!pi.IsFaux() || (pi.F()->IsF(0) && pi.F()->IsF(1) && pi.F()->IsF(2))) &&
                        !pi.IsBorder() &&
                        !pi.FFlip()->IsV())
                {
                    MyPair bp(pi.V(), pi.VFlip());
                    Point3f mp=(bp.V(0)->P()+bp.V(1)->P())/2.0f;
                    if(testCollapse(bp, eg, min, max, length, adapt))
                    {
                        eg.Do(m, bp, mp);
                        pi.V()->SetV();
                        break;
                    }
                }
            }
            fi->SetV();
        }
    //compact vectors, since we killed vertices
    Allocator<MyMesh>::CompactEveryVector(m);
}

// This function sets the selection bit on vertices that lies on creases
int selectVertexFromCrease(MyMesh &m)
{
    int count = 0;
    for(auto fi=m.face.begin(); fi!=m.face.end(); ++fi)
        if(!(*fi).IsD())
            for(int i=0; i<3; ++i)
                if(!(*fi).IsF(i))
                {
                    MyPos p(&*fi, i);
                    p.V()->SetS();
                    p.VFlip()->SetS();
                    ++count;
                }
    return count; //count is not accurate atm
}

/*
    Simple Laplacian Smoothing step
*/
void ImproveByLaplacian(MyMesh &m, bool DEBUGCREASE)
{
    tri::UpdateFlags<MyMesh>::VertexBorderFromFaceAdj(m);
    tri::UpdateSelection<MyMesh>::VertexFromBorderFlag(m);
    selectVertexFromCrease(m);
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
 * CONTROLLA BENE QUANDO SONO DAVVERO NEC LE CHIAMATE DI UPDATE DELLA TOPOLOGIA E FLAG
 * dai statistiche prima dopo di:
 *  valenza media     (direi media e media della distanza da ideale)
 *  qualità triangoli (dovrebbe esserci già in meshlabjs)
 * magari fallo anche come filtro a se
 *
 * aggiungi la possibilità di escludere refine (split e collapse)  edgeswap [done]
 *
 *
 * Seems good:
 *  il valence offset (reale-ideale) diminuisce monotonicamente (con soli swap)
 *  la qualità sembra aumentare (si polarizza anche un po' di più tra brutti e belli)
 *
 *
 * TODO: Think about using tri::Clean<MyMesh>::ComputeValence to compute the valence in the flip stage
 */
void CoarseIsotropicRemeshing(uintptr_t _baseM, int iter, bool adapt, bool refine, bool swap, float crease,
                              bool DEBUGLAPLA, bool DEBUGPROJ, bool DEBUGCREASE)
{
    MyMesh &original = *((MyMesh*) _baseM), m;

    /* Mesh cleaning (needed to support formats like .stl PROBABLY NOT NEEDED!!! CHECK BUG!) */
    int dup      = tri::Clean<MyMesh>::RemoveDuplicateVertex(original);
    int unref    = tri::Clean<MyMesh>::RemoveUnreferencedVertex(original);
    int zeroArea = tri::Clean<MyMesh>::RemoveZeroAreaFace(original);
    Allocator<MyMesh>::CompactEveryVector(original);

    /* Updating box before constructing the grid, otherwise we get weird results */
    original.UpdateBoxAndNormals();

    /*
     * Build a uniform grid with the orignal mesh.
     * Needed to apply the reprojection step.
     *
     */
    vcg::tri::Append<MyMesh,MyMesh>::MeshCopy(m,original);

    MyGrid t;
    t.Set(original.face.begin(), original.face.end());
    tri::FaceTmark<MyMesh> mark;
    mark.SetMesh(&original);

    // Update required topology and quality
    tri::UpdateTopology<MyMesh>::FaceFace(m);
    tri::UpdateTopology<MyMesh>::VertexFace(m);

    /* Manifold(ness) check*/
    if(tri::Clean<MyMesh>::CountNonManifoldEdgeFF(m) != 0 ||
            tri::Clean<MyMesh>::CountNonManifoldVertexFF(m) != 0)
    {
        printf("Input mesh is non-manifold, manifoldness is required!\nInterrupting filter");
        return;
    }

    // here it crashes if executed after simplification (cluster or quadric)
    tri::UpdateCurvature<MyMesh>::MeanAndGaussian(m);
    tri::UpdateQuality<MyMesh>::VertexFromAbsoluteCurvature(m);
    tri::UpdateQuality<MyMesh>::VertexSaturate(m); //do you really want this?

    //was used to debug
    //computeCrease(m);
    //MapErrorColor(m);
    //MapCreaseColor(m);

    /* Computing mean edge length (it needs the edge vector) */
    tri::UpdateTopology<MyMesh>::AllocateEdge(m);
    float length = tri::Stat<MyMesh>::ComputeEdgeLengthAverage(m);

    printf("Initial Mean edge size: %.6f\n", length);
    printf("Initial Mean Valence:   %.15f\n", computeMeanValence(m));
    for(int i=0; i < iter; ++i)
    {
        printf("iter %d \n", i+1);

        if(refine)
        {
            SplitLongEdges(m, adapt, crease, length);
            CollapseShortEdges(m, adapt, crease, length);
        }
        if(swap)
            ImproveValence(m, crease);
        if(DEBUGLAPLA)
            ImproveByLaplacian(m, DEBUGCREASE);
        if(DEBUGPROJ)
            ProjectToSurface(m, t, mark);
    }
    tri::UpdateTopology<MyMesh>::AllocateEdge(m);
    printf("Final Mean edge size: %.6f\n", tri::Stat<MyMesh>::ComputeEdgeLengthAverage(m));
    printf("Final Mean Valence: %.15f \n", computeMeanValence(m));

    m.UpdateBoxAndNormals();
    vcg::tri::Append<MyMesh,MyMesh>::MeshCopy(original,m);
}
