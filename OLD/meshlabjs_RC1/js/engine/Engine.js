        var camera, scene, renderer, controls, time, mesh, ptrMesh;


        var openedMesh=[];
        var listMesh = new Object ();
        var fileExtension='off';
        var fileNameGlobal='mesh';
        var countOpenedMesh=0;


//---------------------------------Declaration DAT.GUI
        var nameMesh='mesh.'+fileExtension;
        var openedMeshController;
        var masterGui = function() {
            this.OpenMesh = function() {
                $('#files').click();    
                // addOpenedMesh();
            }; //end OpenMesh di dat.gui
            this.meshName = nameMesh;
            this.SaveMesh = function () {
                var fileName = master.meshName.split('.');
                var Save = new Module.SaveMesh(ptrMesh);
                var resSave = Save.saveMesh(fileName[fileName.length-1]);  
                var file = FS.readFile('/'+fileName[fileName.length-1]); 
                console.log("Save mesh with result "+resSave);
                var blob = new Blob([file], {type: "application/octet-stream"});
                var fileName = nameMesh;
                saveAs(blob, nameMesh);     
                // FS.unlink(fileName[fileName.length-1]);
            };//end saveMesh
        };//end mastergui
        

        var gui = new dat.GUI({ autoPlace: false });
        document.getElementById('controls').appendChild(gui.domElement);
        var master = new masterGui();
        gui.add(master, 'OpenMesh').name('Open Mesh');
        var nameController = gui.add(master, 'meshName').name('Mesh Name');
        nameController.onChange(function(value) {
            nameMesh=value;
        });
        gui.add(master, 'SaveMesh').name('Save Mesh');

                 

        function updateDatGui(){
            for (var i in gui.__controllers) {
                    gui.__controllers[i].updateDisplay();
            }

        }

//-----------------------------End Declaration DAT.GUI


        

        //init three.js render
        init();
        
        
        function handleFileSelect(evt) {
            var files = evt.target.files; // FileList object
                console.log("Name: ", files[0].name);
                console.log("Size: ", files[0].size);
                console.time("File Reading Time");

                //extract format file
                var oldFileName = files[0].name;
                var fileName = oldFileName;
                var format = fileName.split(".");
                var ext = format[format.length-1];
                fileName= "tmp." + ext;
                format[format.length-1] = '';
                fileNameGlobal = oldFileName;
                switch(ext){
                    case "off": {fileExtension='off'; break;}
                    case "obj": {fileExtension='obj'; break;}
                    case "ply": {fileExtension='ply'; break;}
                    case "stl": {fileExtension='stl'; break;}
                    case "vmi": {fileExtension='vmi'; break;}
                    default : {
                        alert("MeshLabJs allows file format '.off', '.ply', '.vmi', '.obj' and '.stl'. \nTry again.")
                        return;
                    }
                }
                
                //update file name in a meshName textfield
                // fileNameGlobal = fileNameGlobal+'.'+fileExtension;
                master.meshName= fileNameGlobal;
                updateDatGui();
                //end update

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
                if(resOpen!=0){
                    alert("Ops! Error in Opening File.\nTry again.");
                    FS.unlink(fileName);
                }
                else {
                    console.log("Open mesh with result "+resOpen);
                    console.timeEnd("Parsing mesh Time");
                    ptrMesh = Opener.getMesh();
                    createMesh(ptrMesh);
                    animate();

                    FS.unlink(fileName);

                    var meshOpenVar = {
                       mesh0 : files[0].name
                        //end   
                   }; 

                   //update dropdown
                   listMesh[files[0].name] = countOpenedMesh;
                   if(countOpenedMesh!=0) gui.__controllers[3].remove();
                   openedMeshController = gui.add(meshOpenVar,'mesh0',listMesh).name('Opened Mesh');
                   openedMeshController.onChange( function(value) {
                       var fileName = fileNameGlobal;
                       var int8buf = new Int8Array(openedMesh[value]); 
                       FS.createDataFile("/", fileName, int8buf, true, true);
                        var Opener = new Module.Opener();
                        var resOpen = Opener.openMesh(fileName);    
                        console.log("Open mesh with result "+resOpen);
                        console.timeEnd("Parsing mesh Time");
                        ptrMesh = Opener.getMesh();
                        createMesh(ptrMesh);
                        animate();
                        FS.unlink(fileName);
                    });
                    updateDatGui();
                    openedMesh[countOpenedMesh]=int8buf;
                    countOpenedMesh++;


                    }//end else
                }; //end Onload

                fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
            }
            document.getElementById('files').addEventListener('change', handleFileSelect, false);
