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
 * @class The Param base class
 * @abstract
 * @author Stefano Gabriele 
 */
MLJ.gui.Param = function () {
};

MLJ.gui.Param.prototype = {
    /**
     * The function called to build a Param widget
     * @abstract    
     */
    _make: function () {
    },
    /**
     * The function called to change the value of a param widget
     * @abstract    
     */
    _changeValue: function (val) {

    }
};

MLJ.gui.Param.Number = function (flags) {
    this.spinner = new MLJ.gui.component.Spinner(flags);
    this.label = new MLJ.gui.component.Label(flags);

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.spinner);
    };

    this._onChange = function (foo) {
        this.spinner.onSpinStop(foo);
    };

    this.setValue = function (value) {
        this.spinner.setValue(value);
    };

    this._changeValue = function (value) {
        this.setValue(value);
    };

    MLJ.gui.Param.call(this);
};

MLJ.extend(MLJ.gui.Param, MLJ.gui.Param.Number);

MLJ.gui.Param.Float = function (flags) {
    MLJ.gui.Param.Number.call(this, flags);

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

MLJ.extend(MLJ.gui.Param.Number, MLJ.gui.Param.Float);

MLJ.gui.Param.Integer = function (flags) {
    MLJ.gui.Param.Number.call(this, flags);

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

MLJ.extend(MLJ.gui.Param.Number, MLJ.gui.Param.Integer);

MLJ.gui.Param.Bool = function (flags) {
    this.checkbox = new MLJ.gui.component.CheckBox(flags.defval);
    this.label = new MLJ.gui.component.Label(flags);
    var _this = this;

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.checkbox);
    };

    this.getValue = function () {        
        return this.checkbox.isChecked();
    };

    this.setChecked = function (value) {
        this.checkbox.setChecked(value);
    };
    
    this.onChange = function(foo) {
      this.checkbox.onChange(function() {
          foo(_this.getValue());
      });
    };

    this._changeValue = function (value) {
        this.setChecked(value);
    };

    MLJ.gui.Param.call(this);
};

MLJ.extend(MLJ.gui.Param, MLJ.gui.Param.Bool);

MLJ.gui.Param.Choice = function (flags) {
    this.choice = flags.options.length > 3
            ? new MLJ.gui.component.ComboBox(flags)
            : new MLJ.gui.component.ButtonSet(flags);
    this.label = new MLJ.gui.component.Label(flags);

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

    this.selectByValue = function (value) {
        this.choice.selectByValue(value);
    };

    this._changeValue = function (value) {
        this.selectByValue(value);
    };

    this.onChange = function (foo) {
        $(window).ready(function () {
            _this.choice.onChange(function (event) {
                foo(_this.choice.getSelectedValue());
            });
        });
    };

    MLJ.gui.Param.call(this);
};

MLJ.extend(MLJ.gui.Param, MLJ.gui.Param.Choice);

/**         
 * @class A color picking widget
 * @param {flags} flags
 * @memberOf MLJ.gui.Param
 * @author Stefano Gabriele 
 */
MLJ.gui.Param.Color = function (flags) {

    this.color = new MLJ.gui.component.ColorPicker({
        onChange: function (hsb, hex) {
            flags.onChange(hex);
        },
        color: flags.color
    });

    this.label = new MLJ.gui.component.Label(flags);

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.color);
    };

    this.setColor = function (color) {
        this.color.setColor(color);
    };

    this._changeValue = function (value) {
        if(value instanceof THREE.Color) {
            this.color.setColor(value.getHexString());
        } else {
            this.color.setColor(value);
        }
    };

    this.getColor = function (type) {
        return this.color.getColor(type);
    };

    MLJ.gui.Param.call(this);
};

MLJ.extend(MLJ.gui.Param, MLJ.gui.Param.Color);

/**         
 * @class A Ranged Float widget
 * @param {flags} flags
 * @memberOf MLJ.gui.Param
 * @author Stefano Giammori 
 */
MLJ.gui.Param.RangedFloat = function (flags) {
    this.rangedfloat = new MLJ.gui.component.RangedFloat(flags);
    this.label = new MLJ.gui.component.Label(flags);
    var _this = this;

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.rangedfloat);
    };

    this.getValue = function () {
        return parseFloat(this.rangedfloat.getValue());
    };

    /*this.getStep = function () {
        return parseFloat(this.rangedfloat.getStep());
    };*/

    this.setValue = function (value) {
        this.rangedfloat.setValue(value);
    };

    this.onChange = function(foo) {
        this.rangedfloat.onChange(function(event,ui) {
            foo(parseFloat(ui.value));
        });
    };

    this._changeValue = function (value) {
        this.rangedfloat.setValue(value);
    };

};

MLJ.extend(MLJ.gui.Param, MLJ.gui.Param.RangedFloat);
