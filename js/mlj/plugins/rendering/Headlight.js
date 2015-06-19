
(function (plugin, core, scene) {

    var plug = new plugin.Rendering(
            "Headlight",
            "Modify headlight paramters");

    var intensityWidget;

    plug._init = function (tbBuilder, guiBuilder) {
        var light = tbBuilder.Toggle({
            tooltip: "Headlight on/off",
            icon: "img/icons/light.png",
            on: core.defaults.Headlight.on
        });

        guiBuilder.Color({
            label: "Color",
            tooltip: "Headlight color",
            color: core.defaults.Headlight.color,
            onChange: function (hex) {
                scene.lights.Headlight.setColor('#' + hex);
            }
        });

        intensityWidget = guiBuilder.Float({
            label: "Intensity",
            tooltip: "Headlight intensity",
            min: 0, max: 30, step: 0.1,
            defval: core.defaults.Headlight.intensity
        });

        light.onToggle(function (on) {
            scene.lights.Headlight.setOn(on);
        });

        intensityWidget.onChange(function (val) {
            scene.lights.Headlight.setIntensity(val);
        });

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);