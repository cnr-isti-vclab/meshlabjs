/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.SceneBar = {};

(function (gui) {
    var _buttons = [];
    var _$toolsBtns;

    var _widget = new MLJ.gui.Widget(
            function () {//build function

                _$toolsBtns = $('<div id="tools-buttons"></div>');

                for (var i = 0; i < _buttons.length; i++) {
                    _$toolsBtns.append(_buttons[i].jQueryButton());
                }

                return _$toolsBtns;
            });

    this.addButton = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof gui.Button) {
                _buttons.push(arguments[i]);
            } else {
                console.error("The parameter must be an instance of MLJ.gui.Button");
            }
        }
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.SceneBar, MLJ.gui);

