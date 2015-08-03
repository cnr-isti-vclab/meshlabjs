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
 * @file Defines the functions and classes to create and to manage the 
 * graphical user interface of MeshLabJS
 * @author Stefano Gabriele
 */

/**
 * MLJ.gui namespace
 * @namespace MLJ.gui
 * @memberOf MLJ
 * @author Stefano Gabriele
 */
MLJ.gui = {};

/**
 * Contains all installed and running widget 
 * @memberOf MLJ
 * @type Object
 */
MLJ.widget = {};

/**
 * Installs a widget; technically sets the entry <code> MLJ.widget[name] = widget</code>
 * @param {String} name The name of the widget
 * @param {MLJ.gui.Widget} widget The widget to be installed
 * @memberOf MLJ.gui 
 * @author Stefano Gabriele
 */
MLJ.gui.installWidget = function (name, widget) {
    if (widget instanceof MLJ.gui.Widget) {
        MLJ.widget[name] = widget;
    } else {
        console.error("The parameter must be an instance of MLJ.gui.Widget");
    }
};

/**
 * Returns a widget by its name
 * @param {String} name The name of the widget 
 * @returns {MLJ.gui.Widget} The widget if it exists in <code>MLJ.widget</code>,
 * <code>null</code> otherwise
 * @memberOf MLJ.gui
 * @author Stefano Gabriele
 */
MLJ.gui.getWidget = function (name) {
    if (MLJ.widget[name]) {
        return MLJ.widget[name];
    } 
    
    console.warn("The widget '" + name + "' is not installed. Check includes.");    
    return null;    
};

/**
 * Utility function to make a component automatically disabled if the scene doesn't contains layers
 * or automatically enabled if the scene contains at least one layer
 * @param {MLJ.gui.component.Component} component The component to disable/enable
 * @memberOf MLJ.gui
 * @author Stefano Gabriele
 */
MLJ.gui.disabledOnSceneEmpty = function (component) {

    $(window).ready(function () {
        component.disabled(true);
    });

    $(document).on("SceneLayerAdded", function (ev, layer, layersNum) {
        if (layersNum > 0) {
            component.disabled(false);
        } else {
            component.disabled(true);
        }
    });
};

MLJ.gui.disabledOnCppMesh = function(component) {
    $(document).on("SceneLayerSelected", function (ev, layer) {
        if(layer.cpp === true) {
            component.disabled(true);
        } else {
            component.disabled(false);
        }                
    });            

    $(document).on("SceneLayerAdded", function (ev, layer) {
        if(layer.cpp === true) {
            component.disabled(true);
        } else {
            component.disabled(false);
        }                
    });     
};

(function () {

    var _counter = 0;    
    
    /**
     * Returns an unique id; useful when it is necessary to add a UID to a GUI component
     * @returns {String} The UID string     
     * @memberOf MLJ.gui
     * @author Stefano Gabriele
     */
    this.generateUID = function () {
        return "mlj-uid-" + _counter++;
    }
    
    this.makeGroup = function (name) {

        var _group = function () {
            var __items = [];

            this.addItem = function (item) {
                __items.push(item);
            };

            this.getItems = function () {
                return __items;
            };
        };

        if (MLJ.gui.group === undefined) {
            MLJ.gui.group = {};
            MLJ.gui.group.name = new _group();
        } else if (MLJ.gui.group.name === undefined) {
            MLJ.gui.group.name = new _group();
        }

        return MLJ.gui.group.name;
    }   
    
}).call(MLJ.gui);
