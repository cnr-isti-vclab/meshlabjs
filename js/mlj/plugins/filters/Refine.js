
(function (plugin, scene) {

    var filter = new plugin.Filter(
        "Refine", 
        "Apply a subdvision surface refinement step, using various approach (midpoint/loop)" , false);

    var spinner;
    filter._init = function (builder) {

        spinner = builder.Integer({
            max: 5, min: 1, step: 1, defval: 1,
            label: "Step",
            tooltip: "How many refinement iterations are applied to the mesh"
        });

    };

    filter._applyTo = function (meshFile) {
        var refine = new Module.MyRefine(meshFile.ptrMesh);
        refine.myRefine(spinner.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);