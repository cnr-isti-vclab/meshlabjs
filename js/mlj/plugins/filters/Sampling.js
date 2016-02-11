
/* global MLJ, Module */

(function (plugin, scene) {

/******************************************************************************/  

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

/******************************************************************************/  

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
    
/******************************************************************************/  

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
    
/******************************************************************************/  

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

/******************************************************************************/  

    var VoronoiScaffoldingFilter = new plugin.Filter({
        name: "Voronoi Scaffolding",
        tooltip: "Build a mesh representing the various elements of a Voronoi"
                +"tessellation of the interior of a given mesh.<br>"
                +"A number of seeds is distributed in the volume using a Poisson Disk"
                +"distribution and then relaxed using a barycentric Lloyd relaxation strategy."
                +"From these seeds we generate an implicit volumetric representation of the voronoi diagram" 
                +"and then an isosurface is extracted.",
        arity: 2
    });

    var VSradiusWidget,VSincludeSurfaceFlag,VSscaffoldingTypeWidget,VSVoxelPercWdg,
    VSthicknessWidget,VSRelaxStepWdg,VSSmoothStep,VSRandomSeedWdg;
     
    VoronoiScaffoldingFilter._init = function (builder) {

        VSradiusWidget = builder.Float({
            min: 0.0, step: 0.01, defval: "0.05",
            label: "Poisson Radius",
            tooltip: "The poisson sphere radius. Expressed as a percentage of the bbox diagonal."
                    +"It is the main parameter that regulates the number of voronoi seeds."
        });
        
        VSincludeSurfaceFlag = builder.Bool({
            defval: false,
            label: "Include Original Surface",
            tooltip: "If true, the original surface is included in the implicit reprsentation. "
        });
        
        VSscaffoldingTypeWidget  = builder.Choice({
            label: "Scaffolding type",
            tooltip: "Choose the element of the voronoi diagram that is ",
            options: [
                {content: "Seed", value: "0"},
                {content: "Edge", value: "1", selected: true},
                {content: "Internal Edge", value: "4"},
                {content: "Face", value: "2"},
                {content: "Corner", value: "3"}
            ]
        });
        
        VSthicknessWidget = builder.Float({
            min: 0.0, step: 0.001, defval: "0.01",
            label: "Thickness",
            tooltip: "The thickness of the generated structure. <br>"
                    +"Expressed as a percentage of the bbox diagonal. "
                    +"It should be greater or equal than the voxel size"
        });
        
        VSVoxelPercWdg = builder.Float({
            min: 0.0, step: 0.001, defval: "0.005",
            label: "Voxel size",
            tooltip: "Expressed as a percentage of the bbox diagonal, it represents the side of the voxel of the volumetric represetation.<br>"
                    +"Lowering this value increase the precision of the computed structure at expense of computational time. <br>"
                    +"Be careful, halving this value means more or less a x8 increase in computation time."
        });
        
        VSRelaxStepWdg = builder.Integer({
            max: 10, min: 0, step: 1, defval: 2,
            label: "Lloyd Relax Step",
            tooltip: "How many lloyd relaxation are performed to the seeds. <br>"
                    +"Higher values give more uniform seed distribution"
        });
        VSSmoothStepWdg = builder.Integer({
            max: 10, min: 0, step: 1, defval: 1,
            label: "Final Smooth",
            tooltip: "How many smoothing step are applied to the generated surface. <br>"
        });
        
        VSRandomSeedWdg = builder.Integer({
            step: 1, defval: 1,
            label: "Random Seed",
            tooltip: "The random seed used in generation. <br>"
                    +"Set it to a nonzero value for repeatability."
                    +"If zero is intialized with current clock time."
        });

    };

    VoronoiScaffoldingFilter._applyTo = function (baseLayer) {

        var newLayer = MLJ.core.Scene.createLayer("Voronoi Scaffolding");
        newLayer.cppMesh.addPerVertexNormal();
        var ret = Module.CreateVoronoiScaffolding(baseLayer.ptrMesh(), newLayer.ptrMesh(),
                                   VSradiusWidget.getValue(),VSRelaxStepWdg.getValue(),
                                   parseInt(VSscaffoldingTypeWidget.getValue()),
                                   VSVoxelPercWdg.getValue(),VSthicknessWidget.getValue(),
                                   VSincludeSurfaceFlag.getValue(),VSSmoothStepWdg.getValue(),
                                   VSRandomSeedWdg.getValue());
                                   
        if(ret===true)
        {            
            newLayer.cppMesh.addPerVertexColor();
            //newLayer.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
            scene.addLayer(newLayer);
        }
    };

/******************************************************************************/  
 
    plugin.Manager.install(MontecarloSamplingFilter);
    plugin.Manager.install(PoissonDiskSamplingFilter);
    plugin.Manager.install(VolumeMontecarloSamplingFilter);
    plugin.Manager.install(VolumePoissonSamplingFilter);
    plugin.Manager.install(VoronoiScaffoldingFilter);
    
})(MLJ.core.plugin, MLJ.core.Scene);