
(function (plugin, scene) {
/******************************************************************************/
    var QualityFuncFilter = new plugin.Filter({
        name: "Per Vertex Quality Function",
        tooltip: "",
        arity: -1
    });
    
    var qualityFuncWidget;
    QualityFuncFilter._init = function (builder) {
            qualityFuncWidget  = builder.String({
            label: "Quality Func",
            tooltip: "This expression is evaluated on all the vertices to find the quality value",
            defval: "x*x"
        });
    };
        
    QualityFuncFilter._applyTo = function (basemeshFile) {
        basemeshFile.cppMesh.addPerVertexColor();
        Module.QualityFunctionFilter(basemeshFile.ptrMesh(),qualityFuncWidget.getValue(),true,true);
    };

/******************************************************************************/

    plugin.Manager.install(QualityFuncFilter);

})(MLJ.core.plugin, MLJ.core.Scene);