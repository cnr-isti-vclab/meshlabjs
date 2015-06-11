/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


MLJ.gui = {
    build: {
        button: {
            button: function (txt, tooltip, img) {
                return new MLJ.gui.Button(txt, tooltip, img);
            },
            file: function (txt, tooltip, img) {
                return new MLJ.gui.FileButton(txt, tooltip, img);
            }
        },
        accordion: {
            accordion: function (flags) {
                return new MLJ.gui.Accordion(flags);
            },
            entry: function (title) {
                return new MLJ.gui.AccordionEntry(title);
            }
        },
        spinner: function (flags) {
            return new MLJ.gui.Spinner(flags);
        },
        slider: function (flags) {
            return new MLJ.gui.Slider(flags);
        },
        toolbar: function () {
            return new MLJ.gui.ToolBar();
        }
    }
};

MLJ.gui.jQueryObject = function (html, flags) {
    var _flags = flags;
    var _this = this;
    this.$ = $(html);

    function init() {
        if (!flags) {
            flags = {};
        }
    }

    this.flag = function (name, value) {
        //get
        if (!value) {
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

MLJ.gui.jQueryObject.prototype = {
    _make: function () {
    }
};

// GRID ________________________________________________________________________
MLJ.gui.Grid = function () {
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

        if (arg instanceof MLJ.gui.jQueryObject) {
            $cell.append(arg.$);
        } else {
            $cell.append(arg);
        }
        $row.append($cell);
    }

    return $table.append($row);

};


// BUTTONS _____________________________________________________________________

MLJ.gui.Button = function (txt, label, imgSrc) {
    var _html = "<button></button>";
    var flags = {
        text: txt,
        tooltip: label,
        img: imgSrc
    };
    this.onClick = function (foo) {
        $(this.$.click(function (event) {                        
            foo(event);
        }));
    };
    this._make = function () {
        if (txt) {
            this.$.append(flags.text).button();
        }

        if (label) {
            this.$.attr("title", label).tooltip();
        }

        if (imgSrc) {
            this.$.append('<img src="' + imgSrc + '" />');
        }
    };
    MLJ.gui.jQueryObject.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.jQueryObject, MLJ.gui.Button);

MLJ.gui.FileButton = function (txt, label, imgSrc) {
    MLJ.gui.Button.call(this, txt, label, imgSrc);
    var _$file = $('<input type="file" />');
    this.multiple = function () {
        _$file.attr("multiple", "multiple");
    };
    //Enable click event
    this.$.click(function () {
        _$file.click();
    });
};
////Pseudo inheritance
MLJ.extend(MLJ.gui.Button, MLJ.gui.FileButton);
// ACCORDION ___________________________________________________________________

MLJ.gui.Accordion = function (flags) {
    var _html = "<div></div>";
    this.addEntry = function () {
        var entry;
        for (var i = 0, m = arguments.length; i < m; i++) {
            entry = arguments[i];
            if (!(entry instanceof MLJ.gui.AccordionEntry)) {
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
    MLJ.gui.jQueryObject.call(this, _html);

};
MLJ.gui.AccordionEntry = function (title) {
    if (!title) {
        title = "Title";
    }
    this.$title = $('<h3></h3>').css("position", "relative");
    this.$content = $('<div></div>');
    var _$headerWrapp = $("<div></div>").css({display: "table", width: "100%"});
    var _$title = $('<div>' + title + '</div>').css({display: "table-cell"});
    var _$btnWrapp = $('<div></div>').css({display: "table-cell", textAlign: "right"});
    _$headerWrapp.append(_$title, _$btnWrapp);
    this.$title.append(_$headerWrapp);

    this.appendContent = function () {
        var content;
        for (var i = 0, m = arguments.length; i < m; i++) {
            content = arguments[i];
            if (content instanceof MLJ.gui.jQueryObject) {
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
            if (!(button instanceof MLJ.gui.Button)) {
                console.error("The parameter must be a MLJ.gui.Button instance");
            } else {
                _$btnWrapp.append(button.$);
                button.onClick(function(event){event.stopPropagation()});
            }
        }
        return this;
    };

};

// SPINNER _____________________________________________________________________
MLJ.gui.Spinner = function (flags) {
    var _html = '<div></div>';
    var _$spinner = $('<input>').css({width: "100%"});
    this.onChange = function (callback) {
        _$spinner.on("spinchange", function (event, ui) {
            callback(event, ui);
        });
    };
    this.getValue = function () {
        return _$spinner("value");
    };
    this._make = function () {
        this.$.append(_$spinner);
        _$spinner.spinner();
    };
    MLJ.gui.jQueryObject.call(this, _html);
};

MLJ.extend(MLJ.gui.jQueryObject, MLJ.gui.Spinner);

// SLIDER ______________________________________________________________________

MLJ.gui.Slider = function (flags) {
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

    MLJ.gui.jQueryObject.call(this, _html, flags);
};
MLJ.extend(MLJ.gui.jQueryObject, MLJ.gui.Slider);

// Tool Bar ____________________________________________________________________

MLJ.gui.ToolBar = function () {
    var _html = $('<div class="mjs-toolbar"></div>');

    this._make = function () {
    };

    this.addButton = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.Button) {
                this.$.append(arguments[i].$);
            } else {
                console.error("The parameter must be an instance of MLJ.gui.Button");
            }
        }
        return this;
    };

    MLJ.gui.jQueryObject.call(this, _html);
};

MLJ.extend(MLJ.gui.jQueryObject, MLJ.gui.ToolBar);