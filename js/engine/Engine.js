        var camera, scene, renderer, controls, time, mesh, ptrMesh, infoMeshStr;

        var infoArea = document.getElementById('infoMesh');

        var openedMesh=[];
        var fileExtension='off';
        var fileNameGlobal='mesh';

//---------------------------------Declaration DAT.GUI
        var nameMesh='mesh.'+fileExtension;
        var openedMeshController;
        var masterGui = function() {
            this.OpenMesh = function() {
                $('#files').click();  
            }; //end OpenMesh di dat.gui

            this.SaveMesh = function () {
                var fileName = fileNameGlobal.split('.');
                var Save = new Module.SaveMesh(ptrMesh);
                var resSave = Save.saveMesh(fileName[fileName.length-1]);  
                var file = FS.readFile('/'+fileName[fileName.length-1]); 
                var blob = new Blob([file], {type: "application/octet-stream"});
                saveAs(blob, fileNameGlobal);    
            };//end saveMesh
        };//end mastergui
        

        var gui = new dat.GUI({ autoPlace: false });
        document.body.appendChild(gui.domElement);
        var master = new masterGui();
        gui.add(master, 'OpenMesh').name('Open Mesh');
        gui.add(master, 'SaveMesh').name('Save Mesh');
        var folderFilter = gui.addFolder('Filters');
                 

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
                infoArea.value = '';
                infoMeshStr = "Current Mesh: "+files[0].name+"\n";
                infoMeshStr += "Size Mesh: "+files[0].size+" Bytes\n";
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
                    console.timeEnd("Parsing Mesh Time");
                    ptrMesh = Opener.getMesh();
                    createMesh(ptrMesh);
                    animate();

                    FS.unlink(fileName);

                    openedMesh[files[0].name]=ptrMesh;

                    //create new row of table, new checkbox and relative label, append these
                    uncheckAllCheckboxes();
                    document.getElementsByTagName('input[type=checkbox]');
                    var row = document.createElement('tr');
                    var coloumn = document.createElement('td');
                    coloumn.name = files[0].name;
                    var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.checked = true;
                    checkbox.name = files[0].name;
                    checkbox.value = ptrMesh;
                    coloumn.appendChild(checkbox);
                    coloumn.innerHTML += files[0].name;
                    document.getElementById('field').appendChild(row).appendChild(coloumn);
                    document.getElementsByName(files[0].name)[0].checked = true;
                    row.addEventListener('click',function() { OnClickCheckBox(files[0].name); });

                    }//end else
                }; //end Onload

                fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
            }
            document.getElementById('files').addEventListener('change', handleFileSelect, false);
            
            function OnClickCheckBox(name){
                var isChecked = document.getElementsByName(name)[0].checked;
                if(isChecked==false){
                    scene.remove(mesh);
                    uncheckAllCheckboxes();
                } else {
                    uncheckAllCheckboxes();
                    var meshToPointer = openedMesh[name];
                    createMesh(meshToPointer);
                    document.getElementsByName(name)[0].checked = true;
                    fileNameGlobal = name;
                }
            }

            function uncheckAllCheckboxes() {
                var c = document.getElementById('field').getElementsByTagName('input');
                    for (var i = 0; i < c.length; i++) {
                        if (c[i].type == 'checkbox') {
                            c[i].checked = false;
                        }
                    }
            }


