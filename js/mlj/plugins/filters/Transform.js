
(function (plugin, scene) {
/******************************************************************************/
    var LaplacianSmoothFilter = new plugin.Filter({
        name: "Laplacian Smooth",
        tooltip: "Perform Geometric Laplacian Smoothing on the vertices of the mesh",
        arity: 1
    });

    var stepLWidget, weightWidget;
    LaplacianSmoothFilter._init = function (builder) {
        stepLWidget = builder.Integer({
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
        Module.LaplacianSmooth(meshFile.ptrMesh(), stepLWidget.getValue(), weightWidget.getValue());
    };
/******************************************************************************/
    var TaubinSmoothFilter = new plugin.Filter({
        name: "Taubin Smooth",
        tooltip: "The &lambda;-&mu; Taubin smoothing, it make two steps of smoothing, forth and back, for each iteration. Based on:<br>" +
                "Gabriel Taubin,<br><b><a href=https://scholar.google.com/scholar?q=A+signal+processing+approach+to+fair+surface+design >" +
                " A signal processing approach to fair surface design<\a></b><br>Siggraph 1995",
        arity: 1
    });

    var stepTWidget, lambdaWidget, muWidget;
    TaubinSmoothFilter._init = function (builder) {
        stepTWidget = builder.Integer({
            min: 1, step: 1, defval: 1,
            label: "Iteration",
            tooltip: "Number of iteration of the smoothing algorithm"
        });
        lambdaWidget = builder.Float({
            max: 1, min: 0.0, step: 0.1, defval: 0.330,
            label: "lambda",
            tooltip: "The lambda parameter of the Taubin Smoothing algorithm"
        });
        muWidget = builder.Float({
            max: 0.0, min: -1.0, step: 0.1, defval: -0.34,
            label: "mu",
            tooltip: "The mu parameter of the Taubin Smoothing algorithm"
        });
    };

    TaubinSmoothFilter._applyTo = function (meshFile) {
        Module.TaubinSmooth(meshFile.ptrMesh(), stepTWidget.getValue(), lambdaWidget.getValue(), muWidget.getValue());
    };
/******************************************************************************/
    var RndDisplacementFilter = new plugin.Filter({
            name:"Random Displacement",
            tooltip:null,
            arity:1
        });

    var displWidget, normalDispWidget;
    RndDisplacementFilter._init = function (builder) {

        displWidget = builder.Float({
            max: 0.1, min: 0.01, step: 0.01, defval: 0.01,
            label: "Displacement",
            tooltip: "Amount of random displacement added to each vertex of the mesh"
        });
           normalDispWidget = builder.Bool({
            defval: false,
            label: "Normal Directed Displ.",
            tooltip: "If true, the displacement is directed along the normal of the surface, otherwise it is in a random direction."
        });
    };

    RndDisplacementFilter._applyTo = function (meshFile) {
        Module.RandomDisplacement(meshFile.ptrMesh(), displWidget.getValue(),normalDispWidget.getValue());
    };
/******************************************************************************/
    var ScaleFilter = new plugin.Filter({
            name:"Scale Mesh",
            tooltip:"Scale the mesh according to factors relative to the x,y,z coordinates.<br>"
                    +"Uniform Scaling only uses the x factor. Scale to Unit box scales the mesh to fit in a unit box defined from -1 to 1",
            arity:1
        });

    ScaleFilter.xScaleWdg; ScaleFilter.yScaleWdg; ScaleFilter.zScaleWdg; ScaleFilter.uniformScaleWdg; ScaleFilter.unitScaleWdg;
    ScaleFilter._init = function (builder) {

        this.xScaleWdg = builder.Float({
            step: 1, defval: 1,
            label: "X",
            tooltip: "Scaling factor X Coordinate"
        });
        this.yScaleWdg = builder.Float({
            step: 1, defval: 1,
            label: "Y",
            tooltip: "Scaling factor Y Coordinate"
        });
        this.zScaleWdg = builder.Float({
            step: 1, defval: 1,
            label: "Z",
            tooltip: "Scaling factor Z Coordinate"
        });
        this.uniformScaleWdg= builder.Bool({
            defval: false,
            label: "Uniform Scaling",
            tooltip: "If true, the scale factor for X will be the only one considered"
        });
        this.unitScaleWdg= builder.Bool({
            defval: false,
            label: "To Unit Box",
            tooltip: "If true, the Scale Factor will be setted to fit in a unit box defined as (-1,-1,-1)-(1,1,1)"
        });
    };

    ScaleFilter._applyTo = function (meshFile) {
        Module.Scale(meshFile.ptrMesh(),this.xScaleWdg.getValue(),this.yScaleWdg.getValue(),this.zScaleWdg.getValue(),
        this.uniformScaleWdg.getValue(),this.unitScaleWdg.getValue());
    };

/******************************************************************************/
var RotateFilter = new plugin.Filter({
            name:"Rotate Mesh",
            tooltip:"Rotate the mesh according to factors relative to the x,y,z coordinates.<br>",
            arity:1
        });

    RotateFilter.xRotateWdg;
    RotateFilter.yRotateWdg;
    RotateFilter.zRotateWdg;
    RotateFilter._init = function (builder) {

        this.xRotateWdg = builder.Float({
            step: 0.1, defval: "0.0",
            label: "X",
            tooltip: "Rotate factor X Coordinate (Euler rotation)"
        });
        this.yRotateWdg = builder.Float({
            step: 0.1, defval: "0.0",
            label: "Y",
            tooltip: "Rotate factor Y Coordinate"
        });
        this.zRotateWdg = builder.Float({
            step: 0.1, defval: "0.0",
            label: "Z",
            tooltip: "Rotate factor Z Coordinate"
        });
        
    };

    RotateFilter._applyTo = function (meshFile) {
        Module.Rotate(meshFile.ptrMesh(),this.xRotateWdg.getValue(),this.yRotateWdg.getValue(),this.zRotateWdg.getValue());
    };

/******************************************************************************/
    var TranslateFilter = new plugin.Filter({
            name:"Translate Mesh",
            tooltip:"Translate mesh along its axes; optionally move the center of the bounding box of the mesh to the origin.",
            arity:1
        });

    TranslateFilter.xTrasWdg; TranslateFilter.yTrasWdg; TranslateFilter.zTrasWdg; TranslateFilter.toOriginTransFlag;
    TranslateFilter._init = function (builder) {

       this.xTrasWdg = builder.Float({
            step: 0.1, defval: "0.0",
            label: "X",
            tooltip: "Translation on X axis"
        });
        this.yTrasWdg = builder.Float({
            step: 0.1, defval: "0.0",
            label: "Y",
            tooltip: "Translation on Y axis"
        });
	this.zTrasWdg = builder.Float({
            step: 0.1, defval: "0.0",
            label: "Z",
            tooltip: "Translation on Z axis"
        });
	this.toOriginTransFlag = builder.Bool({
            defval: false,
            label: "Center to origin",
            tooltip: "If checked, the mesh will be translated so that its center coincides with the origin. Every translation factor will be ignored"
        });
    };
    TranslateFilter._applyTo = function (meshFile) {
	Module.Translate(meshFile.ptrMesh(),this.xTrasWdg.getValue(),this.yTrasWdg.getValue(),this.zTrasWdg.getValue(),
                         this.toOriginTransFlag.getValue());		
    };

/******************************************************************************/

    plugin.Manager.install(LaplacianSmoothFilter);
    plugin.Manager.install(TaubinSmoothFilter);
    plugin.Manager.install(RndDisplacementFilter);
    plugin.Manager.install(ScaleFilter);
    plugin.Manager.install(TranslateFilter);
    plugin.Manager.install(RotateFilter);


})(MLJ.core.plugin, MLJ.core.Scene);