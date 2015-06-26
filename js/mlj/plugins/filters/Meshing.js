
(function (plugin, scene) {

    var filter = new plugin.Filter(
            "QuadricSimplification",
            "Simplify (decimate) a mesh according to a edge collapse strategy",
            false);

    var ratioW;

    filter._init = function (builder) {

        ratioW = builder.Float({
            max: 1, min: 0, step: 0.1, defval: 0.5,
            label: "SimplificationRatio",
            tooltip: "Amount of Simplification"
        });

    };

    filter._applyTo = function (meshFile) {
        Module.QuadricSimplification(meshFile.ptrMesh, ratioW.getValue(),0,true);
        scene.updateLayer(meshFile);
    };

    plugin.install(filter);

})(MLJ.core.plugin, MLJ.core.Scene);