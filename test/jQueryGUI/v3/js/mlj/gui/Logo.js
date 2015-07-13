/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Logo = {};

(function (gui) {
    var LOGO_WIDTH = 96;
    var LOGO_HEIGHT = 821*LOGO_WIDTH/1023;
    var insets = 10;
    var _PiP;
    var _$dialog;
    
    var _widget = new MLJ.gui.Widget(
            function () {//build function                 
                _PiP = new gui.PiP(0, 0);

                var $logo = $('<img id="logo" src="../../../img/vcglogo200609_1024px.png">');

                _$dialog = $('  <div id="dialog" title="About MeshLabJS">\
                    Copyright(C) 2015<br>\
                    <br>\
                    <a href="http://vcg.isti.cnr.it/%7Ecignoni">Paolo Cignoni</a> <br>\
                    <a href="http://vcg.isti.cnr.it"> Visual Computing Lab</a> <br>\
                    <a href="http://www.isti.cnr.it"> ISTI - Italian National Research Council</a><br><br> \
<b>MeshLabJS</b> is a web-based mesh processing system for \
cleaning, filtering, editing and rendering of unstructured 3D triangular meshes. \
The system is heavily inspired on desktop version of <a href="http://meshlab.sf.net">MeshLab</a>.<br> \
MeshLabJS for the mesh processing tasks relies on the \
<a href="http://vcg.sf.net">VCG</a> C++ library compiled to asm.js using emscripten \
<br>\
<br><b>Authors</b> (in first commit order)<br>\
Paolo Cignoni (Project Leader) <br> \
Maurizio Idini<br>\
Stefano Gabriele <br>\
</div>').hide();
                $('body').append(_$dialog);

                $logo.load(function () {
                    _PiP.appendContent(this);
                    $(this).width(LOGO_WIDTH);
                });

                $logo.css('cursor', 'pointer');

                $(document).ready(function () {
                    var x = $('#tools-pane').outerWidth() + insets;
                    var y = $(window).height() - LOGO_HEIGHT - insets;
                    _PiP.setX(x);
                    _PiP.setY(y);
                });

                $(window).resize(function () {
                    var $tp = $('#tools-pane');
                    var newX = $tp.outerWidth() + $tp.offset().left + insets;
                    var newY = $(window).height() - LOGO_HEIGHT - insets;
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
