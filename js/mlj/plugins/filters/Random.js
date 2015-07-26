
(function (plugin, scene) {

    var filter = new plugin.Filter({
            name:"Random Displacement",
            tooltip:null,
            arity:1
        });

    var displWidget, normalDispWidget;

    filter._init = function (builder) {

        displWidget = builder.Float({
            max: 0.1, min: 0.01, step: 0.01, defval: 0.01,
            label: "Displacement",
            tooltip: "Amount of random displacement added to each vertex of the mesh"
        });
           normalDispWidget = builder.Bool({
            defval: false,
            label: "Normal Directed Displ.",
            tooltip: "If true, the displacement is directed along the normal of the surface, otherwise it is in a random direction."
        });

    };

    filter._applyTo = function (meshFile) {
        Module.RandomDisplacement(meshFile.ptrMesh(), displWidget.getValue(),normalDispWidget.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.Manager.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);