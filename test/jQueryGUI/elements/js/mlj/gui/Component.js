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
        if (!flags) {
            _flags = {};
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

MLJ.gui.component.Component.prototype = {
    _make: function () {
    }
};

////////////////////////////////////////////

//MLJ.gui.component.Layer = function (name, visible) {
//    this.name = name;
//    this.visible = visible;
//};
////////////////////////////////////////////////

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

// BUTTONS _____________________________________________________________________

MLJ.gui.component.Button = function (txt, label, imgSrc) {
    var _html = '<button class="mlj-button"></button>';
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
            this.$.append(flags.text);
            //Build jQuery button
            //this.$.button();
        }

        if (label) {
            this.$.attr("title", label).tooltip();
        }

        if (imgSrc) {
            this.$.append('<img src="' + imgSrc + '" />');
        }
    };
    MLJ.gui.component.Component.call(this, _html, flags);
};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Button);

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
////Pseudo inheritance
MLJ.extend(MLJ.gui.component.Button, MLJ.gui.component.FileButton);


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


// Split Pane __________________________________________________________________

//MLJ.gui.component.SplitPane = function (flags) {
//    var _html = '<div class="split-pane"></div>';
//    var _p1, _p2;
//    var _this = this;
////    this.set = function (title1, rp1, title2, rp2) {
////        _this.$.uniqueId();
////        var id = _this.$.attr("id");
////        _rp1 = new MLJ.gui.component.ResizablePane(title1, {containment: "#" + id, handles: "s"}, true).appendContent(rp1);
////        _rp2 = new MLJ.gui.component.ResizablePane(title2, {}).appendContent(rp2);
////        _this.$.append(_rp1.$, _rp2.$);
////    };
//
//    this._make = function () {
//
//        _this.$.uniqueId();
//        var id = _this.$.attr("id");
//
//        if (!_p1) {
//            _p1 = new MLJ.gui.component.Pane("Title 1",
//                    {
//                        containment: "#" + id,
//                        handles: "s", resizable: true
//                    });
//        }
//
//        if (!_p2) {
//            _p2 = new MLJ.gui.component.Pane("Title 2");
//        }
//
//        _this.$.append(_p1.$, _p2.$);
//
////        this.$.css({height: "100%", width: "100%"});
//
//        _p1.onResize(function () {
//            var h = _this.$.height() - _p1.$.height();
//            _p2.getContent().height(h);
//        });
//
//        $(window).ready(function () {
//            _p2.$.height(_this.$.height() - _p1.$.height());
//        });
//
//    };
//
//    MLJ.gui.component.Component.call(this, _html, flags);
//
//};
//
//MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.SplitPane);


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
    MLJ.gui.component.Component.call(this, _html);

};

MLJ.extend(MLJ.gui.component.Component, MLJ.gui.component.Accordion);

MLJ.gui.component.AccordionEntry = function (title) {
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
                    event.stopPropagation()
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
        return _$spinner("value");
    };
    this._make = function () {
        this.$.append(_$spinner);
        _$spinner.spinner();
    };
    MLJ.gui.component.Component.call(this, _html);
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
