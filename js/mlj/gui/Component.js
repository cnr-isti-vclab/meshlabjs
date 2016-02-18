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
 * @file Component description ...
 * @author Stefano Gabriele
 * @author Stefano Giammori
 */


/**
 * MLJ.gui.component namespace
 * @namespace MLJ.gui.component
 * @memberOf MLJ.gui
 * @author Stefano Gabriele
 */
MLJ.gui.component = {};

/**         
 * @class Component base class
 * @param {html} html
 * @param {flags} flags
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Component = function (html, flags) {
    var _flags = flags;
    var _this = this;
    this.$ = $(html);

    function init() {
        if (flags === undefined) {
            _flags = {};
        }
    }

    this.flag = function (name, value) {

        //get                
        if (value === undefined) {
            return _flags[name];
        }
        //set
        if (_flags[name]) {
            _flags[name] = value;
        } else {
            console.log("jQueryObject has not flag '" + name + "'");
        }
    };

    this.disabled = function (bool) {
        _this._disabled(bool);
    };

    $(window).ready(function () {
        _this._make();
    });

    init();
};

MLJ.gui.component.Component.prototype = {
    _make: function () {
    },
    _disabled: function (bool) {
    }
};

// GRID ________________________________________________________________________

/**         
 * @static Grid
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Grid = function () {
    var $table = $('<div></div>')
            .css({
                display: "table",
                width: "100%"
            })
            .data("grid", true);

    var $row = $('<div></div>')
            .css({
                display: "table-row"
            });

    var $cell, arg;
    var w = 100 / arguments.length;
    var padding;
    for (var i = 0, m = arguments.length; i < m; i++) {
        arg = arguments[i];
        padding = ($(arg).data("grid")) ? 0 : "4px";
        $cell = $('<div></div>')
                .css({
                    display: "table-cell",
                    width: w + '%',
                    padding: padding,
                    verticalAlign: "middle"
                });

        if (arg instanceof MLJ.gui.component.Component) {
            $cell.append(arg.$);
        } else {
            $cell.append(arg);
        }
        $row.append($cell);
    }

    return $table.append($row);

};

// Group _______________________________________________________________________

/**         
 * @static Group
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Group = function () {
    var $div = $('<div></div>');
    
    for (var i = 0, m = arguments.length; i < m; i++) {
        arg = arguments[i];
        
        if (arg instanceof MLJ.gui.component.Component) {
            $div.append(arg.$);
        } else {
            $div.append(arg);
        }        
    }

    return $div;
};

// Picture in Picture __________________________________________________________

/**         
 * @class MLJ.gui.component.PiP
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.PiP = function (x, y) {

    if (!x) {
        x = 0;
    }

    if (!y) {
        y = 0;
    }

    var _html = $("<div></div>").css({
        position: "absolute",
        top: y,
        left: x
    });

    this.appendContent = function (content) {
        this.$.append(content);
        return this;
    };

    this.setX = function (value) {
        this.$.css("left", value);
        return this;
    };

    this.setY = function (value) {
        this.$.css("top", value);
        return this;
    };

    this.setVisible = function (visible) {
        if (visible) {
            this.$.show();
        } else {
            this.$.hide();
        }

        return this;
    };

    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.PiP);

// Color Picker ________________________________________________________________
/**         
 * @class MLJ.gui.component.ColorPicker
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.ColorPicker = function (flags) {
    var _html = '<div class="mlj-color-picker"></div>';
    var _$picker = $('<input type="text"/>').addClass("mlj-picker");
    var _$preview = $('<div/>').addClass("mlj-picker-preview");
    var _this = this;
    var _currentHexColor;

    this.setColor = function (color) {
        if (color.indexOf('#') === -1) {
            color = "#" + color;
        }
        _$preview.css("background-color", color);
        _$picker.val(color);
    };

    this.getColor = function (type) {
        switch (type) {
            case "rgb":
                //Colpick RGB object
                return $.colpick.hexToRgb(_currentHexColor);
            case "hsb":
                //Colpick hsb object
                return $.colpick.hexToHsb(_currentHexColor);
            default:
                return _currentHexColor.indexOf('#') === -1
                        ? '#' + _currentHexColor
                        : _currentHexColor;
        }
    };

    this._make = function () {
        _this.$.append(_$picker, _$preview);
        _this.$.uniqueId();
        var id = _this.$.attr("id");
        _currentHexColor = flags.color;
        $(window).ready(function () {
            $('#' + id).find(".mlj-picker").colpick({
                layout: 'hex',
                submit: 0,
                color: flags.color,
                colorScheme: 'dark',
                onChange: function (hsb, hex, rgb, el, bySetColor) {
                    _currentHexColor = hex;
                    _$preview.css('background-color', '#' + hex);
                    // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                    if (!bySetColor)
                        $(el).val("#" + hex);

                    if (jQuery.isFunction(flags.onChange)) {
                        flags.onChange(hsb, hex, rgb, el, bySetColor);
                    }

                }
            }).keyup(function () {
                $(this).colpickSetColor(this.value);
            }).val(flags.color);
            _$preview.css('background-color', flags.color);
        });
    };

    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.ColorPicker);

// BUTTON _____________________________________________________________________
/**         
 * @class MLJ.gui.component.Button
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Button = function (flags) {
    var _html = '<button></button>';

    this.onClick = function (foo) {
        $(this.$.click(function (event) {
            foo(event);
        }));
    };

    this._make = function () {
		var right=this.flag("right");
		//the flag right is used to distinguish the operation buttons and the info buttons
		if (right !== undefined) { //if it's defined
            this.$.addClass("ui-button-right-align"); //add a css class to align the button to the extreme right
        }
		
        var label = this.flag("label");
        if (label !== undefined) {
            this.$.append(label);
        }

        var tooltip = this.flag("tooltip");
        if (tooltip !== undefined) {
            this.$.attr("title", tooltip).tooltip();
        }

        var img = this.flag("icon");
        if (img !== undefined) {
            this.$.append('<img src="' + img + '" />');
        }

        var disabled = this.flag("disabled");
        this.$.button({disabled: disabled});
    };

    this._disabled = function (bool) {
        // when disabling the component close the tooltip
        // since if it's open it will remain on screen indefinitely
        if (bool) this.$.tooltip("close");
        this.$.button({disabled: bool});
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Button);

// FILE BUTTON _________________________________________________________________
/**         
 * @class MLJ.gui.component.FileButton
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.FileButton = function (flags) {
    MLJ.gui.component.Button.call(this, flags);

    var _$file = $('<input type="file" />');

    if (this.flag("multiple")) {
        _$file.attr("multiple", "multiple");
    }

    //Enable click event
    this.$.click(function () {
        _$file.click();
    });

    this.onChange = function (foo) {
        $(_$file.change(function () {
            foo(this);

            // hack to clear the input form, otherwise the same file cannot
            // be loaded a second time because the change event won't be triggered
            _$file.wrap('<form>').closest('form').get(0).reset();
            _$file.unwrap();
            event.preventDefault();
        }));
    };
};

MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.FileButton);

// TOGGLE BUTTON _______________________________________________________________
/**         
 * @class MLJ.gui.component.ToggleButton
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.ToggleButton = function (flags) {
    if (flags.on !== true && flags.on !== false) {
        console.log("Warning(MLJ.gui.Component.TogggleButton): forcing flags.on to false");
        flags.on = false;
    }
    MLJ.gui.component.Button.call(this, flags);

    var _this = this;
    var _on = this.flag("on");
    var _toggleCallback = null;

    /* NOTE: the callback specified with onToggle() is not called if the 'ev' 
             parameter is omitted */
    this.toggle = function (param, ev) {
        switch (param) {
            case "on":
                _on = true;
                break;
            case "off":
                _on = false;
                break;
            default: // just toggle it
                _on = !_on;
        }

        if (_on) {
            _this.$.addClass("mlj-toggle-on");
        } else {
            _this.$.removeClass("mlj-toggle-on");
        }

        if (ev !== undefined && _toggleCallback) {
            _toggleCallback(_on === true, ev);
        }
    };

    this.onToggle = function (foo) {
        _toggleCallback = foo;
    };

    this.isOn = function () {
        return _on === true;
    };

    this.$.click(function (event) {
        _this.toggle(null, event);
    });
};

MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.ToggleButton);


// CUSTOM TOGGLE BUTTON ________________________________________________________

/**         
 * @class MLJ.gui.component.CustomToggleButton
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.CustomToggleButton = function (flags) {
    var _html = $('<div/>').addClass("mlj-custom-toggle-button");

    var _$arrow = $('<div/>').addClass("mlj-custom-toggle-button-arrow");

    var _arrowHandler = null;

    var _toggle = new MLJ.gui.component.ToggleButton(flags);

    this.toggle = function (param, event) {
        _toggle.toggle(param, event);
    };

    this.isOn = function () {
        return _toggle.isOn();
    };

    this.onToggle = function (foo) {
        _toggle.onToggle(function (on,event) {
            foo(on,event);
        });
    };

    this.onRightButtonClicked = function (foo) {
        _toggle.$.mouseup(function (event) {
            if (event.which === 3) {
                foo(event);
            }
        });
    };

    this.onArrowClicked = function (foo) {
        _arrowHandler = foo;
        _$arrow.click(function () {
            foo();
        });
    };
    
    this.setArrowSelected = function(selected) {
        if(selected === true) {
            _$arrow.addClass("arrow-selected");
        } else {
            _$arrow.removeClass("arrow-selected");
        }
    };

    this.isArrowSelected = function () {
        return _$arrow.hasClass("arrow-selected");
    };
    
    this._make = function () {
        this.$.append(_toggle.$, _$arrow);
    };

    this._disabled = function (disabled) {
        _toggle._disabled(disabled);

        if (disabled) {
            _$arrow.css("opacity", "0.2");
            _$arrow.off();
        } else {
            _$arrow.css("opacity", "1");
            _$arrow.click(_arrowHandler);
        }
    };

    MLJ.gui.component.Component.call(this, _html, flags);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.CustomToggleButton);

// CHECKBOX ____________________________________________________________________

/**         
 * @class MLJ.gui.component.CheckBox
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.CheckBox = function (checked) {
    var _html = '<input type="checkbox" />';

    this._make = function () {
        if (jQuery.type(checked) !== "boolean") {
            checked = false;
        }

        this.setChecked(checked);
    };

    this.onChange = function (foo) {
        this.$.change(function (event) {
            foo(event);
        });
    };


    this.isChecked = function () {
        return this.$.prop('checked');
    };

    this.setChecked = function (boolean) {
        if (jQuery.type(boolean) !== "boolean") {
            boolean = false;
        }
        this.$.prop("checked", boolean);
    };

    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.CheckBox);

// TEXT FIELD __________________________________________________________________
/**         
 * @class MLJ.gui.component.TextField
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.TextField = function (txt) {
    var _html = $('<input type="text" class="mlj-text-field"/>')
            .attr("value", txt);

    var _this = this;
    this._disabled = function () {
        _this.$.attr("disabled", "disabled");
    };

    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.TextField);

// ButtonSet __________________________________________________________________

/**         
 * @class MLJ.gui.component.ButtonSet
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.ButtonSet = function (flags) {
    var _html = '<div></div>';
    var _this = this;

    this._make = function () {
        var options = _this.flag("options");

        _this.$.uniqueId();
        var groupId = this.$.attr("id");

        var $input, $label, uId;
        $(options).each(function (key, option) {
            $input = $('<input type="radio"/>')
//                    .attr("id", option.value)
                    .attr("name", groupId)
                    .data("value", option.value);


            $input.uniqueId();
            uId = $input.attr("id");

            $label = $('<label for="' + uId + '"></label>')
                    .append(option.content);

            if (option.selected === true) {
                $input.attr("checked", "checked");
            }

            _this.$.append($input, $label);

        });

        _this.$.buttonset();

    };

    this.getSelectedContent = function () {
        var id = this.$.find(":checked").attr("id");
        return $("[for=" + id + "]").find("span").text();
    };

    this.getSelectedValue = function () {
        return this.$.find(":checked").data("value");
    };

    this.selectByValue = function (value) {
        this.$.find(":input").each(function (key, element) {
            if ($(element).data("value") === value) {
                $(element).prop('checked', true).button('refresh');
            }
        });
    };

    this.onChange = function (foo) {
        _this.$.find(":input").change(function () {
            foo($(this).data("value"));
        });
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.ButtonSet);

// Combobox ____________________________________________________________________

/**         
 * @class MLJ.gui.component.ComboBox
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.ComboBox = function (flags) {
    var _html = '<select></select>';
    var _this = this;

    this._make = function () {
        var options = _this.flag("options");

        $(options).each(function (key, option) {
            var $option = $("<option/>")
                    .attr("value", option.value)
                    .append(option.content);
            if (option.selected === true) {
                $option.attr("selected", "selected");
            }
            _this.$.append($option);
        });

        _this.$.selectmenu({width: "100%"})
                .selectmenu("menuWidget")
                .addClass("overflow");
    };

    this.getSelectedContent = function () {
        return this.$.find(":selected").text();
    };

    this.getSelectedValue = function () {
        return this.$.find(":selected").val();
    };

    this.selectByValue = function (value) {
        _this.$.find("option[value=" + value + "]").prop('selected', true);
        _this.$.selectmenu('refresh');
    };

    this.onChange = function (foo) {
        _this.$.on("selectmenuchange", function (event, ui) {
            foo(event, ui);
        });
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.ComboBox);

// Tool Bar ____________________________________________________________________

/**         
 * @class MLJ.gui.component.ToolBar
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.ToolBar = function () {
    var _html = $('<div class="mjs-toolbar"></div>');

    this.add = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.component.Component) {
                this.$.append(arguments[i].$);
            } else {
                console.error("The parameter must be an instance of MLJ.gui.component.Component");
            }
        }
        return this;
    };

    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.ToolBar);

// Pane ________________________________________________________________________

/**         
 * @class MLJ.gui.component.Pane
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Pane = function () {

    var _html = '<div class="mlj-pane ui-widget-content"></div>';

    this._make = function () {

        this.$.css({
            height: "100%",
            width: "100%",
            overflow: "auto"
        });
    };

    this.appendContent = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.component.Component) {
                this.$.append(arguments[i].$);
            } else {
                this.$.append(arguments[i]);
            }
        }
        return this;
    };

    MLJ.gui.component.Component.call(this, _html);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Pane);

// LABEL _______________________________________________________________________
/**         
 * @class MLJ.gui.component.Label
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Label = function (flags) {
    var _html = "<label></label>";
    this._make = function () {

        var label = this.flag("label");
        if (label === undefined) {
            label = "Lebel";
        }
        this.$.append(label);

        var tooltip = this.flag("tooltip");
        if (tooltip !== undefined) {
            this.$.attr("title", tooltip);
            this.$.tooltip({
                content: function () {
                    return $(this).prop('title');
                }
            });
        }
    };

    MLJ.gui.component.Component.call(this, _html, flags);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Label);

// ACCORDION ___________________________________________________________________
/**         
 * @class MLJ.gui.component.Accordion
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Accordion = function (flags) {
    var _html = "<div></div>";
    this.addEntry = function () {
        var entry;
        for (var i = 0, m = arguments.length; i < m; i++) {
            entry = arguments[i];
            if (!(entry instanceof MLJ.gui.component.AccordionEntry)) {
                console.error("The parameter must be an AccordionEntry instance.");
            } else {
                this.$.append(entry.$title).append(entry.$content);
            }
        }

        return this;
    };
    this._make = function () {
        this.$.accordion(flags);
    };

    this.getActiveInfo = function () {
        var active = this.$.accordion("option", "active");
        var text = this.$.find("h3").eq(active).text();

        return {index: active, header: text};
    };

    this.refresh = function () {
        this.$.accordion({active: false}).accordion("refresh");
    };
    
    this._disabled = function (disabled) {
        if(disabled) {
            this.$.accordion("disable");
        } else {
            this.$.accordion("enable");
        }
                
    };
    
    MLJ.gui.component.Component.call(this, _html);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Accordion);

/**         
 * @class MLJ.gui.component.AccordionEntry
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.AccordionEntry = function (flags) {
    this.$title = $('<h3></h3>').css("position", "relative");
    this.$content = $('<div></div>');
    var _$headerWrapp = $("<div></div>").css({display: "table", width: "100%"});
    var _$label = new MLJ.gui.component.Label(flags);
    var _$title = $('<div/>').append(_$label.$).css({display: "table-cell"});
    var _$btnWrapp = $('<div></div>').css({display: "table-cell", textAlign: "right"});
    _$headerWrapp.append(_$title, _$btnWrapp);
    this.$title.append(_$headerWrapp);

    this.show = function () {
        this.$title.show();
        this.$content.show();
    };

    this.hide = function () {
        this.$title.hide();
        this.$content.hide();
    };

    this.appendContent = function () {
        var content;
        for (var i = 0, m = arguments.length; i < m; i++) {
            content = arguments[i];
            if (content instanceof MLJ.gui.component.Component) {
                this.$content.append(content.$);
            } else {
                this.$content.append(content);
            }
        }

        return this;
    };

    this.addHeaderButton = function () {
        var button;
        for (var i = 0, m = arguments.length; i < m; i++) {
            button = arguments[i];
            if (!(button instanceof MLJ.gui.component.Button)) {
                console.error("The parameter must be a MLJ.gui.Component.Button instance");
            } else {
                _$btnWrapp.append(button.$);
                button.onClick(function (event) {
                    event.stopPropagation();
                });
            }
        }
        return this;
    };

};

// SPINNER _____________________________________________________________________
/**         
 * @class MLJ.gui.component.Spinner
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Spinner = function (flags) {
    var _html = '<div></div>';
    var _$spinner = $('<input>').css({width: "100%"});

    var _this = this;

    this.onChange = function (callback) {
        _$spinner.on("spinchange", function (event, ui) {
            if (_this.getValue() == "" || isNaN(_this.getValue())) {
                console.warn('Warning(Spinner): value is not a number, reset to default');
                _this.setValue(_this.flag("defval"));
            }
            callback(event, ui);
        });
    };

    this.onSpin = function (callback) {
        _$spinner.on("spin", function (event, ui) {
            callback(event, ui);
        });
    };

    this.onSpinStop = function (callback) {
        _$spinner.on("spinstop", function (event, ui) {
            callback(event, ui);
        });
    };

    this.getValue = function () {
        return _$spinner.val();
    };

    this.setValue = function (value) {
        _$spinner.val(value);
    };

    this._make = function () {
        this.$.append(_$spinner);

        var defval = this.flag("defval");
        if (defval) {
            _$spinner.attr("value", defval);
        }

        _$spinner.spinner(flags);
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Spinner);

/**         
 * @class A Ranged Float component
 * @param {flags} flags
 * @memberOf MLJ.gui.Component
 * @author Stefano Giammori 
 */
