
/* global MLJ, Module */

(function (plugin, scene) {
    
    const USE_BOTH = 0,
          USE_FACE = 1,
          USE_VERT = 2;
          
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
        Module.SelectionDilate(meshFile.ptrMesh());
        scene.updateLayer(meshFile);
    };
    
    var SelectionErodeFilter = new plugin.Filter({
        name: "Selection Face Erode",
        tooltip: "Perform a morphological erosion operation on the set of the selected faces",
        arity: 1
    });

    SelectionErodeFilter._init = function (builder) {  };

    SelectionErodeFilter._applyTo = function (meshFile) {
        Module.SelectionErode(meshFile.ptrMesh());
        scene.updateLayer(meshFile);
    };
    
    var SelectionAllFilter = new plugin.Filter({
        name: "Selection All",
        tooltip: "Select all the element of the mesh. Can works on faces, vertex or both.",
        arity: 1
    });
    var SelectionAllWidget;
    
    SelectionAllFilter._init = function (builder) { 
    SelectionAllWidget = builder.Choice({
            label: "Element",
            tooltip: "Select to what element the filter should be applied",
            options: [
                {content: "Both", value: USE_BOTH, selected: true},
                {content: "Face", value: USE_FACE},
                {content: "Vert", value: USE_VERT}
            ]
        });
    };

    SelectionAllFilter._applyTo = function (meshFile) {
        var vertFlag,faceFlag;
        switch(SelectionAllWidget.getValue()) {
            case USE_BOTH: vertFlag = true;  faceFlag = true; break;
            case USE_FACE: vertFlag = false; faceFlag = false; break;
            case USE_VERT: vertFlag = true;  faceFlag = false; break;
        }
        Module.SelectionAll(meshFile.ptrMesh(),vertFlag,faceFlag);
        scene.updateLayer(meshFile);
    };
    
    var SelectionNoneFilter = new plugin.Filter({
        name: "Selection None",
        tooltip: "Clear current selection.",
        arity: 1
    });
    var SelectionNoneWidget;
    SelectionNoneFilter._init = function (builder) {  
    SelectionNoneWidget = builder.Choice({
            label: "Element",
            tooltip: "Select to what element the filter should be applied",
            options: [
                {content: "Both", value: USE_BOTH, selected: true},
                {content: "Face", value: USE_FACE},
                {content: "Vert", value: USE_VERT}
            ]
        });
    };

    SelectionNoneFilter._applyTo = function (meshFile) {
        var vertFlag,faceFlag;
        switch(SelectionAllWidget.getValue()) {
            case USE_BOTH: vertFlag = true;  faceFlag = true; break;
            case USE_FACE: vertFlag = false; faceFlag = false; break;
            case USE_VERT: vertFlag = true;  faceFlag = false; break;
        }
        Module.SelectionNone(meshFile.ptrMesh(),vertFlag,faceFlag);
        scene.updateLayer(meshFile);
    };
    
    var SelectionInvertFilter = new plugin.Filter({
        name: "Selection Invert",
        tooltip: "Invert the current selection",
        arity: 1
    });

    var SelectionInvertWidget;
    SelectionInvertFilter._init = function (builder) { 
    SelectionInvertWidget = builder.Choice({
            label: "Element",
            tooltip: "Select to what element the filter should be applied",
            options: [
                {content: "Both", value: USE_BOTH, selected: true},
                {content: "Face", value: USE_FACE},
                {content: "Vert", value: USE_VERT}
            ]
        });
    };

    SelectionInvertFilter._applyTo = function (meshFile) {
        var vertFlag,faceFlag;
        switch(SelectionAllWidget.getValue()) {
            case USE_BOTH: vertFlag = true;  faceFlag = true; break;
            case USE_FACE: vertFlag = false; faceFlag = false; break;
            case USE_VERT: vertFlag = true;  faceFlag = false; break;
        }
        Module.SelectionInvert(meshFile.ptrMesh(),vertFlag,faceFlag);
        scene.updateLayer(meshFile);
    };
    
    var ConvexHullFilter = new plugin.Filter({
        name: "Convex Hull",
        tooltip: "Create a new layer with the convex hull of the vertexes of the current mesh. "+
                 "It uses a slight variant of the quickhull algorithm.",
        arity: 1
    });

    ConvexHullFilter._init = function (builder) {
    };

    ConvexHullFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.File.createCppMeshFile("ConvexHull of "+basemeshFile.name);
        Module.ConvexHullFilter(basemeshFile.ptrMesh(), newmeshFile.ptrMesh());
        scene.addLayer(newmeshFile);
    };

    
    
    
    plugin.Manager.install(QuadricSimpFilter);
    plugin.Manager.install(ClusteringFilter);
    plugin.Manager.install(SelectionDilateFilter);
    plugin.Manager.install(SelectionErodeFilter);
    plugin.Manager.install(SelectionAllFilter);
    plugin.Manager.install(SelectionNoneFilter);
    plugin.Manager.install(SelectionInvertFilter);
    plugin.Manager.install(ConvexHullFilter);
    

})(MLJ.core.plugin, MLJ.core.Scene);