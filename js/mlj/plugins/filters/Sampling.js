
(function (plugin, scene) {

    var MontecarloSamplingFilter = new plugin.Filter("Montecarlo Random Sampling",
            "Create a new layer populated with a point sampling of the current mesh;" +
            " samples are generated in a randomly uniform way, or with a distribution biased by the per-vertex quality values of the mesh.",
            false);

    var sampleNumMCWidget;

    MontecarloSamplingFilter._init = function (builder) {

        sampleNumMCWidget = builder.Integer({
            min: 1, step: 1000, defval: 1000,
            label: "Sample Num",
            tooltip: "Number of samples that are randomly chosen over the surface of the mesh."
        });

    };

    MontecarloSamplingFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.File.createCppMeshFile("Montecarlo Samples");
        Module.MontecarloSampling(basemeshFile.ptrMesh, newmeshFile.ptrMesh, sampleNumMCWidget.getValue());
        scene.addLayer(newmeshFile);
    };

    plugin.install(MontecarloSamplingFilter);


    var PoissonDiskSamplingFilter = new plugin.Filter("Poisson Disk Sampling",
            "Create a new layer populated with a point sampling of the current mesh;" +
            "samples are generated according to a Poisson-disk distribution using the algorithm described in:<br>" +
            "<b>'Efficient and Flexible Sampling with Blue Noise Properties of Triangular Meshes'</b><br>" +
            " Massimiliano Corsini, Paolo Cignoni, Roberto Scopigno<br>IEEE TVCG 2012",
            false);

    var stepTWidget, lambdaWidget, muWidget;

    PoissonDiskSamplingFilter._init = function (builder) {

        sampleNumPDWidget = builder.Integer({
            min: 1, step: 1000, defval: 1000,
            label: "Sample Num",
            tooltip: "Number of samples that are randomly chosen over the surface of the mesh."
        });

        radiusWidget = builder.Float({
            min: 0.0, step: 0.1, defval: 0.0,
            label: "Radius",
            tooltip: "If not zero this parameter override the previous parameter to allow exact radius specification"
        });
    };

    PoissonDiskSamplingFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.File.createCppMeshFile("Poisson Disk Samples");
        Module.PoissonDiskSampling(basemeshFile.ptrMesh, newmeshFile.ptrMesh, sampleNumPDWidget.getValue(), radiusWidget.getValue(), 0);
        scene.addLayer(newmeshFile);
    };

    plugin.install(PoissonDiskSamplingFilter);


})(MLJ.core.plugin, MLJ.core.Scene);