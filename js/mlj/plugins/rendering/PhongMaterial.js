
(function (plugin, core, scene) {

    var plug = new plugin.Rendering(
            "Phong Material",
            "Modify Phong Material paramters");

    var shininessWidget;

    plug._init = function (tbBuilder, guiBuilder) {

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

        var shadingWidget = guiBuilder.Choice({
            label: "Shading",
            tooltip: "How the triangles of a curved surface are rendered: as a smooth surface, as flat separate facets, or no shading at all",
            options: [
                {content: "Flat", value: THREE.FlatShading, selected: true},
                {content: "Smooth", value: THREE.SmoothShading}
//                {content: "None", value: THREE.NoShading}
            ]
        });

        shininessWidget = guiBuilder.Integer({
            label: "Shininess",
            tooltip: "How shiny the specular highlight is. A higher value gives a sharper highlight",
            min: 0, max: 100, step: 1,
            defval: core.defaults.PhongMaterial.shininess
        });

        shininessWidget.onChange(function (val) {
            var meshFile = scene.getSelectedLayer();
            meshFile.material.setShininess(val);
        });
        
        shadingWidget.onChange(function(val) {
            var meshFile = scene.getSelectedLayer();
            meshFile.setShading(val);
            //IMPOSTARE VALORE DI DEFOULT
        });                    

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);