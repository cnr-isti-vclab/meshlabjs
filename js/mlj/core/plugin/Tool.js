/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
MLJ.core.plugin.ToolRendering = function (parameters, renderingClass) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);

    var _this = this;

    var pane = new MLJ.gui.component.Pane();
    var UID = MLJ.gui.generateUID();
    pane.$.css("position", "absolute").attr("id", UID);
    pane.$.hide();    

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var toggleButtonBuilder = new MLJ.core.plugin.RenderingBarBuilder(
            MLJ.widget.TabbedPane.getToolsToolBar());
    var renderingPane = MLJ.widget.TabbedPane.getToolPane();

    var _btn = toggleButtonBuilder.Button(parameters);

    // Group ToggleButtons of the same rendering class
    var group = MLJ.gui.makeGroup(renderingClass);
    if (_btn instanceof MLJ.gui.component.CustomToggleButton) {
        group.addItem(_btn);
        _btn.onArrowClicked(function () {
            _this._showOptionsPane();            
        });
    }

    /** @type {MLJ.util.AssociativeArray} Shader files loaded by this plugin */
    this.shaders = null;

    /**
     * Displays the options pane of the rendering plugin
     */
    this._showOptionsPane = function () {
        if (parameters.toggle === true) {
            _btn.setArrowSelected(true);
        }

        for (var groupName in MLJ.gui.group) {
            var items = MLJ.gui.group[groupName].getItems();
            for (var i = 0; i < items.length; ++i) {
                if (items[i] !== _btn) {
                    items[i].setArrowSelected(false);
                }
            }
        }
        
        renderingPane.children().each(function (key, val) {
            if ($(val).attr("id") === UID) {
                $(val).fadeIn();
            } else {
                $(val).fadeOut();                
            }
        });
    }

    /**
     * GUI parameter widget getter
     * @param {Object} paramKey The object used to retrieve the parameter
     * @returns {MLJ.gui.Param} The parameter widget bound by the
     * MLJ.core.plugin.GUIBuilder of this plugin to <code>paramKey</code>
     * (that is, the parameter widget <code>pw</code> of this rendering plugin
     * such that <code>pw.bindTo === paramName</code>)
     */
    this.getParam = function (paramKey) {
        return guiBuilder.params.getByKey(paramKey);
    }

    this._main = function () {
        //if loadShader property is setted, load shader files
        if (parameters.loadShader !== undefined) {

            //Prevent that the rendering pass will be applied if the shader
            //files are not completely loaded
            _btn.$.hide();

            var pathBase = "./js/mlj/plugins/rendering/shaders/";
            //Set shader files path
            for (var i = 0, m = parameters.loadShader.length; i < m; i++) {
                parameters.loadShader[i] = pathBase + parameters.loadShader[i];
            }

            MLJ.util.loadFile(parameters.loadShader, function (results) {
                //Shader loaded
                _this.shaders = results;
                //Show button
                _btn.$.show();
            });
        }
        _this._init(guiBuilder);
        renderingPane.append(pane.$);
    };

    /**
     * @returns {MLJ.gui.component.Button | MLJ.gui.component.CustomToggleButton}
     * The button component created for this rendering plugin
     */
    this.getButton = function () {
        return _btn;
    };

    this._setOnParamChange = guiBuilder.setOnParamChange;
}

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.ToolRendering);

MLJ.core.plugin.Tool = function (parameters, defaults) {
    var renderingClass = "mlj_tool_overlay";
    MLJ.core.plugin.ToolRendering.call(this, parameters, renderingClass);

    var _this = this;
    
    MLJ.core.setDefaults(_this.getName(), defaults);

    var btn = this.getButton();
    MLJ.gui.disabledOnSceneEmpty(btn);

    if (parameters.toggle === true) {
        
        //Click on button
        btn.onToggle(function (on, event) {
            
            if (on) {//the tooltip is active
                //show the options pane
                _this._showOptionsPane();
                //when active a tool panel disable others ----
                var items = MLJ.gui.group[renderingClass].getItems();
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].isOn() && items[i] !== btn) {
                        items[i].toggle("off", event);
                    }
                }
                //------
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
                    //console.log(_this);
                    _this._applyTo(selected, on);
                    selected.properties.set(parameters.name, on);
                }
            }                        
        });

        //Clicked with mouse right button
        /*btn.onRightButtonClicked(function (event) {
            if (!btn.isOn()) {
                btn.toggle("on", event);
            }
            var items = MLJ.gui.group[renderingClass].getItems();
            for (var i = 0; i < items.length; ++i) {
                if (items[i].isOn() && items[i] !== btn) {
                    items[i].toggle("off", event);
                }
            }
        });*/

        $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
            if (layer.properties.getByKey(parameters.name) === true) {
                layer.properties.set(parameters.name, false);
                _this._applyTo(layer, false); // Remove the pass
            }
        });
        
        $(document).on("SceneLayerAdded SceneLayerReloaded",
                function (event, meshFile, layersNumber) {
                    disableSelection();
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
                disableSelection();
                _this._applyTo(meshFile, true);
                update();
            }); 
    }

    $(document).on("SceneLayerSelected", function (event, meshFile) {
        disableSelection();
        
        
        
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
    $(document).on("SceneLayerVisibility", function (event,layerName, visible) {
        if(visible===false){ 
            var layerInvisible=MLJ.core.Scene.getLayerByName(layerName);
            var selected=MLJ.core.Scene.getSelectedLayer();
            if(selected ===layerInvisible)
            {
                _this._applyTo(layer,false);
                btn.toggle("off",event);
            }
        }
        
       //console.log("visibility changed"+visible);
    });
    $(document).on("unToogle", function (event,mesh) {
        btn.toggle("off",event);
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
    /*
     * this function is used to disable the selection mode when the user change the focus between the current layer
     * and another one
     */
    function disableSelection(){
        var selected = MLJ.core.Scene.getSelectedLayer();
        var ptr = MLJ.core.Scene.getLayers().iterator();     
        //console.log(selected);
        while (ptr.hasNext()) {
            layer = ptr.next();
            //console.log(layer);
            //if(layer !== selected){
                //console.log("disableSelection");
                _this._applyTo(layer,false);
                btn.toggle("off",event);
                MLJ.core.Scene.updateLayer(layer);
            //}
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

        if (jQuery.isFunction(paramProp)) { //is 'bindTo' property a function?
            paramProp(value, overlay);
        }

        //if overlay undefined just return
        if (overlay === undefined) {
            return;
        }
        
        //is 'bindTo' property a uniform?
        if (overlay.material && overlay.material.uniforms && overlay.material.uniforms[paramProp]) {
            overlay.material.uniforms[paramProp].value = value;
        }

        MLJ.core.Scene.render();
    });
};

MLJ.extend(MLJ.core.plugin.ToolRendering, MLJ.core.plugin.Tool);
