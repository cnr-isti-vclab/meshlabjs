// TODO comments
MLJ.core.plugin.AbstractRendering = function (parameters, renderingGroup) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);

    this.shaders = null;

    var _this = this;

    var pane = new MLJ.gui.component.Pane();
    var UID = MLJ.gui.generateUID();
    pane.$.css("position", "absolute").attr("id", UID);
    pane.$.hide();      

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var tbBuilder = new MLJ.core.plugin.RenderingBarBuilder(
            MLJ.widget.TabbedPane.getRendToolBar());
    var renderingPane = MLJ.widget.TabbedPane.getRenderingPane();

    var _btn = tbBuilder.Button(parameters);

    var group = MLJ.gui.makeGroup(renderingGroup);
    if (_btn instanceof MLJ.gui.component.CustomToggleButton) {
        group.addItem(_btn);
        _btn.onArrowClicked(function () {
            _this._showOptionsPane();            
        });
    }

    this._showOptionsPane = function () {
        // seta arrow for all classes
        
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

    /* returns the MLJ.gui.Param control bound by the guiBuilder to paramName
       (that is, the parameter widget 'pw' of this rendering plugin such that
        pw.bindTo === paramName) */
    this.getParam = function (paramName) {
        return guiBuilder.params.getByKey(paramName);
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

    this.getButton = function () { return _btn; };

    this._setOnParamChange = guiBuilder.setOnParamChange;
}

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.AbstractRendering);