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
 * @file Defines the basic classes to create plugins
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
    if (name === undefined) {
        throw new Error("MLJ.core.plugin.Plugin: parameters.name undefined");
    }
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
        return this.parameters;
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
     * @param {MLJ.core.Layer} layer The mesh file that should be affected
     * by the code defined in this function
     * @abstract
     * @author Stefano Gabriele
     */
    _applyTo: function (layer) {
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
    var _this = this;
    var _onChange = function () {
    };
    this.params = new MLJ.util.AssociativeArray();

    this.Float = function (flags) {
        var float = new MLJ.gui.Param.Float(flags);
        component.appendContent(float._make());
        _this.params.set(flags.bindTo, float);

        float.onChange(function (val) {
            _onChange(flags.bindTo, val);
        });

        return float;
    };
    this.Integer = function (flags) {
        var integer = new MLJ.gui.Param.Integer(flags);
        component.appendContent(integer._make());
        _this.params.set(flags.bindTo, integer);

        integer.onChange(function (val) {
            _onChange(flags.bindTo, val);
        });

        return integer;
    };
    this.Bool = function (flags) {
        var bool = new MLJ.gui.Param.Bool(flags);
        component.appendContent(bool._make());
        _this.params.set(flags.bindTo, bool);

        bool.onChange(function (val) {
            _onChange(flags.bindTo, val);
        });

        return bool;
    };
    this.Choice = function (flags) {
        var choice = new MLJ.gui.Param.Choice(flags);
        component.appendContent(choice._make());
        _this.params.set(flags.bindTo, choice);

        choice.onChange(function (val) {
            _onChange(flags.bindTo, val);
        });

        return choice;
    };
    this.Color = function (flags) {
        var onChangeFunc = flags.onChange;

        flags.onChange = function (val) {
            _onChange(flags.bindTo, new THREE.Color('#' + val));

            if (jQuery.isFunction(onChangeFunc)) {
                onChangeFunc();
            }
        };

        var color = new MLJ.gui.Param.Color(flags);
        component.appendContent(color._make());
        _this.params.set(flags.bindTo, color);

        return color;
    };
    this.RangedFloat = function (flags) {
        var rangedfloat = new MLJ.gui.Param.RangedFloat(flags);
        component.appendContent(rangedfloat._make());
        _this.params.set(flags.bindTo, rangedfloat);

        rangedfloat.onChange(function (val) {
            _onChange(flags.bindTo, val);
        });

        return rangedfloat;
    };
    this.LayerSelection = function(flags) {
        var layerSelection = new MLJ.gui.Param.LayerSelection(flags);
        component.appendContent(layerSelection._make());
        _this.params.set(flags.bindTo, layerSelection);

        return layerSelection;
    };

    this.setOnParamChange = function (foo) {
        _onChange = foo;
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
