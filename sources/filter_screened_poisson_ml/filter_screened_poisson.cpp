/****************************************************************************
* MeshLab                                                           o o     *
* A versatile mesh processing toolbox                             o     o   *
*                                                                _   O  _   *
* Copyright(C) 2005                                                \/)\/    *
* Visual Computing Lab                                            /\/|      *
* ISTI - Italian National Research Council                           |      *
*                                                                    \      *
* All rights reserved.                                                      *
*                                                                           *
* This program is free software; you can redistribute it and/or modify      *
* it under the terms of the GNU General Public License as published by      *
* the Free Software Foundation; either version 2 of the License, or         *
* (at your option) any later version.                                       *
*                                                                           *
* This program is distributed in the hope that it will be useful,           *
* but WITHOUT ANY WARRANTY; without even the implied warranty of            *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
* GNU General Public License (http://www.gnu.org/licenses/gpl.txt)          *
* for more details.                                                         *
*                                                                           *
****************************************************************************/

#ifdef WIN32
#include <windows.h>
#endif

#include "../mesh_def.h"
#include <vcg/math/matrix44.h>

#include "Src/MyTime.h"
#include "Src/MemoryUsage.h"
#include "Src/MarchingCubes.h"
#include "Src/Octree.h"
#include "Src/SparseMatrix.h"
#include "Src/PPolynomial.h"
#include "Src/Ply.h"

#include <stdlib.h>

#include "Src/PointStream.h"
#include "Src/MultiGridOctreeData.h"


#ifdef TESTING
#include <wrap/io_trimesh/import.h>
#include <wrap/io_trimesh/export.h>
#endif

typedef vcg::Box3<float>     Box3m;

/*
#if defined( _WIN32 ) || defined( _WIN64 )
inline double to_seconds( const FILETIME& ft )
{
	const double low_to_sec=100e-9; // 100 nanoseconds
	const double high_to_sec=low_to_sec*4294967296.0;
	return ft.dwLowDateTime*low_to_sec+ft.dwHighDateTime*high_to_sec;
}
#endif // _WIN32 || _WIN64
*/

template< class Real >
struct OctreeProfiler
{
	Octree< Real >& tree;
	double t;

