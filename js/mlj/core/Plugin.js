/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file Defines the basic classes and functions to manage and to create plugins
 * @author Stefano Gabriele
 */

/**
 * MLJ.core.plugin namespace
 * @namespace MLJ.core.plugin
 * @memberOf MLJ.core
 * @author Stefano Gabriele
 */
MLJ.core.plugin = {
};

/**         
 * @class Defines a generic plugin
 * @param {Integer} type The type of plugin, i.e. <code>MLJ.core.plugin.type.FILTER</code>
 * or <code>MLJ.core.plugin.type.RENDERING</code>
 * @param {String} name The name of plugin
 * @memberOf MLJ.core.plugin
 * @author Stefano Gabriele 
 */
MLJ.core.plugin.Plugin = function (name, parameters) {
    this.name = name;
    this.parameters = parameters;
};

MLJ.core.plugin.Plugin.prototype = {
    /**
     * Returns the name of plugin               
     * @returns {String} The name of plugin
     * @author Stefano Gabriele
     */
    getName: function () {
        return this.name;
    },
    /**
     * Returns the parameter of plugins or <code>undefined</code> if plugin has no
     * parameters
     * @returns {Object} The parameters of plugin or <code>undefined</code> if plugin 
     * has no parameters    
     * @author Stefano Gabriele
     */
    getParameters: function () {
        return this.paramters;
    },
    /**
     * This function should be overridden to define the plugin GUI and its initialization stuff
     * @param {MLJ.core.plugin.GUIBuilder} guiBuilder The object that provides 
     * useful function to build the GUI quickly
     * @abstract     
     * @author Stefano Gabriele
     */
    _init: function (guiBuilder) {
    },
    /**
     * This function should be overridden to define the code that will
     * be executed after that apply or apply to all visible buttons was clicked
     * @param {MLJ.core.MeshFile} meshFile The mesh file that should be affected
     * by the code defined in this function
     * @abstract       
     * @author Stefano Gabriele
     */
    _applyTo: function (meshFile) {
    },
    /**
     * This function represents the main entry point for the plugin execution
     * @abstract      
     * @author Stefano Gabriele
     */
    _main: function () {
    }
};

/**         
 * @class Creates a new GUI builder object, this is the base class used to build
 * GUIs for filters and rendering features
 * @param {MLJ.gui.component.Component} component The base GUI component where 
 * append the MeshLabJs widgets 
 * @memberOf MLJ.core.plugin
 * @author Stefano Gabriele 
 */
MLJ.core.plugin.GUIBuilder = function (component) {
    this.Float = function (flags) {
        var float = new MLJ.gui.Param.Float(flags);
        component.appendContent(float._make());
        return float;
    };
    this.Integer = function (flags) {
        var integer = new MLJ.gui.Param.Integer(flags);
        component.appendContent(integer._make());
        return integer;
    };
    this.Bool = function (flags) {
        var bool = new MLJ.gui.Param.Bool(flags);
        component.appendContent(bool._make());
        return bool;
    };
    this.Choice = function (flags) {
        var choice = new MLJ.gui.Param.Choice(flags);
        component.appendContent(choice._make());
        return choice;
    };
    this.Color = function (flags) {
        var color = new MLJ.gui.Param.Color(flags);
        component.appendContent(color._make());
        return color;
    };
};

MLJ.core.plugin.RenderingBarBuilder = function (tb) {
    this.Button = function (flags) {
        var button = flags.toggle === true
                ? new MLJ.gui.component.CustomToggleButton(flags)
                : new MLJ.gui.component.Button(flags);

        tb.add(button);

        return button;
    };
};

