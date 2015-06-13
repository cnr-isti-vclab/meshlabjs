
(function (plugin, gui, scene) {

    var filter = new plugin.Filter("Smooth");
    var DEFAULT_STEP = 1;
    var _step = DEFAULT_STEP;

    function _smooth(meshFile, step) {

        var visible = meshFile.getThreeMesh().visible;
        scene.removeLayerByName(meshFile.name);
        console.time("Smooth time ");
        Module.Smooth(meshFile.ptrMesh, step);
        console.timeEnd("Smooth time ");
        console.time("Update mesh ");
        meshFile.updateThreeMesh();
        meshFile.getThreeMesh().visible = visible;
        console.timeEnd("Update mesh ");
        scene.addLayer(meshFile);
    }

    function _smoothSelected() {
        var meshFile = scene.getSelectedLayer();
        _smooth(meshFile, _step);
    }

    function _smoothAll() {
        var ptr = scene.getLayers().pointer();
        while (ptr.hasNext()) {
            _smooth(ptr.next(), _step);
        }
    }

    filter._main = function (accordEntry) {

        var apply = gui.build.button.Button("Apply", "Apply to selected mesh");
        var applyAll = gui.build.button.Button("Apply all", "Apply to all mesh in the scene");
        accordEntry.addHeaderButton(apply, applyAll);

        var spinner = gui.build.Spinner({max: 5, min: 1, defval: DEFAULT_STEP});

        accordEntry.appendContent(
                gui.component.Grid("Step", spinner));

        apply.onClick(function () {
            _smoothSelected();
        });

        applyAll.onClick(function () {
            _smoothAll();
        });

        spinner.onChange(function (event) {
            _step = parseInt(event.target.value);
        });

    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);