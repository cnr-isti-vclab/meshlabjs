/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {

    MLJ.gui.widget.Info = function () {
        var _PiP;
        var _$info = $('<div id="mlj-info"></div>');

        this._make = function () {//build function                 
            _PiP = new component.PiP();
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

            return _PiP.$;
        };

        this.clear = function () {
            _$info.empty();
        };

        this.append = function (message) {
            _$info.append("<p>" + message + "</p>");
        };
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.Info);

    //Install widget
    MLJ.gui.installWidget("Info", new MLJ.gui.widget.Info());

})(MLJ.gui.component);
