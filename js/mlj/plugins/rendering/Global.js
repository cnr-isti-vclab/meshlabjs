
(function (plugin, core, scene) {
    var DEFAULTS = {
        DefaultUpColor: new THREE.Color('#00000f'),
        DefaultDownColor: new THREE.Color('#8080ff'),
    };
     var plug = new plugin.Rendering({
        name: "Global",        
        tooltip: "Global Tooltip",
        icon: "img/icons/global.png"        
    }, DEFAULTS);
	
    
    var cullingWidget, topColor, bottomColor;
    
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
                        stats.begin();
                        scene.render(true);
                        stats.end();
                        req = requestAnimationFrame(updateStats);
                    } else {
                        stats.active = false;
                        stats.domElement.style.visibility = 'hidden';
                        window.cancelAnimationFrame(req);
                    }
                };

                var callback = function (value) {
                    if (!show) {
                        if (value) {
                            show = true;
                            stats = scene.getStats();
                            stats.active = true;
                            stats.domElement.style.visibility = 'visible';
                            updateStats();
                        }
                    } else show = value;
                };

                callback.toString = function () { return "showStats"; };
                return callback;
            }())
        });
		topColor = guiBuilder.Color({
            label: "Background Top Color",
            tooltip: "Change the default background color of render panel, obtained mixing two different colors by linear-gradient function, at the top",
            color: "#" + DEFAULTS.DefaultUpColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color) {
                    $('#_3D').css('background', 'linear-gradient('+topColor.getColor()+','+bottomColor.getColor()+')');
                };
                bindToFun.toString = function () { return 'DefaultUpColor'; }
                return bindToFun;
            }())
        });
		bottomColor = guiBuilder.Color({
            label: "Background Bottom Color",
            tooltip: "Change the default background color of render panel, obtained mixing two different colors by linear-gradient function, at the bottom",
            color:  "#" + DEFAULTS.DefaultDownColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color) {
                    $('#_3D').css('background', 'linear-gradient('+topColor.getColor()+','+bottomColor.getColor()+')');
                };
                bindToFun.toString = function () { return 'DefaultDownColor'; }
                return bindToFun;
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