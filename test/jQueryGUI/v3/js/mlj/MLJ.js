/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var MLJ = {version: "1.1"};

MLJ.Error = function (errCode, message) {
    this.code = errCode;
    this.message = message;
};

(function ($) {

    if (typeof $ === 'undefined') {
        console.error("jQuery library needed.");
    }

    var error;

    this.setError = function (error) {        
        this.error = error;
    };

    this.getLastError = function () {
        return this.error;
    };

    /* extending */
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