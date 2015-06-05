/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Logo = {};

(function (gui) {
    var _PiP;
    var _$dialog;
    var _widget = new MLJ.gui.Widget(
            function () {//build function                 
                _PiP = new gui.PiP(0, 0);
                
                var $logo = $('<img id="logo" src="../../../img/vcglogo200609_1024px.png">');

                _$dialog = $('<div id="dialog" title="Dialog Title">About</div>').hide();
                $('body').append(_$dialog);

                $logo.load(function () {
                    _PiP.appendContent(this);
                    $(this).width(86);
                    _PiP.setX(410);
                    _PiP.setY($(window).height() - 86);
                    _PiP.lock(false, true);
                });

                $($logo).css('cursor', 'pointer');

                $($logo).click(function () {
                    $('#dialog').dialog();
                });

                return _PiP.jQuery();
            });


    gui.addWidget(_widget);

}).call(MLJ.gui.Logo, MLJ.gui);
