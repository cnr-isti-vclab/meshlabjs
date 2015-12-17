
(function (plugin, scene) {
/******************************************************************************/
    var DeleteLayerFilter = new plugin.Filter({
        name: "Layer Delete",
        tooltip: "Delete Current Layer.",
        arity: -1
    });
    
    DeleteLayerFilter._init = function (builder) {
    };
    
    DeleteLayerFilter._applyTo = function (basemeshFile) {
        scene.removeLayerByName(basemeshFile.name);
    };
/******************************************************************************/
    var DuplicateLayerFilter = new plugin.Filter({
        name: "Layer Duplicate",
        tooltip: "Duplicate current Layer.",
        arity: 1
    });
    
    DuplicateLayerFilter._init = function (builder) {
    };
    
    DuplicateLayerFilter._applyTo = function (basemeshFile) {
        var newmeshFile = MLJ.core.Scene.createLayer("copy of "+basemeshFile.name);
        Module.DuplicateLayer(basemeshFile.ptrMesh(), newmeshFile.ptrMesh());
        scene.addLayer(newmeshFile);
    };
/******************************************************************************/
    var FlattenLayerFilter = new plugin.Filter({
        name: "Flatten Visible Layer",
        tooltip: "Merge all the visible layer onto a single layer",
        arity: 3
    });
    
    FlattenLayerFilter._init = function (builder) { };
    
    FlattenLayerFilter._applyTo = function () {
        var mergedLayers = MLJ.core.Scene.createLayer("Merged Layers");
        
        var ptr = MLJ.core.Scene.getLayers().iterator();
                var layerCur;
                while (ptr.hasNext()) {
                    layerCur = ptr.next();
                    if (layerCur.getThreeMesh().visible) {
                        Module.AddLayerToLayer(layerCur.ptrMesh(), mergedLayers.ptrMesh());
                    }
                }
                
        scene.addLayer(mergedLayers);
    };
/******************************************************************************/     
    var PlatonicFilter = new plugin.Filter({
        name: "Create Platonic Solid",
        tooltip: "Create a platonic solid, one of a tetrahedron, octahedron, hexahedron or cube, dodecahedron, or icosahedron.",
        arity: 0
    });

    var choiceWidget;
    PlatonicFilter._init = function (builder) {

        choiceWidget = builder.Choice({
            label: "Solid",
            tooltip: "Choose one of the possible platonic solids",
            options: [
                {content: "Tetrahedron", value: "0"},
                {content: "Octahedron", value: "1"},
                {content: "Hexahedron", value: "2"},
                {content: "Dodecahedron", value: "3", selected: true},
                {content: "Icosahedron", value: "4"}
            ]
        });
    };

    PlatonicFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer(choiceWidget.getContent());
        Module.CreatePlatonic(mf.ptrMesh(), parseInt(choiceWidget.getValue()));
        scene.addLayer(mf);
    };
/******************************************************************************/     
    var PlatonicFilter = new plugin.Filter({
        name: "Create Platonic Solid",
        tooltip: "Create a platonic solid, one of a tetrahedron, octahedron, hexahedron or cube, dodecahedron, or icosahedron.",
        arity: 0
    });

    var choiceWidget;
    PlatonicFilter._init = function (builder) {

        choiceWidget = builder.Choice({
            label: "Solid",
            tooltip: "Choose one of the possible platonic solids",
            options: [
                {content: "Tetrahedron", value: "0"},
                {content: "Octahedron", value: "1"},
                {content: "Hexahedron", value: "2"},
                {content: "Dodecahedron", value: "3", selected: true},
                {content: "Icosahedron", value: "4"}
            ]
        });
    };

    PlatonicFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer(choiceWidget.getContent());
        Module.CreatePlatonic(mf.ptrMesh(), parseInt(choiceWidget.getValue()));
        scene.addLayer(mf);
    };

/******************************************************************************/
    var SphereFilter = new plugin.Filter({
        name: "Create Sphere ",
        tooltip: "Create a sphere with the desired level of subdivision",
        arity: 0});

    var sphereLevWidget;
    SphereFilter._init = function (builder) {

        sphereLevWidget = builder.Integer({
            min: 1, step: 1, defval: 3,
            label: "subdivision",
            tooltip: "Number of recursive subdivision of the sphere"
        });
    };

    SphereFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Sphere");
        Module.CreateSphere(mf.ptrMesh(), sphereLevWidget.getValue());
        scene.addLayer(mf);
    };
