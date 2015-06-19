
(function (plugin, scene) {

    var PlatonicFilter = new plugin.Filter("Create Platonic Solid",
            "Create a platonic solid, one of a tetrahedron, octahedron, hexahedron or cube, dodecahedron, or icosahedron.",
            false);

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
        Module.CreatePlatonic(mf.ptrMesh, parseInt(choiceWidget.getValue()));
        scene.updateLayer(mf);
    };

    plugin.install(PlatonicFilter);


    var SphereFilter = new plugin.Filter("Create Sphere ",
            "Create a sphere with the desired level of subdivision",
            false);

    var stepWidget;

    SphereFilter._init = function (builder) {

        stepWidget = builder.Integer({
            min: 1, step: 1, defval: 1,
            label: "subdivision",
            tooltip: "Number of recursive subdivision of the sphere"
        });
    };

    SphereFilter._applyTo = function () {
        var mf = MLJ.core.File.createCppMeshFile("Sphere");
        Module.CreateSphere(mf.ptrMesh, stepWidget.getValue());
        scene.updateLayer(mf);
    };

    plugin.install(SphereFilter);


})(MLJ.core.plugin, MLJ.core.Scene);