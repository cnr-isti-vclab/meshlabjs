
(function (plugin, gui, scene) {

    var filter = new plugin.Filter("Random Displacement", false);
    var DEFAULT_DISPLACEMENT = 0.01;
    var _displacement = DEFAULT_DISPLACEMENT;

    filter._init = function (accordEntry) {

        var spinner = gui.build.Spinner({max: 0.1, min: 0.01, step: 0.01, defval: DEFAULT_DISPLACEMENT});

        accordEntry.appendContent(
                gui.component.Grid(gui.build.Label("Displacement"), spinner));

        spinner.onChange(function (event) {
            _displacement = parseFloat(event.target.value);
        });

    };

    filter._applyTo = function (meshFile) {
        console.time("Random time");
        Module.RandomDisplacement(meshFile.ptrMesh, _displacement);
        console.timeEnd("Random time");
        console.time("Update mesh ");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh ");
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);