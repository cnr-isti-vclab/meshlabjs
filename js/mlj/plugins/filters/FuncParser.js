
(function (plugin, scene) {
/******************************************************************************/
    var QualityFuncFilter = new plugin.Filter({
        name: "Per Vertex Quality Function",
        tooltip: ".",
        arity: -1
    });
    
    var qualityFuncWidget;
    QualityFuncFilter._init = function (builder) {
            qualityFuncWidget  = builder.String({
            label: "Quality Func",
            tooltip: "This function is applied to all the vertices to find the quality value",
            defval: "x*x"
        });
    };
        
    QualityFuncFilter._applyTo = function (basemeshFile) {
        Module.QualityFunction(basemeshFile.ptrMesh(),qualityFuncWidget.getValue(),true,true);
    };

/******************************************************************************/

    plugin.Manager.install(QualityFuncFilter);

})(MLJ.core.plugin, MLJ.core.Scene);