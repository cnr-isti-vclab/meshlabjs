/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {

    MLJ.gui.widget.LayersPane = function () {

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

        this.getSelectedName = function () {
            return _selectedName;
        };

        this._make = function () {//build function 
            initEventHandlers();
            return _$layers;
        };

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

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.LayersPane);

    //Install widget
    MLJ.gui.installWidget("LayersPane", new MLJ.gui.widget.LayersPane());

})(MLJ.gui.component);
