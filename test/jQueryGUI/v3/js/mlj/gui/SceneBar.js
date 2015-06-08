/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.SceneBar = {};

(function (gui) {
    var _toolBar = new gui.ToolBar();

    var _widget = new MLJ.gui.Widget(
            function () {//build function
                return _toolBar.jQuery();
            });
    this.addButton = function () {
        _toolBar.addButton.apply(undefined, arguments);
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.SceneBar, MLJ.gui);

