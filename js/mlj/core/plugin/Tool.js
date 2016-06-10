/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**         
 * 
 * @file Defines the basic class to create and use a tool plugin
 * @author Antonio Nicoletti
 *
 * @class Defines functinalities common to all tool plugin classes like GUI
 * components management, basic event handling and loading shader files. This class is the symmetrical one 
 * of the {@link MLJ.core.plugin.BaseRendering} class: the first one manages the tool pane and the second one 
 * manages the rendering pane which are the same basics functionalities, and the same layout.
 *
 * @param {Object} parameters - The parameters passed to the actual plugin constructor. Other than
 * the tool plugin specific options (listed below), this object should contain the options
 * passed to this plugin's button constructor (see {@link MLJ.gui.component.Button}
 * and {@link MLJ.gui.component.CustomToggleButton}).
 *
 * @param {string} parameters.name - The name of this plugin, passed to {@link MLJ.core.plugin.Plugin}.
 *
 * @param {boolean} [parameters.toggle] - If true the plugin is assigned a
 * {@link MLJ.gui.component.CustomToggleButton} which allows the plugin to be turned
 * on or off, otherwise a simple {@link MLJ.gui.component.Button} is used.
 *
 * @param {string} toolClass - A string used to distinguish the different classes of
 * tool plugins, used to group together their GUI elements when group-level actions
 * are needed (for example toggling all the Layer level overlays at once). This parameter
 * is handled by the framework and the plugin creation process is oblivious to it.
 *
 * @param {string[]} [parameters.loadShader] - If provided, this array should contain
 * the names of the shader files that the plugin must load.
 *
 * @memberOf MLJ.core.plugin
 */
MLJ.core.plugin.ToolRendering = function (parameters, toolClass) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);

    var _this = this;

    var pane = new MLJ.gui.component.Pane();
    var UID = MLJ.gui.generateUID();
    pane.$.css("position", "absolute").attr("id", UID);
    pane.$.hide();    

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var toggleButtonBuilder = new MLJ.core.plugin.RenderingBarBuilder(
            MLJ.widget.TabbedPane.getToolsToolBar());
    var toolPane = MLJ.widget.TabbedPane.getToolPane();

    var _btn = toggleButtonBuilder.Button(parameters);

    // Group ToggleButtons of the same tool class
    var group = MLJ.gui.makeGroup(toolClass);
    if (_btn instanceof MLJ.gui.component.CustomToggleButton) {
        group.addItem(_btn);
        _btn.onArrowClicked(function () {
            _this._showOptionsPane();            
        });
    }

    /** @type {MLJ.util.AssociativeArray} Shader files loaded by this plugin */
    this.shaders = null;

    /**
     * Displays the options pane of the tool plugin
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
        
        toolPane.children().each(function (key, val) {
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
        toolPane.append(pane.$);
    };

    /**
     * @returns {MLJ.gui.component.Button | MLJ.gui.component.CustomToggleButton}
     * The button component created for this rendering plugin
     */
    this.getButton = function () {
        return _btn;
    };

    this._setOnParamChange = guiBuilder.setOnParamChange;
};

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.ToolRendering);

/**
 * @class Questa classe anzitutto crea un istanza della classe ToolRendering precedente a cui è affidato il
 * compito di gestire principalmente la GUI del tool pane nel quale vengono resi disponibili tutti i Tool;
 * in secondo luogo essa effettua l'_applyTo di ogni tool plugin correttamente caricato nel sistema il che significa 
 * effettuare tutte quelle operazioni necessarie al suo utilizzo da parte dell'utente. Attiva infine una serie di ascolatori di eventi
 * per intercettare quando un layer viene rimosso, aggiunto, reso invisibile e cosi via al fine di eseguire determinate
 * operazioni sui tool plugin conseguenti all'evento scatenatosi.
 * 
 * @param {Object} parameters - The parameters passed to the actual plugin constructor. Other than
 * the tool plugin specific options (listed below), this object should contain the options
 * passed to this plugin's button constructor (see {@link MLJ.gui.component.Button}
 * and {@link MLJ.gui.component.CustomToggleButton}).
 * 
 * @param {Object} defaults - It contains the default elements to provide to <code> parameters </code>
 * 
 */

