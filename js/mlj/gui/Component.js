/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.component = {};

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

// Picture in Picture __________________________________________________________

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
MLJ.gui.component.Button = function (flags) {
    var _html = '<button></button>';

    this.onClick = function (foo) {
        $(this.$.click(function (event) {
            foo(event);
        }));
    };

    this._make = function () {
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
        this.$.button({disabled: bool});
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Button);

// FILE BUTTON _________________________________________________________________

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
        }));
    };
};

MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.FileButton);

// TOGGLE BUTTON _______________________________________________________________

MLJ.gui.component.ToggleButton = function (flags) {
    MLJ.gui.component.Button.call(this, flags);

    var _on = this.flag("on") !== undefined
            ? this.flag("on") ^ 1
            : 0;

    var _this = this;

    this.toggle = function (param, click) {

        switch (param) {
            case "on":
                _on = 1;
                break;
            case "off":
                _on = 0;
                break;
            default:
                _on ^= 1;
        }

        if (_on) {
            _this.$.addClass("mlj-toggle-on");
        } else {
            _this.$.removeClass("mlj-toggle-on");
        }

        if (click === true) {
            _this.$.click();
        }
    };

    this.onToggle = function (foo) {
        _this.$.click(function () {
            foo(_on === 1);
        });
    };

    this.isOn = function () {
        return _on === 1;
    };

    this.$.click(function () {
        _this.toggle();
    });

    //init        
    _this.toggle();
};

MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.ToggleButton);


// TOGGLE BUTTON _______________________________________________________________

MLJ.gui.component.CustomToggleButton = function (flags) {
    var _html = $('<div/>').css({
        display: "inline-block",
        paddingBottom: "8px",
        position: "relative"
    });

    var _$arrow = $('<div/>').css({
        width: "0px",
        height: "0px",
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: "6px solid black",
        position: "absolute",
        bottom: "0px",
        left: "5px"
    });

    var _arrowHandler = null;

    var _toggle = new MLJ.gui.component.ToggleButton(flags);

    this.toggle = function (param, click) {
        _toggle.toggle(param, click);
    };

    this.isOn = function () {
        return _toggle.isOn();
    };

    this.onToggle = function (foo) {
        _toggle.onToggle(function (on) {
            foo(on);
        });
    };

    this.onRightButtonClicked = function (foo) {
        _toggle.$.mouseup(function (event) {
            if (event.which === 3) {
                foo();
            }
        });
    };

    this.onArrowClicked = function (foo) {
        _arrowHandler = foo;
        _$arrow.click(function () {
            foo();
        });
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

// Combobox ____________________________________________________________________

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

//LABEL
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

    MLJ.gui.component.Component.call(this, _html);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Accordion);

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
MLJ.gui.component.Spinner = function (flags) {
    var _html = '<div></div>';
    var _$spinner = $('<input>').css({width: "100%"});

    this.onChange = function (callback) {
        _$spinner.on("spinchange", function (event, ui) {
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
    var inputparams;
    //create root
    var _html = $('<div>').css({position: "relative", float: "left", clear: "none", width: "100%"});
    //create slider node
    var _$slider = $('<div>').css({width: "50%", position: "relative", left: "0px", top: "10px"});
    //create label of min max
    var _pmin = $('<p>').css({fontSize: '50%', position: "absolute", left: "0px"});
    var _pmax = $('<p>').css({fontSize: '50%', position: "absolute", left: "87px"});
    //edit text node
    var _$editText = $('<input>')
            .css({width: "30%", position: "relative", left: "110px", bottom: "8px"});
    //init function
    this._make = function () {
        //extract parameters
        var minval = this.flag("min");
        var maxval = this.flag("max");
        var defval = this.flag("defval");
        var stepval = this.flag("step");
        inputparams = {
            minvalue: (minval !== undefined ? minval : 0),
            maxvalue: (maxval !== undefined ? maxval : 100),
            defvalue: (defval !== undefined ? defval : 50),
            stepvalue: (stepval !== undefined ? stepval : 0.01)
        };
        _pmin.html(inputparams.minvalue)
        _pmax.html(inputparams.maxvalue)
        this.$.append(_pmin);
        this.$.append(_pmax);
        //append the slider to the root
        this.$.append(_$slider);
        //append the edit text to the root
        this.$.append(_$editText);
        //slider init
        _$slider.slider({
            min: inputparams.minvalue,
            max: inputparams.maxvalue,
            step: inputparams.stepvalue,
            //onCreate event callback
            create: function (event, ui) {
                _$slider.slider('value', inputparams.defvalue);
                _$editText.val(inputparams.defvalue);
            },
            //onSlide event callback
            slide: function (event, ui) {
                _$slider.slider('value', ui.value);
                _$editText.val(ui.value);
            }
        });
        //set EditText's event callback when text changed
        _$editText.change(function () {
            //inserted value
            var val = $(this).val();
            //validation pattern
            var pattern = /^([-+]?\d+(\.\d+)?)/;
            //trunk in groups the string
            val = val.match(pattern);
            val = (val ? val[0] : null)
            //take the larger part of the inserted value matching the pattern
            if (val == null || !pattern.test(val)) {
                console.error('Invalid input, reset to default value');
                val = inputparams.defvalue; //if not correct, assign the default value
            }
            //take the boundaries
            var min = _$slider.slider("option", "min");
            var max = _$slider.slider("option", "max");
            //validate the boundaries
            if (val > max) {
                _$editText.val(max);
                _$slider.slider('value', max);
            } else if (val < min) {
                _$editText.val(min);
                _$slider.slider('value', min);
            } else {
                _$editText.val(val);
                _$slider.slider('value', val);
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

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.RangedFloat);
