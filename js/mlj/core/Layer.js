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
 */
MLJ.core.Layer = function (id, name, cppMesh) {
    this.name = name;
    this.id = id;
    //boolen for control - if the ptrMesh() was called
    this.calledPtrMesh=false;
    this.getCalledPtrMesh=function()
    {
        return this.calledPtrMesh;
    }
    this.resetCalledPtrMesh=function()
    {
        this.calledPtrMesh=false;
    }
    //deleted property for lazy deletion in scene
    this.deleted = false;
    //history of the mesh in the current layer
    this.meshH = new Module.MeshHistory();
    /**
     * @type {String} - Set if a mesh is read from a file
     * (see {@link MLJ.core.File.openMeshFile}), defaults to the empty string
     */
    this.fileName = "";

    this.cppMesh = cppMesh;
    this.cppMesh.setMeshName(name);
    this.VN = this.FN = this.threeMesh = null;
    // Array of booleans that reflect what are the overlays on or off for this layer.
    this.properties = new MLJ.util.AssociativeArray();
    //is updated by MLJ.core.Scene and contains overlay ThreeJS objects
    this.overlays = new MLJ.util.AssociativeArray();
    //contains overlaying mesh parameters
    this.overlaysParams = new MLJ.util.AssociativeArray();

    var _this = this;

    this.initializeRenderingAttributes = function () {
        for (var pname in MLJ.core.defaults) {
            _this.overlaysParams.set(pname,
                    jQuery.extend(true, {}, MLJ.core.defaults[pname]));
        }

        // Select the appropriate color mode
        var cw = _this.overlaysParams.getByKey("ColorWheel");
        var useIndex = true;
        if (cppMesh.hasPerVertexColor()) {
            cw.mljColorMode = MLJ.ColorMode.Vertex;
        } else if (cppMesh.hasPerFaceColor()) {
            cw.mljColorMode = MLJ.ColorMode.Face;
            useIndex = false;
        }

        console.time("Time to create mesh: ");
        // This Threejs object is used as a 'group' 
        // This node will have as children all the overlays of this layer.
        // It is also used to store in a single place the geometry that the overlay node will refer. 
        // So for example point overlay will use/refer the geometry buffers here defined
        // The node itself will never been rendered (material has the visibile flag == false).
        //  
        _this.threeMesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({visible: false}));
        _this.updateMeshGeometryData(useIndex);
        _this.updateMeshColorData(cw.colorMode);

        console.timeEnd("Time to create mesh: ");

        // If the mesh is a point cloud, enable the "Points" rendering mode
        if (_this.VN > 0 && _this.FN === 0) {
            _this.properties.set("Filled", false);
            _this.properties.set("Points", true);
        }
    };

    this.updateMeshGeometryData = function (indexed) {
        if (indexed === undefined) {
            throw new Error("MLJ.core.Layer.updateMeshGeometryData(): 'indexed' parameter required");
        }

        _this.VN = cppMesh.VN();
        _this.FN = cppMesh.FN();

        var geometry = _this.threeMesh.geometry;
        var bufferptr, bufferData;

        var positionAttrib = null, normalAttrib = null, indexAttrib = null;

        if (indexed) {
            bufferptr = cppMesh.getVertexVector(true);
            bufferData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, bufferptr, _this.VN * 3));
            positionAttrib = new THREE.BufferAttribute(bufferData, 3);
            Module._free(bufferptr);

            if (_this.FN > 0) { // if the mesh has faces, load per vertex normals and the index
                bufferptr = cppMesh.getVertexNormalVector(true);
                bufferData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, bufferptr, _this.VN * 3));
                normalAttrib = new THREE.BufferAttribute(bufferData, 3);
                Module._free(bufferptr);

                bufferptr = cppMesh.getFaceIndex();
                bufferData = new Uint32Array(new Uint32Array(Module.HEAPU8.buffer, bufferptr, _this.FN * 3));
                indexAttrib = new THREE.BufferAttribute(bufferData, 3);
                Module._free(bufferptr);
            }
        } else { // load disconnected triangles
            if (_this.FN === 0) {
                bufferptr = cppMesh.getVertexVector(true); // if there are no faces load unique vertices
                bufferData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, bufferptr, _this.VN * 3));
                positionAttrib = new THREE.BufferAttribute(bufferData, 3);
                Module._free(bufferptr);
            } else {
                bufferptr = cppMesh.getVertexVector(false);
                bufferData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, bufferptr, _this.FN * 9));
                positionAttrib = new THREE.BufferAttribute(bufferData, 3);
                Module._free(bufferptr);

                bufferptr = cppMesh.getVertexNormalVector(false);
                bufferData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, bufferptr, _this.FN * 9));
                normalAttrib = new THREE.BufferAttribute(bufferData, 3)
                Module._free(bufferptr);
            }
        }

        if (geometry.getAttribute('position') !== undefined) {
            delete geometry.attributes.position;
        }
        if (positionAttrib !== null)
            geometry.addAttribute('position', positionAttrib);

        if (geometry.getAttribute('normal') !== undefined) {
            delete geometry.attributes.normal;
        }
        if (normalAttrib !== null)
            geometry.addAttribute('normal', normalAttrib);

        if (geometry.getAttribute('index') !== undefined) {
            delete geometry.attributes.index;
        }
        if (indexAttrib !== null)
            geometry.addAttribute('index', indexAttrib);
        geometry.computeBoundingBox(); //update the boundingbox
    };

    this.updateMeshColorData = function (colorMode) {
        var geometry = _this.threeMesh.geometry;
        var colorptr, colorData;

        if (colorMode === MLJ.ColorMode.Face) {
            if (_this.usingIndexedGeometry()) { // rebuild geometry as disconnected triangles
                _this.updateMeshGeometryData(false);
            }
            colorptr = cppMesh.getFaceColors();
            colorData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, colorptr, _this.FN * 9));
        } else {
            if (!_this.usingIndexedGeometry()) { // rebuild geometry with index
                _this.updateMeshGeometryData(true);
            }
            colorptr = cppMesh.getVertexColors();
            colorData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, colorptr, _this.VN * 3));
        }

        if (geometry.getAttribute('VCGColor') !== undefined) {
            delete geometry.attributes.VCGColor;
        }
        geometry.addAttribute('VCGColor', new THREE.BufferAttribute(colorData, 3));
        Module._free(colorptr);
    };

    this.usingIndexedGeometry = function () {
        return (_this.threeMesh.geometry.getAttribute('index') !== undefined);
    };

    this.updateThreeMesh = function () {
        var cm = _this.overlaysParams.getByKey("ColorWheel").colorMode;
        var useIndex = (cm !== MLJ.ColorMode.Face);
        this.updateMeshGeometryData(useIndex);
        this.updateMeshColorData(cm);
    };

    /**
     * Returns this THREE.Mesh object
     * @returns {THREE.Mesh} this THREE.Mesh object
     * @author Stefano Gabriele     
     */
    this.getThreeMesh = function () {
        return this.threeMesh;
    };

    /**
     * Returns the ptr to the cppMesh object
     * @returns {Number} An emscripten pointer to the VCG mesh of this layer
     */
    this.ptrMesh = function () {
        this.calledPtrMesh=true;
        return _this.cppMesh.getMeshPtr();
    };

    /**
     * Removes the object from memory
     * @author Stefano Gabriele     
     */
    this.dispose = function () {

        var iter = _this.overlays.iterator();
        var mesh;
        while (iter.hasNext()) {
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
                _this.overlaysParams = _this = null;
    };
}
