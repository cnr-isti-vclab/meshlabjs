(function(plugin, scene) {
/******************************************************************************/  
    var MeasureTopoFilter = new plugin.Filter({
        name: "Compute Topological Measures",
        tooltip: "Report topological/combinatorial information of the current mesh:<br>"
                +"Vertex, Edge, Face, Unreferenced Vertices, Boundary Edges, "
                +"Boundary Loops, Genus, Non Manifol Edges, "
                +"Non Manifold vertices, Connected Components.",
        arity: 1
    });
    MeasureTopoFilter._init = function(builder) {   };

    MeasureTopoFilter._applyTo = function(meshfile) {
        Module.ComputeTopologicalMeasures(meshfile.ptrMesh());
    }
/******************************************************************************/  
    var MeasureGeomFilter = new plugin.Filter({
        name: "Compute Geometric Measures",
        tooltip: "Report Geometric information of the current mesh: <br> "
                +"Bounding Box, Volume, Surface, Barycenter, Thin Shell Barycenter, "
                +"Principal Axis, Inertia Moment, ",
        arity: 1
    });
    MeasureGeomFilter._init = function(builder) {   };

    MeasureGeomFilter._applyTo = function(meshfile) {
        Module.ComputeGeometricMeasures(meshfile.ptrMesh());
    }
/******************************************************************************/  
    var HausdorffFilter = new plugin.Filter({
        name: "Compute Hausdorff Distance ",
        tooltip: "Compute the Hausdorff distance between two meshes. <br>"
                +"Hausdorff distance is the standard technique for measuring the "
                +"geometric difference between two surfaces.",
        arity: 2});

    var srcMeshWidget,trgMeshWidget,sampleNumWidget,maxDistWidget,createSampleWidget;
    HausdorffFilter._init = function (builder) {

        srcMeshWidget = builder.LayerSelection({
            label: "Source Mesh",
            tooltip: "The mesh that is sampled"
        });
        
        trgMeshWidget = builder.LayerSelection({
            label: "Target Mesh",
            tooltip: "The mesh where, for each sample, we search the closest point"
        });
        
        sampleNumWidget = builder.Integer({
            label: "Sample Num",
            tooltip: "Number of samples to be taken on source mesh",
            defval: 10000
        });
        
        maxDistWidget = builder.RangedFloat({
            min: 0, step: 0.1, max:1, defval:0.1,
            label: "Max Dist.",
            tooltip: "The distance cutoff expressed as percentage of the bbox diagonal"
        });
        
        createSampleWidget = builder.Bool({
            defval: false,
            label: "Save Sample",
            tooltip: "If true the sample points chosen in the source mesh are saved "
                    +"onto a new layer. The samples contain in the quality the "
                    +"recorded distance so they can be used to plot histogram "
                    +"distribution of the difference."
        });
    };

    HausdorffFilter._applyTo = function () {
        var sampleMeshPtr = 0;
        var sampleLayer;
        if(createSampleWidget.getValue())
        {
            sampleLayer = MLJ.core.Scene.createCppMeshFile("Hausdorff Samples");
            sampleMeshPtr = sampleLayer.ptrMesh();
            sampleLayer.cppMesh.addPerVertexQuality();
        }
        
        Module.ComputeHausdorffDistance(srcMeshWidget.getSelectedPtrMesh(),
                                        trgMeshWidget.getSelectedPtrMesh(),
                                        sampleMeshPtr,
                                        sampleNumWidget.getValue(),maxDistWidget.getValue());
                                        
        if(createSampleWidget.getValue()) 
            scene.addLayer(sampleLayer);
    };
/******************************************************************************/  
    plugin.Manager.install(MeasureTopoFilter);
    plugin.Manager.install(MeasureGeomFilter);
    plugin.Manager.install(HausdorffFilter);

})(MLJ.core.plugin, MLJ.core.Scene);