/**         
 * @class Creates a new filter
 * @param {Object} parameters The object contains the initialization parameters 
 * to create filter plugin<br>
 * <code> paramters = {<br>
 * &nbsp name: //the name of filter<br> 
 * &nbsp tooltip: //the filter description shown if mouse pointer is 
 * over its name<br>
 * &nbsp arity: //An integer:<br>
 * &nbsp&nbsp&nbsp&nbsp //0 for a creation filter<br>
 * &nbsp&nbsp&nbsp&nbsp //1 for a generic filter <br>
 * &nbsp&nbsp&nbsp&nbsp //>1 if the filter doesn't use the current mesh but 
 * defines its own meshes<br>
 * }
 * </code>
 * @memberOf MLJ.core.plugin 
 * @author Stefano Gabriele 
 * @example
 * <caption>Refine Filter</caption>
 * (function (plugin, scene) {
 *
 *      var filter = new plugin.Filter({
 *          name: "Refine",
 *          tooltip: "Apply a subdvision surface refinement step, using various approach (midpoint/loop)",
 *          arity: 1
 *      });
 *
 *      var iterWdg;
 *      filter._init = function (builder) {
 *
 *          iterWdg = builder.Integer({
 *              max: 5, min: 1, step: 1, defval: 1,
 *              label: "Step",
 *              tooltip: "How many refinement iterations are applied to the mesh"
 *          });
 *
 *      };
 *
 *      filter._applyTo = function (meshFile) {
 *          Module.RefineMesh(meshFile.ptrMesh,iterWdg.getValue());
 *          scene.updateLayer(meshFile);
 *      };
 *
 *      plugin.install(filter);
 *
 * })(MLJ.core.plugin, MLJ.core.Scene);
 */
MLJ.core.plugin.Filter = function (parameters) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters.tooltip,
            parameters.arity);
    var _this = this;

    var entry = new MLJ.gui.component.AccordionEntry(
            {label: parameters.name, tooltip: parameters.tooltip});

    //Test if arity is number and is integer
    if (!(Math.floor(parameters.arity) === parameters.arity &&
            jQuery.isNumeric(parameters.arity))) {
        parameters.arity = 1;
    }

    var filterBuilder = new MLJ.core.plugin.GUIBuilder(entry);

    $(document).on("mljSearchSelect", function (ev, select) {
        var found = false;

        for (var i = 0, m = select.length; i < m; i++) {

            if (parameters.name.includes(select[i])) {
                entry.show();
                found = true;
                //exit from for cycle
                i = select.length;
            }
        }

        if (!found) {
            entry.hide();
        }

        MLJ.widget.TabbedPane.getFiltersAccord().refresh();
    });

    this._main = function () {
        MLJ.widget.TabbedPane.getFiltersAccord().addEntry(entry);

        var apply = new MLJ.gui.component.Button({
            tooltip: "Apply to selected layer",
            icon: "img/icons/apply.png",
        });

        entry.addHeaderButton(apply);

        apply.onClick(function () {
            var meshFile = MLJ.core.Scene.getSelectedLayer();
            var t0 = performance.now();
            _this._applyTo(meshFile);
            var t1 = performance.now();
            MLJ.widget.Log.append(name + " exectution time " + Math.round(t1 - t0) + " ms");
        });

        if (parameters.arity > 0) {
            MLJ.gui.disabledOnSceneEmpty(apply);
        }

        if (parameters.arity === 1) {
            var applyAll = new MLJ.gui.component.Button({
                tooltip: "Apply to all visible layers",
                icon: "img/icons/apply_all.png",
            });
            entry.addHeaderButton(applyAll);

            MLJ.gui.disabledOnSceneEmpty(applyAll);

            applyAll.onClick(function () {
                var ptr = MLJ.core.Scene.getLayers().iterator();
                var layer;
                var t0 = performance.now();
                while (ptr.hasNext()) {
                    layer = ptr.next();
                    if (layer.getThreeMesh().visible) {
                        _this._applyTo(layer);
                    }
                }
                var t1 = performance.now();
                MLJ.widget.Log.append(name + " exectution time " + Math.round(t1 - t0) + " ms");
            });
        }

        _this._init(filterBuilder);
    };
};

