// Comments

MLJ.core.plugin.GlobalRendering = function (parameters) {
    parameters.toggle = true;
    var renderingGroup = "mlj_rendering_scene";
    MLJ.core.plugin.AbstractRendering.call(this, parameters, renderingGroup);

    var _this = this;

    var btn = this.getButton();
    
    // Changes to button state
    btn.onToggle(function (on, event) {
        if (on) {
            _this._showOptionsPane();
        }
        _this._applyTo(on);
        MLJ.core.Scene.render();
    });

    // Suppress right clicks
    btn.onRightButtonClicked(function () {});
    
    $(document).on("SceneLayerAdded SceneLayerReloaded SceneLayerRemoved", function (event, meshFile, layersNumber) {
        if (btn.isOn()) {
            _this._applyTo(false);
            _this._applyTo(true);
            MLJ.core.Scene.render();
        }
    });

    $(document).on("SceneLayerUpdated", function (event, meshFile) {
        //TODO
    });                
        
    if (parameters.applyOnEvent !== undefined) {
        // TODO
    }

    $(document).on("SceneLayerSelected", function (event, meshFile) {
        // TODO layer selection should not affect scene level rendering plugins
    });

    //Prevents context menu opening
    $(document).ready(function () {
        $(this).on("contextmenu", function (e) {
            if (btn.$.find("img").prop("outerHTML") === $(e.target).prop("outerHTML")) {
                e.preventDefault();
            }
        });
    });

    _this._setOnParamChange(function (callback, value) {
        if (jQuery.isFunction(callback)) {
            callback(value);
            MLJ.core.Scene.render();
        }
    });
};

MLJ.extend(MLJ.core.plugin.AbstractRendering, MLJ.core.plugin.GlobalRendering);
