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

})(MLJ.core.plugin, MLJ.core.Scene);
