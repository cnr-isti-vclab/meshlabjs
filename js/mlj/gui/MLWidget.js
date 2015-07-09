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



MLJ.gui.MLWidget = function () {
};
MLJ.gui.MLWidget.prototype = {
    _make: function () {
    }
};

MLJ.gui.MLWidget.Number = function (flags) {
    this.spinner = MLJ.gui.build.Spinner(flags);
    this.label = MLJ.gui.build.Label(flags);

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.spinner);
    };

    this._onChange = function (foo) {
        this.spinner.onSpinStop(foo);
    };

    this.setValue = function (value) {
        this.spinner.setValue(value);
    };

    MLJ.gui.MLWidget.call(this);
};

MLJ.extend(MLJ.gui.MLWidget, MLJ.gui.MLWidget.Number);

MLJ.gui.MLWidget.Float = function (flags) {
    MLJ.gui.MLWidget.Number.call(this, flags);

    var _this = this;

    this.getValue = function () {
        return parseFloat(this.spinner.getValue());
    };

    this.onChange = function (foo) {
        _this._onChange(function () {
            foo(_this.getValue());
        });
    };

};

MLJ.extend(MLJ.gui.MLWidget.Number, MLJ.gui.MLWidget.Float);

MLJ.gui.MLWidget.Integer = function (flags) {
    MLJ.gui.MLWidget.Number.call(this, flags);

    var _this = this;

    this.getValue = function () {
        return parseInt(this.spinner.getValue());
    };

    this.onChange = function (foo) {
        _this._onChange(function () {
            foo(_this.getValue());
        });
    };

};

MLJ.extend(MLJ.gui.MLWidget.Number, MLJ.gui.MLWidget.Integer);

MLJ.gui.MLWidget.Bool = function (flags) {
    this.checkbox = MLJ.gui.build.CheckBox(flags.defval);
    this.label = MLJ.gui.build.Label(flags);

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.checkbox);
    };

    this.getValue = function () {
        return this.checkbox.checked();
    };

    MLJ.gui.MLWidget.call(this);
};

MLJ.extend(MLJ.gui.MLWidget.Number, MLJ.gui.MLWidget.Bool);

MLJ.gui.MLWidget.Choice = function (flags) {
    this.choice = flags.options.length > 3
            ? MLJ.gui.build.ComboBox(flags)
            : MLJ.gui.build.ButtonSet(flags);
    this.label = MLJ.gui.build.Label(flags);

    var _this = this;

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.choice);
    };

    this.getContent = function () {
        return this.choice.getSelectedContent();
    };

    this.getValue = function () {
        return this.choice.getSelectedValue();
    };
    
    this.selectByValue = function(value) {
        this.choice.selectByValue(value);
    };

    this.onChange = function (foo) {
        $(window).ready(function () {
            _this.choice.onChange(function (event) {
                foo(_this.choice.getSelectedValue());
            });
        });
    };

    MLJ.gui.MLWidget.call(this);
};

MLJ.extend(MLJ.gui.MLWidget, MLJ.gui.MLWidget.Choice);

/**         
 * @class A color picking widget
 * @param {flags} flags
 * @memberOf MLJ.gui.MLWidget
 * @author Stefano Gabriele 
 */
MLJ.gui.MLWidget.Color = function (flags) {

    this.color = MLJ.gui.build.ColorPicker({
        onChange: function (hsb, hex) {
            flags.onChange(hex);
        },
        color: flags.color
    });

    this.label = MLJ.gui.build.Label(flags);

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.color);
    };

    this.setColor = function (color) {
        this.color.setColor(color);
    };
    
    this.getColor = function(type) {
      return this.color.getColor(type);
    };

    MLJ.gui.MLWidget.call(this);
};

MLJ.extend(MLJ.gui.MLWidget, MLJ.gui.MLWidget.Color);
