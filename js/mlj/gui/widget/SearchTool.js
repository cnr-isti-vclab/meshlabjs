
(function () {

    MLJ.gui.widget.SearchTool = function () {
        var _elements = [];
        var _$searchTool = $('<div id="mlj-search-widget"></div>');
        var _$input = $('<input placeholder="Search">');

        function refresh(select) {
            $(document).trigger("mljSearchSelect", [select]);
        }

        function arrayUnique(array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        }

        this._make = function () {//build function 
            _$searchTool.append(_$input);
            var select;
            _$input.keyup(function () {
                var matcher = new RegExp("(^)" + $.ui.autocomplete.escapeRegex($(this).val()), "i");                
                select = $.grep(_elements, function (item) {
                    return matcher.test(item);
                });

                refresh(select);
            });

            return _$searchTool;
        };

        this.addItem = function (tag) {
            var split = tag.split(" ");
            // Merges both arrays and gets unique items
            _elements = arrayUnique(_elements.concat(split));
            return this;
        };

        MLJ.gui.widget.Widget.call(this);
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.SearchTool);

    //Install widget
    MLJ.gui.installWidget("SearchTool", new MLJ.gui.widget.SearchTool());

})();