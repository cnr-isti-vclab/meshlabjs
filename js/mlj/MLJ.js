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
 * @file Base library file, defines MLJ namespace
 * @author Stefano Gabriele
 */

/**
 * MLJ namespace
 * @namespace MLJ
 * @author Stefano Gabriele
 */
var MLJ = {
    VERSION: "1.0"
};

/**         
 * @class Create a MLJ error
 * @param {number} errorCode The error code number
 * @param {string} message The error message
 * @memberOf MLJ
 * @author Stefano Gabriele   
 */
MLJ.Error = function (errorCode, message) {
    this.code = errorCode;
    this.message = message;
};

/**
 * Namespace for MLJ events
 * @namespace MLJ.events         
 * @memberOf MLJ
 * @author Stefano Gabriele
 */
 MLJ.events = {
  
    /**
     * Enum for Scene envents
     * @readonly
     * @enum {string}
     * @memberOf MLJ.events
     * @author Stefano Gabriele
     */
    Scene: {
        /** Triggered when a layer must be selected */
        SELECT_LAYER: "selectLayer",
        /** Triggered when a layer must be hidden */
        HIDE_LAYER: "hideLayer",
        /** Triggered when a layer must be shown */
        SHOW_LAYER: "showLayer",
        /** Triggered when the scene is ready */
        SCENE_READY: "sceneReady",
        /** Triggered when a layer is selected */
        LAYER_SELECTED: "layerSelected",
        /** Triggered when a layer is added */
        LAYER_ADDED: "layerAdded",
        /** Triggered when a layer is updated */
        LAYER_UPDATED: "layerUpdated"
    }
};

(function ($) {

    if (typeof $ === 'undefined') {
        console.error("jQuery library needed.");
    }

    var error;
    
    /** @function
     *  @param {MLJ.Error} error The error to set 
     *  @description Set an error
     *  @author Stefano Gabriele
     */
    this.setError = function (error) {        
        this.error = error;
    };    
    
    /** @function
     *  @return {MLJ.Error} The last error
     *  @description Get last error
     *  @author Stefano Gabriele
     */    
    this.getLastError = function () {
        return this.error;
    };
    
    /**
     * @function
     * @param {class} base The superclass
     * @param {class} sub The subclass
     * @description Utility function used to inherit from a superclass
     */
    this.extend = function (base, sub) {
        // Avoid instantiating the base class just to setup inheritance
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
        // for a polyfill
        // Also, do a recursive merge of two prototypes, so we don't overwrite 
        // the existing prototype, but still maintain the inheritance chain
        // Thanks to @ccnokes
        var origProto = sub.prototype;
        sub.prototype = Object.create(base.prototype);
        for (var key in origProto) {
            sub.prototype[key] = origProto[key];
        }
        // Remember the constructor property was set wrong, let's fix it
        sub.prototype.constructor = sub;
        // In ECMAScript5+ (all modern browsers), you can make the constructor property
        // non-enumerable if you define it like this instead
        Object.defineProperty(sub.prototype, 'constructor', {
            enumerable: false,
            value: sub
        });
    };
}).call(MLJ, jQuery);