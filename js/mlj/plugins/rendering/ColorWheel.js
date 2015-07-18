
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#A0A0A0')
    };

    var plug = new plugin.Rendering({
        name: "ColorWheel",
        tooltip: "ColorWheel Tooltip",
        icon: "img/icons/color.png"        
    }, DEFAULTS);

    var albedoColor;

    plug._init = function (guiBuilder) {

        albedoColor = guiBuilder.Color({
            label: "Albedo color",
            tooltip: "Diffuse color of the material",
            color: "#"+DEFAULTS.color.getHexString(),
            bindTo: "color"
        });

    };

    plug._applyTo = function (meshFile, on) {
//        if (defaults === true) {
//            meshFile.material.setColor(DEFAULTS.color.clone());
//        } else {
//            meshFile.material.setColor(albedoColor.getColor());
//        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
