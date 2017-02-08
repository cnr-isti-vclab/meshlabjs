
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
        Module.AddLayerToLayer(basemeshFile.ptrMesh(), newmeshFile.ptrMesh());
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
    var SphereFilter = new plugin.Filter({
        name: "Create Sphere",
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
    var SphericalCapFilter = new plugin.Filter({
        name: "Create Spherical Cap",
        tooltip: "Creating a spherical cap of a given angle amplitude and with specified subdivision level. Cap are triangulated without extraordinary vertexes so the generated mesh is good for small angle caps and of bad quality on the extreme case of an half sphere. ",
        arity: 0});

    var sphericalCapLevWidget,sphericalCapAngleWdg;
    
    SphericalCapFilter._init = function (builder) {

        sphericalCapLevWidget = builder.Integer({
            min: 1, step: 1, defval: 3,
            label: "subdivision",
            tooltip: "Number of recursive subdivision of the sphere"
        });
                sphericalCapAngleWdg = builder.RangedFloat({
            min: 0, step: 15, max:180, defval:60,
            label: "Cap Angle",
            tooltip: "Angle of the spherical cap in degree. 180 means half sphere."
        });

    };

    SphericalCapFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Spherical Cap");
        Module.CreateSphericalCap(mf.ptrMesh(), sphericalCapAngleWdg.getValue(), sphericalCapLevWidget.getValue());
        scene.addLayer(mf);
    };
/******************************************************************************/
    var SpherePointCloudFilter = new plugin.Filter({
        name: "Create Points on a Sphere",
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
                {content: "Fibonacci Lattice", value: "4", selected: true}
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
        name: "Create Torus",
        tooltip: "Create a torus with the desired level of subdivisions and ratio between inner and outer radius",
        arity: 0});

    var stepTorusWidget, radiusRatioWidget;
    TorusFilter._init = function (builder) {

        stepTorusWidget = builder.Integer({
            min: 6, step: 1, defval: 32,
            label: "Subdivision",
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
        Module.CreateTorus(mf.ptrMesh(), stepTorusWidget.getValue(), radiusRatioWidget.getValue());
        scene.addLayer(mf);
    };
	/******************************************************************************/
    var SuperToroidFilter = new plugin.Filter({
        name: "Create SuperToroid",
        tooltip: "Create a super toroid with the desired level of subdivisions and a specific ratio, the vertical and horizontal squareness are the main parameters to obtain a different supertoroids models.",
        arity: 0});

    var stepToroidWidget, vertSqrWdg, horzSqrWdg, radiusRatioToroidWdg;
    SuperToroidFilter._init = function (builder) {

        stepToroidWidget = builder.Integer({
            min: 6, step: 1, defval: 32,
            label: "Subdivision",
            tooltip: "Number of recursive subdivision of the supertoroid"
        });
	vertSqrWdg = builder.RangedFloat({
            min: 0.0, step: 0.1, max:2.50, defval:0.50,
            label: " Vertical Squareness",
            tooltip: "This amount controls the squareness of the vertical sections. The input range is between 0.25 and 2.50"
        });
        horzSqrWdg = builder.RangedFloat({
            min: 0.0, step: 0.1, max:2.50, defval:0.50,
            label: "Horizontal Squareness",
            tooltip: "This amount controls the squareness of the horizontal sections. The input range is between 0.25 and 2.50"
        });
        radiusRatioToroidWdg = builder.Float({
            min:0.01 , step: 0.1, defval: 0.5,
            label: "Radius Ratio",
            tooltip: "This parameter specify the major radii in the X and Y directions about the supertoroid implemented"
        }); 		
    };

    SuperToroidFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("SuperToroid");
        Module.CreateSuperToroid(mf.ptrMesh(),radiusRatioToroidWdg.getValue(),
         vertSqrWdg.getValue(), horzSqrWdg.getValue(),stepToroidWidget.getValue());
        scene.addLayer(mf);
    };
	/******************************************************************************/
    var SuperEllipsoidFilter = new plugin.Filter({
        name: "Create SuperEllipsoid",
        tooltip: "Create a superellipsoid with the desired level of subdivisions and a set of features that allow to change the shape of the superellipsoid",
        arity: 0});

    var stepWidget, feature1, feature2, feature3;
    SuperEllipsoidFilter._init = function (builder) {

        stepWidget = builder.Integer({
            min: 6, step: 1, defval: 32,
            label: "subdivision",
            tooltip: "Number of recursive subdivision of the superellipsoid"
        });
		feature1 = builder.Float({ 
            min: 0.1, step: 0.1, defval:0.80,
            label: "YZ Squaredness",
            tooltip: "How sharp/smooth is along the X axis."
        });
		feature2= builder.Float({ 
            min: 0.1, step: 0.1, defval:0.80,
            label: "XZ Squaredness",
            tooltip: "How sharp/smooth is along the Y axis."
        });
		feature3 = builder.Float({ 
            min: 0.1, step: 0.1, defval:0.80,
            label: "XY Squaredness",
            tooltip: "How sharp/smooth is along the Z axis"
        });
        
    };

    SuperEllipsoidFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("SuperEllipsoid");
        Module.CreateSuperEllipsoid(mf.ptrMesh(),feature1.getValue(), feature2.getValue(), feature3.getValue(),stepWidget.getValue());
        scene.addLayer(mf);
    };

/******************************************************************************/
    var IsosurfaceFilter = new plugin.Filter({
        name: "Create User Defined Isosurface",
        tooltip: "Create a isosurface user defined scalar field",
        arity: 0});

    var isoFuncWidget,isoResWidget,minXWdg,minYWdg,minZWdg,maxXWdg,maxYWdg,maxZWdg;
    IsosurfaceFilter._init = function (builder) {
        
            isoFuncWidget  = builder.String({
            label: "Volume Field",
            tooltip: "This expression is evaluated on all the voxel of the volume",
//            defval: "cos(x)*sin(y)+cos(y)*sin(z)+cos(z)*sin(x)"
            defval: "cos(x)*sin(y)+cos(y)*sin(z)+cos(z)*sin(x)"
        });
        isoResWidget = builder.Float({
            min: 0, step: 0.01, defval: 0.1,
            label: "Voxel Resolution",
            tooltip: "Resolution of the grid where the isosurface is defined"
        });        
        
        minXWdg = builder.Float({ step: 0.1, defval:-4.0, label: "X Min", tooltip: "Domain range minimum x value" });
        minYWdg = builder.Float({ step: 0.1, defval:-4.0, label: "Y Min", tooltip: "Domain range minimum y value" });
        minZWdg = builder.Float({ step: 0.1, defval:-4.0, label: "Z Min", tooltip: "Domain range minimum z value" });
        maxXWdg = builder.Float({ step: 0.1, defval: 4.0, label: "X Max", tooltip: "Domain range maximum x value" });
        maxYWdg = builder.Float({ step: 0.1, defval: 4.0, label: "Y Max", tooltip: "Domain range maximum y value" });
        maxZWdg = builder.Float({ step: 0.1, defval: 4.0, label: "Z Max", tooltip: "Domain range maximum z value" });
    };

    IsosurfaceFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("User Defined Isosurf");
        Module.IsosurfaceFilter(mf.ptrMesh(), isoFuncWidget.getValue(), 
                    minXWdg.getValue(),minYWdg.getValue(),minZWdg.getValue(),
                    maxXWdg.getValue(),maxYWdg.getValue(),maxZWdg.getValue(),
                    isoResWidget.getValue());
                    scene.addLayer(mf);
    };

