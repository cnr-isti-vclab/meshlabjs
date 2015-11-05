/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file Defines and installs the SearchTool widget 
 * @author Stefano Gabriele
 */
(function () {

    /**         
     * @class Create a new SearchTool widget
     * @augments  MLJ.gui.Widget
     * @private
     * @memberOf MLJ.gui.widget
     * @author Stefano Gabriele 
     */
    var _SearchTool = function () {
        var _elements = [];
        var _$searchTool = $('<div id="mlj-search-widget"></div>');
        var _$input = $('<input placeholder="Search" autofocus>');

        function refresh(select) {
            $(document).trigger("mljSearchSelect", [select]);
            MLJ.widget.TabbedPane.getFiltersAccord().refresh();
        }

        /**
         * @author Stefano Gabriele         
         */
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

        /**
         * Adds a new tag in the search list
         * @param {String} tag The tag to insert in the search list
         */
        this.addItem = function (tag) {
            //Replace special characters with a whitespace
            var cleanedTag = tag.replace(/[^\w\s]/gi," ");
            var split = cleanedTag.split(" ");
            // Merge both arrays and get unique items
            _elements = MLJ.util.arrayUnique(_elements.concat(split));
            return this;
        };
        
        this.focus = function() {
            _$input.focus();
        }

        this.select = function() {
            _$input.select();
        }

        MLJ.gui.Widget.call(this);
    };

    MLJ.extend(MLJ.gui.Widget, _SearchTool);

    //Install widget
    MLJ.gui.installWidget("SearchTool", new _SearchTool());

})();