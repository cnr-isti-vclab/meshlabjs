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
 * @file Defines and installs the Layers pane widget that provides the features of
 * select and show/hide layers
 * @author Stefano Gabriele
 */
(function (component) {
    
    /**         
     * @class Create a new Layers Pane widget
     * @augments  MLJ.gui.Widget
     * @private
     * @memberOf MLJ.gui.widget
     * @author Stefano Gabriele 
     */
    var _LayersPane = function () {

        var _$layers = $('<div id="mlj-layers" class="ui-widget-content"></div>');

        var _selectedName;

        function select(name) {
            //Just one
            var $sel = _$layers.find("[class*='selected']");
            $sel.each(function (key, value) {
                $(value).removeClass("selected");
            });

            //Just one
            $sel = _$layers.find("[name='" + name + "']");
            $sel.each(function (key, value) {
                $sel = $(value).addClass("selected");
                _selectedName = name;
            });
        }

        function initEventHandlers() {
            //On new mesh added
            $(document).on("SceneLayerAdded",
                    function (event, mesh) {
                        //Add item to layers pane widget
                        MLJ.widget.LayersPane.addLayer(mesh.name);

                        var infoWidg = MLJ.gui.getWidget("Info");
                        //Clear info area
                        infoWidg.clear();

                        //Add mesh info to info widget
                        infoWidg.append("Current Mesh: " + mesh.name);
                        infoWidg.append("Vertices: " + mesh.VN);
                        infoWidg.append("Faces: " + mesh.FN);
                    });

            $(document).on("SceneLayerSelected",
                    function (event, mesh) {

                        var infoWidg = MLJ.gui.getWidget("Info");

                        //Clear info area
                        infoWidg.clear();

                        //Add mesh info to info widget
                        infoWidg.append("Current Mesh: " + mesh.name);
                        infoWidg.append("Vertices: " + mesh.VN);
                        infoWidg.append("Faces: " + mesh.FN);

                    });

            $(document).on("SceneLayerUpdated",
                    function (event, mesh) {
                        //UPDATE INFO                        
                        if (_selectedName === mesh.name) {
                            var infoWidg = MLJ.gui.getWidget("Info");
                            //Clear info area
                            infoWidg.clear();

                            //Add mesh info to info widget
                            infoWidg.append("Current Mesh: " + mesh.name);
                            infoWidg.append("Vertices: " + mesh.VN);
                            infoWidg.append("Faces: " + mesh.FN);
                        }

                    });
        }
        
        /**
         * Returns the name of the selected layer
         * @returns {String} The name of the selected layer
         * @author Stefano Gabriele
         */
        this.getSelectedName = function () {
            return _selectedName;
        };
        
        /**          
         * @author Stefano Gabriele
         */
        this._make = function () {//build function 
            initEventHandlers();
            return _$layers;
        };
        
        /**
         * Adds a new layer
         * @param {String} name The name of the layer
         * @author Stefano Gabriele
         */
        this.addLayer = function (name) {

            var $wrap = $('<div class="mlj-layers-entry"></div>')
                    .css({position: "relative", width: "100%"});
            var $layer = $('<div class="mlj-layer" name="' + name + '">' + name + '</div>')
                    .css({position: "absolute"});
            var $eye = $('<div class="mlj-eye show"></div>')
                    .css({position: "absolute"});
            $wrap.append($eye).append($layer);
            _$layers.append($wrap);
            select(name);

            $layer.click(function () {
                if ($layer.attr("name") !== _selectedName) {
                    select(name);
                    MLJ.core.Scene.selectLayerByName(name);
                }
            });

            $eye.click(function () {
                if ($eye.hasClass("show")) {
                    $eye.removeClass("show").addClass("hide");
                    MLJ.core.Scene.setLayerVisible(name, false);
                } else {
                    $eye.removeClass("hide").addClass("show");
                    MLJ.core.Scene.setLayerVisible(name, true);
                }
            });
        };

    };

    MLJ.extend(MLJ.gui.Widget, _LayersPane);

    //Install widget
    MLJ.gui.installWidget("LayersPane", new _LayersPane());

})(MLJ.gui.component);
