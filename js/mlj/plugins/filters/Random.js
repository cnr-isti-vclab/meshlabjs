
(function (plugin, scene) {

    var filter = new plugin.Filter(
            "Random Displacement",
            null,
            false);

    var spinner;

    filter._init = function (builder) {

        spinner = builder.Float({
            max: 0.1, min: 0.01, step: 0.01, defval: 0.01,
            label: "Displacement",
            tooltip: "Amount of random displacement added to each vertex of the mesh"
        });

    };

    filter._applyTo = function (meshFile) {
        Module.RandomDisplacement(meshFile.ptrMesh, spinner.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);