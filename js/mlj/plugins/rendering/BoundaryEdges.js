
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Boundary Edges",        
        tooltip: "Tooltip",
        icon: "img/icons/boundary.png",
        toggle:true,    
        on: false        
    });
    

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);