
(function (plugin, gui, scene) {

    var filter = new plugin.Filter("Smooth", false);
    var DEFAULT_STEP = 1;
    var _step = DEFAULT_STEP;
    var _weight = false;

    filter._init = function (accordEntry) {

        var spinner = gui.build.Spinner({max: 5, min: 1, defval: DEFAULT_STEP});

        accordEntry.appendContent(
                gui.component.Grid(gui.build.Label("Step"), spinner));
        
        spinner.onChange(function (event) {
            _step = parseInt(event.target.value);
        });

        // Qui ci vorrebbe un secondo paraemtro booleano. Qualcsa tipo 
        // _weightWidget = gui.build("Use Cotangent Weights",true, "Long Descriptive help..."); 
    };

    filter._applyTo = function (meshFile) {
        console.time("Smooth time");
        Module.Smooth(meshFile.ptrMesh, _step, _weight);
        console.timeEnd("Smooth time");
        console.time("Update mesh");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh");
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);