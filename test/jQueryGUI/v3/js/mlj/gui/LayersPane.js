/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.LayersPane = {};

(function (gui) {

    var _$layersPane;
    var _$layers = $('<div id="layers" class="df-content"></div>');
    var _selectedName;

    var _widget = new MLJ.gui.Widget(
            function () {//build function 

                _$layersPane = $('<div class="display-field"></div>')
                        .append('<div class="df-title"><h3>Layers</h3></div>')
                        .append(_$layers);

                return _$layersPane;

            });

    function select(name) {
        //Just one
        var $sel = _$layers.find("[class*='selected']");
        $sel.each(function (key, value) {
            $(value).removeClass("selected");
        });

        //Just one
        $sel = _$layers.find("[name*='" + name + "']");
        $sel.each(function (key, value) {
            $sel = $(value).addClass("selected");
            _selectedName = name;
        });
    }

    this.addLayer = function (name) {
        var $wrap = $('<div class="entry"></div>').css(
                {position: "relative", width:"100%"});
        var $layer = $('<div class="layer" name="' + name + '">' + name + '</div>')
                .css({position: "absolute"});
        var $eye = $('<div class="eye show"></div>')
                .css({position: "absolute"});
        $wrap.append($eye).append($layer);
        _$layers.append($wrap);

        select(name);

        $layer.click(function () {
            if ($layer.attr("name") !== _selectedName) {
                select(name);
                //Trigger LAYER_SELECTION_CHANGED event 
                $(document).trigger(MLJ.events.Gui.LAYER_SELECTION_CHANGED, [name]);
            }
        });

        $eye.click(function () {
            if ($eye.hasClass("show")) {
                $eye.removeClass("show").addClass("hide");
                $(document).trigger(MLJ.events.Gui.HIDE_LAYER, [name]);
            } else {
                $eye.removeClass("hide").addClass("show");
                $(document).trigger(MLJ.events.Gui.SHOW_LAYER, [name]);
            }
        });
    };


    gui.addWidget(_widget);

}).call(MLJ.gui.LayersPane, MLJ.gui);