	OctreeProfiler(Octree< Real >& t) : tree(t) { ; }
	void start(void) { t = Time(), tree.resetLocalMemoryUsage(); }
	void print(const char* header) const
	{
		tree.memoryUsage();
#if defined( _WIN32 ) || defined( _WIN64 )
		if (header) printf("%s %9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", header, Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage(), PeakMemoryUsageMB());
		else         printf("%9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage(), PeakMemoryUsageMB());
#else // !_WIN32 && !_WIN64
		if (header) printf("%s %9.1f (s), %9.1f (MB) / %9.1f (MB)\n", header, Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage());
		else         printf("%9.1f (s), %9.1f (MB) / %9.1f (MB)\n", Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage());
#endif // _WIN32 || _WIN64
	}
	void dumpOutput(const char* header) const
	{
		tree.memoryUsage();
#if defined( _WIN32 ) || defined( _WIN64 )
		if (header) DumpOutput("%s %9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", header, Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage(), PeakMemoryUsageMB());
		else         DumpOutput("%9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage(), PeakMemoryUsageMB());
#else // !_WIN32 && !_WIN64
		if (header) DumpOutput("%s %9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", header, Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage());
		else         DumpOutput("%9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage());
#endif // _WIN32 || _WIN64
	}
	void dumpOutput2(std::vector< char* >& comments, const char* header) const
	{
		tree.memoryUsage();
#if defined( _WIN32 ) || defined( _WIN64 )
		if (header) DumpOutput2(comments, "%s %9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", header, Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage(), PeakMemoryUsageMB());
		else         DumpOutput2(comments, "%9.1f (s), %9.1f (MB) / %9.1f (MB) / %9.1f (MB)\n", Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage(), PeakMemoryUsageMB());
#else // !_WIN32 && !_WIN64
		if (header) DumpOutput2(comments, "%s %9.1f (s), %9.1f (MB) / %9.1f (MB)\n", header, Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage());
		else         DumpOutput2(comments, "%9.1f (s), %9.1f (MB) / %9.1f (MB)\n", Time() - t, tree.localMemoryUsage(), tree.maxMemoryUsage());
#endif // _WIN32 || _WIN64
	}
};


template <class Real>
class PoissonParam
{
public:
	int MaxDepthVal;
	int MaxSolveDepthVal;
	int KernelDepthVal;
	int MinDepthVal;
	int FullDepthVal;
	Real SamplesPerNodeVal;
	Real ScaleVal;
	bool ConfidenceFlag;
	bool CleanFlag;
	bool DensityFlag;
	Real PointWeightVal;
	int AdaptiveExponentVal;
	int BoundaryTypeVal;
	bool CompleteFlag;
	bool NonManifoldFlag;
	bool ShowResidualFlag;
	int CGDepthVal;
	int ItersVal;
	Real CSSolverAccuracyVal;

	bool VerboseFlag;
	int ThreadsVal;
	bool LinearFitFlag;
	float LowResIterMultiplierVal;
	float ColorVal;

	PoissonParam()
	{
		MaxDepthVal = 8;
		MaxSolveDepthVal = 10;
		KernelDepthVal = 0;//-1;
		MinDepthVal = 0;
		FullDepthVal = 5;
		SamplesPerNodeVal = 1.5f;
		ScaleVal = 1.1f;
		ConfidenceFlag = false;
		CleanFlag = false;
		DensityFlag = false;
		PointWeightVal = 4.0f;
		AdaptiveExponentVal = 1;
		BoundaryTypeVal = 1;
		CompleteFlag = false;
		NonManifoldFlag = false;
		ShowResidualFlag = false;
		CGDepthVal = 0;
		ItersVal = 8;
		CSSolverAccuracyVal = 1e-3f;

		VerboseFlag = true;
		ThreadsVal = omp_get_num_procs();
		LinearFitFlag = false;
		LowResIterMultiplierVal = 1.f;
		ColorVal = 16.0f;
	}
};


template< class Real>
XForm4x4<Real> GetPointStreamScale(vcg::Box3<Real> &bb, float expFact)
{
	Real scale = bb.Dim()[bb.MaxDim()] * expFact;
	Point3D<Real> center = Point3D<Real>(bb.Center()[0], bb.Center()[0], bb.Center()[2]);
	for (int i = 0; i < 3; i++) center[i] -= scale / 2;
	XForm4x4< Real > tXForm = XForm4x4< Real >::Identity(), sXForm = XForm4x4< Real >::Identity();
	for (int i = 0; i < 3; i++) sXForm(i, i) = (Real)(1. / scale), tXForm(3, i) = -center[i];
	return sXForm * tXForm;
}

template< class Real >
XForm4x4< Real > GetPointXForm(OrientedPointStream< Real >& stream, Real scaleFactor)
{
	Point3D< Real > min, max;
	stream.boundingBox(min, max);
	Point3D< Real > center = (max + min) / 2;
	Real scale = std::max< Real >(max[0] - min[0], std::max< Real >(max[1] - min[1], max[2] - min[2]));
	scale *= scaleFactor;
	for (int i = 0; i < 3; i++) center[i] -= scale / 2;
	XForm4x4< Real > tXForm = XForm4x4< Real >::Identity(), sXForm = XForm4x4< Real >::Identity();
	for (int i = 0; i < 3; i++) sXForm(i, i) = (Real)(1. / scale), tXForm(3, i) = -center[i];
	return sXForm * tXForm;
}

template< class Real >
class MyMeshPointStream : public OrientedPointStream< Real >
{
	MyMesh &_m;
	size_t _curPos;
public:
	MyMeshPointStream(MyMesh &m) :_m(m), _curPos(0)
	{
		vcg::tri::RequireCompactness(m);
	}
	~MyMeshPointStream(void) {}
	void reset(void) { _curPos = 0; }
	bool nextPoint(OrientedPoint3D< Real >& pt)
	{
		if (_curPos >= _m.VN())
			return false;

		pt.p[0] = _m.vert[_curPos].P()[0];
		pt.p[1] = _m.vert[_curPos].P()[1];
		pt.p[2] = _m.vert[_curPos].P()[2];
		pt.n[0] = _m.vert[_curPos].N()[0];
		pt.n[1] = _m.vert[_curPos].N()[1];
		pt.n[2] = _m.vert[_curPos].N()[2];
		++_curPos;
		return true;
	}
};

template< class Real, int Degree, BoundaryType BType, class Vertex >
int _Execute(OrientedPointStream< Real > *pointStream, Box3m bb, MyMesh &pm, PoissonParam<Real> &pp)
{
	typedef typename Octree< Real >::template DensityEstimator< WEIGHT_DEGREE > DensityEstimator;
	typedef typename Octree< Real >::template InterpolationInfo< false > InterpolationInfo;
	typedef OrientedPointStream< Real > PointStream;
	typedef OrientedPointStreamWithData< Real, Point3D< Real > > PointStreamWithData;
	typedef TransformedOrientedPointStream< Real > XPointStream;
	typedef TransformedOrientedPointStreamWithData< Real, Point3D< Real > > XPointStreamWithData;
	Reset< Real >();

	XForm4x4< Real > xForm = GetPointStreamScale<Real>(bb, pp.ScaleVal);
	XForm4x4< Real > iXForm = xForm.inverse();

	OctNode< TreeNodeData >::SetAllocator(MEMORY_ALLOCATOR_BLOCK_SIZE);
	Octree< Real > tree;
	tree.threads = pp.ThreadsVal;
	if (pp.MaxSolveDepthVal < 0) pp.MaxSolveDepthVal = pp.MaxDepthVal;

	if (pp.KernelDepthVal < 0) pp.KernelDepthVal = pp.MaxDepthVal - 2;
	if (pp.KernelDepthVal > pp.MaxDepthVal)
	{
		printf("kernelDepth cannot be greateer Depth.value\n");
		return false;
	}

	int pointCount;

	Real pointWeightSum;
	std::vector< typename Octree< Real >::PointSample >* samples = new std::vector< typename Octree< Real >::PointSample >();
	std::vector< ProjectiveData< Point3D< Real >, Real > >* sampleData = NULL;
	DensityEstimator* density = NULL;
	SparseNodeData< Point3D< Real >, NORMAL_DEGREE >* normalInfo = NULL;
	Real targetValue = (Real)0.5;

	// Read in the samples (and color data)
	{

		/*
		MyMeshPointStream<float>* pointStream;

		char* ext = GetFileExtension( In.value );
		if( Color.set && Color.value>0 )
		{
			sampleData = new std::vector< ProjectiveData< Point3D< Real > , Real > >();
			if     ( !strcasecmp( ext , "bnpts" ) ) pointStream = new BinaryOrientedPointStreamWithData< Real , Point3D< Real > , float , Point3D< unsigned char > >( In.value );
			else if( !strcasecmp( ext , "ply"   ) ) pointStream = new    PLYOrientedPointStreamWithData< Real , Point3D< Real > >( In.value , ColorInfo< Real >::PlyProperties , 6 , ColorInfo< Real >::ValidPlyProperties );
			else                                    pointStream = new  ASCIIOrientedPointStreamWithData< Real , Point3D< Real > >( In.value , ColorInfo< Real >::ReadASCII );
		}
		else
		{
			if     ( !strcasecmp( ext , "bnpts" ) ) pointStream = new BinaryOrientedPointStream< Real , float >( In.value );
			else if( !strcasecmp( ext , "ply"   ) ) pointStream = new    PLYOrientedPointStream< Real >( In.value );
			else                                    pointStream = new  ASCIIOrientedPointStream< Real >( In.value );
		}
		delete[] ext;
		*/
		//sampleData = new std::vector< ProjectiveData< Point3D< Real > , Real > >();        
		//XPointStreamWithData _pointStream( xForm , ( PointStreamWithData& )*pointStream );
		//pointCount = tree.template init< Point3D< Real > >( _pointStream , pp.MaxDepthVal , pp.ConfidenceFlag , *samples , sampleData );


		XPointStream _pointStream(xForm, *pointStream);
		xForm = GetPointXForm(_pointStream, (Real)pp.ScaleVal) * xForm;
		if (sampleData)
		{
			XPointStreamWithData _pointStream(xForm, (PointStreamWithData&)*pointStream);
			pointCount = tree.template init< Point3D< Real > >(_pointStream, pp.MaxDepthVal, pp.ConfidenceFlag, *samples, sampleData);
		}
		else
		{
			XPointStream _pointStream(xForm, *pointStream);
			pointCount = tree.template init< Point3D< Real > >(_pointStream, pp.MaxDepthVal, pp.ConfidenceFlag, *samples, sampleData);
		}
		iXForm = xForm.inverse();
		delete pointStream;

		for (int i = 0; i < (int)samples->size(); i++) 
			(*samples)[i].sample.data.n *= (Real)-1;
	}

	DenseNodeData< Real, Degree > solution;

	{
		DenseNodeData< Real, Degree > constraints;
		InterpolationInfo* iInfo = NULL;
		int solveDepth = pp.MaxSolveDepthVal;

		tree.resetNodeIndices();

		// Get the kernel density estimator [If discarding, compute anew. Otherwise, compute once.]
		{
			density = tree.template setDensityEstimator< WEIGHT_DEGREE >(*samples, pp.KernelDepthVal, pp.SamplesPerNodeVal);
		}

		// Transform the Hermite samples into a vector field [If discarding, compute anew. Otherwise, compute once.]
		{
			normalInfo = new SparseNodeData< Point3D< Real >, NORMAL_DEGREE >();
			*normalInfo = tree.template setNormalField< NORMAL_DEGREE >(*samples, *density, pointWeightSum, BType == BOUNDARY_NEUMANN);
		}

		if (!pp.DensityFlag) delete density, density = NULL;

		// Trim the tree and prepare for multigrid
		{
			std::vector< int > indexMap;

			int MAX_DEGREE;
			tree.template inalizeForBroodedMultigrid< 2, Degree, BType >(pp.FullDepthVal, typename Octree< Real >::template HasNormalDataFunctor< NORMAL_DEGREE >(*normalInfo), &indexMap);

			if (normalInfo) normalInfo->remapIndices(indexMap);
			if (density) density->remapIndices(indexMap);
		}

		// Add the FEM constraints
		{
			constraints = tree.template initDenseNodeData< Degree >();
			tree.template addFEMConstraints< Degree, BType, NORMAL_DEGREE, BType >(FEMVFConstraintFunctor< NORMAL_DEGREE, BType, Degree, BType >(1., 0.), *normalInfo, constraints, solveDepth);
		}

		// Free up the normal info [If we don't need it for subseequent iterations.]
		delete normalInfo, normalInfo = NULL;

		// Add the interpolation constraints
		if (pp.PointWeightVal > 0)
		{
			iInfo = new InterpolationInfo(tree, *samples, targetValue, pp.AdaptiveExponentVal, (Real)pp.PointWeightVal * pointWeightSum, (Real)0);
			tree.template addInterpolationConstraints< Degree, BType >(*iInfo, constraints, solveDepth);
		}

		// Solve the linear system
		{
			//profiler.start();
			typename Octree< Real >::SolverInfo solverInfo;
			solverInfo.cgDepth = pp.CGDepthVal, solverInfo.iters = pp.ItersVal, solverInfo.cgAccuracy = pp.CSSolverAccuracyVal, solverInfo.verbose = pp.VerboseFlag, solverInfo.showResidual = pp.ShowResidualFlag, solverInfo.lowResIterMultiplier = std::max< double >(1., pp.LowResIterMultiplierVal);
			solution = tree.template solveSystem< Degree, BType >(FEMSystemFunctor< Degree, BType >(0, 1., 0), iInfo, constraints, solveDepth, solverInfo);
			if (iInfo) delete iInfo, iInfo = NULL;
		}
	}

	CoredFileMeshData< Vertex > mesh;

	{
		//	profiler.start();
		double valueSum = 0, weightSum = 0;
		typename Octree< Real >::template MultiThreadedEvaluator< Degree, BType > evaluator(&tree, solution, pp.ThreadsVal);

		for (int j = 0; j < samples->size(); j++)
		{
			ProjectiveData< OrientedPoint3D< Real >, Real >& sample = (*samples)[j].sample;
			Real w = sample.weight;
			if (w > 0) weightSum += w, valueSum += evaluator.value(sample.data.p / sample.weight, omp_get_thread_num(), (*samples)[j].node) * w;
		}
		Real isoValue = (Real)(valueSum / weightSum);
		if (samples) delete samples, samples = NULL;
		

		//COLOR RELATED, NOT WORKING

		SparseNodeData< ProjectiveData< Point3D< Real >, Real >, DATA_DEGREE >* colorData = NULL;

		/*if( sampleData )
		{
			colorData = new SparseNodeData< ProjectiveData< Point3D< Real > , Real > , DATA_DEGREE >();
			*colorData = tree.template setDataField< DATA_DEGREE , false >( *samples , *sampleData , (DensityEstimator*)NULL );
			delete sampleData , sampleData = NULL;
			for( const OctNode< TreeNodeData >* n = tree.tree().nextNode() ; n ; n=tree.tree().nextNode( n ) )
			{
				ProjectiveData< Point3D< Real > , Real >* clr = (*colorData)( n );
				if( clr )
				  (*clr) *= (Real)pow( pp.ColorVal , tree.depth( n ) );
			}
		}*/

		tree.template getMCIsoSurface< Degree, BType, WEIGHT_DEGREE, DATA_DEGREE >(density, colorData, solution, isoValue, mesh, !pp.LinearFitFlag, !pp.NonManifoldFlag, false /*PolygonMesh.set*/);
	}

	//        FreePointer( solution );


	mesh.resetIterator();
	int vm = mesh.outOfCorePointCount() + mesh.inCorePoints.size();
	for (auto pt = mesh.inCorePoints.begin(); pt != mesh.inCorePoints.end(); ++pt)
	{
		Point3D<Real> pp = iXForm*pt->point;
		vcg::tri::Allocator<MyMesh>::AddVertex(pm, MyMesh::CoordType(pp[0], pp[1], pp[2]));
		//pm.vert.back().Q() = pt->value;
		//pm.vert.back().C()[0] = pt->color[0];
		//pm.vert.back().C()[1] = pt->color[1];
		//pm.vert.back().C()[2] = pt->color[2];
	}
	for (int ii = 0; ii < mesh.outOfCorePointCount(); ii++) {
		Vertex pt;
		mesh.nextOutOfCorePoint(pt);
		Point3D<Real> pp = iXForm*pt.point;
		vcg::tri::Allocator<MyMesh>::AddVertex(pm, MyMesh::CoordType(pp[0], pp[1], pp[2]));
		//pm.vert.back().Q() = pt.value;
		//pm.vert.back().C()[0] = pt.color[0];
		//pm.vert.back().C()[1] = pt.color[1];
		//pm.vert.back().C()[2] = pt.color[2];
	}

	std::vector< CoredVertexIndex > polygon;
	while (mesh.nextPolygon(polygon))
	{
		assert(polygon.size() == 3);
		int indV[3];
		for (int i = 0; i<int(polygon.size()); i++)
		{
			if (polygon[i].inCore) indV[i] = polygon[i].idx;
			else                    indV[i] = polygon[i].idx + int(mesh.inCorePoints.size());
		}
		vcg::tri::Allocator<MyMesh>::AddFace(pm, &pm.vert[indV[0]], &pm.vert[indV[1]], &pm.vert[indV[2]]);
	}

//		if( colorData ) delete colorData , colorData = NULL;
	if (density) delete density, density = NULL;

	return 1;
}

template <class MeshType>
void PoissonClean(MeshType &m, bool scaleNormal, bool cleanFlag)
{
	if (cleanFlag) {
		if (m.face.size() > 0)
			vcg::tri::Clean<MeshType>::RemoveUnreferencedVertex(m);
	}
	vcg::tri::Allocator<MeshType>::CompactEveryVector(m);
	vcg::tri::UpdateNormal<MeshType>::NormalizePerVertex(m);
	if (scaleNormal)
	{
		for (auto vi = m.vert.begin(); vi != m.vert.end(); ++vi)
			vi->N() *= vi->Q();
	}
}

bool HasGoodNormal(MyMesh &m)
{
	for (auto vi = m.vert.begin(); vi != m.vert.end(); ++vi)
		if (vcg::SquaredNorm(vi->N()) < FLT_MIN * 10.0)
			return false;

	return true;
}

bool PoissonSurfaceRecontruction(uintptr_t _baseM, uintptr_t p)
{
	MyMesh &m = *((MyMesh*)_baseM);
	MyMesh &pmm = *((MyMesh*)p);
	PoissonParam<float> pp;
	/*
	pp.MaxDepthVal = env.evalInt("depth");
	pp.FullDepthVal = env.evalInt("fullDepth");
	pp.CGDepthVal = env.evalInt("cgDepth");
	pp.ScaleVal = env.evalFloat("scale");
	pp.SamplesPerNodeVal = env.evalFloat("samplesPerNode");
	pp.PointWeightVal = env.evalFloat("pointWeight");
	pp.ItersVal = env.evalInt("iters");
	pp.ConfidenceFlag = env.evalBool("confidence");
	pp.DensityFlag = true;
	pp.CleanFlag = env.evalBool("preClean");
	*/

	if (!vcg::tri::HasPerVertexNormal(m))
	{
		printf("Filter requires correct per vertex normals.\n Use Point Cloud Normal Extrapolation.\n");
		return false;
	}

	PoissonClean<MyMesh>(m, pp.ConfidenceFlag, pp.CleanFlag);

	MyMesh *pm;
	
	Box3m bb;
	vcg::Matrix44<float> mi;
	mi.SetIdentity();
	bb.Add(mi, m.bbox);

	//OrientedPointStream<float> * pointStream = new    PLYOrientedPointStream< float >("E:/xampp/htdocs/Repo/test/in.ply");
	OrientedPointStream<float> * pointStream = new    MyMeshPointStream< float >(m);
	_Execute<float, 2, BOUNDARY_NEUMANN, PlyValueVertex<float> >(pointStream, m.bbox, pmm, pp);
	
	return true;
}


#ifdef TESTING
void PoissonPluginTEST()
{

	MyMesh m;
	int loadmask = 0;
	m.tr.SetIdentity();
	string fileName = "E:/xampp/htdocs/Repo/test/in.ply";
	m.meshName = fileName;

	//printf("Starting POISSON PLUGIN TEST on %s", fileName);

	int ret = vcg::tri::io::Importer<MyMesh>::Open(m, fileName.c_str(), loadmask);


	if (ret != 0)
	{
		printf("Error opening file\n");
		return;
	}

	MyMesh out;
	PoissonSurfaceRecontruction(uintptr_t(&m), uintptr_t(&out));
	string outFileName = "E:/xampp/htdocs/Repo/test/out.ply";
	//out.tr.SetIdentity();
	ret = vcg::tri::io::Exporter<MyMesh>::Save(out, outFileName.c_str(), loadmask);
	if (ret != 0) { printf("Error in saving file\n"); }

	printf("END\n");
}
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(PoissonFilterPlugin) {
	emscripten::function("PoissonSurfaceRecontruction", &PoissonSurfaceRecontruction);
}
#endif
