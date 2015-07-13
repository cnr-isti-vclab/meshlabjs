
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Points",        
        tooltip: "Points Tooltip",
        icon: "img/icons/points.png",
        toggle:true,    
        on: false 
    });
    

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);