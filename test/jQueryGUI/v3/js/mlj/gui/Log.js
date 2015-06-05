/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Log = {};

(function (gui) {
    var _$logPane;
    var _$log = $('<div id="log" class="df-content"></div>');

    var _widget = new MLJ.gui.Widget(
            function () {//build function 

                _$logPane = $('<div class="display-field"></div>')
                        .append('<div class="df-title"><h3>Log</h3></div>')
                        .append(_$log);

                return _$logPane;

            });

    this.append = function (message) {
        _$log.append("<p>" + message + "</p>");
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.Log, MLJ.gui);
