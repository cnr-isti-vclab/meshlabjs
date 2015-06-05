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
                    var ww = $(window).width();
                    var wh = $(window).height();
                    var pw = _$info.width();
                    var ph = _$info.height();                    
                    _PiP.setX(ww - pw);
                    _PiP.setY(wh - ph);
                    _PiP.lock();
                });
                
                return _PiP.jQuery();
            });

    this.append = function (message) {
        _$info.append("<p>" + message + "</p>");
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.Info, MLJ.gui);
