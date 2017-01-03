
/* global MLJ, Module */

(function (plugin, scene) {

    /******************************************************************************/
    var QuadricSimpFilter = new plugin.Filter({
        name: "Quadric Simplification",
        tooltip: "Simplify (decimate) a mesh according to a edge collapse strategy driven by a quadric based error evaluation strategy.",
        arity: 1
    });

    var ratioWdg, qualityQuadricWdg, topologicalQuadricWdg;
    QuadricSimpFilter._init = function (builder) {
        ratioWdg = builder.RangedFloat({
            max: 1, min: 0, step: 0.1, defval: 0.5,
            label: "Simplification Ratio",
            tooltip: "Amount of Simplification expressed as a percentage of the initial mesh complexity."
        });
        qualityQuadricWdg = builder.Bool({
            defval: true,
            label: "Quality Quadric",
            tooltip: "if true during the initialization it manages all the edges as border edges by adding a set of additional quadrics that are useful mostly for keeping face aspect ratio good."
        });
        topologicalQuadricWdg = builder.Bool({
            defval: true,
            label: "Toplogical Preservarion",
            tooltip: "if true during the simplification the topology of the mesh is preserved. This avoid the creation of small non manifold but also prevent drastic simplification ratios."
        });

    };

    QuadricSimpFilter._applyTo = function (meshFile) {
        Module.QuadricSimplification(meshFile.ptrMesh(), ratioWdg.getValue(), 0,
            topologicalQuadricWdg.getValue(), qualityQuadricWdg.getValue());
    };
    /******************************************************************************/
    var ClusteringFilter = new plugin.Filter({
        name: "Clustering Simplification",
        tooltip: "Simplify (decimate) a mesh according to a vertex clustering strategy",
        arity: 1
    });

    var clusteringRatioWidget;
    ClusteringFilter._init = function (builder) {
        clusteringRatioWidget = builder.RangedFloat({
            max: 0.2, min: 0, step: 0.01, defval: 0.02,
            label: "Clustering radius",
            tooltip: "Expressed as a fraction of the bounding box diagonal." +
            "A value of 0.01 means that the clustering cell size is 1/100 of the bbox diagonal," +
            "or, in other words, that all the vertexes that are closer than 1/100 of the bbox diagonal" +
            "are collapsed together."
        });
    };

    ClusteringFilter._applyTo = function (meshFile) {
        Module.ClusteringSimplification(meshFile.ptrMesh(), clusteringRatioWidget.getValue());
    };
    /******************************************************************************/
    var VoronoiRemeshingFilter = new plugin.Filter({
        name: "Voronoi Remeshing",
        tooltip: "Perform a remeshing using a point sampling plus relaxation and triangulation strategy. <br> "
        + "Points are sampled on the surface using a Poisson Disk strategy and then their "
        + "position is optimized  using a Centroidal Voronoi Lloyd Relaxation Strategy. "
        + "This voronoi diagram is used to build a delaunay triangulation using the "
        + "sample points. If this base triangolation is 2-manifold it can be automatically refined and relaxed to better adapt to the surface.",
        arity: 2
    });

    var voronoiRatioWidget, relaxNumWidget, relaxTypeWidget,
        postRefineStepWidget, postRelaxStepWidget, colorizeMeshWidget;
    VoronoiRemeshingFilter._init = function (builder) {
        voronoiRatioWidget = builder.RangedFloat({
            max: 0.3, min: 0, step: 0.01, defval: 0.02,
            label: "Clustering ratio",
            tooltip: "Expressed as a fraction of the total vertex number. "
        });
        relaxNumWidget = builder.Integer({
            max: 20, min: 1, step: 1, defval: 5,
            label: "Lloyd Relax Step",
            tooltip: "How many refinement iterations are applied to the mesh."
        });
        relaxTypeWidget = builder.Choice({
            label: "Lloyd Relax Algorithmm",
            tooltip: "Choose the possible strategy of choosing the new centroid. <br>",
            options: [
                { content: "Quadric", value: "0", selected: true },
                { content: "Geodesic", value: "1" },
            ]
        });
        postRefineStepWidget = builder.Integer({
            max: 10, min: 0, step: 1, defval: "0",
            label: "Refine Step",
            tooltip: "How many refinement iterations are applied to the mesh."
        });
        postRelaxStepWidget = builder.Integer({
            max: 20, min: 0, step: 1, defval: 3,
            label: "Post Relax Step",
            tooltip: "How many refinement iterations are applied to the mesh."
        });
        colorizeMeshWidget = builder.Bool({
            defval: true,
            label: "Voronoi Coloring",
            tooltip: "if true the initial mesh is colored with distance from the seeds."
        });


    };

    VoronoiRemeshingFilter._applyTo = function (meshFile) {
        var newmeshFile = MLJ.core.Scene.createLayer("Voronoi Remeshing of " + meshFile.name);
        Module.VoronoiClustering(meshFile.ptrMesh(), newmeshFile.ptrMesh(),
            voronoiRatioWidget.getValue(), relaxNumWidget.getValue(),
            parseInt(relaxTypeWidget.getValue()),
            postRelaxStepWidget.getValue(), postRefineStepWidget.getValue(),
            colorizeMeshWidget.getValue());
        scene.addLayer(newmeshFile);
        if (colorizeMeshWidget.getValue())
            meshFile.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
    };

    /******************************************************************************/
    var ConvexHullFilter = new plugin.Filter({
        name: "Convex Hull",
        tooltip: "Create a new layer with the convex hull of the vertexes of the current mesh. " +
        "It uses a slight variant of the quickhull algorithm.",
        arity: 2
    });

    ConvexHullFilter._init = function (builder) { };

    ConvexHullFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.Scene.createLayer("ConvexHull of " + basemeshFile.name);
        Module.ConvexHullFilter(basemeshFile.ptrMesh(), newmeshFile.ptrMesh());
        scene.addLayer(newmeshFile);
    };
    /******************************************************************************/
    var RemoveUnrefVert = new plugin.Filter({
        name: "Remove Unreferenced Vertices",
        tooltip: "Remove vertices that are not referenced from the mesh (e.g. vertices without any incident face).",
        arity: 1
    });

    RemoveUnrefVert._init = function (builder) { };

    RemoveUnrefVert._applyTo = function (basemeshFile) {
        Module.RemoveUnreferencedVertices(basemeshFile.ptrMesh());
    };
    /******************************************************************************/
    var RemoveDupVert = new plugin.Filter({
        name: "Remove Duplicated Vertices",
        tooltip: "Unify all the vertices with the same coordinates to a single vertex",
        arity: 1
    });

    RemoveDupVert._init = function (builder) { };

    RemoveDupVert._applyTo = function (basemeshFile) {
        Module.RemoveDuplicatedVertices(basemeshFile.ptrMesh());
    };
    /******************************************************************************/
    var InvertFaceOrientation = new plugin.Filter({
        name: "Invert Face Orientation",
        tooltip: "Flip all the orientation of all the faces of a mesh by swapping the vertex order inside each triangle.",
        arity: 1
    });

    InvertFaceOrientation._init = function (builder) { };

    InvertFaceOrientation._applyTo = function (basemeshFile) {
        Module.InvertFaceOrientation(basemeshFile.ptrMesh());
    };
    /******************************************************************************/
    var ReorientFaceCoherently = new plugin.Filter({
        name: "Reorient Face coherently",
        tooltip: "Reorient all the faces of a mesh in a coherent way. Require that the mesh is two-manifold and orientable",
        arity: 1
    });

    ReorientFaceCoherently._init = function (builder) { };

    ReorientFaceCoherently._applyTo = function (basemeshFile) {
        Module.ReorientFaceCoherently(basemeshFile.ptrMesh());
    };
    /******************************************************************************/
    var CutAlongCrease = new plugin.Filter({
        name: "Cut Along Crease",
        tooltip: "Cut the current mesh along the crease edges, e.g. the edges where the two adjacent faces have normals that differs more than a given angle. .",
        arity: 1
    });
    var creaseAngleWidget
    CutAlongCrease._init = function (builder) {
        creaseAngleWidget = builder.RangedFloat({
            max: 90.0, min: 0, step: 10, defval: 70,
            label: "Crease Angle",
            tooltip: "All the edges where the adjacent normals spans an angle larger than this value are marked are considered crease and cut."
        });
    };

    CutAlongCrease._applyTo = function (basemeshFile) {
        Module.CutAlongCreaseFilter(basemeshFile.ptrMesh(), creaseAngleWidget.getValue());
    };
    /******************************************************************************/
    var CutTopological = new plugin.Filter({
        name: "Cut to Topological Disk",
        tooltip: "Cut the current mesh So that it becomes topologically equivalent to an open disk.",
        arity: 1
    });
    CutTopological._init = function (builder) { };

    CutTopological._applyTo = function (basemeshFile) {
        Module.CutTopologicalFilter(basemeshFile.ptrMesh());
    };
    /******************************************************************************/
    var HoleFilling = new plugin.Filter({
        name: "Hole Filling",
        tooltip: "Fill all the holes of the mesh within a given size (expressed as boundary edge number)  ",
        arity: 1
    });
    var maxHoleEdgeNumWidget
    HoleFilling._init = function (builder) {
        maxHoleEdgeNumWidget = builder.Integer({
            min: 0, step: 10, defval: 30,
            label: "Max Hole Size",
            tooltip: "The maximum number of edges of the boundary of the holes to be filled."
        });
    };

    HoleFilling._applyTo = function (basemeshFile) {
        Module.HoleFilling(basemeshFile.ptrMesh(), maxHoleEdgeNumWidget.getValue());
    };
    /******************************************************************************/
    var CoarseIsotropicRemeshing = new plugin.Filter({
        name: "Coarse Isotropic Remeshing",
        tooltip: "TODO ",
        arity: 1
    });
    var iterNumWidget, adaptiveWidget, creaseThrWidget;
    CoarseIsotropicRemeshing._init = function (builder) {
        iterNumWidget = builder.Integer({
            min: 1, step: 1, defval: 1,
            label: "Iterations",
            tooltip: "No. of iterations to do."
        });
        /* TODO support this in cpp */
        adaptiveWidget = builder.Bool({
            defval: true,
            label: "Adaptive",
            tooltip: "Toggles adaptive isotropic remeshing"
        });
        /*TODO support this in cpp*/ 
        creaseThrWidget = builder.RangedFloat({
            min: 1, max: 90, step: 0.3, defval: 30,
            label: "Crease Threshold",
            tooltip: "Minimum angle between faces to consider the shared edge as crease."
        });
    };



    CoarseIsotropicRemeshing._applyTo = function (basemeshFile) {
        Module.CoarseIsotropicRemeshing(
            basemeshFile.ptrMesh(),
            iterNumWidget.getValue(), 
            adaptiveWidget.getValue(), 
            creaseThrWidget.getValue()
            );
    };
    /******************************************************************************/

    plugin.Manager.install(QuadricSimpFilter);
    plugin.Manager.install(ClusteringFilter);
    plugin.Manager.install(VoronoiRemeshingFilter);
    plugin.Manager.install(ConvexHullFilter);
    plugin.Manager.install(RemoveUnrefVert);
    plugin.Manager.install(RemoveDupVert);
    plugin.Manager.install(InvertFaceOrientation);
    plugin.Manager.install(ReorientFaceCoherently);
    plugin.Manager.install(CutAlongCrease);
    plugin.Manager.install(CutTopological);
    plugin.Manager.install(HoleFilling);
    plugin.Manager.install(CoarseIsotropicRemeshing);

})(MLJ.core.plugin, MLJ.core.Scene);