/**
 * MeshLabJsGui represent gui object.
 * Attributes are:
 * - openMesh : it's an array of opened mesh
 * - arrInfoMeshOut : it's an array of info mesh
 * Methods are:
 * - loadGui: load the gui
 * - declareDatGui : declare 
 * @constructor
 */
function MeshLabJsGui() { }

MeshLabJsGui.prototype = {
	openMesh : [],
	arrInfoMeshOut : [],

	loadGui : function () {
		this.declareDatGui();
		this.createDatGui();
		this.loadPlugin();
		document.getElementById('files').addEventListener('change', handleFileSelect, false);
	},

	declareDatGui : function () {
		fileExtension = 'off';
		fileNameGlobal = 'mesh';
		var nameMesh = 'mesh.' + fileExtension;
		this.masterGui = function() {
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
	},

	createDatGui : function() {
		gui = new dat.GUI({ autoPlace: false });
		document.body.appendChild(gui.domElement);
		var master = new this.masterGui();
		gui.add(master, 'OpenMesh').name('Open Mesh');
		gui.add(master, 'SaveMesh').name('Save Mesh');
		folderFilter = gui.addFolder('Filters');
	},

	updateDatGui : function () {
	    for (var i in gui.__controllers) {
	        gui.__controllers[i].updateDisplay();
	    }
	},

	loadPlugin : function () {
		var smooth = new SmoothPlugin();
		smooth.loadSmoothPlugin();
		var refine = new RefinePlugin();
		refine.loadRefinePlugin();
		var random = new RandomPlugin();
		random.loadRandomPlugin();
	}

};

function handleFileSelect(evt) {
	if(evt.target.files.length != 0){
        var files = evt.target.files; // FileList object
        console.time("File Reading Time");
        //extract format file
        var oldFileName = files[0].name;
        var fileName = oldFileName;
        var format = fileName.split(".");
        var ext = format[format.length-1];
        fileName = "tmp." + ext;
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
	            var mlRender = new MeshLabJsRender();
	            var meshCreated = mlRender.createMesh(ptrMesh,files[0].name);
	            mlRender.arrThreeJsMeshObj[files[0].name] = meshCreated;
	            // mlRender.addMeshByName(files[0].name);
	            mlRender.render();
	            FS.unlink(fileName);
	            var mlgui = new MeshLabJsGui();
	            mlgui.openMesh[files[0].name] = ptrMesh;
	            mlgui.arrInfoMeshOut[files[0].name] = "Current Mesh: "+files[0].name+"\nSize Mesh: "+files[0].size+" Bytes\n"; 
	            addElementOpenedMesh();
	        }//end else
	    }; //end Onload
    	fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
    }	
}

function addElementOpenedMesh(){
	//create new row of table, new checkbox and relative label, append these
	var mlgui = new MeshLabJsGui();
	var name = fileNameGlobal;
	var pointer = mlgui.openMesh[name];
	document.getElementsByTagName('input[type=checkbox]');
    var row = document.createElement('tr');
    var coloumn = document.createElement('td');
    coloumn.id = name;
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.name = name;
    checkbox.value = pointer;
    coloumn.appendChild(checkbox);
    coloumn.innerHTML += name;
    document.getElementById('field').appendChild(row).appendChild(coloumn);
    document.getElementsByName(name)[0].checked = true;
    row.addEventListener('click',  function() { OnClickCheckBox(name); });
    coloumn.addEventListener('click', function() { OnClickSelectCurrent(name); });
    OnClickSelectCurrent(name);		
}

function OnClickCheckBox(name){
    var isChecked = document.getElementsByName(name)[0].checked;
    var mlRender = new MeshLabJsRender();
    if(isChecked==false){
        mlRender.hideMeshByName(name);
    } else {
        mlRender.showMeshByName(name);
        document.getElementsByName(name)[0].checked = true;
    }
}

function OnClickSelectCurrent (name) {
    var cells = document.getElementById("field").getElementsByTagName("td");
    for (var i=1; i< cells.length; i++) {
        cells[i].style.borderLeftColor = "#111";
    }
    var mlgui = new MeshLabJsGui();
    currentPtr = mlgui.openMesh[name];
    fileNameGlobal = name;
    document.getElementById(name).style.borderLeftColor = "yellow";
    var infoArea = document.getElementById('infoMesh');
    var mlRender = new MeshLabJsRender();
    infoArea.value = mlgui.arrInfoMeshOut[name] + mlRender.arrVNFNMeshOut[name];
}