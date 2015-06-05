/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.core.file = {
    ErrorCodes: {EXTENSION: 1}
};

(function () {

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

    this.openMeshFile = function (file) {
        console.time("Read mesh file");

        if (!(file instanceof File)) {
            console.error("MLJ.file.open(file): the parameter 'file' must be a File instace.");
            return;
        }

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

            return false;
        }

        //Read file
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onloadend = function (fileLoadedEvent) {
            console.log("Read file", fileLoadedEvent.target.result.byteLength);
            console.timeEnd("Read mesh file");
            //  Emscripten need a Arrayview so from the returned arraybuffer we must create a view of it as 8bit chars
            var int8buf = new Int8Array(fileLoadedEvent.target.result);
            FS.createDataFile("/", file.name, int8buf, true, true);

            console.time("Parsing Mesh Time");
            var Opener = new Module.Opener();
            var resOpen = Opener.openMesh(file.name);
            if (resOpen != 0) {
                alert("Ops! Error in Opening File.\nTry again.");
                FS.unlink(file.name);
            } else {
                console.timeEnd("Parsing Mesh Time");
                var ptrMesh = Opener.getMesh();

                console.time("Getting Mesh Properties Time");
                var meshProp = new Module.MeshLabJs(ptrMesh);
                var mf = new MLJ.core.MeshFile(
                        file.name,
                        meshProp.getVertexNumber(),
                        meshProp.getVertexVector(),
                        meshProp.getFaceNumber(),
                        meshProp.getFaceVector());
                console.timeEnd("Getting Mesh Properties Time");

                //Trigger mesh opened event
                $(document).trigger(
                        MLJ.core.Events.MESH_FILE_OPENED,
                        [mf]);

                FS.unlink(file.name);

                return mf;

            }//end else
        }; //end onloadend
    };
}).call(MLJ.core.file);

