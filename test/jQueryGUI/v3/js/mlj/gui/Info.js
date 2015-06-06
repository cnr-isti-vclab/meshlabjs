/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Info = {};

(function (gui) {
    var _PiP;
    var _$info = $('<div id="info"></div>');

    var _widget = new MLJ.gui.Widget(
            function () {//build function                 
                _PiP = new gui.PiP();
                _PiP.appendContent(_$info);

                $(document).ready(function () {
                    var x = $(window).width() - _$info.width();
                    var y = $(window).height() - _$info.height();

                    _PiP.setX(x);
                    _PiP.setY(y);
                });

                $(window).resize(function () {
                    var newX = $(window).width() - _$info.width();
                    var newY = $(window).height() - _$info.height();
                    _PiP.setX(newX);
                    _PiP.setY(newY);
                });

                return _PiP.jQuery();
            });

    this.append = function (message) {
        _$info.append("<p>" + message + "</p>");
    };

    gui.addWidget(_widget, true);

}).call(MLJ.gui.Info, MLJ.gui);
