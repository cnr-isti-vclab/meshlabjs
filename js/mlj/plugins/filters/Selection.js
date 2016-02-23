
(function (plugin, scene) {
    const USE_BOTH = 0,
          USE_FACE = 1,
          USE_VERT = 2;
/******************************************************************************/
    var SelectionDilateFilter = new plugin.Filter({
        name: "Selection Face Dilate",
        tooltip: "Perform a morphological dilate operation on the set of the selected faces",
        arity: 1
    });

    SelectionDilateFilter._init = function (builder) {  };

    SelectionDilateFilter._applyTo = function (meshFile) {
        Module.SelectionDilate(meshFile.ptrMesh());
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
    };
/******************************************************************************/        
    var SelectionByConnectedComponentSizeFilter = new plugin.Filter({
            name:"Selection by Connected Component Size",
            tooltip: "Select all the faces of the connected components composed by a "+
                    "face number smaller than the given threshold. Useful for selecting "+
                    "all the small pieces floating around noisy datasets.",
            arity:1
        });

    var ccSizeRatioWidget;
    SelectionByConnectedComponentSizeFilter._init = function (builder) {
        ccSizeRatioWidget = builder.RangedFloat({
            max: 1, min: 0, step: 0.1, defval: 0.2,
            label: "CC Size Ratio",
            tooltip: "The ratio (expressed as 0..1) of the maximum connected component size that will be selected. "+
                    "E.g. with a ratio of 0.2 the filter will select all the connected components containing less than 20% of the number of faces "+
                    "of the largest connected component."
        });
        
    };

    SelectionByConnectedComponentSizeFilter._applyTo = function (meshFile) {
        Module.SelectionByConnectedComponentSize(meshFile.ptrMesh(), ccSizeRatioWidget.getValue());
    };
/******************************************************************************/
     var SelectionByQualityFilter = new plugin.Filter({
        name: "Selection by Quality",
        tooltip: "Select in the current layer the vertex/face whose quality is below a given threshold, expressed as an actual value or a percentage / percentile of the range of the quality.",
        arity: 1
    });
    
    var thresholdWidget,selModeWdg, vertexFaceWidget;
    SelectionByQualityFilter._init = function (builder) {
        
        thresholdWidget = builder.RangedFloat({
            max: 1.0, min: 0.0, step: 0.01, defval: 0.5,
            label: "Threshold %",
            tooltip: "As a indicated in the below widget"
        });
        
        selModeWdg = builder.Choice({
            label: "Threshold Mode",
            tooltip: "Specify how the indicated threshold is used",
            options: [
                {content: "Percentage", value: 0 },
                {content: "Percentile", value: 1, selected: true},
                {content: "Actual Value", value: 2}
            ]
        });    
        
        vertexFaceWidget = builder.Bool({
            defval: true,
            label: "Per vertex",
            tooltip: "If true, vertex quality is used and vertexes are selected, otherwise the filter work by face."
        });
    };

    SelectionByQualityFilter._applyTo = function (basemeshFile) {
        Module.SelectionByQuality(basemeshFile.ptrMesh(),thresholdWidget.getValue(), vertexFaceWidget.getValue(),selModeWdg.getValue());
    };
/******************************************************************************/    
    var SelectionDeleteVertex = new plugin.Filter({
        name: "Delete Selected Vertices",
        tooltip: "Delete all the selected vertices. For sake of consistency all "
                +"the faces that are incident on selected vertices are deleted too",
        arity: 1
    });
    SelectionDeleteVertex._init = function (builder) {} 
    SelectionDeleteVertex._applyTo = function (meshFile) {
        Module.SelectionDeleteVertex(meshFile.ptrMesh());
    };
/******************************************************************************/    
    var SelectionDeleteFace = new plugin.Filter({
        name: "Delete Selected Faces",
        tooltip: "All the Selected Faces are deleted. For sake of consistency we delete"
                +"also all the vertices that would become isolated after the "
                +"deletion of the faces.",
        arity: 1
    });
    SelectionDeleteFace._init = function (builder) {} 
    SelectionDeleteFace._applyTo = function (meshFile) {
        Module.SelectionDeleteFace(meshFile.ptrMesh());
    };
/******************************************************************************/    
    var SelectionMoveToNewLayer = new plugin.Filter({
        name: "Move Selection to New Layer",
        tooltip: "Move the selected vertices and faces onto a new layer. "
                +"All the selected faces are moved and all the vertices that "
                +"are selected <b>or</b> incident on a selcted face. ",
        arity: 2
    });
    var deleteOrigFaceWidget;
    SelectionMoveToNewLayer._init = function (builder) {
            deleteOrigFaceWidget = builder.Bool({
            defval: true,
            label: "Delete Orig. Face",
            tooltip: "If true, the selected face in the initial mesh are deleted"
        });

    } 
    SelectionMoveToNewLayer._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.Scene.createLayer("Selection of "+basemeshFile.name);
        Module.SelectionMoveToNewLayer(basemeshFile.ptrMesh(), newmeshFile.ptrMesh(),deleteOrigFaceWidget.getValue());
        scene.addLayer(newmeshFile);
    };
/******************************************************************************/
    plugin.Manager.install(SelectionDilateFilter);
    plugin.Manager.install(SelectionErodeFilter);
    plugin.Manager.install(SelectionAllFilter);
    plugin.Manager.install(SelectionNoneFilter);
    plugin.Manager.install(SelectionInvertFilter);
    plugin.Manager.install(RndSelectionFilter);
    plugin.Manager.install(SelectionByQualityFilter);
    plugin.Manager.install(SelectionDeleteFace);
    plugin.Manager.install(SelectionDeleteVertex);
    plugin.Manager.install(SelectionMoveToNewLayer);
    plugin.Manager.install(SelectionByConnectedComponentSizeFilter);

})(MLJ.core.plugin, MLJ.core.Scene);