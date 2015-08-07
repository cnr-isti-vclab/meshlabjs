
(function (plugin, scene) {

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
        scene.updateLayer(meshFile);
    };


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
        scene.updateLayer(meshFile);
    };
    
    var SelectionDilateFilter = new plugin.Filter({
        name: "Selection Face Dilate",
        tooltip: "Perform a morphological dilate operation on the set of the selected faces",
        arity: 1
    });

    SelectionDilateFilter._init = function (builder) {  };

    SelectionDilateFilter._applyTo = function (meshFile) {
        Module.DilateSelection(meshFile.ptrMesh());
        scene.updateLayer(meshFile);
    };
    
    var SelectionErodeFilter = new plugin.Filter({
        name: "Selection Face Erode",
        tooltip: "Perform a morphological erosion operation on the set of the selected faces",
        arity: 1
    });

    SelectionErodeFilter._init = function (builder) {  };

    SelectionErodeFilter._applyTo = function (meshFile) {
        Module.ErodeSelection(meshFile.ptrMesh());
        scene.updateLayer(meshFile);
    };

    
    plugin.Manager.install(QuadricSimpFilter);
    plugin.Manager.install(ClusteringFilter);
    plugin.Manager.install(SelectionDilateFilter);
    plugin.Manager.install(SelectionErodeFilter);


})(MLJ.core.plugin, MLJ.core.Scene);