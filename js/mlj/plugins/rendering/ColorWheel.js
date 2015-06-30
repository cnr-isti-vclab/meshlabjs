
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "ColorWheel",        
        tooltip: "ColorWheel Tooltip",
        icon: "img/icons/color.png"        
    });
    

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);