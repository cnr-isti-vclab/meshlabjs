
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Histogram",        
        tooltip: "Histogram Tooltip",
        icon: "img/icons/histogram.png",
        toggle: true,
        on: false
    });   

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);