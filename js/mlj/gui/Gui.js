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
 * @param {MLJ.gui.widget.Widget} widget The widget to be installed
 * @memberOf MLJ.gui 
 * @author Stefano Gabriele
 */
MLJ.gui.installWidget = function (name, widget) {
    if (widget instanceof MLJ.gui.widget.Widget) {
        MLJ.widget[name] = widget;
    } else {
        console.error("The parameter must be an instance of MLJ.gui.widget.Widget");
    }
};

/**
 * Returns a widget by its name
 * @param {String} name The name of the widget 
 * @returns {MLJ.gui.widget.Widget} The widget if it exists in <code>MLJ.widget</code>,
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


MLJ.gui.build = {           
    Button: function (flags) {
    return new MLJ.gui.component.Button(flags);
    },
    FileButton: function (flags) {
    return new MLJ.gui.component.FileButton(flags);
    },
    ToggleButton: function (flags) {
    return new MLJ.gui.component.ToggleButton(flags);
    },
    Accordion: function (flags) {
    return new MLJ.gui.component.Accordion(flags);
    },
    AccordionEntry: function (flags) {
    return new MLJ.gui.component.AccordionEntry(flags);
    },    
    Spinner: function (flags) {
        return new MLJ.gui.component.Spinner(flags);
    },
    Slider: function (flags) {
        return new MLJ.gui.component.Slider(flags);
    },
    ToolBar: function () {
        return new MLJ.gui.component.ToolBar();
    },
    PiP: function () {
        return new MLJ.gui.component.PiP();
    },
    Pane: function () {
        return new MLJ.gui.component.Pane();
    },
    Label: function (flags) {
        return new MLJ.gui.component.Label(flags);
    },
    TextField: function (text) {
        return new MLJ.gui.component.TextField(text);
    },
    ColorPicker: function (flags) {
        return new MLJ.gui.component.ColorPicker(flags);
    },
    CheckBox: function (checked) {
        return new MLJ.gui.component.CheckBox(checked);
    },
    ComboBox: function (flags) {
        return new MLJ.gui.component.ComboBox(flags);
    },
    ButtonSet: function (flags) {
        return new MLJ.gui.component.ButtonSet(flags);
    }
};

(function () {

    var _counter = 0;    
    var _ctrlDown = false;
    
    function initKeysEventsHandler() {        
        
        $(document).keydown(function(event){        
         _ctrlDown = event.ctrlKey;
        });
        
        $(document).keyup(function(event){        
         _ctrlDown = event.ctrlKey;                    
        });
    }
        
    /**
     * Returns <code>true</code> if control key is pressed
     * @returns <code>true</code> if control key is pressed, <code>false</code> otherwise
     * @memberOf MLJ.gui
     * @author Stefano Gabriele
     */
    this.isCtrlDown = function() {
        return _ctrlDown;
    }
    
    /**
     * Returns an unique id; useful when it is necessary to add a UID to a GUI component
     * @returns {String} The UID string     
     * @memberOf MLJ.gui
     * @author Stefano Gabriele
     */
    this.generateUID = function () {
        return "mlj-uid-" + _counter++;
    };
    
    initKeysEventsHandler();
    
}).call(MLJ.gui);