MLJ.core.plugin.Rendering = function (parameters) {
    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters.parameters);
    var _this = this;

    var pane = new MLJ.gui.component.Pane();
    var UID = MLJ.gui.generateUID();
    pane.$.css("position", "absolute").attr("id", UID);

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(pane);
    var tbBuilder = new MLJ.core.plugin.RenderingBarBuilder(
            MLJ.widget.TabbedPane.getRendToolBar());
    var renderingPane = MLJ.widget.TabbedPane.getRenderingPane();

    var btn = tbBuilder.Button(parameters);

    var group = MLJ.gui.makeGroup("rendButtons");
    if (btn instanceof MLJ.gui.component.CustomToggleButton) {
        group.addItem(btn);
        MLJ.gui.disabledOnSceneEmpty(btn);
    }

    if (parameters.toggle === true) {

        //Click on button
        btn.onToggle(function (on) {
            //Apply rendering pass to all mesh
            if (MLJ.gui.isCtrlDown()) {
                var ptr = MLJ.core.Scene.getLayers().iterator();
                var layer;
                while (ptr.hasNext()) {
                    layer = ptr.next();
                    if (layer.getThreeMesh().visible) {
                        _this._applyTo(layer, on);
                        layer.properties.set(parameters.name,on);
                    }
                }
            } else { //Apply rendering pass to selected layer
                var selected = MLJ.core.Scene.getSelectedLayer();
                if (selected !== undefined) {                    
                    _this._applyTo(selected, on);                                        
                    selected.properties.set(parameters.name,on);
                }
            }
        });

        //Clicked with mouse right button
        btn.onRightButtonClicked(function () {
            btn.toggle("on");
            var items = group.getItems();
            var item;
            for (var key in items) {
                item = items[key];
                if (item !== btn) {
                    item.toggle("off");
                }
            }

        });

        //Click on arrow
        btn.onArrowClicked(function () {

            renderingPane.children().each(function (key, val) {
                if ($(val).attr("id") === UID) {
                    $(val).fadeIn();
                } else {
                    $(val).fadeOut();
                }
            });

        });

        $(document).on("SceneLayerAdded",
                function (event, meshFile, layersNumber) {                    
                    _this._applyTo(meshFile, btn.isOn());
                    meshFile.properties.set(parameters.name,btn.isOn());
                });

    } else {
        btn.onClick(function () {

            renderingPane.children().each(function (key, val) {
                if ($(val).attr("id") === UID) {
                    $(val).fadeIn();
                } else {
                    $(val).fadeOut();
                }
            });
        });
    }

    $(document).on("SceneLayerSelected", function (event, meshFile) {
        _this._update();

        if (parameters.toggle === true) {
            var val = meshFile.properties.getByKey(parameters.name);            
            if (val === true) {
                btn.toggle("on");
            } else {
                btn.toggle("off");
            }
        }
    });


    //Prevents context menu opening
    $(document).ready(function () {
        $(this).on("contextmenu", function (e) {
            if (btn.$.find("img").prop("outerHTML") === $(e.target).prop("outerHTML")) {
                e.preventDefault();
            }
        });
    });
    
    this._update = function () {
    },
    
    this._main = function () {
        _this._init(guiBuilder);
        renderingPane.append(pane.$);
    };

};

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Filter);
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Rendering);

(function (widget, gui) {

    var _filters = new MLJ.util.AssociativeArray();
    var _rendering = new MLJ.util.AssociativeArray();

    /**
     * Installs a new plugin in MeshLabJS
     * @memberOf MLJ.core.plugin
     * @author Stefano Gabriele
     */
    this.install = function () {
        var plugin;
        var search = MLJ.gui.getWidget("SearchTool");
        for (var i = 0; i < arguments.length; i++) {
            plugin = arguments[i];
            if (plugin instanceof MLJ.core.plugin.Plugin) {
                if (plugin instanceof MLJ.core.plugin.Filter) {
                    _filters.set(plugin.getName(), plugin);
                    search.addItem(plugin.getName());
                } else if (plugin instanceof MLJ.core.plugin.Rendering) {
                    _rendering.set(plugin.getName(), plugin);
                }
            } else {
                console.error("The parameter must be an instance of MLJ.core.Plugin");
            }
        }
    };

    /**
     * Executes the main entry point function for all installed plugins
     * @memberOf MLJ.core.plugin
     * @author Stefano Gabriele
     */
    this.run = function () {
        var ptr = _filters.iterator();
        while (ptr.hasNext()) {
            ptr.next()._main();
        }

        ptr = _rendering.iterator();
        while (ptr.hasNext()) {
            ptr.next()._main();
        }

    };

    this.getRenderingPlugins = function () {
        return _rendering;
    };

    this.getFilterPlugins = function () {
        return _filters;
    };

}).call(MLJ.core.plugin, MLJ.widget, MLJ.gui);//MLJ.widget contains GUI running widgets