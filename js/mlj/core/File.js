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
    },
    SupportedSketchfabExtensions: {
        OBJ: ".obj",
        PLY: ".ply",
        STL: ".stl"
    },
    SupportedWebsites: {
        SKF: "Sketchfab"
    }
};

(function () {
    var _openedList = new MLJ.util.AssociativeArray();

    function isExtensionValid(extension) {

        switch (extension) {
            case ".off":
            case ".obj":
            case ".ply":
            case ".stl":
            case ".zip":
                return true;
        }

        return false;
    }

    /**
     * Loads 'file' in the virtual file system as an Int8Array and reads it into the layer 'mf'
     */
    function loadMeshDataFromFile(file, mf, onLoaded) {
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onloadend = function (fileLoadedEvent) {
            console.log("Read file " + file.name + " size " + fileLoadedEvent.target.result.byteLength + " bytes");
            console.timeEnd("Read mesh file");
            //  Emscripten need a Arrayview so from the returned arraybuffer we must create a view of it as 8bit chars
            var int8buf = new Int8Array(fileLoadedEvent.target.result);
            FS.createDataFile("/", file.name, int8buf, true, true);
            console.time("Parsing Mesh Time");
//            console.log("File extension: " +file.name.split('.').pop());
            var resOpen = -1;
            if (file.name.split('.').pop() === "zip")
                resOpen = mf.cppMesh.openMeshZip(file.name);
            else
                resOpen = mf.cppMesh.openMesh(file.name);

            if (resOpen !== 0) {
                console.log("Ops! Error in Opening File. Try again.");
                FS.unlink(file.name);
                onLoaded(false);
            }
            console.timeEnd("Parsing Mesh Time");
            FS.unlink(file.name);
            onLoaded(true, mf);
            MLJ.core.Scene.pushState(mf, MLJ.core.ChangeType.Creation)
            MLJ.core.Scene.history.closeSC();
            console.error(mf.meshH.size());
        };
    }



    /**
     * Opens a mesh file or a list of mesh files     
     * @param {(File | FileList)} toOpen A single mesh file or a list of mesh files
     * @memberOf MLJ.core.File
     * @fires MLJ.core.File#MeshFileOpened
     * @author Stefano Gabriele
     */
    this.openMeshFile = function (toOpen) {
        $(toOpen).each(function (key, file) {
            console.time("Read mesh file");

            if (!(file instanceof File)) {
                console.error("MLJ.file.openMeshFile(file): the parameter 'file' must be a File instace.");
                return;
            }

            //Add file to opened list
            _openedList.set(file.name, file);

            //Extract file extension
            var pointPos = file.name.lastIndexOf('.');
            var extension = file.name.substr(pointPos);

            //Validate file extension
            if (!isExtensionValid(extension)) {
                console.error("MeshLabJs allows file format '.off', '.ply', '.obj' and '.stl'. \nTry again.");
                return;
            }

            var mf = MLJ.core.Scene.createLayer(file.name);

            mf.fileName = file.name;

            loadMeshDataFromFile(file, mf, function (loaded, meshFile) {
                if (loaded) {
                    /**
                     *  Triggered when a mash file is opened
                     *  @event MLJ.core.File#MeshFileOpened
                     *  @type {Object}
                     *  @property {MLJ.core.Layer} meshFile The opened mesh file
                     *  @example
                     *  <caption>Event Interception:</caption>
                     *  $(document).on("MeshFileOpened",
                     *      function (event, meshFile) {
                     *          //do something
                     *      }
                     *  );
                     */
                    $(document).trigger("MeshFileOpened", [meshFile]);
                }
            });

        });
    };

    /**
     * Reloads an existing layer, that is recovers the file linked to the layer
     * and reinitializes the cppMesh of the layer with it
     * @param {MLJ.core.Layer} mf the MeshFile to be reloaded
     * @memberOf MLJ.core.File
     * @fires MLJ.core.File#MeshFileReloaded
     */
    this.reloadMeshFile = function (mf) {
        var file = _openedList.getByKey(mf.fileName);

        if (file === undefined) {
            console.warn("MLJ.file.reloadMeshFile(name): the scene not contains file '" + name + "'.");
            return;
        }

        loadMeshDataFromFile(file, mf, function (loaded, meshFile) {
            if (loaded) {
                /**
                 *  Triggered when a mesh file is reloaded
                 *  @event MLJ.core.File#MeshFileReloaded
                 *  @type {Object}
                 *  @property {MLJ.core.Layer} meshFile The reloaded mesh file
                 *  @example
                 *  <caption>Event Interception:</caption>
                 *  $(document).on("MeshFileReloaded",
                 *      function (event, meshFile) {
                 *          //do something
                 *      }
                 *  );
                 */
                $(document).trigger("MeshFileReloaded", [meshFile]);
            }
        });
    };

    this.saveMeshFile = function (mesh, fileName) {
        //Create data file in FS
        var int8buf = new Int8Array(mesh.ptrMesh());
        FS.createDataFile("/", fileName, int8buf, true, true);

        //call a saveMesh method from above class
        var resSave = mesh.cppMesh.saveMesh(fileName);

        //handle errors ...        

        //readFile is a Emscripten function which read a file into memory by path
        var file = FS.readFile(fileName);
        //create a Blob by filestream
        var blob = new Blob([file], {type: "application/octet-stream"});
        //call a saveAs function of FileSaver Library
        saveAs(blob, fileName);

        FS.unlink(fileName);
    };


    this.saveMeshFileZip = function (mesh, fileName, archiveName) {
        mesh.cppMesh.saveMesh(fileName);
        mesh.cppMesh.saveMeshZip(fileName, archiveName);

        var file = FS.readFile(archiveName);
        var blob = new Blob([file], {type: "application/octet-stream"});
        saveAs(blob, archiveName);

        FS.unlink(archiveName);
        FS.unlink(fileName);
    };


    this.uploadToSketchfab = function (meshFile, meshExt, zipBool, dialog) {
        var meshInfo = meshFile.name.split(".");
        var meshFileName = meshInfo[0] + meshExt;
        var fileName = meshFileName;

        var resSave = meshFile.cppMesh.saveMesh(meshFileName);

        if (zipBool) {
            fileName = meshInfo[0] + ".zip";
            meshFile.cppMesh.saveMeshZip(meshFileName, fileName);
        }

        console.log("Uploading " + meshFileName + " compressed: " + zipBool + " filename: " + fileName);
        var file = FS.readFile(fileName);
        var blob = new Blob([file], {type: "application/octet-stream"});

        var sketchfabApiUrl = 'https://api.sketchfab.com/v2/models';
        var sketchfabModelUrl = 'https://sketchfab.com/models/';
        // var data = document.getElementById( 'the-form' );
        var data = $('#the-form')[0];
        var modelName = data[1].value;
        uploadModel(data);
        $('#status').html('Uploading File...');
        $('#status').removeClass('error');

        FS.unlink(fileName);

        function uploadModel(data) {
//          console.log( 'Begin upload of ' + String( data.modelFile.value ) );  
            var formData = new FormData();

            formData.append("modelFile", blob, fileName);
            formData.append("token", data[0].value);
            formData.append("name", data[1].value);
            formData.append("description", data[2].value + "    \n\Made with **MeshLabJS**, the mesh processing tool on the web. Freely available at [www.meshlabjs.net](http://www.meshlabjs.net)   \n\![MeshLabJS](http://www.meshlabjs.net/img/favicon48.png \"MeshLabJS\")");
            formData.append("tags", data[3].value + " meshlab meshlabjs");
            formData.append("private", data[4].value);
            formData.append("password", data[5].value);
            formData.append("source", "meshlabjs");

//          var entries = formData.entries();
//          console.log(entries.next().value);
//          console.log(entries.next().value);
//          console.log(entries.next().value);
//          console.log(entries.next().value);
//          console.log(entries.next().value);
//          console.log(entries.next().value);
//          console.log(entries.next().value);
//          console.log(entries.next().value);
            var abort = false;
            var upError = false;
            var upSuccess = false;

            var progressBar = $('#progressBar');
            var pBarLabel = $('#pBarLabel');

            var xhr = $.ajax({
                xhr: function ()
                {
                    var xhrProgr = new window.XMLHttpRequest();
                    xhrProgr.upload.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = Math.round((evt.loaded / evt.total) * 100);
                            var percentProgressBar = Math.round((evt.loaded / evt.total) * 50);
                            $('#status').html('Uploading File ' + percentComplete + '%');
                            $('#status').removeClass('error');
                            progressBar.width(percentProgressBar + '%');
                            pBarLabel.html(percentProgressBar + '%');
                        }
                    }, false);
                    return xhrProgr;
                },
                url: sketchfabApiUrl,
                data: formData,
                cache: false,
                source: 'meshlabjs',
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    upSuccess = true;
                    var uid = response.uid;
                    console.log('Begin polling processing status. If successful, the model will be available at ' + sketchfabModelUrl + uid);
                    $('#status').removeClass('error');
                    $('#status').html('Upload successful, polling...');
                    $('#exitUpdateButton').prop('disabled', true);
                    progressBar.width("50%");
                    pBarLabel.html("50%");
                    pollProcessingStatus(uid);
                },
                error: function (response) {
                    if (!abort) {
                        upError = true;
                        console.log('Upload Error!');
                        console.log(JSON.stringify(response));
                        $('#status').html('Upload error!');
                        $('#status').addClass('error');
                    } else {
                        console.log("Upload Aborted");
                        $('#status').html('Upload Aborted!');
                        $('#status').addClass('error');
                    }

                    $('#exitUpdateButton').prop('disabled', false);
                    $('#exitUpdateButton').prop('disabled', false);
                    $('#exitUpdateButton').text('Exit');
                }
            });

            $('#exitUpdateButton').click(function () {
                if (!abort && !upError && !upSuccess) {
                    abort = true;
                    xhr.abort();
                } else if (upError || upSuccess) {
                    dialog.destroy();
                } else {
                    dialog.destroy();
                }
            });
        }

        function pollProcessingStatus(urlid) {
            var url = sketchfabApiUrl + '/' + urlid + '/status?token=' + data.token.value;
            var progressBar = $('#progressBar');
            var pBarLabel = $('#pBarLabel');
            var errors = 0;
            var maxErrors = 10;
            var retry = 0;
            var maxRetries = 50;
            var retryTimeout = 5000;  // milliseconds
            var retryTimeoutSec = retryTimeout / 1000; // seconds
            var complete = false;
            function getStatus() {
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function (response) {
                        retry++;
                        console.log('Got status...')
                        var status = response.processing;

                        switch (status) {
                            case 'PENDING':
                                console.log('Model is in the processing queue. Waiting ' + (retryTimeoutSec) + ' seconds to try again...');
                                $('#status').html('Model in queue...');
                                $('#status').removeClass('error');
                                progressBar.width('60%');
                                pBarLabel.html("60%");
                                break;
                            case 'PROCESSING':
                                console.log('Model is being processed. Waiting ' + (retryTimeoutSec) + ' seconds to try again...');
                                $('#status').html('Model processing...');
                                $('#status').removeClass('error');
                                progressBar.width('75%');
                                pBarLabel.html("75%");
                                break;
                            case 'FAILED':
                                console.log('Model processing failed:');
                                console.log(response.error);
                                $('#status').html('Model processing failed!');
                                $('#status').addClass('error');
                                $('#exitUpdateButton').prop('disabled', false);
                                $('#exitUpdateButton').removeClass("ui-button-disabled ui-state-disabled");
                                $('#exitUpdateButton').text('Exit');
                                complete = true;
                                break;
                            case 'SUCCEEDED':
                                console.log('It worked!');
                                console.log(sketchfabModelUrl + urlid);
                                complete = true;
                                $('#status').removeClass('error');
                                $('#status').html('It worked! See it here: <a href="' + sketchfabModelUrl + urlid + '" target="_blank"> Sketchfab: ' + modelName + '</a>');
                                $('#exitUpdateButton').button().text('Ok');
                                $('#exitUpdateButton').prop('disabled', false);
                                $('#exitUpdateButton').removeClass("ui-button-disabled ui-state-disabled");
                                progressBar.width('100%');
                                pBarLabel.html("100%");
                                break;
                            default:
                                console.log('This message should never appear...something changed in the processing response. See: ' + url);
                        }

                        if (retry < maxRetries && !complete) {
                            setTimeout(getStatus, retryTimeout);
                        } else if (complete) {
                            return;
                        } else if (retry >= maxRetries) {
                            console.log('Polled ' + maxRetries + ' times and it\'s still not finished...quitting');
                        } else {
                            console.log('Something weird happened...quitting');
                        }
                    },
                    error: function (response) {
                        errors++;
                        retry++;
                        if (errors < maxErrors && retry < maxRetries && !complete) {
                            console.log('Error: ' + JSON.stringify(response));
                            console.log('Error getting status ( ' + errors + ' ). Trying again...');
                            setTimeout(getStatus, retryTimeout);
                        } else {
                            console.log('Too many errors...quitting');
                        }
                    }
                });
            }
            getStatus();
        }
    };

}).call(MLJ.core.File);
