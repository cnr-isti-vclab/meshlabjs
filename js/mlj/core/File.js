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
MLJ.core.File = {
    ErrorCodes: {EXTENSION: 1},
    openedList: new MLJ.util.AssociativeArray()
};

(function () {

    var nameList = new MLJ.util.AssociativeArray();

    function isExtensionValid(extension) {

        switch (extension) {
            case ".off":
            case ".obj":
            case ".ply":
            case ".stl":
            case ".vmi":
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
        MLJ.core.File.openedList.set(file.name, file);

        //Extract file extension
        var pointPos = file.name.lastIndexOf('.');
        var extension = file.name.substr(pointPos);

        //Validate file extension
        if (!isExtensionValid(extension)) {
            var err = new MLJ.Error(
                    MLJ.core.meshfile.ErrorCodes.EXTENSION,
                    "MeshLabJs allows file format '.off', '.ply', '.vmi', '.obj' and '.stl'. \nTry again."
                    );

            MLJ.setError(err);

            onLoaded(false);
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

            console.time("Parsing Mesh Time");
            var Opener = new Module.Opener();
            var resOpen = Opener.openMesh(file.name);
            if (resOpen != 0) {
                console.log("Ops! Error in Opening File. Try again.");
                FS.unlink(file.name);

                onLoaded(false);
            }

            console.timeEnd("Parsing Mesh Time");
            var ptrMesh = Opener.getMesh();

            var mf = new MLJ.core.MeshFile(file.name, ptrMesh);

            FS.unlink(file.name);

            onLoaded(true, mf);

        }; //end onloadend
    }

    this.reloadMeshFileByName = function (name) {
        var file = MLJ.core.File.openedList.getByKey(name);

        if (file === undefined) {
            console.warn("MLJ.file.reloadMeshFile(name): the scene not contains file '" + name + "'.");
            return false;
        }

        loadFile(file, function (loaded, meshFile) {
            if (loaded) {
                //Trigger mesh opened event
                $(document).trigger(
                        MLJ.events.File.MESH_FILE_RELOADED,
                        [meshFile]);
            }
            //else error in file reading
        });
    };

    this.createCppMeshFile = function (name, builder) {

        var nameAmount = nameList.getByKey(name);
        if (nameAmount === undefined) {
            nameList.set(name, 0);
        } else {
            nameAmount++;
            nameList.set(name, nameAmount);
            name += " " + nameAmount;
        }

        var Opener = new Module.Opener();
        var ptrMesh = Opener.getMesh();
        var mf = new MLJ.core.MeshFile(name, ptrMesh);

        //Indicates that the mesh is created by c++
        mf.cpp = true;
        return mf;
    };

    this.openMeshFile = function (file) {
        $(file).each(function (key, value) {
            loadFile(value, function (loaded, meshFile) {
                if (loaded) {
                    //Trigger mesh opened event
                    $(document).trigger(
                            MLJ.events.File.MESH_FILE_OPENED,
                            [meshFile]);
                } else {//else error in file reading
                    console.log(MLJ.getLastError().message);
                }
            });
        });
    };

}).call(MLJ.core.File);
