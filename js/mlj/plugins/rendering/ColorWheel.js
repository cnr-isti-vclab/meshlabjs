
(function (plugin, core, scene) {

    var plug = new plugin.Rendering({
        name: "ColorWheel",
        tooltip: "ColorWheel Tooltip",
        icon: "img/icons/color.png",
        parameters: {
            color: '#474747'
        }
    });


    var albedoColor;

    plug._init = function (guiBuilder) {

        albedoColor = guiBuilder.Color({
            label: "Albedo color",
            tooltip: "Diffuse color of the material",
            color: plug.parameters.color,
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
    
    plug.getAlbedoColor = function(type) {
      return albedoColor.getColor(type);
    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);