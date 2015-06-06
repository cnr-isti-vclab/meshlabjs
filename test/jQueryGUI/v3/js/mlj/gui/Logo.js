/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Logo = {};

(function (gui) {
    var LOGO_WIDTH = 86;
    var insets = 10;
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
                    $(this).width(LOGO_WIDTH);
                });

                $logo.css('cursor', 'pointer');

                $(document).ready(function () {
                    var x = $('#tools-pane').outerWidth() + insets;
                    var y = $(window).height() - LOGO_WIDTH;
                    _PiP.setX(x);
                    _PiP.setY(y);
                });

                $(window).resize(function () {
                    var $tp = $('#tools-pane');
                    var newX = $tp.outerWidth() + $tp.offset().left + insets;
                    var newY = $(window).height() - LOGO_WIDTH;
                    _PiP.setX(newX);
                    _PiP.setY(newY);
                });

                $logo.click(function () {
                    $('#dialog').dialog();
                });

                return _PiP.jQuery();
            });


    gui.addWidget(_widget, true);

}).call(MLJ.gui.Logo, MLJ.gui);
