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
 * @file Defines Emscripten Module object, MLJ.core namspace and the basic 
 * classes used to create a Scene
 * @author Stefano Gabriele
 */

/**
 * @global
 * @description Module is a global JavaScript object with attributes that 
 * Emscripten-generated code calls at various points in its execution.
 * Developers can provide an implementation of Module to control 
 * the execution of code. For example, to define how notification 
 * messages from Emscripten are displayed, developers implement the 
 * Module.print attribute.
 * Note that parameter 'memoryInitializerPrefixURL' indicates path of file.js.mem
 */

var Module = {
    memoryInitializerPrefixURL: "js/generated/",
    preRun: [],
    postRun: [],
    print: function (text) {
        var w = MLJ.gui.getWidget("Log");
        w.append(text);
    },
    printErr: function (text) {
        var w = MLJ.gui.getWidget("Log");
        w.append(text);
    }
};


/**
 * MLJ.core namspace
 * @namespace MLJ.core
 * @memberOf MLJ
 * @author Stefano Gabriele
 */
MLJ.core = {
    /**
     * Enum for defaults
     * @readonly
     * @enum {Object}
     * @memberOf MLJ.core     
     * @author Stefano Gabriele
     */
    defaults: {
        /** AmbientLight defaults */
        AmbientLight: {
            color: "#ffffff",
            on: false
        },
        /** Headlight defaults */
        Headlight: {
            color: "#ffffff",
            on: true,
            intensity: 0.5,
            distance: 0
        },
        /** Material defaults */
        Material: {
            color: '#474747',
            specular: '#a9a9a9',
            emissive: '#7d7d7d',
            wireframe: false
        }
    }
};

/**         
 * @class Creates a new Ambient light
 * @param {THREE.Scene} scene The scene object
 * @param {THREE.Camera} camera The camera object
 * @param {THREE.WebGLRenderer} renderer The renderer object
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 */
MLJ.core.AmbientLight = function (scene, camera, renderer) {

    var _on = MLJ.core.defaults.AmbientLight.on;

    var _light = new THREE.AmbientLight(
            MLJ.core.defaults.AmbientLight.color);
    
    /**
     * Sets the ambient light color
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example,
     * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setColor = function (color) {
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
    };
    
    /**
     * Returns <code>true</code> if this ambient light is on
     * @returns {Boolean} <code>true</code> if this ambient light is on, 
     * <code>false</code> otherwise
     * @author Stefano Gabriele     
     */
    this.isOn = function () {
        return _on;
    };
    
    /**
     * Sets this ambient light on/off
     * @param {Boolean} on If <code>true</code>, this ambient light is enabled; 
     * otherwise this ambient light is disabled
     * @author Stefano Gabriele
     */
    this.setOn = function (on) {
        if (on === true) {
            scene.add(_light);
            _on = true;
        } else {
            scene.remove(_light);
            _on = false;
        }

        renderer.render(scene, camera);
    };

    //Init
    this.setOn(_on);
};


/**         
 * @class Creates a new Headlight
 * @param {THREE.Scene} scene The scene object
 * @param {THREE.Camera} camera The camera object
 * @param {THREE.WebGLRenderer} renderer The renderer object
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 */
MLJ.core.Headlight = function (scene, camera, renderer) {
    var _on = MLJ.core.defaults.Headlight.on;

    var _light = new THREE.PointLight(
            MLJ.core.defaults.Headlight.color,
            MLJ.core.defaults.Headlight.intensity,
            MLJ.core.defaults.Headlight.distance);
    
    /**
     * Sets the intensity of the headlight
     * @param {Float} Numeric value of the light's strength/intensity
     * @author Stefano Gabriele     
     */
    this.setIntensity = function (value) {
        _light.intensity = value;
        renderer.render(scene, camera);
    };
    
    /**
     * Sets the headlight color
     * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
     * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
     * @author Stefano Gabriele     
     */
    this.setColor = function (color) {
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
    };
    
    /**
     * Sets this headlight on/off
     * @param {Boolean} on If <code>true</code>, this headlight is enabled; 
     * otherwise this headlight is disabled
     * @author Stefano Gabriele
     */
    this.setOn = function (on) {
        if (on) {
            camera.add(_light);
        } else {
            camera.remove(_light);
        }
        renderer.render(scene, camera);
    };

    //Init
    this.setOn(_on);

};

MLJ.core.Material = function (parameters) {
    
    var _this = this;
    
    /**     
     * Contains this THREE.Material.
     * @type THREE.MeshPhongMaterial
     * @author Stefano Gabriele
     */
       
    this.threeMaterial = null;
    
    /**     
    * Contains this material paramters
    * @type Object
    * @author Stefano Gabriele
    */
    this.parameters = parameters === undefined
            ? $.extend(true, {}, MLJ.core.defaults.Material)
            : parameters;     
              
    /**
    * Sets the diffuse color of the material
    * @param {Object} color Can be a hexadecimal or a CSS-style string for example, 
    * "rgb(250, 0,0)", "rgb(100%,0%,0% )", "#ff0000", "#f00", or "red"
    * @author Stefano Gabriele     
    */
    this.setColor = function (value) {
        this.parameters.color = this.threeMaterial.color = new THREE.Color(value);
        MLJ.core.Scene.render();
    };
    
    /**
     * Indicates that this material need update
     * @author Stefano Gabriele     
     */
    this.needUpdate = function () {
        _this.threeMaterial.needUpdate = true;
    };
    
    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {
        _this.threeMaterial.dispose();
        _this.threeMaterial = _this.parameters = _this = null;        
    };
    
    this.build = function() {        
        if(_this.parameters.color === undefined) {
            _this.parameters.color = new THREE.Color(MLJ.core.defaults.Material.color);
        } else if(!(_this.parameters.color instanceof THREE.Color)) {
            _this.parameters.color = new THREE.Color(_this.parameters.color);
        }        
        _this._build();
    };
        
    //Init
    this.build();
};

MLJ.core.Material.prototype = {
    _build: function () {
    }
};

MLJ.core.BasicMaterial = function (parameters) {               
    
    /**     
     * Build a new THREE.MeshBasicMaterial initialized with <code>this.parameters</code>
     * @author Stefano Gabriele
     */
    this._build = function () {
        this.threeMaterial = new THREE.MeshBasicMaterial(this.parameters);        
    };
            
    MLJ.core.Material.call(this, parameters);
};

MLJ.extend(MLJ.core.Material, MLJ.core.BasicMaterial);

MLJ.core.ShaderMaterial = function (parameters) {    
           
    /**     
     * Build a new THREE.MeshPhongMaterial initialized with <code>this.parameters</code>
     * @author Stefano Gabriele
     */
    this._build = function () {
        this.threeMaterial = new THREE.MeshPhongMaterial(this.parameters);        
    };
       
    MLJ.core.Material.call(this, parameters);
};

MLJ.extend(MLJ.core.Material, MLJ.core.ShaderMaterial);
