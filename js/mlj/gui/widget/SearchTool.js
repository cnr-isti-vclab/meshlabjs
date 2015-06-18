
(function () {

    MLJ.gui.widget.SearchTool = function () {
        var _elements = [];
        var _$searchTool = $('<div id="mlj-search-widget"></div>');
        var _$input = $('<input placeholder="Search">');

        function refresh(select) {
            $(document).trigger("mljSearchSelect", [select]);
        }

        this._make = function () {//build function 
            _$searchTool.append(_$input);
            var select;
            _$input.keyup(function () {
                var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()), "i");

                select = $.grep(_elements, function (item) {
                    return matcher.test(item);
                });

                refresh(select);
            });

            return _$searchTool;
        };

        this.addItem = function (tag) {
            _elements.push(tag);
            return this;
        };

        MLJ.gui.widget.Widget.call(this);
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.SearchTool);

    //Install widget
    MLJ.gui.installWidget("SearchTool", new MLJ.gui.widget.SearchTool());

})();