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

MLJ.core = {
    defaults: {},
    setDefaults: function(name, parameters) {
        if(MLJ.core.defaults[name] !== undefined) {
            console.warn("The default properties of "+name+" was overridden.");
        }
        MLJ.core.defaults[name] = parameters;
    },
    getDefaults: function(name) {
        return MLJ.core.defaults[name];
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

    var _on = true;
    //var _light = new THREE.AmbientLight("#ffffff");
    var _light = new THREE.AmbientLight("#808080");

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
    // var _camera = camera;
    /***************debug****************** */
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube1 = new THREE.Mesh( geometry, material );
    var material1 = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
    var cube2 = new THREE.Mesh( geometry, material1 );

    var _on = true;
    var _light = new THREE.DirectionalLight("#ffffff",0.5);

    var _lightMesh = new THREE.Object3D();

    _lightMesh.add(cube1);
    _light.add(cube2);

    // _lightMesh.position.set(camera.position.x, camera.position.y, camera.position.z);
    _lightMesh.position.set(0, 0 ,0);
    _lightMesh.add(_light);
    
    /**
     * Sets this headlight on/off
     * @param {Boolean} on If <code>true</code>, this headlight is enabled;
     * otherwise this headlight is disabled
     * @author Stefano Gabriele
     */
    this.setOn = function (on) {
        if (on) {
            scene.add(_lightMesh);
        } else {
            scene.remove(_lightMesh);
        }
        renderer.render(scene, camera);
    };

    //Init
    this.setOn(_on);

    this.setPosition = function (pos) {
      _light.position.set(pos.x, pos.y, pos.z);
    }
    this.getWorldPosition = function () {
        return new THREE.Vector3(_light.position.x, _light.position.y, _light.position.z).applyMatrix4(_lightMesh.matrixWorld);
    }
    this.getLocalPosition = function () {
        return new THREE.Vector3(_light.position.x, _light.position.y, _light.position.z);
    }
    this.getMesh = function () {
        return _lightMesh;
    }
    this.getLight = () => {
        return _light;
    }
};