/******************************************************************************/
    var NoisyIsoFilter = new plugin.Filter({
        name: "Create Noisy Isosurface",
        tooltip: "Create a isosurface from a cylindrical scalar field perturbed by perlin noise",
        arity: 0});

    var noisyIsoResWdg;
    NoisyIsoFilter._init = function (builder) {
        noisyIsoResWdg = builder.Integer({
            min: 16, step: 16, defval: 32,
            label: "Resolution",
            tooltip: "Resolution of the grid where the isosurface is defined"
        });        
    };

    NoisyIsoFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Noisy Isosurf");
        Module.CreateNoisyIsosurface(mf.ptrMesh(), noisyIsoResWdg.getValue());
        scene.addLayer(mf);
    };

/******************************************************************************/
    var ParametricSurfaceFilter = new plugin.Filter({
        name: "Create Parametric Surface",
        tooltip: "Create a parametric surface defined by (x,y,z) = F(u,v)",
        arity: 0});

    var funcStrXWdg,funcStrYWdg,funcStrZWdg,
        countUWdg,countVWdg, minUWdg,minVWdg,maxUWdg,maxVWdg;
    ParametricSurfaceFilter._init = function (builder) {
        
        funcStrXWdg  = builder.String({
            label: "X func",
            tooltip: "This expression is evaluated on all the point of the (u,v) parametric surface grid to get the X value",
            defval: "u-sin(u)*cosh(v)"
        });
        funcStrYWdg  = builder.String({
            label: "Y func",
            tooltip: "This expression is evaluated on all the point of the (u,v) parametric surface grid to get the X value",
            defval: "1-cos(u)*cosh(v)"
        });
        funcStrZWdg  = builder.String({
            label: "Z func",
            tooltip: "This expression is evaluated on all the point of the (u,v) parametric surface grid to get the X value",
            defval: "4*sin(1/2*u)*sinh(v/2)"
        });
        countUWdg = builder.Integer({
            min: 1, step: 5, defval: 200,
            label: "U steps",
            tooltip: "Resolution of the grid along the 'u' dimension"
        });         
        countVWdg = builder.Integer({
            min: 1, step: 5, defval: 50,
            label: "V steps",
            tooltip: "Resolution of the grid along the 'u' dimension"
        });         
        
        minUWdg = builder.Float({ step: 0.1, defval:-10.0, label: "U Min", tooltip: "Domain range minimum U value" });
        minVWdg = builder.Float({ step: 0.1, defval:-2.0, label: "V Min", tooltip: "Domain range minimum V value" });
        maxUWdg = builder.Float({ step: 0.1, defval: 10.0, label: "U Max", tooltip: "Domain range maximum U value" });
        maxVWdg = builder.Float({ step: 0.1, defval: 2.0, label: "V Max", tooltip: "Domain range maximum V value" });
        
    };

    ParametricSurfaceFilter._applyTo = function () {
        var mf = MLJ.core.Scene.createLayer("Param Surf");
        Module.ParametricSurfaceFilter(mf.ptrMesh(), 
                    funcStrXWdg.getValue(), funcStrYWdg.getValue(), funcStrZWdg.getValue(), 
                    minUWdg.getValue(), maxUWdg.getValue(), countUWdg.getValue(),
                    minVWdg.getValue(), maxVWdg.getValue(), countVWdg.getValue()  );
                    scene.addLayer(mf);
    };

/******************************************************************************/


    plugin.Manager.install(DeleteLayerFilter);
    plugin.Manager.install(DuplicateLayerFilter);
    plugin.Manager.install(FlattenLayerFilter);
    plugin.Manager.install(SphereFilter);
    plugin.Manager.install(SphericalCapFilter);
    plugin.Manager.install(SpherePointCloudFilter);
    plugin.Manager.install(PlatonicFilter);
    plugin.Manager.install(TorusFilter);
    plugin.Manager.install(NoisyIsoFilter);
    plugin.Manager.install(SuperToroidFilter);
    plugin.Manager.install(SuperEllipsoidFilter);
    plugin.Manager.install(IsosurfaceFilter);
    plugin.Manager.install(ParametricSurfaceFilter);   
})(MLJ.core.plugin, MLJ.core.Scene);
