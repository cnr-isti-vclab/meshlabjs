MLJ.core.plugin.TexturePanel = function (parameters) {
    console.log("TexturePanel created");
    var _this = this;  
    
    this._main = function(){
        _this._init();
    };
    
    $(document).on("SceneLayerSelected SceneLayerAdded", function (event, layer) {
            _this._applyTo(layer, 1, $);
    });
    
    $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
            _this._applyTo(layer, layersNum, $);      
    });
};
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.TexturePanel);