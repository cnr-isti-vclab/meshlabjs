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
 * @file Defines the functions to manage files
 * @author Stefano Gabriele
 */

/**
 * MLJ.core.File namespace
 * @namespace MLJ.core.File
 * @memberOf MLJ.core
 * @author Stefano Gabriele
 */
MLJ.core.File = {
    ErrorCodes: {
        EXTENSION: 1
    },
    SupportedExtensions: {
        OFF: ".off",
        OBJ: ".obj",
        PLY: ".ply",
        STL: ".stl"        
    }
};

(function () {
    var _openedList = new MLJ.util.AssociativeArray();
    var nameList = new MLJ.util.AssociativeArray();

    function isExtensionValid(extension) {

        switch (extension) {
            case ".off":
            case ".obj":
            case ".ply":
            case ".stl":
                return true;
        }

        return false;
    }

    function loadFile(file, onLoaded) {
        console.time("Read mesh file");

        if (!(file instanceof File)) {
            console.error("MLJ.file.open(file): the parameter 'file' must be a File instace.");
            onLoaded(false);
        }

        //Add file to opened list
        _openedList.set(file.name, file);

        //Extract file extension
        var pointPos = file.name.lastIndexOf('.');
        var extension = file.name.substr(pointPos);

        //Validate file extension
        if (!isExtensionValid(extension)) {
            var err = new MLJ.Error(
                    MLJ.core.File.ErrorCodes.EXTENSION,
                    "MeshLabJs allows file format '.off', '.ply', '.obj' and '.stl'. \nTry again."
                    );

            MLJ.setError(err);

            onLoaded(false);
            return;
        }

        //Read file
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onloadend = function (fileLoadedEvent) {
            console.log("Read file " + file.name + " size " + fileLoadedEvent.target.result.byteLength + " bytes");
            console.timeEnd("Read mesh file");
            //  Emscripten need a Arrayview so from the returned arraybuffer we must create a view of it as 8bit chars
            var int8buf = new Int8Array(fileLoadedEvent.target.result);
            FS.createDataFile("/", file.name, int8buf, true, true);
            
            var mf = MLJ.core.File.createCppMeshFile(file.name);
            console.time("Parsing Mesh Time");
            var resOpen = mf.cppMesh.openMesh(file.name);
            if (resOpen !== 0) {
                console.log("Ops! Error in Opening File. Try again.");
                FS.unlink(file.name);
                onLoaded(false);
            }
            console.timeEnd("Parsing Mesh Time");            
            onLoaded(true, mf);            
            FS.unlink(file.name);

        }; //end onloadend
    }

    /**
     * Reloads a mesh file by name
     * @param {String} name The name of the mesh file needs to be reloaded
     * @memberOf MLJ.core.File
     * @fires MLJ.core.File#MeshFileReloaded
     * @author Stefano Gabriele
     */
    this.reloadMeshFileByName = function (name) {
        var file = _openedList.getByKey(name);

        if (file === undefined) {
            console.warn("MLJ.file.reloadMeshFile(name): the scene not contains file '" + name + "'.");
            return false;
        }

        loadFile(file, function (loaded, meshFile) {
            if (loaded) {

                /**
                 *  Triggered when a mesh file is reloaded
                 *  @event MLJ.core.File#MeshFileReloaded
                 *  @type {Object}
                 *  @property {MLJ.core.MeshFile} meshFile The reloaded mesh file
                 *  @example
                 *  <caption>Event Interception:</caption>
                 *  $(document).on("MeshFileReloaded",
                 *      function (event, meshFile) {
                 *          //do something
                 *      }
                 *  );
                 */
                $(document).trigger("MeshFileReloaded", [meshFile]);
            } else {
                //else error in file reading
                console.log(MLJ.getLastError().message);
            }
        });
    };

    /**
     * Creates a new mesh file using the c++ functions bound to JavaScript
     * @param {String} name The name of the new mesh file
     * @memberOf MLJ.core.File
     * @returns {MLJ.core.MeshFile} The new mesh file
     * @author Stefano Gabriele
     */
    this.createCppMeshFile = function (name) {

        var nameAmount = nameList.getByKey(name);
        if (nameAmount === undefined) {
            nameList.set(name, 0);
        } else {
            nameAmount++;
            nameList.set(name, nameAmount);
            name += " " + nameAmount;
        }

        var CppMesh = new Module.CppMesh();
        var mf = new MLJ.core.MeshFile(name, CppMesh);

        //Indicates that the mesh is created by c++
        mf.cpp = true;
        return mf;
    };

    /**
     * Opens a mesh file or a list of mesh files     
     * @param {(File | FileList)} file A single mesh file or a list of mesh files
     * @memberOf MLJ.core.File
     * @fires MLJ.core.File#MeshFileOpened
     * @author Stefano Gabriele
     */
    this.openMeshFile = function (file) {
        $(file).each(function (key, value) {
            loadFile(value, function (loaded, meshFile) {
                if (loaded) {
                    /**
                     *  Triggered when a mash file is opened
                     *  @event MLJ.core.File#MeshFileOpened
                     *  @type {Object}
                     *  @property {MLJ.core.MeshFile} meshFile The opened mesh file
                     *  @example
                     *  <caption>Event Interception:</caption>
                     *  $(document).on("MeshFileOpened",
                     *      function (event, meshFile) {
                     *          //do something
                     *      }
                     *  );
                     */
                    $(document).trigger("MeshFileOpened", [meshFile]);
                } else {//else error in file reading
                    console.log(MLJ.getLastError().message);
                }
            });
        });
    };

    this.saveMeshFile = function (meshFile, fileName) {
        
        //Create data file in FS
        var int8buf = new Int8Array(meshFile.ptrMesh());
        FS.createDataFile("/", fileName, int8buf, true, true);
        
        //call a SaveMesh contructon from c++ Saver.cpp class
        var Save = new Module.SaveMesh(meshFile.ptrMesh());
        //call a saveMesh method from above class
        var resSave = Save.saveMesh(fileName);
        
        //handle errors ...        
        
        //readFile is a Emscripten function which read a file into memory by path
        var file = FS.readFile(fileName);
        //create a Blob by filestream
        var blob = new Blob([file], {type: "application/octet-stream"});
        //call a saveAs function of FileSaver Library
        saveAs(blob, fileName);
        
        FS.unlink(fileName);
    };        

}).call(MLJ.core.File);
