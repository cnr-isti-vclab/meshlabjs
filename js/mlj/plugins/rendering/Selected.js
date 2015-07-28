
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Selection",        
        tooltip: "Show Selected Face and vertices",
        icon: "img/icons/selected.png",
        toggle: true,
        on: false
    });   

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);