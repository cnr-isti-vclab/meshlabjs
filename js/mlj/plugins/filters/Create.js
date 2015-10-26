
(function (plugin, scene) {
/******************************************************************************/
    var DeleteLayerFilter = new plugin.Filter({
        name: "Layer Delete",
        tooltip: "Delete Current Layer.",
        arity: 2
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
        var newmeshFile = MLJ.core.File.createCppMeshFile(basemeshFile.name);
        Module.DuplicateLayer(basemeshFile.ptrMesh(), newmeshFile.ptrMesh());
        scene.addLayer(newmeshFile);
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
        var mf = MLJ.core.File.createCppMeshFile(choiceWidget.getContent());
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
        var mf = MLJ.core.File.createCppMeshFile("Sphere");
        Module.CreateSphere(mf.ptrMesh(), sphereLevWidget.getValue());
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
        var mf = MLJ.core.File.createCppMeshFile("Torus");
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
        var mf = MLJ.core.File.createCppMeshFile("Noisy Isosurf");
        Module.CreateNoisyIsosurface(mf.ptrMesh(), isoResWidget.getValue());
        scene.addLayer(mf);
    };


/******************************************************************************/

    plugin.Manager.install(DeleteLayerFilter);
    plugin.Manager.install(DuplicateLayerFilter);
    plugin.Manager.install(SphereFilter);
    plugin.Manager.install(PlatonicFilter);
    plugin.Manager.install(TorusFilter);
    plugin.Manager.install(NoisyIsoFilter);

})(MLJ.core.plugin, MLJ.core.Scene);