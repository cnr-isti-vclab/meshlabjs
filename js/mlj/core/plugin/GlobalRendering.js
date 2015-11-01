// TODO refactor code, event handling

MLJ.core.plugin.GlobalRendering = function (parameters, defaults) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);

    //if is defined parameters.loadShader, this.shaders is an associative array
    //mapping the shader name with its code
    this.shaders = null;

    var _this = this;
    //MLJ.core.setDefaults(_this.getName(), defaults); reminder


    var pane = new MLJ.gui.component.Pane();
    var UID = MLJ.gui.generateUID();
    pane.$.css("position", "absolute").attr("id", UID);
    pane.$.hide();      

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var tbBuilder = new MLJ.core.plugin.RenderingBarBuilder(
            MLJ.widget.TabbedPane.getRendToolBar());
    var renderingPane = MLJ.widget.TabbedPane.getRenderingPane();

    parameters.toggle = true;
    var btn = tbBuilder.Button(parameters);

    var group = MLJ.gui.makeGroup("globalRendButtons");
    if (btn instanceof MLJ.gui.component.CustomToggleButton) {
        group.addItem(btn);
        //MLJ.gui.disabledOnSceneEmpty(btn);
    }
    
    //Shows the options pane of this rendering feature
    // ?? same as Rendering.js ??
    function _showOptionsPane() {

        
        if (parameters.toggle === true) {
            btn.setArrowSelected(true);
        }
            
        var items = group.getItems();
        var item;
        for (var key in items) {
            item = items[key];
            if (item !== btn) {
                item.setArrowSelected(false);
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

    // are global rendering plugins always toggle buttons?
    if (parameters.toggle === true) {
        
        //Click on button
        btn.onToggle(function (on, event) {
            if (on) {
                _showOptionsPane();
            }
            _this._applyTo(on);
            MLJ.core.Scene.render();
        });

        //Clicked with mouse right button
        btn.onRightButtonClicked(function () {

        });

        //Click on arrow same as Rendering.js
        btn.onArrowClicked(function () {
            _showOptionsPane();            
        });             
        
        // TODO Update by default or rely on plugins passing updateOnLayerAdded == true
        // as parameter?
        $(document).on("SceneLayerAdded SceneLayerReloaded SceneLayerRemoved",
                function (event, meshFile, layersNumber) {
                    if (btn.isOn()) {
                        _this._applyTo(false);
                        _this._applyTo(true);
                        MLJ.core.Scene.render();
                    }
                });

        $(document).on("SceneLayerUpdated",
                function (event, meshFile) {

                });                
        
        if (parameters.applyOnEvent !== undefined) {

        }
    }

    $(document).on("SceneLayerSelected", function (event, meshFile) {

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

    }

    function reapply(applay, meshFile) {

    }

    guiBuilder.setOnParamChange(function (callback, value) {
        if (jQuery.isFunction(callback)) {
            callback(value);
            MLJ.core.Scene.render();
        }
    });

    // same as Rendering.js
    this._main = function () {
        //if loadShader property is setted, load shader files
        if (parameters.loadShader !== undefined) {

            //Prevent that the rendering pass will be applied if the shader
            //files are not completely loaded
            btn.$.hide();

            var pathBase = "./js/mlj/plugins/rendering/shaders/";
            //Set shader files path
            for (var i = 0, m = parameters.loadShader.length; i < m; i++) {
                parameters.loadShader[i] = pathBase + parameters.loadShader[i];
            }

            MLJ.util.loadFile(parameters.loadShader, function (results) {
                //Shader loaded
                _this.shaders = results;
                //Show button
                btn.$.show();
            });
        }
        _this._init(guiBuilder);
        renderingPane.append(pane.$);
    };

};

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.GlobalRendering);