MLJ.gui.component.RangedFloat = function (flags) {
    //local variable for the input parameters
    var _this = this, inputparams;
    //create root
    var _html = $('<div>').css({position: "relative", float: "left", clear: "none", width: "100%"});
    //create slider node
    var _$slider = $('<div>').css({width: "50%", position: "relative", left: "0px", top: "10px"});
    //create label of min max
    var _pmin = $('<p>').css({fontSize: '50%', position: "absolute", left: "0px"});
    var _pmax = $('<p>').css({fontSize: '50%', position: "absolute", left: "87px"});
    //edit text node
    var _$editText = $('<input>')
            .css({width: "30%", position: "relative", textAlign: "right", left: "110px", bottom: "8px"});        
    //init function
    this._make = function () {
        //extract parameters
        var minval = this.flag("min");
        var maxval = this.flag("max");
        var defval = this.flag("defval");
        var stepval = this.flag("step");
        //check & assignment
        inputparams = {
            minvalue: (minval !== undefined ? minval : 0),
            maxvalue: (maxval !== undefined ? maxval : 100),
            defvalue: (defval !== undefined ? defval : 50),
            stepvalue: (stepval !== undefined ? stepval : 0.01)
        };
        //insert the labels html code
        _pmin.html(inputparams.minvalue);
        _pmax.html(inputparams.maxvalue);
        //append the labels
        this.$.append(_pmin);
        this.$.append(_pmax);
        //append the slider to the root
        this.$.append(_$slider);
        //append the edit text to the root
        this.$.append(_$editText);
        //slider initialization
        _$slider.slider({
            min: inputparams.minvalue,
            max: inputparams.maxvalue,
            step: inputparams.stepvalue,
            value: inputparams.defvalue,
            //onCreate event callback
            create: function (event, ui) {
                _$editText.val(inputparams.defvalue);
            }
        });
    };

    this.getValue = function () {
        return _$editText.val();
    };

    this.setValue = function (value) {
        _$editText.val(value);
        _$slider.slider('value', value);
    };

    this.onChange = function (foo) {
        _$slider.on( "slide", function( event, ui ) {
            //call rangedfloat's setValue method
            _this.setValue(ui.value);
            foo(event,ui);
        });
        _$editText.on("change", function( event ) {
            //take inserted value
            var val = _this.getValue();
            //validation pattern
            var pattern = /^([-+]?\d+(\.\d+)?)/;
            //trunk in groups the string
            val = val.match(pattern);
            val = (val ? val[0] : null);
            //take the larger part of the inserted value matching the pattern
            if (val == null || !pattern.test(val)) {
                console.error('Invalid input, reset to default value');
                val = inputparams.defvalue; //if not correct, assign the default value
            }
            //take the boundaries
            var min = _$slider.slider("option", "min");
            var max = _$slider.slider("option", "max");
            //validate the boundaries
            if (val > max)
                val = max;
            else if (val < min)
                val = min;
            //call rangedfloat's setValue method
            _this.setValue(val);
            //var needed by foo
            var ui = { value : val };
            foo(event,ui);
        });
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.RangedFloat);


// DIALOG ______________________________________________________________________
/**         
 * @class MLJ.gui.component.Dialog
 * @memberOf MLJ.gui.component
 * @author Stefano Gabriele 
 */
MLJ.gui.component.Dialog = function (flags) {
    var _html = "<div></div>";
    var _this = this;
    
    this.appendContent = function (content) {        
        _this.$.append(content);
        return this;
    };
    
    this._make = function () {
        _this.$.hide();
        $('body').append(_html);
    };

    this.show = function() {        
         _this.$.dialog(flags);
    }
    
    this.hide = function() {        
         _this.$.dialog("close");
    }
    
    this.destroy = function() {
        _this.$.dialog("destroy");
    }
            
    MLJ.gui.component.Component.call(this, _html);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Dialog);

/**         
 * @class Layer selection component, rendered as a ComboBox menu.
 * @param {flags} flags
 * @memberOf MLJ.gui.component
 */
MLJ.gui.component.LayerSelection = function(flags) {
    var _html = "<select></select>";
    var _this = this;

    $(document).on("SceneLayerAdded", function(event, layer) {
        if (_this.$.find("option").length === 0) {
            _this.$.selectmenu("enable");
        }
        var $option = $("<option />").attr("value", layer.name).append(layer.name);
        _this.$.append($option);
        _this.$.selectmenu("refresh");
    });

    $(document).on("SceneLayerRemoved", function(event, layer) {
        _this.$.find("option[value=\"" + layer.name + "\"]").remove();
        if (_this.$.find("option").length === 0) {
            _this.$.selectmenu("disable");
        }        
        _this.$.selectmenu("refresh");
    });

    this._make = function() {
        _this.$.selectmenu({width: "100%", disabled: true})
            .selectmenu("menuWidget")
                .addClass("overflow");
    };

    this.getSelectedEntry = function() {
        return _this.$.find(":selected").val();
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.LayerSelection);
