
(function (widget) {

    if (typeof widget === 'undefined') {
        console.error("MLJ.gui.widget module needed.");
    }

    var _$wrapper = $('<div></div>')
            .css({
                display: "table",
                position: "absolute",
                height: "100%"
            });

    var _$border = $('<div id="mlj-tools-pane-border"></div>')
            .css({
                display: "table-cell",
                background: "none",
                verticalAlign: "middle"
            });

    var _$hideBtn = $('<span class="ui-icon ui-icon-arrowthick-1-w"></span>')
            .css({
                borderRadius: 5
            });

    var _$pane = $('<div id="mlj-tools-pane"></div>')
            .css({
                display: "table-cell"
            })
            .data("visible", true);

    var _$3D = $('<div id="_3D"></div>');

    function makeTitle(title) {
        var _PiP = MLJ.gui.build.PiP();

        var $title = $('<div id="mlj-title">' + title + '</div>');
        var insets = 10;
        _PiP.appendContent($title);

        $(window).ready(function () {
            var x = _$pane.outerWidth() + insets;
            var y = insets;
            _PiP.setX(x);
            _PiP.setY(y);
        });

        $(window).resize(function () {
            var newX = _$pane.outerWidth() + _$pane.offset().left + insets;
            _PiP.setX(newX);
        });

        return _PiP.$;
    }

    this.makeGUI = function (title) {
        _$border.append(_$hideBtn);
        _$wrapper.append(_$pane, _$border);

        _$pane.resizable({
            handles: "e"
        });

        $('body').append(_$3D, _$wrapper, makeTitle(title));

        _$pane.append(MLJ.gui.getWidget("SceneBar")._make());
//        _$pane.append(MLJ.gui.getWidget("SearchTool")._make());

        var $wrap = $("<div/>").attr("id", "mlj-split-pane");
        var $pos1 = $("<div/>").css({height: "30%"}).addClass("mlj-resiz1");
        var $pos2 = $("<div/>").css({height: "50%"}).addClass("mlj-resiz2");
        var $pos3 = $("<div/>").css({height: "20%"}).addClass("mlj-resiz3");
        $wrap.append($pos1, $pos2, $pos3);
        _$pane.append($wrap);
        splitPane("mlj-resiz1");
        splitPane("mlj-resiz2");

        //Init split pane height on window ready
        //splitPane.height = window.height - (sceneBar.height+searchTool.height)
        $(window).ready(function () {
            $wrap.height($(window).height() - $wrap.offset().top);
        });

        $pos1.append(MLJ.gui.getWidget("LayersPane")._make());
        $pos2.append(MLJ.gui.getWidget("TabbedPane")._make());
        $pos3.append(MLJ.gui.getWidget("Log")._make());

        $('body').append(MLJ.gui.getWidget("Logo")._make());
        $('body').append(MLJ.gui.getWidget("Info")._make());

        _$3D.css({
            position: "absolute",
            width: $(window).width() - (_$pane.outerWidth() + _$pane.offset().left),
            left: _$pane.outerWidth() - _$pane.offset().left,
            height: "100%",
            top: 0
        });
    };

    function splitPane(cl) {
        var sum, minH;
        $("." + cl).resizable({
//                    autoHide: true,
            handles: 's',
            start: function (e, ui) {
                var divTwo = ui.element.next();
                sum = ui.element.height() + divTwo.height();
                minH = parseInt(divTwo.css("min-height"), 10);
            },
            resize: function (e, ui) {
                var divTwo = ui.element.next();
                var remainingSpace = sum - ui.element.height();
                if (remainingSpace >= minH) {
                    divTwo.height(remainingSpace);
                } else {
                    ui.element.height(sum - minH);
                    divTwo.height(minH);
                }
            }
        });
    }

    $(window).resize(function (event) {
        var h = $(window).outerHeight() - $('#mlj-split-pane').position().top;

        if (!$(event.target).hasClass('ui-resizable')) {
            $(".mlj-resiz2").height(h - (
                    $('.mlj-resiz1').height() + $('.mlj-resiz3').height()));
        }

        MLJ.gui.getWidget("TabbedPane")._refresh();

        _$3D.css({
            width: $(window).width() - (_$pane.outerWidth() + _$pane.offset().left),
            left: _$pane.outerWidth() + _$pane.offset().left
        });

    });

    _$hideBtn.click(function () {

        if (_$pane.data("visible")) {
            _$wrapper.animate({left: -_$pane.outerWidth()}, {
                duration: 500,
                start: function () {
                },
                step: function () {
                    $(window).trigger('resize');
                },
                complete: function () {
                    $(window).trigger('resize');

                    //Hide button animation
                    $({deg: 0}).animate({deg: 180}, {
                        duration: 500,
                        step: function (now) {
                            _$hideBtn.css({
                                transform: 'rotate(' + now + 'deg)'
                            });
                        }
                    });

                }
            });

            _$pane.data("visible", false);

        } else {
            _$wrapper.animate({left: 0}, {
                duration: 500,
                start: function () {
                },
                step: function () {
                    $(window).trigger('resize');
                },
                complete: function () {
                    $(window).trigger('resize');

                    //Hide button animation
                    $({deg: 180}).animate({deg: 360}, {
                        duration: 500,
                        step: function (now) {
                            _$hideBtn.css({
                                transform: 'rotate(' + now + 'deg)'
                            });
                        }
                    });

                }
            });

            _$pane.data("visible", true);
        }
    });

}).call(MLJ.gui, MLJ.gui.widget);