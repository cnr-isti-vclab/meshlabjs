
(function (plugin, core, scene) {

    var plug = new plugin.Rendering(
            "Phong Material",
            "Modify Phong Material paramters");

    var shininessWidget;

    plug._init = function (tbBuilder, guiBuilder) {
//        var light = tbBuilder.Toggle({
//            tooltip: "Headlight on/off",
//            icon: "img/icons/light.png",
//            on: core.defaults.Headlight.on
//        });

        guiBuilder.Color({
            label: "Specular",
            tooltip: "Specular color of the material, i.e. how shiny the material is and the color of its shine. Setting this the same color as the diffuse value (times some intensity) makes the material more metallic-looking; setting this to some gray makes the material look more plastic",
            color: core.defaults.PhongMaterial.specular,
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                meshFile.material.setSpecular('#' + hex);
            }
        });

        guiBuilder.Color({
            label: "Color",
            tooltip: "Diffuse color of the material",
            color: core.defaults.PhongMaterial.color,
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                meshFile.material.setColor('#' + hex);
            }
        });

        guiBuilder.Color({
            label: "Emissive",
            tooltip: "Emissive (light) color of the material, essentially a solid color unaffected by other lighting",
            color: core.defaults.PhongMaterial.emissive,
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                meshFile.material.setEmissive('#' + hex);
            }
        });

        shininessWidget = guiBuilder.Integer({
            label: "Shininess",
            tooltip: "How shiny the specular highlight is. A higher value gives a sharper highlight",
            min: 0, max: 100, step: 1,
            defval: core.defaults.PhongMaterial.shininess
        });

//        light.onToggle(function (on) {
//            scene.lights.Headlight.setOn(on);
//        });
//
        shininessWidget.onChange(function (val) {
            var meshFile = scene.getSelectedLayer();
            meshFile.material.setShininess(val);
        });

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);