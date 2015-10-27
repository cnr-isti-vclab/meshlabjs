
(function (plugin, scene) {

    var MontecarloSamplingFilter = new plugin.Filter({
        name: "Montecarlo Random Sampling",
        tooltip: "Create a new layer populated with a point sampling of the current mesh;" +
                " samples are generated in a randomly uniform way, or with a distribution biased by the per-vertex quality values of the mesh.",
        arity: 2
    });

    var sampleNumMCWidget;

    MontecarloSamplingFilter._init = function (builder) {

        sampleNumMCWidget = builder.Integer({
            min: 1, step: 1000, defval: 1000,
            label: "Sample Num",
            tooltip: "Number of samples that are randomly chosen over the surface of the mesh."
        });

    };

    MontecarloSamplingFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.Scene.createCppMeshFile("Montecarlo Samples");
        Module.MontecarloSampling(basemeshFile.ptrMesh(), newmeshFile.ptrMesh(), sampleNumMCWidget.getValue());
        scene.addLayer(newmeshFile);
    };

    plugin.Manager.install(MontecarloSamplingFilter);


    var PoissonDiskSamplingFilter = new plugin.Filter({
        name: "Poisson Disk Sampling",
        tooltip: "Create a new layer populated with a point sampling of the current mesh;" +
                "samples are generated according to a Poisson-disk distribution using the algorithm described in:<br>" +
                "<b>'Efficient and Flexible Sampling with Blue Noise Properties of Triangular Meshes'</b><br>" +
                " Massimiliano Corsini, Paolo Cignoni, Roberto Scopigno<br>IEEE TVCG 2012",
        arity: 2
    });

    var sampleNumPDWidget, radiusWidget;
     
    PoissonDiskSamplingFilter._init = function (builder) {

        sampleNumPDWidget = builder.Integer({
            min: 1, step: 1000, defval: 1000,
            label: "Sample Num",
            tooltip: "Number of samples that are randomly chosen over the surface of the mesh."
        });

        radiusWidget = builder.Float({
            min: 0.0, step: 0.1, defval: "0.0",
            label: "Radius",
            tooltip: "If not zero this parameter override the previous parameter to allow exact radius specification"
        });
    };

    PoissonDiskSamplingFilter._applyTo = function (basemeshFile) {

        var newmeshFile = MLJ.core.Scene.createCppMeshFile("Poisson Disk Samples");
        Module.PoissonDiskSampling(basemeshFile.ptrMesh(), newmeshFile.ptrMesh(),
                                   radiusWidget.getValue(),sampleNumPDWidget.getValue(),  0);
        scene.addLayer(newmeshFile);
    };

    plugin.Manager.install(PoissonDiskSamplingFilter);


})(MLJ.core.plugin, MLJ.core.Scene);