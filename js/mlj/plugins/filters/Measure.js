(function (plugin, scene) {
    /******************************************************************************/
    var MeasureTopoFilter = new plugin.Filter({
        name: "Compute Topological Measures",
        tooltip: "Report topological/combinatorial information of the current mesh:<br>"
        + "Vertex, Edge, Face, Unreferenced Vertices, Boundary Edges, "
        + "Boundary Loops, Genus, Non Manifol Edges, "
        + "Non Manifold vertices, Connected Components.",
        arity: 1
    });
    MeasureTopoFilter._init = function (builder) { };

    MeasureTopoFilter._applyTo = function (meshLayer) {
        Module.ComputeTopologicalMeasures(meshLayer.ptrMesh());
    }
    /******************************************************************************/
    var MeasureGeomFilter = new plugin.Filter({
        name: "Compute Geometric Measures",
        tooltip: "Report Geometric information of the current mesh: <br> "
        + "Bounding Box, Volume, Surface, Barycenter, Thin Shell Barycenter, "
        + "Principal Axis, Inertia Moment, ",
        arity: 1
    });
    MeasureGeomFilter._init = function (builder) { };

    MeasureGeomFilter._applyTo = function (meshLayer) {
        Module.ComputeGeometricMeasures(meshLayer.ptrMesh());
    }
    /******************************************************************************/
    var CurvatureQualityFilter = new plugin.Filter({
        name: "Compute Quality form Curvature",
        tooltip: "Compute discrete curvature values and store it in the per vertex quality. <br> "
        + "It can compute the Gaussian and Mean curvatures using the standard discrete approximations for triangle meshes. ",
        arity: 1
    });
    var curvatureTypeWidget;
    CurvatureQualityFilter._init = function (builder) {
        curvatureTypeWidget = builder.Choice({
            label: "Curvature Type",
            tooltip: "Choose the possible curvature type",
            options: [
                { content: "Gaussian Curvature", value: "0", selected: true },
                { content: "Mean Curvature", value: "1" },
            ]
        });
    };

    CurvatureQualityFilter._applyTo = function (meshLayer) {
        Module.ComputeQualityFromCurvature(meshLayer.ptrMesh(), parseInt(curvatureTypeWidget.getValue()));
    }
    /******************************************************************************/
    var ThicknessEvaluatorFilter = new plugin.Filter({
        name: "Thickness Evaluation",
        tooltip: "Compute an approximated measure of the thickenss of a watertight mesh. <br> "
        + "We evaluate thickness as distance from the medial axis (medial surface)."
        + "We start from a montecarlo volume sampling and try to search for the "
        + "samples that can be part of the medial axis."
        + "It use a sampled representation of the surface. A volume sample is "
        + "considered part of the medial axis if there are at least two samples "
        + "that are (almost) the same minimal distance to that point.",
        arity: 1
    });

    var thickSampleNumWidget, saveSurfSampleWidget, distTrhWidget;
    var saveSurfSampleWidget, saveVolSampleWidget, saveSkelSampleWidget;
    ThicknessEvaluatorFilter._init = function (builder) {

        thickSampleNumWidget = builder.Integer({
            min: 10, step: 1000, defval: 10000,
            label: "Sample Num",
            tooltip: "Number of volumetric samples scattered inside the mesh."
        });

        surfSamplingRadiusWidget = builder.Float({
            min: 0.0, step: 0.001, defval: "0.005",
            label: "Surface Sampling Radius",
            tooltip: "The thickness is evaluated over a surface sampling with the specified radius density. <br>"
            + "The radius is specified as a percentage of the bbox diagonal."
        });
        distTrhWidget = builder.Float({
            min: 0.9, step: 0.01, defval: "1.05",
            label: "Distance Threshold",
            tooltip: ""
        });
        saveSurfSampleWidget = builder.Bool({
            defval: true,
            label: "Save Surface Sample",
            tooltip: "If true, the surface sampling is saved as a new layer"
        });
        saveVolSampleWidget = builder.Bool({
            defval: true,
            label: "Save Volume Sample",
            tooltip: "If true, the surface sampling is saved as a new layer"
        });
        saveSkelSampleWidget = builder.Bool({
            defval: true,
            label: "Save Skeleton Samples",
            tooltip: "If true, the surface sampling is saved as a new layer"
        });

    };

    ThicknessEvaluatorFilter._applyTo = function (meshLayer) {
        var surfMeshLayer, volumeLayer, skelLayer;
        var surfMeshPtr = 0, volumePtr = 0, skelPtr = 0;
        if (saveSurfSampleWidget.getValue()) {
            surfMeshLayer = MLJ.core.Scene.createLayer("Surf Samples");
            surfMeshLayer.cppMesh.addPerVertexColor();
            surfMeshPtr = surfMeshLayer.ptrMesh();
        }
        if (saveVolSampleWidget.getValue()) {
            volumeLayer = MLJ.core.Scene.createLayer("Volume Samples");
            volumeLayer.cppMesh.addPerVertexColor();
            volumePtr = volumeLayer.ptrMesh();
        }
        if (saveSkelSampleWidget.getValue()) {
            skelLayer = MLJ.core.Scene.createLayer("Medial");
            skelLayer.cppMesh.addPerVertexColor();
            skelPtr = skelLayer.ptrMesh();
        }
        var ret = Module.ComputeThickness(meshLayer.ptrMesh(), surfMeshPtr, volumePtr, skelPtr,
            thickSampleNumWidget.getValue(), surfSamplingRadiusWidget.getValue(), distTrhWidget.getValue());

        meshLayer.cppMesh.addPerVertexColor();

        if (ret && saveSurfSampleWidget.getValue()) scene.addLayer(surfMeshLayer);
        if (ret && saveVolSampleWidget.getValue()) scene.addLayer(volumeLayer);
        if (ret && saveSkelSampleWidget.getValue()) scene.addLayer(skelLayer);

    }
    /******************************************************************************/
    var HausdorffFilter = new plugin.Filter({
        name: "Compute Hausdorff Distance ",
        tooltip: "Compute the Hausdorff distance between two meshes. <br>"
        + "Hausdorff distance is the standard technique for measuring the "
        + "geometric difference between two surfaces.",
        arity: 2
    });

    var srcMeshWidget, trgMeshWidget, sampleNumWidget, maxDistWidget, createSampleWidget;
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
            min: 0, step: 0.1, max: 1, defval: 0.1,
            label: "Max Dist.",
            tooltip: "The distance cutoff expressed as percentage of the bbox diagonal"
        });

        createSampleWidget = builder.Bool({
            defval: false,
            label: "Save Sample",
            tooltip: "If true the sample points chosen in the source mesh are saved "
            + "onto a new layer. The samples contain in the quality the "
            + "recorded distance so they can be used to plot histogram "
            + "distribution of the difference."
        });
    };

    HausdorffFilter._applyTo = function () {
        var sampleMeshPtr = 0;
        var sampleLayer;
        if (createSampleWidget.getValue()) {
            sampleLayer = MLJ.core.Scene.createLayer("Hausdorff Samples");
            sampleMeshPtr = sampleLayer.ptrMesh();
            sampleLayer.cppMesh.addPerVertexQuality();
        }

        Module.ComputeHausdorffDistance(srcMeshWidget.getSelectedPtrMesh(),
            trgMeshWidget.getSelectedPtrMesh(),
            sampleMeshPtr,
            sampleNumWidget.getValue(), maxDistWidget.getValue());

        if (createSampleWidget.getValue())
            scene.addLayer(sampleLayer);
    };
    /******************************************************************************/
    var ComputeValenceFilter = new plugin.Filter({
        name: "Compute Valence measures",
        tooltip: "Computes the mean valence and the mean distance "
         +"from ideal valence of the current mesh",
        arity: 1
    });
    ComputeValenceFilter._init = function (builder) { };

    ComputeValenceFilter._applyTo = function (meshLayer) {
        Module.ComputeMeanValence(meshLayer.ptrMesh());
    }
    /******************************************************************************/
    plugin.Manager.install(MeasureTopoFilter);
    plugin.Manager.install(MeasureGeomFilter);
    plugin.Manager.install(HausdorffFilter);
    plugin.Manager.install(CurvatureQualityFilter);
    plugin.Manager.install(ThicknessEvaluatorFilter);
    plugin.Manager.install(ComputeValenceFilter);

})(MLJ.core.plugin, MLJ.core.Scene);
