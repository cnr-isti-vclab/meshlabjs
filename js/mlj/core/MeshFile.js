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
 * @file Defines the MeshFile class
 * @author Stefano Gabriele
 */


/**         
 * @class Creates a new MeshFile 
 * @param {String} name The name of the mesh file
 * @param {CppMesh} cppMesh the CppMesh object
 * @memberOf MLJ.core
 * @author Stefano Gabriele 
 * @example
 * var CppMesh = new Module.CppMesh();
 * var resOpen = Opener.openMesh(file.name);
 * if (resOpen != 0) {
 *      // error in opening ...
 * } else { 
 *      var mf = new MLJ.core.MeshFile(file.name, CppMesh); 
 * } 
 */
MLJ.core.MeshFile = function (name, cppMesh) {
    this.name = name;
    this.ptrMesh = cppMesh.getMesh();
    this.cppMesh = cppMesh;
    this.VN = this.vert = this.FN = this.face = this.threeMesh = null;
    this.properties = new MLJ.util.AssociativeArray();
    //is updated by MLJ.core.Scene and contains overlaying mesh
    this.overlays = new MLJ.util.AssociativeArray();
    //contains overlaying mesh parameters
    this.overlaysParams = new MLJ.util.AssociativeArray();
    var _isRendered = true;
    var _this = this;   
    
    function init() {
//        buildThreeMesh();
        console.time("Time to create mesh: ");
        _this.threeMesh = new THREE.Mesh(buildMeshGeometry());
        console.timeEnd("Time to create mesh: ");
        
        for(var name in MLJ.core.defaults) {
            _this.overlaysParams.set(name,
                jQuery.extend(true, {}, MLJ.core.defaults[name]));                        
        }
        
    }
    
    function buildMeshGeometry() {
        var meshProp = new Module.MeshLabJs(_this.ptrMesh);
        _this.VN = meshProp.getVertexNumber();
        _this.vert = meshProp.getVertexVector();
        _this.FN = meshProp.getFaceNumber();
        _this.face = meshProp.getFaceVector();

        var geometry = new THREE.Geometry();
        for (var i = 0; i < _this.VN * 3; i++) {
            var v1 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            i++;
            var v2 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            i++;
            var v3 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            geometry.vertices.push(new THREE.Vector3(v1, v2, v3));
        }
        for (var i = 0; i < _this.FN * 3; i++) {
            var a = Module.getValue(_this.face + parseInt(i * 4), '*');
            i++;
            var b = Module.getValue(_this.face + parseInt(i * 4), '*');
            i++;
            var c = Module.getValue(_this.face + parseInt(i * 4), '*');
            geometry.faces.push(new THREE.Face3(a, b, c));
        }

        geometry.dynamic = true;

        return geometry;
    }

//    function buildThreeMesh() {
//        console.time("Time to create mesh: ");
////        _this.threeMesh = new THREE.Mesh(buildMeshGeometry(),
////                _this.material.threeMaterial);
//        _this.threeMesh = new THREE.Mesh(buildMeshGeometry());
//        console.timeEnd("Time to create mesh: ");
//    }

    function geometryNeedUpdate() {
        _this.threeMesh.geometry.verticesNeedUpdate = true;
        _this.threeMesh.geometry.elementsNeedUpdate = true;
        _this.threeMesh.geometry.normalsNeedUpdate = true;
        _this.threeMesh.geometry.computeFaceNormals();
        _this.threeMesh.geometry.computeVertexNormals();
    }

//    this.updateMaterial = function(material, updateGeometry) {
//        if(!(material instanceof MLJ.core.Material)) {
//            console.warn("material parameter must be an instance of MLJ.core.Material");
//        } else {            
//            _this.material = material;
//            _this.threeMesh.material = _this.material.threeMaterial;            
//        }
//        
//        if(updateGeometry === true) {            
//            geometryNeedUpdate();
//        }
//        
//        MLJ.core.Scene.render();
//    };    
    
//    this.setRenderingOn = function(on) {
//        _isRendered = on;
//        if(on) {
//          _this.threeMesh.material = _this.material.threeMaterial;
//        } else {
//          _this.threeMesh.material = null;
//        }
//        MLJ.core.Scene.render();
//    };
    
//    this.isRendered = function() {
//        return _isRendered;
//    };
    
    /**
     * Returns this THREE.Mesh object
     * @returns {THREE.Mesh} this THREE.Mesh object
     * @author Stefano Gabriele     
     */
    this.getThreeMesh = function () {
        return this.threeMesh;
    };

    /**
     * Update (rebuild) this THREE.Mesh geometry
     * @author Stefano Gabriele        
     */
    this.updateThreeMesh = function () {

        //Free memory
        _this.threeMesh.geometry.dispose();

        //Rebuild mesh geometry
        _this.threeMesh.geometry = buildMeshGeometry();

        geometryNeedUpdate();
    };
    
    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {
        _this.threeMesh.geometry.dispose();
        _this.threeMesh.material.dispose();
        _this.cppMesh.delete();
        
        _this.name = _this.ptrMesh = _this.VN = _this.vert = _this.FN =
        _this.face = _this.threeMesh = _this.properties = _this.overlays = 
        _this.overlaysParams =  _this = null;
    };
    
    init();
}
