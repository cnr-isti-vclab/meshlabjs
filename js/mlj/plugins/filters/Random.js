
(function (plugin, scene) {

    var RndDisplacementFilter = new plugin.Filter({
            name:"Random Displacement",
            tooltip:null,
            arity:1
        });

    var displWidget, normalDispWidget;

    RndDisplacementFilter._init = function (builder) {

        displWidget = builder.Float({
            max: 0.1, min: 0.01, step: 0.01, defval: 0.01,
            label: "Displacement",
            tooltip: "Amount of random displacement added to each vertex of the mesh"
        });
           normalDispWidget = builder.Bool({
            defval: false,
            label: "Normal Directed Displ.",
            tooltip: "If true, the displacement is directed along the normal of the surface, otherwise it is in a random direction."
        });

    };

    RndDisplacementFilter._applyTo = function (meshFile) {
        Module.RandomDisplacement(meshFile.ptrMesh(), displWidget.getValue(),normalDispWidget.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.Manager.install(RndDisplacementFilter);
    
    /*****/
    
    var RndSelectionFilter = new plugin.Filter({
            name:"Random Selection",
            tooltip:null,
            arity:1
        });

    var faceRatioWidget, verttRatioWidget;

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
        Module.RandomSelection(meshFile.ptrMesh(), vertRatioWidget.getValue(),faceRatioWidget.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.Manager.install(RndSelectionFilter);

})(MLJ.core.plugin, MLJ.core.Scene);