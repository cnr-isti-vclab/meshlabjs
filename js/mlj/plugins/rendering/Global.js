
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Global",        
        tooltip: "Global Tooltip",
        icon: "img/icons/global.png"        
    });
    

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);