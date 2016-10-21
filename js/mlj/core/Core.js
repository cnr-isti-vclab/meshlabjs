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
    /***************debug****************** */
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube1 = new THREE.Mesh( geometry, material );
    var material1 = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
    var cube2 = new THREE.Mesh( geometry, material1 );
    /*************************************** */

    var _on = true;

    var _light = new THREE.DirectionalLight("#ffffff",0.5);


    /**
     * It represents the origin of the system onto which the 
     * light is anchored, all the trasformations used to rotate
     * the light are applyed to this mesh, the headlight is a child of
     * this mesh.
     * 
     * @type THREE.Object3D
     * @memberOf MLJ.core.Headlight
     */
    var _lightMesh = new THREE.Object3D();

    /***********DEBUG ************ */
    // _lightMesh.add(cube1);
    // _light.add(cube2);
    /************************* */

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

    /**
     * Sets the position of this headlight (relative to the origiMesh)
     * @param {THREE.Vector3}
     * 
     * @author Thomas Alderighi
     */
    this.setPosition = function (pos) {
    //   _light.quaternion.set(0,0,0,1);
    //   _light.updateMatrixWorld(true);
        // _lightMesh.lookAt(pos);
        // _light.position.set(1 , -1, 15);
      _light.position.set(pos.x + 1, pos.y-1, pos.z);
    }

    /**
     * Gets the world position of this headlight 
     * 
     * @author Thomas Alderighi
     */
    this.getWorldPosition = function () {
        _lightMesh.updateMatrixWorld(true);
        return new THREE.Vector3(_light.position.x, _light.position.y, _light.position.z).applyMatrix4(_lightMesh.matrixWorld);
    }

     /**
     * Gets the local position of this headlight (relative to the originMesh)
     * 
     * @author Thomas Alderighi
     */
    this.getLocalPosition = function () {
        return new THREE.Vector3(_light.position.x, _light.position.y, _light.position.z);
    }

    /**
     * Gets a reference to the originMesh of this headlight,
     * the originMesh is needed to apply transformations via the
     * transform control, to control the light movement
     * 
     * @author Thomas Alderighi
     */
    this.getMesh = function () {
        return _lightMesh;
    }

     /**
     * Gets a reference to this headlight,
     * 
     * @author Thomas Alderighi
     */   
    this.getLight = function () {
        return _light;
    }
};
