/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file Defines and installs the Logo widget
 * @author Stefano Gabriele
 */
(function (component) {
    
    /**         
     * @class Create a new Logo widget
     * @augments  MLJ.gui.Widget
     * @private
     * @memberOf MLJ.gui.widget
     * @author Stefano Gabriele 
     */
    var _Logo = function () {

        var LOGO_WIDTH = 96;
        var LOGO_HEIGHT = 821 * LOGO_WIDTH / 1023;
        var insets = 10;
        var _PiP;
        var _dialog = new MLJ.gui.component.Dialog(
                {title:"About MeshLabJS",draggable: false, width: 500, modal: true, resizable: false});
        
        this._make = function () {                 
            _PiP = new component.PiP();

            var $logo = $('<img id="logo" src="img/vcglogo_196px.png">');

            _dialog.appendContent(
                "Copyright(C) 2015<br>"+
                "<br>"+
                "<a href=\"http://vcg.isti.cnr.it/%7Ecignoni\">Paolo Cignoni</a> <br>"+
                "<a href=\"http://vcg.isti.cnr.it\"> Visual Computing Lab</a> <br>"+
                "<a href=\"http://www.isti.cnr.it\"> ISTI - CNR</a><br><br> "+
                "<b>MeshLabJS</b> is a web-based mesh processing system for "+
                "cleaning, filtering, editing and rendering of unstructured 3D triangular meshes. "+
                "This program is heavily inspired on the original desktop system "+
                "<a href=\"http://meshlab.sf.net\">MeshLab</a>.<br> "+
                "Like the original one, for all the mesh processing tasks MeshLabJS relies on the "+
                "<a href=\"http://vcg.sf.net\">VCG</a> C++ library compiled to asm.js using emscripten "+
                "<br>"+
                "<br><b>Authors</b> (in first commit order)<br>"+
                "Paolo Cignoni (Project Leader) <br> "+
                "Maurizio Idini<br>"+
                "Stefano Gabriele <br>"+
                "Stefano Giammori <br>"+
                "Gian Maria Delogu <br>"+
                "Davide Busato<br>"+
                "Andrea Maggiordomo<br><br>" +
                "Current version contains " + MLJ.core.plugin.Manager.getFilterPlugins().size() + " filters."
                );

            $logo.load(function () {
                _PiP.appendContent(this);
                $(this).width(LOGO_WIDTH);
            });

            $logo.css('cursor', 'pointer');

            $(document).ready(function () {
                var x = $('#mlj-tools-pane').outerWidth() + insets;
                var y = $(window).height() - LOGO_HEIGHT - insets;
                _PiP.setX(x);
                _PiP.setY(y);
            });

            $(window).resize(function () {
                var $tp = $('#mlj-tools-pane');
                var newX = $tp.outerWidth() + $tp.offset().left + insets;
                var newY = $(window).height() - LOGO_HEIGHT - insets;
                _PiP.setX(newX);
                _PiP.setY(newY);
            });

            $logo.click(function () {               
                  _dialog.show();
            });

            return _PiP.$;
        };
    };

    MLJ.extend(MLJ.gui.Widget, _Logo);

    //Install widget
    MLJ.gui.installWidget("Logo", new _Logo());

})(MLJ.gui.component);
