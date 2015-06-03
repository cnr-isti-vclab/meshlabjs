/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.SearchTool = {};

(function (gui) {
    var _elements = new Object();

    var _$searchTool;

    var _widget = new MLJ.gui.Widget(
            function () {//build function             

                _$searchTool = $('<div id="search"></div>')
                        .append('<label for="autocomplete"></label>')
                        .append('<input id="autocomplete" placeholder="Search">');

                $(document).ready(function () {

                    var tags = [];

                    $.each(_elements, function (key, value) {
                        tags.push(key);
                    });

                    $('#autocomplete').autocomplete({
                        source: function (request, response) {
                            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
                            response($.grep(tags, function (item) {
                                return matcher.test(item);
                            }));
                        },
                        select: function (event, ui) {
                            //Execute function handler
                            _elements[ui.item.value]();
                        }
                    });
                });

                return _$searchTool;
            });

    this.addTag = function () {
        var element;
        for (var i = 0; i < arguments.length; i++) {
            element = arguments[i];
            if (element instanceof gui.SearchElement) {
                _elements[element.tag] = element.handler;
            } else {
                console.error("The parameter must be an instance of MLJ.gui.SearchElement");
            }
        }
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.SearchTool, MLJ.gui);
