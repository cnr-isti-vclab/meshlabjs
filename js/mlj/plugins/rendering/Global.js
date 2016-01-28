
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
            ],
            bindTo: (function() {

                var stats;
                var show = false;
                var req;

                var updateStats = function() {
                    if (show) {
                        stats.update();
                        req = requestAnimationFrame(updateStats);
                    } else {
                        stats.domElement.style.visibility = 'hidden';
                        window.cancelAnimationFrame(req);
                    }
                };

                var callback = function (value) {
                    if (!show) {
                        if (value) {
                            show = true;
                            stats = scene.getStats();
                            stats.domElement.style.visibility = 'visible';
                            updateStats();
                        }
                    } else show = value;
                };

                callback.toString = function () { return "showStats"; };
                return callback;
            }())
        });

    };

    plug.getBackfaceCullingValue = function (type) {
        return cullingWidget.getValue();
    };

    plug.getShowStatsValue = function (type) {
        return statsWidget.getValue();
    };
    
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);