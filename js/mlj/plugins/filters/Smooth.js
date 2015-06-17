
(function (plugin, scene) {

    var filter = new plugin.Filter("Smooth", false);

    var spinner;
    filter._init = function (builder) {

        spinner = builder.Integer({
            max: 5, min: 1, step: 1, defval: 1,
            label: "Step",
            tooltip: "Amount of smooth steps"
        });

    };

    filter._applyTo = function (meshFile) {
        console.time("Smooth time");
        Module.Smooth(meshFile.ptrMesh, spinner.getValue());
        console.timeEnd("Smooth time");
        console.time("Update mesh");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh");
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);