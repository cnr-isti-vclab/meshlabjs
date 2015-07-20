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
 * @file Defines MLJ.util namespace and AssociativeArray class
 * @author Stefano Gabriele
 */


/**
 * MLJ.util namespace
 * @namespace MLJ.util
 * @author Stefano Gabriele
 */
MLJ.util = {};

MLJ.util.loadFile = function (path, callback) {
    if (!jQuery.isFunction(callback)) {
        console.warn("The callback paramter must be a funciton.");
    }

    var tmpArray = [];
    if (jQuery.isArray(path)) {
        tmpArray = path;        
    } else {
        tmpArray.push(path);
    }
    
    var results = new MLJ.util.AssociativeArray();    
    function _load(path, _callback) {
        
        var fileName = path.substring(path.lastIndexOf('/')+1);                    
        
        $.ajax({
            url: path,
            error: function (xhr, textStatus, errorThrown) {
                var msg = "An error occurred. Status code: ";
                console.warn(msg + xhr.status + ". Status text: " + textStatus);
                results.set(fileName,"");
            },
            success: function (data) {
                results.set(fileName,data);
                _callback(data);
            }
        });
    }
    
    var i = 0;
    function _loadNextFile() {
        _load(tmpArray[i], function () {
            i++;
            if (i === tmpArray.length) {
                callback(results);
                return;
            } else {
                _loadNextFile();
            }            
        });
    }
    
    _loadNextFile();
};

/**
 * Returns an array without duplicates
 * @param {type} array The array to be cleaned
 * @returns {Array} The array without duplicates
 */
MLJ.util.arrayUnique = function (array) {

    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

/**         
 * @class Create an Associative array 
 * @memberOf MLJ.util
 * @author Stefano Gabriele  
 * @example <caption>Usage example:</caption>  
 * var aa = new MLJ.util.AssociativeArray();
 * aa.set("key1", obj1);
 * aa.set("key2", obj2);
 * var iter = aa.iterator();
 * var obj;
 * while(iter.hasNext()) {
 *    obj = iter.next();
 *    //do something with obj
 * }
 */
MLJ.util.AssociativeArray = function () {

    //Contains the keys (key = keys[0 ... _length-1])
    var keys = [];
    //Associative arrays (value = values[key]);
    var values = [];

    /**         
     * @class Create a new _Iterator
     * @private     
     * @author Stefano Gabriele  
     */
    var _Iterator = function () {
        var _ind = 0;

        /**
         * Returns true if the iteration has more elements
         * @returns {Boolean} <code>true</code> if the iteration has more elements,
         * <code>false</code> otherwise
         */
        this.hasNext = function () {
            return _ind < keys.length;
        };

        /**
         * Returns the next element in the iteration
         * @returns {Object} the next element in the iteration
         */
        this.next = function () {
            var next = values[keys[_ind]];
            _ind++;
            return next;
        };
    };

    /**
     * Returns the value to which the specified key is mapped, or 
     * <code>undefined</code> if this array contains no mapping for the key
     * @param {string} key the key whose associated value is to be returned
     * @returns the value to which the specified key is mapped, or 
     * <code>undefined</code> if this array contains no mapping for the key
     * @author Stefano Gabriele  
     */
    this.getByKey = function (key) {
        return values[key];
    };

    /**
     * Returns the number of elements in this array     
     * @returns {Integer} The number of elements in this array
     * @author Stefano Gabriele  
     */
    this.size = function () {
        return keys.length;
    };

    /**
     * Inserts an element in this associative array. Note that if the array 
     * previously contained a mapping for the key, the old value is replaced
     * @param {String} key The key with which the specified value is to be associated
     * @param {Object} value The value to be associated with the specified key
     * @author Stefano Gabriele  
     */
    this.set = function (key, value) {
        //if key not exists
        if (!values[key]) {
            keys.push(key);
        }
        //Note that if key aleady exists, the new entry wll override the old
        values[key] = value;
    };

    /**
     * Removes an element from this associative array          
     * @param {String} key The key whose mapping is to be removed from the array
     * @returns {Object} The removed element if the array contains a mapping for
     * the key, <code>null</code> otherwise
     */
    this.remove = function (key) {
        var element = values[key];
        delete values[key];
        for (var i = 0, m = keys.length; i < m; i++) {
            if (keys[i] === key) {
                keys.splice(i, 1);
                //we have finished
                return element;
            }
        }

        return null;
    };

    /**
     * Returns an iterator over the elements in this array
     * @returns {MLJ.util.AssociativeArray._Iterator}
     */
    this.iterator = function () {
        return new _Iterator();
    };
};
