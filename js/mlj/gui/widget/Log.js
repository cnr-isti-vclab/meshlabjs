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
 * @file Defines and installs the Log widget the text area used like standard output 
 * @author Stefano Gabriele
 */
(function (component) {
    
    /**         
     * @class Create a new Log widget
     * @augments  MLJ.gui.widget.Widget
     * @private
     * @memberOf MLJ.gui.widget
     * @author Stefano Gabriele 
     */
    var _Log = function () {

        var _this = this;

        //Console output redirecting ...
        var _log = console.log, _warn = console.warn, _error = console.error;

        console.log = function (message, args) {
            var m = args ? message + " " + args : message;
            _this.append(m);
            _log.apply(console, arguments);
        };

        console.warn = function (message, args) {
            var m = args ? message + " " + args : message;
            _this.append(m);
            _warn.apply(console, arguments);
        };

        console.error = function (message, args) {
            var m = args ? message + " " + args : message;
            _this.append(m);
            _error.apply(console, arguments);
        };

        var _$log = $('<textarea/>')
                .attr("spellcheck", false)
                .attr("readonly", "readonly");
        
        /**
         * @author Stefano Gabriele
         */
        this._make = function () {
            var $wrap = $('<div/>').attr("id", "mlj-log-widget");
            $wrap.append(_$log);
            return $wrap;
        };
        
        /**
         * Appends text to Log
         * @param {String} text The text to append
         * @author Stefano Gabriele
         */
        this.append = function (text) {
            _$log.append(text + "\n");
            _$log.scrollTop(_$log[0].scrollHeight - _$log.height());
        };
    };

    MLJ.extend(MLJ.gui.widget.Widget, _Log);

    //Install widget
    MLJ.gui.installWidget("Log", new _Log());

})(MLJ.gui.component);