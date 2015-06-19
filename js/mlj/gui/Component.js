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

    this.insertInto = function (wrapper) {
        var $wrap = $(wrapper);
        if ($wrap.length > 0) {
            $wrap.append(this.$);
        }

    };

    $(window).ready(function () {
        _this._make();
    });

    init();
};

MLJ.gui.component.Component.prototype = {
    _make: function () {
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
        padding = ($(arg).data("grid")) ? 0 : "10px";
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
//    var _html = '<input type="text" class="mlj-color-picker">';
    var _html = '<div class="mlj-color-picker"></div>';
    var _$picker = $('<input type="text"/>').addClass("mlj-picker");
    var _$preview = $('<div/>').addClass("mlj-picker-preview");
    var _this = this;

    this._make = function () {
        _this.$.append(_$picker, _$preview);
        _this.$.uniqueId();
        var id = _this.$.attr("id");

        $(window).ready(function () {
            $('#' + id).find(".mlj-picker").colpick({
                layout: 'hex',
                submit: 0,
                color: flags.color,
                colorScheme: 'dark',
                onChange: function (hsb, hex, rgb, el, bySetColor) {
//                    $(el).css('border-color', '#' + hex);
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
MLJ.gui.component.Button = function (txt, label, imgSrc) {
    var _html = '<button class="mlj-button"></button>';

    this.onClick = function (foo) {
        $(this.$.click(function (event) {
            foo(event);
        }));
    };

    this._make = function () {
        if (txt) {
            this.$.append(txt);
            //Build jQuery button
//            this.$.button();
        }

        if (label) {
            this.$.attr("title", label).tooltip();
        }

        if (imgSrc) {
            this.$.append('<img src="' + imgSrc + '" />');
        }
    };
    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Button);

// FILE BUTTON _________________________________________________________________

MLJ.gui.component.FileButton = function (txt, label, imgSrc) {
    MLJ.gui.component.Button.call(this, txt, label, imgSrc);

    var _$file = $('<input type="file" />');

    this.multiple = function () {
        _$file.attr("multiple", "multiple");
    };
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

MLJ.gui.component.ToggleButton = function (txt, label, imgSrc) {
    MLJ.gui.component.Button.call(this, txt, label, imgSrc);

    var _on = 0;
    var _this = this;

    this.toggle = function () {
        _on ^= 1;
        if (_on) {
            _this.$.addClass("mlj-toggle-on");
        } else {
            _this.$.removeClass("mlj-toggle-on");
        }
    };

    this.onToggle = function (foo) {
        _this.$.click(function () {
            foo(_on);
        });
    };

    this.$.click(function () {
        _this.toggle();
    });

};

MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.ToggleButton);

// CHECKBOX ____________________________________________________________________

MLJ.gui.component.CheckBox = function (checked) {
    var _html = '<input type="checkbox" />';

    this._make = function () {
        if (jQuery.type(checked) !== "boolean") {
            checked = false;
        }

        this.checked(checked);
    };

    this.onChange = function (foo) {
        this.$.change(function (event) {
            foo(event);
        });
    };

    this.checked = function (boolean) {
        //Get
        if (boolean === undefined) {
            return this.$.prop('checked');
        }

        //Set
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
    this.disabled = function () {
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

        var $input, $label;
        $(options).each(function (key, option) {
            $input = $('<input type="radio"/>')
                    .attr("id", option.value)
                    .attr("name", groupId);
            $label = $('<label for="' + option.value + '"></label>')
                    .append(option.content);

            if (option.selected === true) {
                $input.attr("checked", "checked");
            }

            _this.$.append($input, $label);

        });

        this.$.buttonset();

    };

    this.getSelected = function () {
        return this.$.find(":checked").attr("id");
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

    this.getSelected = function () {
        return this.$.find(":selected").text();
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.ComboBox);

// Tool Bar ____________________________________________________________________

MLJ.gui.component.ToolBar = function () {
    var _html = $('<div class="mjs-toolbar"></div>');

    this.addButton = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.component.Button) {
                this.$.append(arguments[i].$);
            } else {
                console.error("The parameter must be an instance of MLJ.gui.component.Button");
            }
        }
        return this;
    };

    MLJ.gui.component.Component.call(this, _html);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.ToolBar);

// Pane ________________________________________________________________________

MLJ.gui.component.Pane = function (title, flags) {

    var _html = '<div class="mlj-pane"></div>';
    var _$resWrap = $('<div class="mlj-content-wrapper"></div>');
    var _$title = $('<h3 class="ui-widget-header">' + title + '</h3>');
    var _$content = $('<div class="mlj-content ui-widget-content"></div>');

    this.getContent = function () {
        return _$content;
    };

    this._make = function () {
        _$resWrap.append(_$content);
        this.$.append(_$title, _$resWrap);
        if (this.flag("resizable")) {
            _$resWrap.resizable(flags);
        }
        _$content.css({
            position: "relative",
            height: "100%",
            overflow: "auto"
        });
    };

    this.onResize = function (foo) {
        _$resWrap.on("resize", function (event, ui) {
            foo(event, ui);
        });
    };

    this.appendContent = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.component.Component) {
                _$content.append(arguments[i].$);
            } else {
                _$content.append(arguments[i]);
            }
        }
        return this;
    };

    MLJ.gui.component.Component.call(this, _html, flags);

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
    var _$label = new MLJ.gui.build.Label(flags);
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

    this.getValue = function () {
        return _$spinner.val();
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

// SLIDER ______________________________________________________________________

MLJ.gui.component.Slider = function (flags) {
    var _html = '<div></div>';
    var _$display = $('<div></div>')
            .css({});

    var _$sliderHandle;
    var _$this = this;
    this._make = function () {
        this.$.slider(flags);

//        _$sliderHandle = $('.ui-slider-handle');
//        _$sliderHandle.append(_$display);
//        _$display.width(_$sliderHandle.position().left);
//        _$display.height(this.$.height()).append("<span style='margin-right:15px;'>" + this.getValue() + "</span>");

//        var slider = this;
//        //Eventa for drag and drop
//        var startDrag;
//        _$sliderHandle.mousedown(function () {
//            startDrag = true;
//        });
//
//        _$sliderHandle.mouseup(function () {
//            startDrag = false;
//        });
//
//        $(document).mousemove(function () {
//            if (startDrag) {
//                _$display.width(_$sliderHandle.position().left);
//            }
//        });

    };

    this.getValue = function () {
        return this.$.slider("value");
    };

    this.onChange = function (callback) {
        this.$.on("slidechange", function (event, ui) {
            callback(event, ui);
        });
    };

    this.onSlide = function (callback) {
        this.$.on("slide", function (event, ui) {
            callback(event, ui);
//            _$sliderHandle.text(_$this.getValue());
//            console.log(_$display.width());
        });
    };

    this.onStart = function (callback) {
        this.$.on("slidestart", function (event, ui) {
            callback(event, ui);
        });
    };

    this.onStop = function (callback) {
        this.$.on("slidestop", function (event, ui) {
            callback(event, ui);
        });
    };

    MLJ.gui.component.Component.call(this, _html, flags);
};
MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Slider);
