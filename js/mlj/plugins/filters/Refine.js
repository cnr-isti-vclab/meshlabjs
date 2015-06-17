
(function (plugin, scene) {

    var filter = new plugin.Filter("Refine", false);

    var spinner;
    filter._init = function (builder) {

        spinner = builder.Integer({
            max: 5, min: 1, step: 1, defval: 1,
            label: "Step",
            tooltip: "Amount of refinement steps"
        });

    };

    filter._applyTo = function (meshFile) {
        console.time("Refine time");
        var refine = new Module.MyRefine(meshFile.ptrMesh);
        refine.myRefine(spinner.getValue());
        console.timeEnd("Refine time");
        console.time("Update mesh");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh");
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);