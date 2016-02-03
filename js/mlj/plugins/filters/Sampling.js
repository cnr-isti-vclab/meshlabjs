
(function (plugin, scene) {

    var MontecarloSamplingFilter = new plugin.Filter({
        name: "Montecarlo Random Sampling",
        tooltip: "Create a new layer populated with a point sampling of the current mesh;" +
                " samples are generated in a randomly uniform way, or with a distribution biased by the per-vertex quality values of the mesh.",
        arity: 2
    });

    var sampleNumMCWidget,perFaceNormalWidget;

    MontecarloSamplingFilter._init = function (builder) {

        sampleNumMCWidget = builder.Integer({
            min: 1, step: 1000, defval: 1000,
            label: "Sample Num",
            tooltip: "Number of samples that are randomly chosen over the surface of the mesh."
        });
           perFaceNormalWidget = builder.Bool({
            defval: true,
            label: "Per Face Normal",
            tooltip: "if true the sample normal is the face normal, otherwise it is interpolated."
        });

    };

    MontecarloSamplingFilter._applyTo = function (baseLayer) {
        var newLayer = MLJ.core.Scene.createLayer("Montecarlo Samples");
        newLayer.cppMesh.addPerVertexNormal();
        Module.MontecarloSampling(baseLayer.ptrMesh(), newLayer.ptrMesh(), sampleNumMCWidget.getValue(),
                perFaceNormalWidget.getValue());
        scene.addLayer(newLayer);
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

    PoissonDiskSamplingFilter._applyTo = function (baseLayer) {

        var newLayer = MLJ.core.Scene.createLayer("Poisson Disk Samples");
        newLayer.cppMesh.addPerVertexNormal();
        Module.PoissonDiskSampling(baseLayer.ptrMesh(), newLayer.ptrMesh(),
                                   radiusWidget.getValue(),sampleNumPDWidget.getValue(),  0);
        scene.addLayer(newLayer);
    };

    plugin.Manager.install(PoissonDiskSamplingFilter);


var VolumeMontecarloSamplingFilter = new plugin.Filter({
        name: "Volume Montecarlo Sampling",
        tooltip: "Compute a volumetric montecarlo sampling inside a watertight mesh.",
        arity: 2
    });

    var sampleVolNumWidget;
     
    VolumeMontecarloSamplingFilter._init = function (builder) {

        sampleVolNumWidget = builder.Integer({
            min: 10, step: 1000, defval: 10000,
            label: "Sample Num",
            tooltip: "Number of volumetric samples scattered inside the mesh."
        });
    };

    VolumeMontecarloSamplingFilter._applyTo = function (baseLayer) {

        var newLayer = MLJ.core.Scene.createLayer("Volume Samples");
        newLayer.cppMesh.addPerVertexNormal();
        var ret = Module.VolumeMontecarloSampling(baseLayer.ptrMesh(), newLayer.ptrMesh(),
                                   sampleVolNumWidget.getValue());
                                   
        if(ret===true)
        {            
            newLayer.cppMesh.addPerVertexColor();
            //newLayer.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
            scene.addLayer(newLayer);
        }
    };

    plugin.Manager.install(VolumeMontecarloSamplingFilter);
    
    
var VolumePoissonSamplingFilter = new plugin.Filter({
        name: "Volume Poisson Sampling",
        tooltip: "Compute a volumetric Poisson sampling inside a watertight mesh.",
        arity: 2
    });

    var VPSradiusWidget;
     
    VolumePoissonSamplingFilter._init = function (builder) {

        VPSradiusWidget = builder.Float({
            min: 0.0, step: 0.01, defval: "0.05",
            label: "Poisson Radius",
            tooltip: "The poisson sphere radius. Expressed as a percentage of the bbox diagonal"
        });
    };

    VolumePoissonSamplingFilter._applyTo = function (baseLayer) {

        var newLayer = MLJ.core.Scene.createLayer("Volume Poisson Samples");
        newLayer.cppMesh.addPerVertexNormal();
        var ret = Module.VolumePoissonSampling(baseLayer.ptrMesh(), newLayer.ptrMesh(),
                                   VPSradiusWidget.getValue());
                                   
        if(ret===true)
        {            
            newLayer.cppMesh.addPerVertexColor();
            //newLayer.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
            scene.addLayer(newLayer);
        }
    };

    plugin.Manager.install(VolumePoissonSamplingFilter);
})(MLJ.core.plugin, MLJ.core.Scene);