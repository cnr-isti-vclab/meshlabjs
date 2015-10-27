
/* global MLJ, Module */

(function (plugin, scene) {
    
/******************************************************************************/  
    var QuadricSimpFilter = new plugin.Filter({
        name: "Quadric Simplification",
        tooltip: "Simplify (decimate) a mesh according to a edge collapse strategy driven by a quadric based error evaluation strategy.",
        arity: 1
    });

    var ratioW;
    QuadricSimpFilter._init = function (builder) {
        ratioW = builder.RangedFloat({
            max: 1, min: 0, step: 0.1, defval: 0.5,
            label: "Simplification Ratio",
            tooltip: "Amount of Simplification expressed as a percentage of the initial mesh complexity."
        });
    };

    QuadricSimpFilter._applyTo = function (meshFile) {
        Module.QuadricSimplification(meshFile.ptrMesh(), ratioW.getValue(), 0, true);
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
    var ConvexHullFilter = new plugin.Filter({
        name: "Convex Hull",
        tooltip: "Create a new layer with the convex hull of the vertexes of the current mesh. "+
                 "It uses a slight variant of the quickhull algorithm.",
        arity: 2
    });

    ConvexHullFilter._init = function (builder) {};

    ConvexHullFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.Scene.createCppMeshFile("ConvexHull of "+basemeshFile.name);
        Module.ConvexHullFilter(basemeshFile.ptrMesh(), newmeshFile.ptrMesh());
        scene.addLayer(newmeshFile);
    };
/******************************************************************************/  
    var RemoveUnrefVert = new plugin.Filter({
        name: "Remove Unreferenced Vertices",
        tooltip: "Remove vertices that are not referenced from the mesh (e.g. vertices without any incident face).",
        arity: 1
    });

    RemoveUnrefVert._init = function (builder) {};

    RemoveUnrefVert._applyTo = function (basemeshFile) {
        Module.RemoveUnreferencedVertices(basemeshFile.ptrMesh());
    };
/******************************************************************************/  
    var RemoveDupVert = new plugin.Filter({
        name: "Remove Duplicated Vertices",
        tooltip: "Unify all the vertices with the same coordinates to a single vertex",
        arity: 1
    });

    RemoveDupVert._init = function (builder) {};

    RemoveDupVert._applyTo = function (basemeshFile) {
        Module.RemoveDuplicatedVertices(basemeshFile.ptrMesh());
    };
/******************************************************************************/  

    plugin.Manager.install(QuadricSimpFilter);
    plugin.Manager.install(ClusteringFilter);
    plugin.Manager.install(ConvexHullFilter);
    plugin.Manager.install(RemoveUnrefVert);
    plugin.Manager.install(RemoveDupVert);
    

})(MLJ.core.plugin, MLJ.core.Scene);