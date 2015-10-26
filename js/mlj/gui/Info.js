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
 * @file Defines and installs the Info widget the area where the informations
 * about mesh are shown
 * @author Stefano Gabriele
 */

(function(component) {

    /**         
     * @class Create a new Info widget
     * @augments  MLJ.gui.Widget
     * @private
     * @memberOf MLJ.gui.widget
     * @author Stefano Gabriele
     */
    var _Info = function() {
        var _PiP;
        var _$info = $('<div id="mlj-info"></div>');

        /**          
         * @author Stefano Gabriele
         */
        this._make = function() { //build function                 
            _PiP = new component.PiP();
            _PiP.appendContent(_$info);

            $(window).resize(function() {
                var newX = $(window).width() - _$info.width();
                var newY = $(window).height() - _$info.height();
                _PiP.setX(newX-6);
                _PiP.setY(newY-6);
            });

            $(document).ready(function() {
                $(window).resize();
            });

            return _PiP.$;
        };

        /**
         * Clear the Info area
         * @author Stefano Gabriele
         */
        this.clear = function() {
            _$info.empty();
        };

        this.updateInfo = function(mesh) {
            //Clear info area
            this.clear();

            //Add mesh info to info widget
            this.append(mesh.name);
            var vertString = "V: " + mesh.VN;
            if(mesh.cppMesh.hasPerVertexColor())   vertString +=(" VC");
            if(mesh.cppMesh.hasPerVertexQuality()) vertString +=(" VQ");
            
            var faceString = "F: " + mesh.FN;
            if(mesh.cppMesh.hasPerFaceColor())   vertString +=(" FC");
            if(mesh.cppMesh.hasPerFaceQuality()) vertString +=(" FQ");
        
            this.append(vertString);
            this.append(faceString);
        }
            
        /**
         * Appends text to the Info area
         * @param {String} text The text to append
         * @author Stefano Gabriele
         */
        this.append = function(text) {
            _$info.append("<p>" + text + "</p>");
        };
    };

    MLJ.extend(MLJ.gui.Widget, _Info);

    //Install widget
    MLJ.gui.installWidget("Info", new _Info());

})(MLJ.gui.component);