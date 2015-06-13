/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {
    
    MLJ.gui.widget.SearchTool = function () {
        var _elements = new Object();
        var _$searchTool = $('<div id="mlj-search"></div>');
        var _$wrapper = $('<div id="mlj-search-wrapper"></div>');
        var _$input = $('<input placeholder="Search">');
        var _$searchButton = new component.Button("", "Search",
                "../icons/IcoMoon-Free-master/PNG/48px/0135-search.png");

        this._make = function () {//build function 
            _$wrapper.append(_$input, _$searchButton.$);
            _$searchTool.append(_$wrapper);

            $(window).ready(function () {

                var tags = [];

                $.each(_elements, function (key, value) {
                    tags.push(key);
                });

                _$input.autocomplete({
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
        };


        this.addSearchElement = function (tag, handler) {

            //Check for duplicated tags.
            if (_elements[tag]) {
                console.error("Duplicated tag name.");
                return;
            }

            if (jQuery.isFunction(handler)) {
                console.error("Handler must be a function.");
                return;
            }

            _elements[tag] = handler;

            return this;
        };

        MLJ.gui.widget.Widget.call(this);
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.SearchTool);

    //Install widget
    MLJ.gui.installWidget("SearchTool", new MLJ.gui.widget.SearchTool());

})(MLJ.gui.component);