
(function (plugin, gui, scene) {

    var filter = new plugin.Filter("Refine",false);
    var DEFAULT_STEP = 1;
    var _step = DEFAULT_STEP;

    filter._init = function (accordEntry) {
        var spinner = gui.build.Spinner({max: 5, min: 1, defval: DEFAULT_STEP});

        accordEntry.appendContent(
                gui.component.Grid(gui.build.Label("Step"), spinner));

        spinner.onChange(function (event) {
            _step = parseInt(event.target.value);
        });
    };


    filter._applyTo = function (meshFile) {
        console.time("Refine time");
        var refine = new Module.MyRefine(meshFile.ptrMesh);
        refine.myRefine(_step);
        console.timeEnd("Refine time");
        console.time("Update mesh");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh");
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);