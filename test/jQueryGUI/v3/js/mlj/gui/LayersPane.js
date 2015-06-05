/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.LayersPane = {};

(function (gui) {

    var _layers = [];

    var _$layersPane;
    var _$layers = $('<div id="layers" class="df-content"></div>');

    var _widget = new MLJ.gui.Widget(
            function () {//build function 

                _$layersPane = $('<div class="display-field"></div>')
                        .append('<div class="df-title"><h3>Layers</h3></div>')
                        .append(_$layers);

                return _$layersPane;

            });

    this.addLayer = function (name) {
        _$layers.append("<p>" + name + "</p>");
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.LayersPane, MLJ.gui);
