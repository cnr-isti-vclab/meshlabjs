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
 * @file Defines the Widget base class 
 * @author Stefano Gabriele
 */

/**
 * MLJ.gui.widget namespace
 * @namespace MLJ.gui.widget
 * @memberOf MLJ.gui
 * @author Stefano Gabriele
 */
MLJ.gui.widget = {};

/**         
 * @class The widget base class
 * @abstract
 * @author Stefano Gabriele 
 */
MLJ.gui.widget.Widget = function () {};

MLJ.gui.widget.Widget.prototype = {
    /**
     * The function called to build the widget
     * @abstract
     */
    _make: function () {

    },
    
    /**
     * The function called to refresh the widget
     * @abstract
     */
    _refresh: function () {
    }
};