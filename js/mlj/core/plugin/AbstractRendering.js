/**
 * @file Defines the abstract base class derived by rendering plugins
 * @author Andrea Maggiordomo
 */

/**         
 * @class Defines functinalities common to all rendering plugin classes like GUI
 * components management, basic event handling, loading shader files.
 *
 * @param {Object} parameters - The parameters passed to the actual plugin constructor. Other than
 * the rendering plugin specific options (listed below), this object should contain the options
 * passed to this plugin's button constructor (see {@link MLJ.gui.component.Button}
 * and {@link MLJ.gui.component.CustomToggleButton}).
 *
 * @param {string} parameters.name - The name of this plugin, passed to {@link MLJ.core.plugin.Plugin}.
 *
 * @param {boolean} [parameters.toggle] - If true the plugin is assigned a
 * {@link MLJ.gui.component.CustomToggleButton} which allows the plugin to be turned
 * on or off, otherwise a simple {@link MLJ.gui.component.Button} is used.
 *
 * @param {string} renderingGroup - A string used to distinguish the different classes of
 * rendering plugins, used to group together their GUI elements when group-level actions
 * are needed (for example toggling all the Layer level overlays at once). This parameter
 * is handled by the framework and the plugin creation process is oblivious to it.
 *
 * @param {string[]} [parameters.loadShader] - If provided, this array should contain
 * the names of the shader files that the plugin must load.
 *
 * @memberOf MLJ.core.plugin
 */
MLJ.core.plugin.AbstractRendering = function (parameters, renderingGroup) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);

    var _this = this;

    var pane = new MLJ.gui.component.Pane();
    var UID = MLJ.gui.generateUID();
    pane.$.css("position", "absolute").attr("id", UID);
    pane.$.hide();      

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var toggleButtonBuilder = new MLJ.core.plugin.RenderingBarBuilder(
            MLJ.widget.TabbedPane.getRendToolBar());
    var renderingPane = MLJ.widget.TabbedPane.getRenderingPane();

    var _btn = toggleButtonBuilder.Button(parameters);

    var group = MLJ.gui.makeGroup(renderingGroup);
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

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.AbstractRendering);
