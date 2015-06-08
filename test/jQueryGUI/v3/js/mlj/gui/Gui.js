/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui = {};

MLJ.gui.Widget = function (build, refresh) {
    this._build = jQuery.isFunction(build) ? build : function () {
    };
    this._refresh = jQuery.isFunction(refresh) ? refresh : function () {
    };
};

MLJ.gui.SearchElement = function (tag, handler) {
    this.tag = tag;
    this.handler = jQuery.isFunction(handler) ? handler : function () {
    };
};

MLJ.gui.Layer = function (name, visible) {
    this.name = name;
    this.visible = visible;
};

MLJ.gui.Tab = function (name) {
    this.name = name;
    var _$content = $('<div id="tab-' + name + '"></div>');

    this.jQueryTab = function () {
        return $('<li><a href="#tab-' + name + '"><span>' + name + '</span></a></li>');
    };
    this.jQueryTabContent = function () {
        return _$content;
    };

    this.appendContent = function (content) {
        _$content.append(content);
        return this;
    };
};

MLJ.gui.AccordionEntry = function (title) {
    var _$content = $('<div></div>');
    this.title = '<h3>' + title + '</h3>';
    this.$content = _$content;

    this.add = function (content) {
        _$content.append(content);
        return this;
    };

};

MLJ.gui.Accordion = function () {
    var _$accordion = $('<div></div>');
    var _btn;

    //entry type of accordion entry
    this.addItem = function (entry) {
        if (!(entry instanceof MLJ.gui.AccordionEntry)) {
            console.error("The parameter must be an AccordionEntry instace.");
            return;
        }
         _btn = new MLJ.gui.Button(entry.title+"-apply","apply","apply");
         _btn.jQueryButton().css("float","right");
         var s = $(entry.title).append(_btn.jQueryButton());         
        _$accordion.append(s).append(entry.$content);
    };

    this.jQuery = function () {
        return _$accordion;
    };

};

MLJ.gui.ToolBar = function () {
    var _$tb = $('<div id="tools-buttons"></div>');

    this.jQuery = function () {
        return _$tb;
    };

    this.addButton = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof MLJ.gui.Button) {
                _$tb.append(arguments[i].jQueryButton());
            } else {
                console.error("The parameter must be an instance of MLJ.gui.Button");
            }
        }
    };
};

MLJ.gui.Button = function (id, title, text, imageSrc) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.imageSrc = imageSrc;
    this.$button = $('<button id="' + this.id + '" title="' + this.title + '">' + text + '</button>');
    if (imageSrc) {
        this.$button.append('<img src="' + this.imageSrc + '"/>').button().tooltip();
    }
};

MLJ.gui.Button.prototype = {
    jQueryButton: function () {
        return this.$button;
    }
};

MLJ.gui.FileButton = function (id, title, text, imageSrc) {
    MLJ.gui.Button.call(this, id, title, text, imageSrc);
    var _$file = $('<input type="file" />');

    this.jQueryFile = function () {
        return _$file;
    };

    this.multiple = function () {
        _$file.attr("multiple", "multiple");
    };

    //Enable click event
    this.$button.click(function () {
        _$file.click();
    });

};

//Pseudo inheritance
MLJ.extend(MLJ.gui.Button, MLJ.gui.FileButton);


MLJ.gui.PiP = function (x, y) {

    var _$PiP;

    function init() {
        _$PiP = $("<div></div>").css({
            position: "absolute",
            top: y,
            left: x
        });
    }

    this.jQuery = function () {
        return _$PiP;
    };

    this.appendContent = function (content) {
        _$PiP.append(content);
    };

    this.setX = function (value) {
        _$PiP.css("left", value);
    };

    this.setY = function (value) {
        _$PiP.css("top", value);
    };

    this.setVisible = function (visible) {
        if (visible) {
            _$PiP.show();
        } else {
            _$PiP.hide();
        }
        return _$PiP;
    };

    init();
};

(function () {
    var _widgets = [];
    var _bodyWidgets = [];
    var _$pane = $('<div id="tools-pane"></div>');
    var _$3D = $('<div id="_3D"></div>');

    var _hideBtn = new MLJ.gui.PiP(0, 0);
    _hideBtn.appendContent('<span class="ui-icon ui-icon-arrowthick-1-w"></span>');

    _hideBtn.jQuery().css({
        background: "rgba(255,255,255,0.4)",
        borderRadius: 5
    });

    function update() {
        for (var i = 0, m = _widgets.length; i < m; i++) {
            _widgets[i]._refresh();
        }

        for (var i = 0, m = _bodyWidgets.length; i < m; i++) {
            _bodyWidgets[i]._refresh();
        }

        _$3D.css({
            width: $(window).width() - (_$pane.outerWidth() + _$pane.offset().left),
            left: _$pane.outerWidth() + _$pane.offset().left
        });

        _hideBtn.jQuery().css({left: _$pane.outerWidth() + _$pane.offset().left});
    }

    this.addWidget = function (widget, body) {
        if (widget instanceof MLJ.gui.Widget) {

            if (body === true) {
                _bodyWidgets.push(widget);
            } else {
                _widgets.push(widget);
            }
        } else {
            console.error("The parameter must be an instance of MLJ.gui.Widget");
        }
    };

    this.makeGUI = function (title) {

        _$pane.append('<div id="top" ><span>' + title + '</span></div>');
        $('body').append(_$3D).append(_$pane).append(_hideBtn.jQuery());

        _hideBtn.jQuery().offset({left: _$pane.outerWidth()});

        for (var i = 0, m = _widgets.length; i < m; i++) {
            _$pane.append(_widgets[i]._build());
        }

        for (var i = 0, m = _bodyWidgets.length; i < m; i++) {
            $('body').append(_bodyWidgets[i]._build());
        }

        _$3D.css({
            position: "absolute",
            width: $(window).width() - (_$pane.outerWidth() + _$pane.offset().left),
            left: _$pane.outerWidth() - _$pane.offset().left,
            height: "100%",
            top: 0
        });

    };

    this.update = function () {
        update();
    };

    $(window).resize(function () {
        update();
    });

    _hideBtn.jQuery().click(function () {
        if (_$pane.is(":visible")) {
            _$pane.animate({left: -_$pane.outerWidth()}, {
                duration: 500,
                start: function () {
                    _hideBtn.jQuery().fadeOut();
                },
                step: function () {
                    $(window).trigger('resize');
                },
                complete: function () {
                    $(window).trigger('resize');
                    _$pane.hide();
                    _hideBtn.jQuery().children(0)
                            .removeClass("ui-icon-arrowthick-1-w")
                            .addClass("ui-icon-arrowthick-1-e");
                    _hideBtn.jQuery().fadeIn();

                }
            });

        } else {
            _$pane.animate({left: 0}, {
                duration: 500,
                start: function () {
                    _$pane.show();
                    _hideBtn.jQuery().fadeOut();
                },
                step: function () {
                    $(window).trigger('resize');
                },
                complete: function () {
                    $(window).trigger('resize');
                    _hideBtn.jQuery().children(0)
                            .removeClass("ui-icon-arrowthick-1-e")
                            .addClass("ui-icon-arrowthick-1-w");
                    _hideBtn.jQuery().fadeIn();
                }
            });
        }
    });

}).call(MLJ.gui);