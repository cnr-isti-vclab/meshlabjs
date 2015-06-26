
(function (plugin, scene) {

    var filter = new plugin.Filter({
        name: "Refine",
        tooltip: "Apply a subdvision surface refinement step, using various approach (midpoint/loop)",
        arity: 1
    });

    var iterWdg;
    filter._init = function (builder) {

        iterWdg = builder.Integer({
            max: 5, min: 1, step: 1, defval: 1,
            label: "Step",
            tooltip: "How many refinement iterations are applied to the mesh"
        });

    };

    filter._applyTo = function (meshFile) {
        Module.RefineMesh(meshFile.ptrMesh,iterWdg.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);