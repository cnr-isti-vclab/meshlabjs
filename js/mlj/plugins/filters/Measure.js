(function(plugin, scene) {
    var Measure = { GEOMETRIC: "Geometric", TOPOLOGICAL: "Topological" };

    var MeasureFilter = new plugin.Filter({
        name: "Compute Measures",
        tooltip: "Compute geometric or topological measures of the selected mesh.",
        arity: 1
    });

    var measureChoice;

    MeasureFilter._init = function(builder) {
        measureChoice = new builder.Choice({
            label: "Measures",
            tooltip: "Select the type of measures to compute.",
            options: [
                { content: "Geometric", value: Measure.GEOMETRIC, selected: true },
                { content: "Topological", value: Measure.TOPOLOGICAL }
            ]
        });
    };

    MeasureFilter._applyTo = function(meshfile) {
        switch (measureChoice.getValue()) {
        case Measure.GEOMETRIC:
            Module.ComputeGeometricMeasures(meshfile.ptrMesh());
            break;

        case Measure.TOPOLOGICAL:
            Module.ComputeTopologicalMeasures(meshfile.ptrMesh());
            break;

        default:
            console.error("Compute Measures: unexpected measure type parameter.");
        }
    }

    plugin.Manager.install(MeasureFilter);
    
    var HausdorffFilter = new plugin.Filter({
        name: "Compute Hausdorff Distance ",
        tooltip: "Compute the Hausdorff distance between two meshes. Hausdorff distance is the standard technique for measuring the geometric difference between two surfaces.",
        arity: 2});

    var srcMeshWidget,trgMeshWidget,sampleNumWidget,maxDistWidget;

    HausdorffFilter._init = function (builder) {

        srcMeshWidget = builder.LayerSelection({
            label: "Source Mesh",
            tooltip: "The mesh that is sampled"
        });
        
        trgMeshWidget = builder.LayerSelection({
            label: "Target Mesh",
            tooltip: "The mesh where, for each sample, we search the closest point"
        });
        
        sampleNumWidget = builder.Integer({
            label: "Sample Num",
            tooltip: "Number of samples to be taken on source mesh",
            defval: 10000
        });
        
        maxDistWidget = builder.RangedFloat({
            min: 0, step: 0.1, max:1, defval:0.1,
            label: "Max Dist.",
            tooltip: "The distance cutoff expressed as percentage of the bbox diagonal"
        });
       
    };

    HausdorffFilter._applyTo = function () {
        Module.ComputeHausdorffDistance(srcMeshWidget.getSelectedPtrMesh(),
                                        trgMeshWidget.getSelectedPtrMesh(),
                                        sampleNumWidget.getValue(),maxDistWidget.getValue());
    };

    plugin.Manager.install(HausdorffFilter);
    

})(MLJ.core.plugin, MLJ.core.Scene);
