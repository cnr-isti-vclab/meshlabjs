MLJ.core.plugin.Texturing = function (parameters, defaults) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);
    var _this = this;      
    MLJ.core.setDefaults(_this.getName(), defaults)
    var pane = new MLJ.gui.component.Pane();
    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var UID = MLJ.gui.generateUID();   
    var texturePane = MLJ.widget.TabbedPane.getTexturePane(); 
    
    this._main = function(){    
        pane.appendContent('<div id="texNameContainer" style="display: table; width: 100%; margin-top: 5px; margin-bottom: 5px;">'
                                +'<div style="display: table-row;">'
                                    +'<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                        +'<label>Texture Name: </label>'
                                    +'</div>'
                                    +'<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                        +'<label for="textureName">No Layer Selected</label>'
                                    +'</div>'
                                +'</div>' 
                            +'</div>'
                            +'<div id="texInfoContainer" style="display: table; width: 100%; margin-top: 5px; margin-bottom: 5px;">'
                                +'<div style="display: table-row;">'
                                    +'<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                        +'<label>Texture Infos: </label>'
                                    +'</div>'
                                    +'<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                        +'<label for="textureInfos"></label>'
                                    +'</div>'
                                +'</div>'    
                            +'</div>');    
                    
        _this._init(guiBuilder);
        pane.appendContent('<div id="texCanvasWrapper"></div>'); //The webgl texture canvas wrapper
        texturePane.append(pane.$);
        pane.$.hide();
    };
    
    
    this.getParam = function (paramKey) {
        return guiBuilder.params.getByKey(paramKey);
    }
    
    this._setOnParamChange = guiBuilder.setOnParamChange;
    
    this._setOnParamChange(function (paramProp, value) {
        // update parameter
        var layer = MLJ.core.Scene.getSelectedLayer();
        if(layer === undefined)
            return;
                
        //the selectedTexture param is layer-dependent and not texture-dependent
        if(paramProp === "selectedTexture"){
            if(value <= layer.texturesNum) //Fix in case the other texture had more texture than the new one
                layer.selectedTexture = value;
            else layer.selectedTexture = 0;
        }
        else{
            var params = layer.texture[layer.selectedTexture].texPanelParam;            
            params[paramProp] = value; // update parameter
        }
        if (jQuery.isFunction(paramProp)) { //is 'bindTo' property a function?
            paramProp(value);
        }       
    });
    
    $(document).on("SceneLayerAdded", function (event, layer) {
        //The panel will be shown only when the first mesh is loaded
        //it is the only way to hide
        if(MLJ.core.Scene.getLayers().size() === 1)
            pane.$.show();
        
        //Let's create the texPanelparam array (cannot directly pass defaults or
        //js will make a deep copy checking always the pointer of the defaults array
        for(var i = 0; i < layer.texturesNum; i++){
            layer.texture[i].texPanelParam = [];
            for(var name in defaults)
                layer.texture[i].texPanelParam[name] = defaults[name];
        }
        
        update();            
        _this._applyTo(layer, 1, $);
    }); 
    
    $(document).on("SceneLayerSelected", function (event, layer) {
        update();
        _this._applyTo(layer, 1, $);
    });    
    
    $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
        update();
        _this._applyTo(layer, layersNum, $);      
    });
    
    
    function update() {
        var selected = MLJ.core.Scene.getSelectedLayer();
        var params = selected.texture[selected.selectedTexture].texPanelParam;
        var paramWidget;
        for (var pname in params) {
            paramWidget = _this.getParam(pname);
            if (paramWidget !== undefined) {
                paramWidget._changeValue(params[pname]);
            }
        }
    }
};
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Texturing);