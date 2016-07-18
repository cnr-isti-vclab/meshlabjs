MLJ.core.plugin.Texturing = function (parameters, defaults) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);
    var _this = this;      
    MLJ.core.setDefaults(_this.getName(), defaults)
    var pane = new MLJ.gui.component.Pane();
    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var UID = MLJ.gui.generateUID();   
    var texturePane = MLJ.widget.TabbedPane.getTexturePane(); 
    
    this._main = function(){
        _this._init(guiBuilder);
        
        pane.appendContent('<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                +'<label for="textureName"></label>'
                                +'<label for="textureInfos"></label>'
                                +'</div>');
        pane.appendContent('<div id="texCanvasWrapper"></div>'); //The webgl texture canvas wrapper
        texturePane.append(pane.$);
        texturePane.hide(); //hide the panel when initializing the plugin
    };
    
    
    this.getParam = function (paramKey) {
        return guiBuilder.params.getByKey(paramKey);
    }
    
    this._setOnParamChange = guiBuilder.setOnParamChange;
    
    this._setOnParamChange(function (paramProp, value) {
        // update parameter
        var layer = MLJ.core.Scene.getSelectedLayer();
        var params = layer.texture.texPanelParam;
        // update parameter
        params[paramProp] = value;
        if (jQuery.isFunction(paramProp)) { //is 'bindTo' property a function?
            paramProp(value);
        }       
    });
    
    $(document).on("SceneLayerAdded", function (event, layer) {
        //Let's create the texPanelparam array (cannot directly pass defaults or
        //js will make a deep copy checking always the pointer of the defaults array
        layer.texture.texPanelParam = [];
        for(var name in defaults)
            layer.texture.texPanelParam[name] = defaults[name];
        
        update();            
        _this._applyTo(layer, 1, $);
        
        if(layer.texture.hasTexture)                       
            texturePane.show();
        else texturePane.hide();
    }); 
    
    $(document).on("SceneLayerSelected", function (event, layer) {
        if(layer.texture.hasTexture)                       
            texturePane.show();
        else texturePane.hide();
        
        update();
        _this._applyTo(layer, 1, $);
    });    
    
    $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
        if(layersNum < 1)            
            texturePane.hide();
        
        update();
        _this._applyTo(layer, layersNum, $);      
    });
    
    
    function update() {
        var selected = MLJ.core.Scene.getSelectedLayer();
        var params = selected.texture.texPanelParam;
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