MLJ.core.plugin.TexturePanel = function (parameters, defaults) {
    var _this = this;      
    MLJ.core.setDefaults(_this.getName(), defaults)
    var pane = new MLJ.gui.component.Pane();
    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    
    this._main = function(){
        var texturePane = MLJ.widget.TabbedPane.getTexturePane();
        _this._init(guiBuilder);
        pane.appendContent('<div style="display: table-cell; width: 50%; padding: 4px; vertical-align: middle;">'
                                +'<label for="textureName"></label>'
                                +'<label for="textureInfos"></label>'
                                +'</div>');
        pane.appendContent('<div id="texCanvasWrapper">'
                            +'<canvas id="texGlCanvas"></canvas>'
                            +'</div>');
        texturePane.append(pane.$);
    };
    
    $(document).on("SceneLayerSelected SceneLayerAdded", function (event, layer) {
            _this._applyTo(layer, 1, $);
    });
    
    $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
            _this._applyTo(layer, layersNum, $);      
    });
};
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.TexturePanel);