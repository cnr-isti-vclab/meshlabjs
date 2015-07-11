
(function (plugin, core, scene) {

    var DEFAULTS = {
        color: new THREE.Color('#474747')
    };

    var plug = new plugin.Rendering({
        name: "ColorWheel",
        tooltip: "ColorWheel Tooltip",
        icon: "img/icons/color.png",
    });

    var albedoColor;

    plug._init = function (guiBuilder) {

        albedoColor = guiBuilder.Color({
            label: "Albedo color",
            tooltip: "Diffuse color of the material",
            color: "#"+DEFAULTS.color.getHexString(),
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                meshFile.material.setColor('#' + hex);
            }
        });

    };

    plug._update = function () {
        var meshFile = scene.getSelectedLayer();        
        albedoColor.setColor(meshFile.material.parameters.color.getHexString());
    };

    plug._applyTo = function (meshFile, on, defaults) {
        if (defaults === true) {
            meshFile.material.setColor(DEFAULTS.color.clone());
        } else {
            meshFile.material.setColor(albedoColor.getColor());
        }
    };

    plug.getAlbedoColor = function (type) {
        return albedoColor.getColor(type);
    };
    
    plug.getDefaults = function() {
        return DEFAULTS;
    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
