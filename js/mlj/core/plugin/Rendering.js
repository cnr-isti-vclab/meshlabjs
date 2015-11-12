/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file Defines the basic class to create a rendering plugin
 * @author Stefano Gabriele
 */

MLJ.core.plugin.Rendering = function (parameters, defaults) {
    var renderingClass = "mlj_rendering_overlay";
    MLJ.core.plugin.BaseRendering.call(this, parameters, renderingClass);

    var _this = this;
    
    MLJ.core.setDefaults(_this.getName(), defaults);

    var btn = this.getButton();
    MLJ.gui.disabledOnSceneEmpty(btn);

    if (parameters.toggle === true) {
        
        //Click on button
        btn.onToggle(function (on, event) {
            
            if (on) {
                //show the options pane
                _this._showOptionsPane();                
            }
            
            //Apply rendering pass to all mesh
            if (event.ctrlKey === true) {                
                var passName = parameters.name;
                var ptr = MLJ.core.Scene.getLayers().iterator();                
                //get selected layer
                var selLayer = MLJ.core.Scene.getSelectedLayer();                
                //get this rendering pass paramters of selected layer
                var selParams = selLayer.overlaysParams.getByKey(passName);
                var layer;             
                //apply rendering pass with 'selParams' to all layers
                while (ptr.hasNext()) {
                    layer = ptr.next();    
                    if (layer.getThreeMesh().visible) {
                        var lParams = layer.overlaysParams.getByKey(passName);
                        for (var opName in selParams) { // each layer gets it's own copy
                            lParams[opName] = selParams[opName];
                        }
                        // Watch out for undefined 'properties' values (overlays that were never activated)
                        if (on !== (layer.properties.getByKey(passName)===true)) { // simply toggle the pass
                            _this._applyTo(layer, on);
                        } else { // if pass is active reapply with changed parameters, otherwise switch it off
                            on ? reapply(on, layer) : _this._applyTo(layer, on);
                        }
                        layer.properties.set(passName, on);
                    }
                }
                
            } else { //Apply rendering pass to selected layer
                var selected = MLJ.core.Scene.getSelectedLayer();
                if (selected !== undefined) {
                    _this._applyTo(selected, on);
                    selected.properties.set(parameters.name, on);
                }
            }                        
        });

        //Clicked with mouse right button
        btn.onRightButtonClicked(function (event) {
            if (!btn.isOn()) {
                btn.toggle("on", event);
            }
            var items = MLJ.gui.group[renderingClass].getItems();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].isOn() && items[i] !== btn) {
                    items[i].toggle("off", event);
                }
            }
        });

        $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
            if (layer.properties.getByKey(parameters.name) === true) {
                layer.properties.set(parameters.name, false);
                _this._applyTo(layer, false); // Remove the pass
            }
        });
        
        $(document).on("SceneLayerAdded SceneLayerReloaded",
                function (event, meshFile, layersNumber) {
                    if (event.type === "SceneLayerReloaded") {
                        if (meshFile.properties.getByKey(parameters.name) === true) {
                            _this._applyTo(meshFile, false);
                        }
                    }
                    //Check if the rendering feature is enabled
                    if (!(meshFile.properties.getByKey(parameters.name) === false) && 
                            (parameters.on || meshFile.properties.getByKey(parameters.name) === true) ) {
                        btn.toggle("on");
                        _this._applyTo(meshFile, btn.isOn());
                        meshFile.properties.set(parameters.name, btn.isOn());
                        update();
                    } else {
                        btn.toggle("off");
                        if (btn.isArrowSelected()) update();
                    }
                    
                    //if the rendering pass need to be updated when a 
                    //new layer is added
                    if (parameters.updateOnLayerAdded) {
                        var ptr = MLJ.core.Scene.getLayers().iterator();
                        var layer, isOn;
                        while (ptr.hasNext()) {
                            layer = ptr.next();
                            isOn = layer.properties.getByKey(parameters.name) === true;
                            reapply(isOn,layer);                            
                        }
                    }

                });

        $(document).on("SceneLayerUpdated", function (event, layer) {
            reapply(layer.properties.getByKey(_this.getName())===true, layer);                    
        });
        
        if (parameters.applyOnEvent !== undefined) {
            $(window).ready(function() {
                $($('canvas')[0]).on(parameters.applyOnEvent, function() {
                    var it = MLJ.core.Scene.getLayers().iterator();
                    while (it.hasNext()) {
                        var layer = it.next();
                        if (layer.properties.getByKey(parameters.name) === true) {
                            reapply(true, layer);
                        }
                    }
                });
            });
        }
        
    } else {
        btn.onClick(function () {
            _this._showOptionsPane();
        });
        
        $(document).on("SceneLayerAdded SceneLayerReloaded",
            function (event, meshFile, layersNumber) {
                _this._applyTo(meshFile, true);
                update();
            });            
    }

    $(document).on("SceneLayerSelected", function (event, meshFile) {
        update();

        if (parameters.toggle === true) {
            var val = meshFile.properties.getByKey(parameters.name);
            if (val === true) {
                btn.toggle("on");
            } else {
                btn.toggle("off");
            }
        }
    });

    //Prevents context menu opening
    $(document).ready(function () {
        $(this).on("contextmenu", function (e) {
            if (btn.$.find("img").prop("outerHTML") === $(e.target).prop("outerHTML")) {
                e.preventDefault();
            }
        });
    });

    function update() {
        var selected = MLJ.core.Scene.getSelectedLayer();
        var params = selected.overlaysParams.getByKey(_this.getName());
        var paramWidget;
        for (var pname in params) {
            paramWidget = _this.getParam(pname);
            if (paramWidget !== undefined) {
                paramWidget._changeValue(params[pname]);
            }
        }
    }

    function reapply(apply, meshFile) {
        if (apply) {
            _this._applyTo(meshFile, false);
            _this._applyTo(meshFile, true);
        }
    }

    this._setOnParamChange(function (paramProp, value) {
        var layer = MLJ.core.Scene.getSelectedLayer();
        var params = layer.overlaysParams.getByKey(_this.getName());

        // update parameter
        params[paramProp] = value;
              
        if (parameters.global === true) {
            var iter = layer.overlays.iterator();
            var overlay;
            //Update the global parameter for all overlay layers
            while (iter.hasNext()) {
                overlay = iter.next();
                // check if overlay has the property defined as a uniform
                if (overlay.material && overlay.material.uniforms[paramProp]) {
                    overlay.material.uniforms[paramProp].value = value;
                }
                // also check if the property is a callable object
                if (jQuery.isFunction(paramProp)) {
                    paramProp(value, overlay, layer);
                }
            }

            MLJ.core.Scene.render();
            return;
        }

        var overlay = layer.overlays.getByKey(_this.getName());

        //if overlay undefined just return
        if (overlay === undefined) {
            return;
        }
        
        //is 'bindTo' property a uniform?
        if (overlay.material && overlay.material.uniforms && overlay.material.uniforms[paramProp]) {
            overlay.material.uniforms[paramProp].value = value;
        } else if (jQuery.isFunction(paramProp)) { //is 'bindTo' property a function?
            paramProp(value, overlay);
        }

        MLJ.core.Scene.render();
    });
};

MLJ.extend(MLJ.core.plugin.BaseRendering, MLJ.core.plugin.Rendering);
