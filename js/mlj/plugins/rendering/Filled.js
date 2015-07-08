
(function (plugin, core, scene) {

    var plug = new plugin.Rendering({
        name: "Filled",
        tooltip: "Tooltip",
        icon: "img/icons/flat.png",
        toggle: true,
        on: true,
        parameters: {
            specular: '#a9a9a9',
            emissive: '#7d7d7d',
            shininess: 50,
            shading: THREE.FlatShading,
            lighting: true
        }
    });

    var lightingWidget, shadingWidget, shininessWidget,
            specularColor, emissiveColor;
    plug._init = function (guiBuilder) {
        specularColor = guiBuilder.Color({
            label: "Specular",
            tooltip: "Specular color of the material, i.e. how shiny the material is and the color of its shine. Setting this the same color as the diffuse value (times some intensity) makes the material more metallic-looking; setting this to some gray makes the material look more plastic",
            color: plug.parameters.specular,
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                meshFile.material.setSpecular('#' + hex);
            }
        });

        emissiveColor = guiBuilder.Color({
            label: "Emissive",
            tooltip: "Emissive (light) color of the material, essentially a solid color unaffected by other lighting",
            color: plug.parameters.emissive,
            onChange: function (hex) {
                var meshFile = scene.getSelectedLayer();
                meshFile.material.setEmissive('#' + hex);
            }
        });

        shininessWidget = guiBuilder.Integer({
            label: "Shininess",
            tooltip: "How shiny the specular highlight is. A higher value gives a sharper highlight",
            min: 0, max: 100, step: 1,
            defval: plug.parameters.shininess
        });

        shadingWidget = guiBuilder.Choice({
            label: "Shading",
            tooltip: "How the triangles of a curved surface are rendered: as a smooth surface, as flat separate facets, or no shading at all",
            options: [
                {content: "Flat", value: THREE.FlatShading, selected: true},
                {content: "Smooth", value: THREE.SmoothShading}
            ]
        });

        lightingWidget = guiBuilder.Choice({
            label: "Lighting",
            tooltip: "Enable/disable lighting",
            options: [
                {content: "on", value: true, selected: true},
                {content: "off", value: false}
            ]
        });

        shininessWidget.onChange(function (val) {
            var meshFile = scene.getSelectedLayer();
            meshFile.material.setShininess(val);
        });

        shadingWidget.onChange(function (val) {
            var meshFile = scene.getSelectedLayer();
            meshFile.setShading(val);
        });

        lightingWidget.onChange(function (val) {            
            var meshFile = scene.getSelectedLayer();
            meshFile.setLighting(val);
        });

    };

    plug._update = function () {
        var meshFile = scene.getSelectedLayer();        
        specularColor.setColor(meshFile.material.parameters.specular.getHexString());
        emissiveColor.setColor(meshFile.material.parameters.emissive.getHexString());
        shininessWidget.setValue(meshFile.material.parameters.shininess);
        shadingWidget.selectByValue(meshFile.material.parameters.shading);
        lightingWidget.selectByValue(meshFile.material.parameters.lighting);
    };

    plug._applyTo = function (meshFile, on) {

        var rend = MLJ.core.plugin.getRenderingPlugins(); 
        var colorWheel = rend.getByKey("ColorWheel");

        if (on) {
            meshFile.setRenderingOn(true);
            var params = {};                                                
            
            params.color = colorWheel.getAlbedoColor();
            params.specular = specularColor.getColor();
            params.emissive = emissiveColor.getColor();
            params.shading = shadingWidget.getValue();
            params.shininess = shininessWidget.getValue();
            params.lighting = lightingWidget.getValue();                        
            
            var material = params.lighting === true
                    ? new MLJ.core.PhongMaterial(params)
                    : new MLJ.core.BasicMaterial(params);                                                                
            
            meshFile.updateMaterial(material);            
        } else {
            meshFile.setRenderingOn(false);
        }

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);