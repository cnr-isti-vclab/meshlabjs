
(function (plugin, core, scene) {

    var plug = new plugin.Rendering(
            "Ambient Light",
            "Modify ambient light parameters");

    plug._init = function (tbBuilder, guiBuilder) {
        var light = tbBuilder.Toggle({
            tooltip: "Ambient light on/off",
            icon: "img/icons/light.png",
            on: core.defaults.AmbientLight.on
        });

        guiBuilder.Color({
            label: "Color",
            tooltip: "Ambient light color",
            color: core.defaults.AmbientLight.color,
            onChange: function (hex) {
                scene.lights.AmbientLight.setColor('#' + hex);
            }
        });

        light.onToggle(function (on) {
            scene.lights.AmbientLight.setOn(on);
        });

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);