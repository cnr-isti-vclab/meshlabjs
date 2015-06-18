
(function (plugin, scene) {

    var LaplacianSmoothFilter = new plugin.Filter("Laplacian Smooth",
            "Perform Geometric Laplacian Smoothing on the vertices of the mesh",
            false);

    var stepWidget;
    var weightWidget;

    LaplacianSmoothFilter._init = function (builder) {

        stepWidget = builder.Integer({
            min: 1, step: 1, defval: 1,
            label: "Iteration",
            tooltip: "Number of iteration of the smoothing algorithm"
        });

        weightWidget = builder.Bool({
            defval: false,
            label: "Cotangent Weights",
            tooltip: "Use cotangent weighting scheme during relaxation."
        });

    };

    LaplacianSmoothFilter._applyTo = function (meshFile) {
        Module.Smooth(meshFile.ptrMesh, stepWidget.getValue(), weightWidget.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.install(LaplacianSmoothFilter);
    
    
    var TaubinSmoothFilter = new plugin.Filter("Taubin Smooth",
            "The &lambda;-&mu; Taubin smoothing, it make two steps of smoothing, forth and back, for each iteration. Based on:<br>"+
            "Gabriel Taubin,<br><b>A signal processing approach to fair surface design</b><br>Siggraph 1995",
            false);

    var stepWidget;
    var weightWidget;

    TaubinSmoothFilter._init = function (builder) {

        stepWidget = builder.Integer({
            min: 1, step: 1, defval: 1,
            label: "Iteration",
            tooltip: "Number of iteration of the smoothing algorithm"
        });

        
        lambdaWidget = builder.Float({
            max: 1, min: 0.0, step: 0.1, defval: 0.33,
            label: "lambda",
            tooltip: "The lambda parameter of the Taubin Smoothing algorithm"
        });

        muWidget = builder.Float({
            max: 0.0, min: -1.0, step: 0.1, defval: -0.53,
            label: "mu",
            tooltip: "The mu parameter of the Taubin Smoothing algorithm"
        });

    };

    TaubinSmoothFilter._applyTo = function (meshFile) {
        Module.TaubinSmooth(meshFile.ptrMesh, lambdaWidget.getValue(), muWidget.getValue());
        scene.updateLayer(meshFile);
    };

    plugin.install(TaubinSmoothFilter);
    

})(MLJ.core.plugin, MLJ.core.Scene);