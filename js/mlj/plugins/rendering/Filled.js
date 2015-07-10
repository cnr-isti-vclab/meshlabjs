
(function (plugin, core, scene) {

    /**         
     * @class Creates a new PhongMaterial 
     * @param {Object} parameters The initial paramters of the material
     * @memberOf MLJ.core
     * @author Stefano Gabriele 
     * @example
     * var material = new PhongMaterial({
     *    specular: '#ffffff',
     *    color: '#a0a0a0',
     *    emissive: '#7c7b7b',
     *    shading: THREE.FlatShading,
     *    shininess: 50, 
     * });
     */
    var PhongMaterial = function (parameters) {

        if (parameters.emissive === undefined) {
            parameters.emissive = new THREE.Color(MLJ.core.defaults.Material.emissive);
        } else if (!(parameters.color instanceof THREE.Color)) {
            parameters.emissive = new THREE.Color(parameters.emissive);
        }

        if (parameters.specular === undefined) {
            parameters.specular = new THREE.Color(MLJ.core.defaults.Material.specular);
        } else if (!(parameters.color instanceof THREE.Color)) {
            parameters.specular = new THREE.Color(parameters.specular);
        }

        /**     
         * Build a new THREE.MeshPhongMaterial initialized with <code>this.parameters</code>
         * @author Stefano Gabriele
         */
        this._build = function () {
            this.threeMaterial = new THREE.MeshPhongMaterial(this.parameters);
        };

        /**
         * Sets the Emissive (light) color of the material, essentially a solid color unaffected by other lighting
         * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
         * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
         * @author Stefano Gabriele     
         */
        this.setEmissive = function (value) {
            this.parameters.emissive = this.threeMaterial.emissive = new THREE.Color(value);
            MLJ.core.Scene.render();
        };

        /**
         * Sets the headlight color
         * @param {Object} color Can be a hexadecimal or a CSS-style string for example, "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
         * @author Stefano Gabriele     
         */
        this.setSpecular = function (value) {
            this.parameters.specular = this.threeMaterial.specular = new THREE.Color(value);
            MLJ.core.Scene.render();
        };

        /**
         * Sets the specular color of the material, i.e., how shiny the material is 
         * and the color of its shine. Setting this the same color as the diffuse 
         * value (times some intensity) makes the material more metallic-looking; 
         * setting this to some gray makes the material look more plastic
         * @param {Object} color Can be a hexadecimal or a CSS-style string 
         * for example, "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
         * @author Stefano Gabriele     
         */
        this.setShininess = function (value) {
            this.parameters.shininess = this.threeMaterial.shininess = value;
            MLJ.core.Scene.render();
        };

        MLJ.core.Material.call(this, parameters);
    };

    MLJ.extend(MLJ.core.Material, PhongMaterial);


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

        shadingWidget.onChange(function (shading) {
            var meshFile = scene.getSelectedLayer();
//            meshFile.setShading(val);

            //The mesh file is no rendered
            if (!meshFile.isRendered()) {
                return;
            }

            //Set material shading parameter
            meshFile.material.parameters.shading = shading;
            
            var material = new PhongMaterial(meshFile.material.parameters);
            
            //Update material and geometry
            meshFile.updateMaterial(material, true);
            
            //Rebuild material
            //meshFile.material.build();
                                    
            //Change mesh old material with new one
            //_this.threeMesh.material = this.material.threeMaterial;            

            //Update geometry
            //geometryNeedUpdate();

//            MLJ.core.Scene.render();
        });

        lightingWidget.onChange(function (on) {
            var meshFile = scene.getSelectedLayer();

            //The mesh file is no rendered
            if (!meshFile.isRendered()) {
                return;
            }

            meshFile.material.parameters.lighting = on;
            var material = on === true
                    ? new PhongMaterial(meshFile.material.parameters)
                    : new MLJ.core.BasicMaterial(meshFile.material.parameters);

            meshFile.updateMaterial(material);
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
                    ? new PhongMaterial(params)
                    : new MLJ.core.BasicMaterial(params);

            meshFile.updateMaterial(material);
        } else {
            meshFile.setRenderingOn(false);
        }

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);