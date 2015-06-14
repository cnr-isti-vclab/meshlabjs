
(function (plugin, gui, scene) {

    var filter = new plugin.Filter("Refine");
    var DEFAULT_STEP = 1;
    var _step = DEFAULT_STEP;

    function _refine(meshFile, step) {
        console.time("Refine time ");
        var refine = new Module.MyRefine(meshFile.ptrMesh);
        refine.myRefine(step);
        console.timeEnd("Refine time ");
        console.time("Update mesh ");
        scene.updateLayer(meshFile);
        console.timeEnd("Update mesh ");
    }

    function _refineSelected() {
        var meshFile = scene.getSelectedLayer();
        _refine(meshFile, _step);
    }

    function _refineAll() {
        var ptr = scene.getLayers().pointer();
        while (ptr.hasNext()) {
            _refine(ptr.next(), _step);
        }
    }

    filter._main = function (accordEntry) {

        var apply = gui.build.button.Button("Apply", "Apply to selected mesh");
        var applyAll = gui.build.button.Button("Apply all", "Apply to all mesh in the scene");
        accordEntry.addHeaderButton(apply, applyAll);

        var spinner = gui.build.Spinner({max: 5, min: 1, defval: DEFAULT_STEP});

        accordEntry.appendContent(
                gui.component.Grid(gui.build.Label("Step"), spinner));

        apply.onClick(function () {
            _refineSelected();
        });

        applyAll.onClick(function () {
            _refineAll();
        });

        spinner.onChange(function (event) {
            _step = parseInt(event.target.value);
        });

    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);