
(function (plugin, core, scene) {
    
     var plug = new plugin.Rendering({
        name: "Filled",        
        tooltip: "Tooltip",
        icon: "img/icons/flat.png",
        toggle:true,    
        on: false        
    });
    
//    var plug = new plugin.Rendering({
//        name: "Ambient Light",
//        button: {
//            type: "toggle",
//            tooltip: "Ambient light on/off",
//            icon: "img/icons/light.png",
//            on: core.defaults.AmbientLight.on,
//            onToggle: function(on) {                
//                scene.lights.AmbientLight.setOn(on);
//            }
//        }        
//    });

//    plug._init = function (guiBuilder) {      
//
//        guiBuilder.Color({
//            label: "Color",
//            tooltip: "Ambient light color",
//            color: core.defaults.AmbientLight.color,
//            onChange: function (hex) {
//                scene.lights.AmbientLight.setColor('#' + hex);
//            }
//        });
//
//    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);