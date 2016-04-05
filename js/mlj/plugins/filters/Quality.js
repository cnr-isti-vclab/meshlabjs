(function (plugin, scene) {
    
    /******************************************************************************/ 
    
    var ClampVertexQualityFilter = new plugin.Filter({
        name: "Clamp Vertex Quality",
        tooltip: "Clamp vertex quality values to a given range according to specific values or to percentiles",
        arity: 1
    });
   
    
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
    

    ClampVertexQualityFilter._applyTo = function(meshFile) {
        Module.ClampVertexQuality(meshFile.ptrMesh(), min.getValue(), max.getValue(), percentile.getValue(), zeroSym.getValue());
    };

    plugin.Manager.install(ClampVertexQualityFilter);

/******************************************************************************/  

    var SmoothVertexQualityFilter = new plugin.Filter({
        name: "Smooth Vertex Quality",
        tooltip: "Laplacian smooth of the quality values.",
        arity: 1
    });
    
    SmoothVertexQualityFilter._applyTo = function(meshFile) {
        Module.SmoothVertexQuality(meshFile.ptrMesh());
    };

    plugin.Manager.install(SmoothVertexQualityFilter);

/******************************************************************************/  

var ComputeQualityAsFaceQualityFilter = new plugin.Filter({
        name: "Compute Quality as Face Quality",
        tooltip: "Compute a quality and colorize faces depending on triangle quality: <br>"
                +"1: minimum ratio height/edge among the edges<br>"
                +"2: ratio between radii of incenter and circumcenter<br>"
                +"3: 2*sqrt(a, b)/(a+b), a, b the eigenvalues of M^tM, M transform triangle into equilateral",
        arity: 1
    });
    

    var choiceWidget;

    ComputeQualityAsFaceQualityFilter._init = function (builder) {
        choiceWidget = builder.Choice({
            label: "Metric",
            tooltip: "Choose a metric to compute triangle quality",
            options: [
                {content: "area/max side", value: "0", selected: true},
                {content: "inradius/circumradius", value: "1"},
                {content: "mean ratio", value: "2"},
                {content: "Area", value: "3"},
            ]
        });
    };
    
    ComputeQualityAsFaceQualityFilter._applyTo = function(meshFile) {
        Module.ComputeQualityAsFaceQuality(meshFile.ptrMesh(), parseInt(choiceWidget.getValue()));
    };

    plugin.Manager.install(ComputeQualityAsFaceQualityFilter);
    
    
/******************************************************************************/  

    var FaceQualityFromVertexFilter = new plugin.Filter({
        name: "Face Quality From Vertex",
        tooltip: "Transfers vertex quality to face",
        arity: 1
    });
    
    FaceQualityFromVertexFilter._applyTo = function(meshFile) {
        Module.FaceQualityFromVertex(meshFile.ptrMesh());
    };

    plugin.Manager.install(FaceQualityFromVertexFilter);

/******************************************************************************/  

    var VertexQualityFromFaceFilter = new plugin.Filter({
        name: "Vertex Quality From Face",
        tooltip: "Transfers face quality to vertices",
        arity: 1
    });
    
    var areaWeighted;

    VertexQualityFromFaceFilter._init = function (builder) {
        areaWeighted = new builder.Bool({
            defval: true,
            label: "Area Weighted",
            tooltip: "If true, to compute the quality will be used a weight that depends on the area of each face"
        });
    };
    
    VertexQualityFromFaceFilter._applyTo = function(meshFile) {
        Module.VertexQualityFromFace(meshFile.ptrMesh(), areaWeighted.getValue());
    };

    plugin.Manager.install(VertexQualityFromFaceFilter);

/******************************************************************************/  

})(MLJ.core.plugin, MLJ.core.Scene);