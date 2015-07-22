
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Global",        
        tooltip: "Global Tooltip",
        icon: "img/icons/global.png"        
    });
    
    var cullingWidget;
    
    plug._init = function (guiBuilder) {
        
        cullingWidget = guiBuilder.Choice({
            label: "Backface Culling",
            tooltip: "Enable/disable Backface Culling",
            options: [
                {content: "on", value: true},
                {content: "off", value: false, selected: true}
            ]
        });

        statsWidget = guiBuilder.Choice({
            label: "Show Stats",
            tooltip: "Enable/disable the display of rendering performance stats",
            options: [
                {content: "on", value: true},
                {content: "off", value: false, selected: true}
            ]
        });

    };

    plug.getBackfaceCullingValue = function (type) {
        return cullingWidget.getValue();
    };
    
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);