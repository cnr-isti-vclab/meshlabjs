var camera, scene, renderer, controls, ptrMesh;
var openedMesh=[];
var arrThreeJsMeshObj=[];
var arrInfoMeshOut=[];
var arrVNFNMeshOut=[];
var currentPtr;
var fileExtension='off';
var fileNameGlobal='mesh';
var isCurrentMeshVisible;
var infoArea = document.getElementById('infoMesh');

//---------------------------------Declaration DAT.GUI
var nameMesh='mesh.'+fileExtension;
var masterGui = function() {
    this.OpenMesh = function() {
        //simulate a click in a hidden html button
        $('#files').click();  
    }; //end OpenMesh di dat.gui

    this.SaveMesh = function () {
        var fileName = fileNameGlobal.split('.');
        //call a SaveMesh contructon from c++ Saver.cpp class
        var Save = new Module.SaveMesh(ptrMesh); 
        //call a saveMesh method from above class
        var resSave = Save.saveMesh(fileName[fileName.length-1]);  
        //readFile is a Emscripten function which read a file into memory by path
        var file = FS.readFile('/'+fileName[fileName.length-1]); 
        //create a Blob by filestream
        var blob = new Blob([file], {type: "application/octet-stream"});
        //call a saveAs function of FileSaver Library
        saveAs(blob, fileNameGlobal);
    };//end saveMesh
};//end mastergui

//create dat.GUI and add it objects created above
var gui = new dat.GUI({ autoPlace: false });
document.body.appendChild(gui.domElement);
var master = new masterGui();
gui.add(master, 'OpenMesh').name('Open Mesh');
gui.add(master, 'SaveMesh').name('Save Mesh');
var folderFilter = gui.addFolder('Filters');


//function updateDatGui update elements of dat.GUI
function updateDatGui(){
    for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
    }
}

//-----------------------------End Declaration DAT.GUI

//init three.js render
init();

/*
* function handleFileSelect
* function which takes an event as argument, a file reader event from eventhandler, 
* load a file into memory and create a mesh by this file.
*/
function handleFileSelect(evt) {
    if(evt.target.files.length!=0){
        var files = evt.target.files; // FileList object
        arrInfoMeshOut[files[0].name] = "Current Mesh: "+files[0].name+"\n";
        arrInfoMeshOut[files[0].name] += "Size Mesh: "+files[0].size+" Bytes\n";
        console.time("File Reading Time");
        
        //extract format file
        var oldFileName = files[0].name;
        var fileName = oldFileName;
        var format = fileName.split(".");
        var ext = format[format.length-1];
        fileName= "tmp." + ext;
        format[format.length-1] = '';
        fileNameGlobal = files[0].name;
        switch(ext){
            case "off": {fileExtension='off'; break;}
            case "obj": {fileExtension='obj'; break;}
            case "ply": {fileExtension='ply'; break;}
            case "stl": {fileExtension='stl'; break;}
            case "vmi": {fileExtension='vmi'; break;}
            default : {
                alert("MeshLabJs allows file format '.off', '.ply', '.vmi', '.obj' and '.stl'. \nTry again.");
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
        } else {
            console.timeEnd("Parsing Mesh Time");
            ptrMesh = Opener.getMesh();
            var meshCreated = createMesh(ptrMesh,files[0].name);
            arrThreeJsMeshObj[files[0].name] = meshCreated;
            addMeshByName(files[0].name);
            animate();
            FS.unlink(fileName);
            openedMesh[files[0].name]=ptrMesh;
            //create new row of table, new checkbox and relative label, append these
            document.getElementsByTagName('input[type=checkbox]');
            var row = document.createElement('tr');
            var coloumn = document.createElement('td');
            coloumn.id = files[0].name;
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
            coloumn.addEventListener('click', function() { OnClickSelectCurrent(files[0].name);});
            OnClickSelectCurrent(files[0].name);
        }//end else
    }; //end Onload

    fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
    }
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);


/*
* function onClickCheckBox
* function which takes a name as argument and remove or add mesh on/from scene by checkbox value
*/
function OnClickCheckBox(name){
    var isChecked = document.getElementsByName(name)[0].checked;
    if(isChecked==false){
        removeMeshByName(name);
    } else {
        addMeshByName(name);
        document.getElementsByName(name)[0].checked = true;
    }
}
/*
* function onClickSelectCurrent
* function which takes a name as argument and set as selected mesh the element clicked
*/
function OnClickSelectCurrent(name) {
    var cells = document.getElementById("field").getElementsByTagName("td");
    for (var i=1; i< cells.length; i++) {
        cells[i].style.borderLeftColor = "#111";
    }
    currentPtr = openedMesh[name];
    fileNameGlobal = name;
    document.getElementById(name).style.borderLeftColor = "yellow";
    infoArea.value = arrInfoMeshOut[name] + arrVNFNMeshOut[name];
}

