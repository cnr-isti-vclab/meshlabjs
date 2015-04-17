        var camera, scene, renderer, controls, time, mesh, ptrMesh;
        //declaration of plugin global variable
        var Refine;

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
            
            var fileToLoad = files[0];
            var fileReader = new FileReader();
            
            fileReader.onload = function (fileLoadedEvent) {

            //  Emscripten need a Arrayview so from the returned arraybuffer we must create a view of it as 8bit chars
                var int8buf = new Int8Array(fileLoadedEvent.target.result); 
                FS.createDataFile("/", fileName, int8buf, true, true);

                console.log("Read file", fileLoadedEvent.target.result.byteLength );
                console.timeEnd("File Reading Time");

                console.time("Parsing mesh Time");
                var Opener = new Module.Opener();
                var resOpen = Opener.openMesh(fileName);
                console.log("Open mesh with result "+resOpen);
                console.timeEnd("Parsing mesh Time");
                ptrMesh = Opener.getMesh();
                
                createMesh(ptrMesh);
                animate();

                FS.unlink(fileName);
                };

            fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
            }
            document.getElementById('files').addEventListener('change', handleFileSelect, false);


            //handler for plugin REFINE
            document.getElementById('refinement').addEventListener('click', function refineMesh(){
            console.time("Refine time ");
            Refine = new Module.MyRefine(ptrMesh);
            Refine.myRefine(1);
            console.timeEnd("Refine time ");
            console.time("Update mesh ");
            createMesh(ptrMesh);
            console.timeEnd("Update mesh ");
            });

