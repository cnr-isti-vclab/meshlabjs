
(function (plugin, scene) {

    var filter = new plugin.Filter({
        name: "Refine",
        tooltip: "Apply a subdvision surface refinement step, using various approach (midpoint/loop)",
        arity: 1
    });

    var iterWdg,refineTypeWidget;
    filter._init = function (builder) {

        iterWdg = builder.Integer({
            max: 5, min: 1, step: 1, defval: 1,
            label: "Step",
            tooltip: "How many refinement iterations are applied to the mesh"
        });
        refineTypeWidget  = builder.Choice({
            label: "Refinement Algorithm",
            tooltip: "Choose the possible subdivision surface algorithm",
            options: [
                {content: "Midpoint", value: "0", selected: true},
                {content: "Butterfly", value: "1"},
                {content: "Loop", value: "2"},
            ]
        });

    };

    filter._applyTo = function (meshFile) {
        Module.RefineMesh(meshFile.ptrMesh(),iterWdg.getValue(),parseInt(refineTypeWidget.getValue()));
    };

    plugin.Manager.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);