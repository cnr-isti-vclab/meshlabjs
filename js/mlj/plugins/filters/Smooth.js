
(function (plugin, scene) {

    var filter = new plugin.Filter("Smooth",
            null,
            false);

    var stepWidget;
    var weightWidget;

    filter._init = function (builder) {

        stepWidget = builder.Integer({
            min: 1, step: 1, defval: 1,
            label: "Step",
            tooltip: "Number of iteration of the smoothing algorithm"
        });

        weightWidget = builder.Bool({
            defval: false,
            label: "Cotangent Weights",
            tooltip: "Use cotangent weighting scheme during relaxation."
        });

    };

    filter._applyTo = function (meshFile) {
        Module.Smooth(meshFile.ptrMesh, stepWidget.getValue(), weightWidget.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);