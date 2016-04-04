(function (plugin, scene) {
    
    /******************************************************************************/  
    var ClampVertexQualityFilter = new plugin.Filter({
        name: "Clamp Vertex Quality",
        tooltip: "Clamp vertex quality values to a given range according to specific values or to percentiles",
        arity: 1
    });
    
//    var ClampVertexQualityWidget;
    
    var min, max, percentile, zeroSym;

    ClampVertexQualityFilter._init = function (builder) {
            min = new builder.Float({
                    step: 0.5, defval: "0.0",
                    label: "Quality min",
                    tooltip: "The value that will be mapped to the lower end of the scale (blue)."
            });
            max = new builder.Float({
                    step: 0.5, defval: "7.0",
                    label: "Quality max",
                    tooltip: "The value that will be mapped to the upper end of the scale (red)."
            });
            percentile = new builder.RangedFloat({
                    max: 100, min: 0, step: 1, defval: 0,
                    label: "Percentile crop",
                    tooltip: ""
            });
            zeroSym = new builder.Bool({
                    defval: false,
                    label: "Zero symmetric",
                    tooltip: "If true, the quality range will be enlarged to be symmetric (so that green is always zero)"
            });
    };
    
//    ClampVertexQualityFilter._init = function (builder) { 
//    ClampVertexQualityWidget = builder.Choice({
//            label: "Element",
//            tooltip: "Select to what element the filter should be applied",
//            options: [
//                {content: "Both", value: USE_BOTH, selected: true},
//                {content: "Face", value: USE_FACE},
//                {content: "Vert", value: USE_VERT}
//            ]
//        });
//    };

    ClampVertexQualityFilter._applyTo = function(meshFile) {
        Module.ClampVertexQuality(meshFile.ptrMesh(), min.getValue(), max.getValue(), percentile.getValue(), zeroSym.getValue());
//        meshFile.cppMesh.addPerVertexColor();
//        meshFile.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
    };

    plugin.Manager.install(ClampVertexQualityFilter);

//    ClampVertexQualityFilter._applyTo = function (meshFile) {
//        var vertFlag,faceFlag;
//        switch(SelectionAllWidget.getValue()) {
//            case USE_BOTH: vertFlag = true;  faceFlag = true; break;
//            case USE_FACE: vertFlag = false; faceFlag = false; break;
//            case USE_VERT: vertFlag = true;  faceFlag = false; break;
//        }
//        Module.SelectionAll(meshFile.ptrMesh(),vertFlag,faceFlag);
//    };
/******************************************************************************/  

    var SmoothVertexQualityFilter = new plugin.Filter({
        name: "Smooth Vertex Quality",
        tooltip: "Laplacian smooth of the quality values.",
        arity: 1
    });
    
//    var ClampVertexQualityWidget;
    
    var min, max, percentile, zeroSym;

    SmoothVertexQualityFilter._init = function (builder) {
        
    };
    
    SmoothVertexQualityFilter._applyTo = function(meshFile) {
        Module.SmoothVertexQuality(meshFile.ptrMesh());
    };

    plugin.Manager.install(SmoothVertexQualityFilter);

/******************************************************************************/  

})(MLJ.core.plugin, MLJ.core.Scene);