/******************************************************************************/
    var SpherePointCloudFilter = new plugin.Filter({
        name: "Create Points on a Sphere ",
        tooltip: "Create a point cloud with a set of point distributed on the surface of a sphere with a number of different strategies: Montecarlo, Poisson Disk, Octahedron recursive subdivision, Disco Ball, Fibonacci Spherical Lattice",
        arity: 0});

    var sphPtNumWidget,sphPtAlgWidget;
    SpherePointCloudFilter._init = function (builder) {

        sphPtNumWidget = builder.Integer({
            min: 1, step: 10, defval: 100,
            label: "Point Num.",
            tooltip: "Expected number of points; depending on the algorithm it could be not possible to match it exactly"
        });
        sphPtAlgWidget = builder.Choice({
            label: "Generation Technique",
            tooltip: "Generation Technique:<br>"
                    +"<b>Montecarlo</b>: The points are randomly generated with an uniform distribution.<br>"
                    +"<b>Poisson Disk</b>: The points are to follow a poisson disk distribution.<br>"
                    +"<b>Disco Ball</b>: Dave Rusin's disco ball algorithm for the regular placement of points on a sphere is used. <br>"
                    +"<b>Recursive Octahedron</b>: Points are genereate on the vertex of a recursively subdivided octahedron <br>"
                    +"<b>Fibonacci Lattice</b>:  Points are generated according to the Fibonacci Lattice approach as explained in <br>\"Spherical Fibonacci Mapping\", Keinert et al.  ACM TOG, 2015",
            options: [
                {content: "Montecarlo", value: "0"},
                {content: "Poisson Disk", value: "1"},
                {content: "Disco Ball", value: "2"},
                {content: "Recursive Octahedron", value: "3"},
                {content: "Fibonacci Lattice ", value: "4", selected: true}
            ]
        });
    };

    SpherePointCloudFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Sphere-"+sphPtAlgWidget.getContent());
        mf.cppMesh.addPerVertexNormal();
        Module.CreateSpherePointCloud(mf.ptrMesh(),sphPtNumWidget.getValue(), parseInt(sphPtAlgWidget.getValue()));
        scene.addLayer(mf);
    };
/******************************************************************************/
    var TorusFilter = new plugin.Filter({
        name: "Create Torus ",
        tooltip: "Create a torus with the desired level of subdivisions and ratio between inner and outer radius",
        arity: 0});

    var stepWidget, radiusRatioWidget;
    TorusFilter._init = function (builder) {

        stepWidget = builder.Integer({
            min: 6, step: 1, defval: 32,
            label: "subdivision",
            tooltip: "Number of recursive subdivision of the sphere"
        });
        
        radiusRatioWidget = builder.RangedFloat({
            min: 0, step: 0.1, max:2, defval:0.5,
            label: "Radius Ratio",
            tooltip: "Ratio between the section of the torus and the generating circle"
        });
    };

    TorusFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Torus");
        Module.CreateTorus(mf.ptrMesh(), stepWidget.getValue(), radiusRatioWidget.getValue());
        scene.addLayer(mf);
    };
/******************************************************************************/
    var NoisyIsoFilter = new plugin.Filter({
        name: "Create Noisy Isosurface ",
        tooltip: "Create a isosurface from a cylindrical scalar field perturbed by perlin noise",
        arity: 0});

    var isoResWidget;
    NoisyIsoFilter._init = function (builder) {
        isoResWidget = builder.Integer({
            min: 16, step: 16, defval: 32,
            label: "Resolution",
            tooltip: "Resolution of the grid where the isosurface is defined"
        });        
    };

    NoisyIsoFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Noisy Isosurf");
        Module.CreateNoisyIsosurface(mf.ptrMesh(), isoResWidget.getValue());
        scene.addLayer(mf);
    };


/******************************************************************************/

    plugin.Manager.install(DeleteLayerFilter);
    plugin.Manager.install(DuplicateLayerFilter);
    plugin.Manager.install(FlattenLayerFilter);
    plugin.Manager.install(SphereFilter);
    plugin.Manager.install(SpherePointCloudFilter);
    plugin.Manager.install(PlatonicFilter);
    plugin.Manager.install(TorusFilter);
    plugin.Manager.install(NoisyIsoFilter);

})(MLJ.core.plugin, MLJ.core.Scene);