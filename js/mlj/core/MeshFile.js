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
        console.time("Time to create mesh: ");
        _this.threeMesh = new THREE.Mesh(buildMeshGeometry());
        console.timeEnd("Time to create mesh: ");
        
        for(var name in MLJ.core.defaults) {
            _this.overlaysParams.set(name,
                jQuery.extend(true, {}, MLJ.core.defaults[name]));                        
        }
        
    }
    
    function buildMeshGeometry() {
        _this.VN = cppMesh.VN();
        _this.vert = cppMesh.getVertexVector();
        _this.FN = cppMesh.FN();
        _this.face = cppMesh.getFaceVector();

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
    
    function geometryNeedUpdate() {
        _this.threeMesh.geometry.verticesNeedUpdate = true;
        _this.threeMesh.geometry.elementsNeedUpdate = true;
        _this.threeMesh.geometry.normalsNeedUpdate = true;
        _this.threeMesh.geometry.computeFaceNormals();
        _this.threeMesh.geometry.computeVertexNormals();
    }    
    
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
     * Returns the ptr to the cppMesh object
     * @returns {THREE.Mesh} this THREE.Mesh object
     *  
     */
    this.ptrMesh = function () {
        return _this.cppMesh.getMeshPtr();
    }
    
    /**
     * Returns the THREE.Matrix4 object that is stored with the mesh
     * @returns {Matrix4}
     *  
     */
    this.ptrMesh = function () {
        THREE.Matrix4.elements = THREE.Matrix4();
        return _this.cppMesh.getMeshPtr();
    }
    
    
    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {
        
        FS.unlink(name);
        
        var iter = _this.overlays.iterator();
        var mesh;
        while(iter.hasNext()) {
            mesh = iter.next();
            mesh.geometry.dispose();
            mesh.material.dispose();
            
            if (mesh.texture) {
                mesh.texture.dispose();            
                mesh.texture = null;
            }
        }
        
        _this.threeMesh.geometry.dispose();
        _this.threeMesh.material.dispose();
        
        if (_this.threeMesh.texture) {
            _this.threeMesh.texture.dispose();            
            _this.threeMesh.texture = null;
        }
        
        _this.cppMesh.delete();
        
        _this.name = _this.VN = _this.vert = _this.FN =
        _this.face = _this.threeMesh = _this.properties = _this.overlays = 
        _this.overlaysParams =  _this = null;       
    };
    
    init();
}
