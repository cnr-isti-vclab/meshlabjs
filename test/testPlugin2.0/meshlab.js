        var camera, scene, renderer, controls, time, mesh;
        init();


        function handleFileSelect(evt) {
            var files = evt.target.files; // FileList object
            console.log("Name: ", files[0].name);
            console.log("Size: ", files[0].size);
            console.time("File Reading Time");

            //extract format file
            var fileName = files[0].name;
            var format = fileName.split(".");
            format = format[format.length-1];
            fileName= "tmp." + format;
            switch(format){
                case "off": {break;}
                case "obj": {break;}
                case "ply": {break;}
                case "stl": {break;}
                case "vmi": {break;}
                default : {
                    alert("MeshLabJs allows file format '.off', '.ply', '.vmi', '.obj' and '.stl'. \nTry again.")
                    return;
                }
            }
            var meshLab = new Module.MeshLabJs();
            
            var fileToLoad = files[0];
            var fileReader = new FileReader();
            
            fileReader.onload = function (fileLoadedEvent) {

            //  Emscripten need a Arrayview so from the returned arraybuffer we must create a view of it as 8bit chars
                var int8buf = new Int8Array(fileLoadedEvent.target.result); 
                FS.createDataFile("/", fileName, int8buf, true, true);

                // meshLab.setFileName(fileName);

                console.log("Read file", fileLoadedEvent.target.result.byteLength );
                console.timeEnd("File Reading Time");
                console.time("Parsing mesh Time");

                var openMeshResult = meshLab.openMesh(fileName);

                console.timeEnd("Parsing mesh Time");
                console.time("Getting mesh Time");

                var VN = meshLab.getVertexNumber();
                var vert = meshLab.getVertexVector();
                var face = meshLab.getFaceVector();
                var FN = meshLab.getFaceNumber();
                console.timeEnd("Getting mesh Time");
                console.log("openMesh result is "+openMeshResult);
                createMesh(vert,face,VN,FN);
                animate();
                var test = new Module.Test(meshLab.getMesh());
                test.testTest();
                FS.unlink(fileName);
                };

            fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
            }
            document.getElementById('files').addEventListener('change', handleFileSelect, false);
    
