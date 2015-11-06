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
 * @file Defines the Layer class
 * @author Stefano Gabriele
 */


/**         
 * @class Creates a new Layer 
 * @param {String} name The name of the mesh file
 * @param {CppMesh} cppMesh the CppMesh object
 * @memberOf MLJ.core
 * @example
 */
MLJ.core.Layer = function (name, cppMesh) {
    this.name = name;
    this.fileName = "";
    this.cppMesh = cppMesh;
    this.cppMesh.setMeshName(name);
    this.VN = this.FN = this.threeMesh = null;
    this.properties = new MLJ.util.AssociativeArray();
    //is updated by MLJ.core.Scene and contains overlaying mesh
    this.overlays = new MLJ.util.AssociativeArray();
    //contains overlaying mesh parameters
    this.overlaysParams = new MLJ.util.AssociativeArray();

    
    var _this = this;   
        
    /**
     * Returns this THREE.Mesh object
     * @returns {THREE.Mesh} this THREE.Mesh object
     * @author Stefano Gabriele     
     */
    this.getThreeMesh = function () {
        return this.threeMesh;
    };

    /**
     * updateThreeMesh (rebuild) this THREE.Mesh geometry
     * @author Stefano Gabriele        
     */
    this.updateThreeMesh = function (colorMode) {
        if (colorMode === undefined) colorMode = this.overlaysParams.getByKey("ColorWheel").colorMode;

        _this.updateMeshGeometryData();
        _this.updateMeshColorData(colorMode);
    };


    var _posBuffer = null, _normBuffer = null, _colorBuffer = null;

    this.updateMeshGeometryData = function() {
        _this.VN = cppMesh.VN();
        _this.FN = cppMesh.FN();
        var geometry = _this.threeMesh.geometry;

        if (_posBuffer   !== null) { Module._free(_posBuffer);   _posBuffer   = null; }
        if (_normBuffer  !== null) { Module._free(_normBuffer);  _normBuffer  = null; }

        if (_this.FN === 0) {
            _posBuffer = cppMesh.getVertexVector();
            var particlesArray = new Float32Array(Module.HEAPU8.buffer, _posBuffer, _this.VN*3);
            geometry.addAttribute('position', new THREE.BufferAttribute(particlesArray, 3));
            geometry.computeVertexNormals();//compute fake normals
        } else {
            // load position, normal and color buffers
            _posBuffer = cppMesh.getTriangleSoup();
            var posArray = new Float32Array(Module.HEAPU8.buffer, _posBuffer, _this.FN*9);
            if (geometry.getAttribute('position') !== undefined) {
                delete geometry.attributes.position;
            }
            geometry.addAttribute('position', new THREE.BufferAttribute(posArray, 3));

            _normBuffer = cppMesh.getDuplicatedNormals();
            var normalsArray = new Float32Array(Module.HEAPU8.buffer, _normBuffer, _this.FN*9);
            if (geometry.getAttribute('normal') !== undefined) {
                delete geometry.attributes.normal;
            }
            geometry.addAttribute('normal', new THREE.BufferAttribute(normalsArray, 3));
            
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.normal.needsUpdate = true;
        }

        var _oldvn = geometry.computeVertexNormals;

        geometry.computeVertexNormals = function () { console.warn("computeVertexNormals() suppressed"); };

    }

    this.updateMeshColorData = function (colorMode) {
        var geometry = _this.threeMesh.geometry;

        if (_colorBuffer !== null) { Module._free(_colorBuffer); _colorBuffer = null; }

        if (colorMode === THREE.VertexColors) {
            _colorBuffer = cppMesh.getDuplicatedVertexColors();
        } else {
            _colorBuffer = cppMesh.getDuplicatedFaceColors();
        }
        var colorArray = new Float32Array(Module.HEAPU8.buffer, _colorBuffer, _this.FN*9);
        if (geometry.getAttribute('VCGColor') !== undefined) {
            delete geometry.attributes.VCGColor4b;
        }
        geometry.addAttribute('VCGColor', new THREE.BufferAttribute(colorArray, 3));

        geometry.attributes.VCGColor.needsUpdate = true;

    }

    this.initializeRenderingAttributes = function () {
        for(var name in MLJ.core.defaults) {
            _this.overlaysParams.set(name,
                jQuery.extend(true, {}, MLJ.core.defaults[name]));                        
        }

        // Select the appropriate color mode
        var cw = _this.overlaysParams.getByKey("ColorWheel");
        if (cppMesh.hasPerVertexColor()) {
            cw.meshColorMapping = ColorMapping.Attribute;
            cw.colorMode = THREE.VertexColors;
        } else if (cppMesh.hasPerFaceColor()) {
            cw.meshColorMapping = ColorMapping.Attribute;
            cw.colorMode = THREE.FaceColors;
        }

        console.time("Time to create mesh: ");
        _this.threeMesh = new THREE.Mesh(new THREE.BufferGeometry());
        _this.updateMeshGeometryData();
        _this.updateMeshColorData(cw.colorMode);
        console.timeEnd("Time to create mesh: ");

        // If the mesh is a point cloud, enable the "Points" rendering mode
        if (_this.VN > 0 && _this.FN === 0) {
            _this.properties.set("Filled", false);
            _this.properties.set("Points", true);
        }
    };
    
    /**
     * Returns the ptr to the cppMesh object
     * @returns {THREE.Mesh} this THREE.Mesh object
     *  
     */
    this.ptrMesh = function () {
        return _this.cppMesh.getMeshPtr();
    };
    
    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {
               
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
        
        _this.name = _this.VN = _this.FN =
        _this.threeMesh = _this.properties = _this.overlays = 
        _this.overlaysParams =  _this = null;       
    };
    
}
