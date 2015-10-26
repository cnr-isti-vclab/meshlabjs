
(function (plugin, scene) {

/******************************************************************************/
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
/******************************************************************************/
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
/******************************************************************************/  
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
/******************************************************************************/    
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
/******************************************************************************/    
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
/******************************************************************************/        
    var RndSelectionFilter = new plugin.Filter({
            name:"Random Selection",
            tooltip:null,
            arity:1
        });

    var faceRatioWidget, vertRatioWidget;
    RndSelectionFilter._init = function (builder) {
        faceRatioWidget = builder.RangedFloat({
            max: 1, min: 0, step: 0.1, defval: 0.5,
            label: "Face Ratio",
            tooltip: "Probability that a face is randomly selected"
        });
        vertRatioWidget = builder.RangedFloat({
            max: 1, min: 0, step: 0.1, defval: 0.5,
            label: "Vertex Ratio",
            tooltip: "Probability that a vertex is randomly selected"
        });
        
    };

    RndSelectionFilter._applyTo = function (meshFile) {
        Module.SelectionRandom(meshFile.ptrMesh(), vertRatioWidget.getValue(),faceRatioWidget.getValue());
        scene.updateLayer(meshFile);
    };
/******************************************************************************/
     var SelectionByQualityFilter = new plugin.Filter({
        name: "Selection by Quality",
        tooltip: "Select in the current layer the vertex/face whose quality is below a given threshold.",
        arity: 1
    });
    
    var thresholdWidget,vertexFaceWidget;
    SelectionByQualityFilter._init = function (builder) {
         thresholdWidget = builder.RangedFloat({
            max: 1.0, min: 0.0, step: 0.01, defval: 0.5,
            label: "Threshold %",
            tooltip: "As a percentage of the range of the quality"
        });
           vertexFaceWidget = builder.Bool({
            defval: true,
            label: "Per vertex",
            tooltip: "If true, vertex quality is used and vertexes are selected, otherwise the filter work by face."
        });
    };

    SelectionByQualityFilter._applyTo = function (basemeshFile) {
        Module.SelectionByQuality(basemeshFile.ptrMesh(),thresholdWidget.getValue(),vertexFaceWidget.getValue());
        scene.updateLayer(basemeshFile);
    };
/******************************************************************************/
    
   


    plugin.Manager.install(SelectionDilateFilter);
    plugin.Manager.install(SelectionErodeFilter);
    plugin.Manager.install(SelectionAllFilter);
    plugin.Manager.install(SelectionNoneFilter);
    plugin.Manager.install(SelectionInvertFilter);
    plugin.Manager.install(RndSelectionFilter);
    plugin.Manager.install(SelectionByQualityFilter);

})(MLJ.core.plugin, MLJ.core.Scene);