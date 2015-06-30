
(function (plugin, core, scene) {

    var plug = new plugin.Rendering({
        name: "Wire",
        tooltip: "Wire Tooltip",
        icon: "img/icons/wire.png",
        toggle:true,    
        on: false 
    });


    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);