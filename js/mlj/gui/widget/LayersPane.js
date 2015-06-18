/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {

    MLJ.gui.widget.LayersPane = function () {

        var _layersPane;
//        var _$wrapper = $('<div></div>').css({height: "100%"});
        var _$layers = $('<div id="mlj-layers" class="ui-widget-content"></div>');
//        var _$title = $('<h3 class="ui-widget-header">Layers</h3>')
//                .css({position:"absolute",top:0, right:0, left:0});

        var _selectedName;

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

        function initEventHandlers() {
            //On new mesh added
            $(document).on(MLJ.events.Scene.LAYER_ADDED,
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

            $(document).on(MLJ.events.Scene.LAYER_REMOVED,
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

            $(document).on(MLJ.events.Scene.LAYER_SELECTED,
                    function (event, mesh) {

                        var infoWidg = MLJ.gui.getWidget("Info");

                        //Clear info area
                        infoWidg.clear();

                        //Add mesh info to info widget
                        infoWidg.append("Current Mesh: " + mesh.name);
                        infoWidg.append("Vertices: " + mesh.VN);
                        infoWidg.append("Faces: " + mesh.FN);

                    });

            $(document).on(MLJ.events.Scene.LAYER_UPDATED,
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

        this._make = function (containment) {//build function 
            initEventHandlers();
//            _$wrapper.append(_$layers,_$title);

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

    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.LayersPane);

    //Install widget
    MLJ.gui.installWidget("LayersPane", new MLJ.gui.widget.LayersPane());

})(MLJ.gui.component);
