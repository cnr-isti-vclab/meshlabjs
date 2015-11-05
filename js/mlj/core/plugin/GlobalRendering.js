/**
 * @file Defines the class to create "scene level" rendering plugins. These plugins
 * implement rendering passes that are not tied to a particular mesh layer, but
 * affect the whole scene. 
 */

/**         
 * @class Base class to create rendering plugins that are not tied to a mesh layer.
 *
 * @param {Object} parameters - The plugin parameters (see {@link MLJ.core.plugin.BaseRendering}
 * for details). Note that for this rendering class <code>parameters.toggle</code>
 * is forced to <true>
 *
 * @memberOf MLJ.core.plugin
 */
MLJ.core.plugin.GlobalRendering = function (parameters) {
    var renderingClass = "mlj_rendering_scene";
    parameters.toggle = true;
    MLJ.core.plugin.BaseRendering.call(this, parameters, renderingClass);

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

MLJ.extend(MLJ.core.plugin.BaseRendering, MLJ.core.plugin.GlobalRendering);
