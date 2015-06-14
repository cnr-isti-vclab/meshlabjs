
(function (plugin, gui, scene) {

    var filter = new plugin.Filter("Random Displacement");
    var DEFAULT_DISPLACEMENT = 0.01;
    var _displacement = DEFAULT_DISPLACEMENT;

    function _random(meshFile, displacement) {
        console.time("Random time");
        Module.RandomDisplacement(meshFile.ptrMesh, displacement);
        console.timeEnd("Random time");
        console.time("Update mesh ");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh ");
    }

    function _randomSelected() {
        var meshFile = scene.getSelectedLayer();
        _random(meshFile, _displacement);
    }

    function _randomAll() {
        var ptr = scene.getLayers().pointer();
        while (ptr.hasNext()) {
            _random(ptr.next(), _displacement);
        }
    }

    filter._main = function (accordEntry) {

        var apply = gui.build.button.Button("Apply", "Apply to selected mesh");
        var applyAll = gui.build.button.Button("Apply all", "Apply to all mesh in the scene");
        accordEntry.addHeaderButton(apply, applyAll);

        var spinner = gui.build.Spinner({max: 0.1, min: 0.01, step: 0.01, defval: DEFAULT_DISPLACEMENT});

        accordEntry.appendContent(
                gui.component.Grid(gui.build.Label("Displacement"), spinner));

        apply.onClick(function () {
            _randomSelected();
        });

        applyAll.onClick(function () {
            _randomAll();
        });

        spinner.onChange(function (event) {
            _displacement = parseFloat(event.target.value);
        });

    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);