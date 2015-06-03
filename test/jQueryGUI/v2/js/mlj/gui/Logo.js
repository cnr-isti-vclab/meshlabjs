/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Logo = {};

(function (gui) {
    var _PiP;

    var _widget = new MLJ.gui.Widget(
            function () {//build function                 
                _PiP = new gui.PiP(0, 0);
                var $logo = $('<img id="logo" src="../../../img/vcglogo200609_1024px.png">');

                $logo.load(function () {                        
                    _PiP.appendContent(this);
                    $(this).width(64);
                    _PiP.setX($(window).width() - 64);
                    _PiP.setY(10);                    
                });               

                return _PiP.jQuery();
            });


    gui.addWidget(_widget);

}).call(MLJ.gui.Logo, MLJ.gui);
