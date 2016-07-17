MLJ.core.plugin.TexturePanel = function (parameters, defaults) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);
    var _this = this;      
    MLJ.core.setDefaults(_this.getName(), defaults)
    var pane = new MLJ.gui.component.Pane();
    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var UID = MLJ.gui.generateUID();    
    
    this._main = function(){
        var texturePane = MLJ.widget.TabbedPane.getTexturePane();
        _this._init(guiBuilder);
        
        pane.appendContent('<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                +'<label for="textureName"></label>'
                                +'<label for="textureInfos"></label>'
                                +'</div>');
        pane.appendContent('<div id="texCanvasWrapper"></div>'); //The webgl texture canvas wrapper
        texturePane.append(pane.$);
    };
    
    
    this.getParam = function (paramKey) {
        return guiBuilder.params.getByKey(paramKey);
    }
    
    this._setOnParamChange = guiBuilder.setOnParamChange;
    
    this._setOnParamChange(function (paramProp, value) {
        // update parameter
        var layer = MLJ.core.Scene.getSelectedLayer();
        var params = layer.overlaysParams.getByKey(_this.getName());
        // update parameter
        params[paramProp] = value;
        if (jQuery.isFunction(paramProp)) { //is 'bindTo' property a function?
            paramProp(value);
        }        
    });
    
    $(document).on("SceneLayerSelected SceneLayerAdded", function (event, layer) {
        update();
        _this._applyTo(layer, 1, $);
    });    
    
    $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
        update();
        _this._applyTo(layer, layersNum, $);      
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
};
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.TexturePanel);