MLJ.core.plugin.Tool = function (parameters, defaults) {
    var toolClass = "mlj_tool_overlay";
    MLJ.core.plugin.ToolRendering.call(this, parameters, toolClass);

    var _this = this;
    
    MLJ.core.setDefaults(_this.getName(), defaults);

    var btn = this.getButton();
    MLJ.gui.disabledOnSceneEmpty(btn);
    /**
     * This global function can be used from every tool pane to enable or disable whatever button they use to implement some operation
     * For example the "Moving Tool" when is activated by the user, initializes two buttons, that is "Apply" and "Clear" buttons,
     * to apply some transformation on the current mesh or restore its original position, respectively.
     * @param {type} bool
     * @returns {undefined}
     */
    this._disableButtons= function (bool){
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.component.Component) {
                arguments[i]._disabled(bool);
            } else {
                console.error("The parameter must be an instance of MLJ.gui.component.Component");
            }
        }
    };

    if (parameters.toggle === true) {
        
        //Click on button
        btn.onToggle(function (on, event) {
            
            if (on) {//the tooltip is active
                //show the options pane
                _this._showOptionsPane();
                //when active a tool plugin disable others ----
                var items = MLJ.gui.group[toolClass].getItems();
                for (var i = 0; i < items.length; ++i) {
                    if (items[i].isOn() && items[i] !== btn) {
                        items[i].toggle("off", event);
                    }
                }
                //------
            }
            var selected = MLJ.core.Scene.getSelectedLayer();
            if (selected !== undefined) {
                //console.log(_this);
                _this._applyTo(selected, on);
                selected.properties.set(parameters.name, on);
            }                      
        });

        
        /*
        * Triggered when the current layer is removed, the action performed is disable the tool plugin active on it
        */
        $(document).on("SceneLayerRemoved", function (event, layer, layersNum) {
            disableSelection();
            
        });
       
        //variables used in the following events to set the main parameters -----------------
        var flag=false;
        var keyEventParam={
          event: null,
          keyPressed: false,
          keyReleased: false
        };
        /**
         * Triggered when a key is pressed down; 
         * dato che ogni tool usa un certo numero di tasti della tastiera in differente modo per usufruire di funzionalità
         * aggiuntive, la gestione dell'evento viene delegato al tool attualmente attivo attraverso l'invocazione della funzione
         * _applyTo la quale riceve l'evento scatenatosi e il suo tipo: <code> KeyPressed = true </code> se l'evento in questione
         * è il KeyDown, <code> keyReleased=true </code> se l'evento in questione è il KeyUp. I primi due parametri della funzione _applyTo 
         * sono settati a null per indicare che l'invocazione della stessa riguarda la gestione dell'evento comune. La variabile flag 
         * rimane true fintanto che il tasto rimane premuto.
         */
        $(document).bind("keydown", function (event) {
            if(btn.isOn()&&!flag){
                keyEventParam.event=event;
                keyEventParam.keyPressed=true;
                _this._applyTo(null, null, keyEventParam);
                flag=true;
                keyEventParam={
                    event: null,
                    keyPressed: false,
                    keyReleased: false
                  };
            }  
              
        });
        /*
         * Triggered when a key is released
         */
        $(document).bind("keyup", function (event) {
            if(btn.isOn()) {
                flag=false;
                keyEventParam.event=event;
                keyEventParam.keyReleased=true;
                _this._applyTo(null, null, keyEventParam);
                keyEventParam={
                    event: null,
                    keyPressed: false,
                    keyReleased: false
                  };
              }
        });
        //----------------
        /*
        * Triggered when the current layer is reloaded or a new layer is added and the current one loses focus,
        *  the action performed is disable the tool plugin active on it
        */
        $(document).on("SceneLayerAdded SceneLayerReloaded",
                function (event, meshFile, layersNumber) {
                    disableSelection();
                });

        
    } else {
        btn.onClick(function () {
            _this._showOptionsPane();
        });
    }
    /*
     * Triggered when the current layer loses focus, the action performed is disable the tool plugin active on it
     */
    $(document).on("SceneLayerSelected", function (event, meshFile) {
        disableSelection();
        
    });
    /*
     * Triggered when the current layer is made invisible, the action performed is disable the tool plugin active on it
     */
    $(document).on("SceneLayerVisibility", function (event,layerName, visible) {
        if(visible===false){ 
            var layerInvisible=MLJ.core.Scene.getLayerByName(layerName);
            var selected=MLJ.core.Scene.getSelectedLayer();
            if(selected ===layerInvisible)
            {
                _this._applyTo(selected,false);
                btn.toggle("off",event);
            }
        }
    });
    
    $(document).on("unToogle", function (event,mesh) {
        btn.toggle("off",event);
    });
    
    //Prevents context menu opening
    $(document).ready(function () {
        $(this).on("contextmenu", function (e) {
            if (btn.$.find("img").prop("outerHTML") === $(e.target).prop("outerHTML")) {
                e.preventDefault();
            }
        });
    });
    
    
    
    //this function disable all tools plugin when a layer is changed, reloaded or others------
    function disableSelection(){
        var ptr = MLJ.core.Scene.getLayers().iterator();     
        while (ptr.hasNext()) {
            var layer = ptr.next();
            _this._applyTo(layer,false);
            btn.toggle("off",event);
        }
    }
    //--------------------
    this._setOnParamChange(function (paramProp, value) {
        var layer = MLJ.core.Scene.getSelectedLayer();
        var params = layer.overlaysParams.getByKey(_this.getName());
        // update parameter
        params[paramProp] = value;
              
        if (parameters.global === true) {
            var iter = layer.overlays.iterator();
            var overlay;
            //Update the global parameter for all overlay layers
            while (iter.hasNext()) {
                overlay = iter.next();
                // check if overlay has the property defined as a uniform
                if (overlay.material && overlay.material.uniforms[paramProp]) {
                    overlay.material.uniforms[paramProp].value = value;
                }
                // also check if the property is a callable object
                if (jQuery.isFunction(paramProp)) {
                    paramProp(value, overlay, layer);
                }
            }
            MLJ.core.Scene.render();
            return;
        }
        var overlay = layer.overlays.getByKey(_this.getName());
        if (jQuery.isFunction(paramProp)) { //is 'bindTo' property a function?
            paramProp(value, overlay);
        }
        //if overlay undefined just return
        if (overlay === undefined) {
            return;
        }
        //is 'bindTo' property a uniform?
        if (overlay.material && overlay.material.uniforms && overlay.material.uniforms[paramProp]) {
            overlay.material.uniforms[paramProp].value = value;
        }
        MLJ.core.Scene.render();
    });
};

MLJ.extend(MLJ.core.plugin.ToolRendering, MLJ.core.plugin.Tool);
