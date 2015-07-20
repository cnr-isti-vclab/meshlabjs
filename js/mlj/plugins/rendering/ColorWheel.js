
(function (plugin, core, scene) {

    var DEFAULTS = {
        diffuse: new THREE.Color('#A0A0A0'),
        meshColorMapping: 0
    };

    var plug = new plugin.Rendering({
        name: "ColorWheel",
        tooltip: "ColorWheel Tooltip",
        icon: "img/icons/color.png",
        global: true
    }, DEFAULTS);

    var albedoColor;
    var meshColorWidget;

    plug._init = function (guiBuilder) {

        albedoColor = guiBuilder.Color({
            label: "Albedo color",
            tooltip: "Diffuse color of the material",
            color: "#"+DEFAULTS.diffuse.getHexString(),
            bindTo: "diffuse"
        });
        meshColorWidget = guiBuilder.Choice({
            label: "Mesh Color",
            tooltip: "Choose one of the possible ways of choosing the color of the mesh",
            options: [
                {content: "albedo", value: "0", selected: true},
                {content: "mesh id", value: "1"}
            ],
            bindTo: "meshColorMapping"
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
