/**
 * @class MeshLabJsGui
 * @name MeshLabJsGui
 * @description Represent a Gui which user interact with MeshLabJs
 * @author maurizio.idini@gmail.com
 */
function MeshLabJsGui() {
}
MeshLabJsGui.prototype = {
    /**
     * Call methods for creation gui
     */
    loadGui: function () {
        this.declareDatGui();
        this.createDatGui();
        this.loadPlugin();
        document.getElementById('files').addEventListener('change', this.loadFileCreateElement, false);
    },
    /**
     *	Declare elements of dat.GUI
     */
    declareDatGui: function () {
        fileExtension = 'off';
        fileNameGlobal = 'mesh';
        var nameMesh = 'mesh.' + fileExtension;
        this.masterGui = function () {
            this.OpenMesh = function () {
                //simulate a click in a hidden html button
                $('#files').click();
            }; //end OpenMesh di dat.gui

            this.SaveMesh = function () {
                var fileName = fileNameGlobal.split('.');
                //call a SaveMesh contructon from c++ Saver.cpp class
                var Save = new Module.SaveMesh(ptrMesh);
                //call a saveMesh method from above class
                var resSave = Save.saveMesh(fileName[fileName.length - 1]);
                //readFile is a Emscripten function which read a file into memory by path
                var file = FS.readFile('/' + fileName[fileName.length - 1]);
                //create a Blob by filestream
                var blob = new Blob([file], {type: "application/octet-stream"});
                //call a saveAs function of FileSaver Library
                saveAs(blob, fileNameGlobal);
            };//end saveMesh
        };//end mastergui

    },
    /**
     * Create dat.Gui user interface
     */
    createDatGui: function () {
        gui = new dat.GUI({autoPlace: false});
        document.body.appendChild(gui.domElement);
        var master = new this.masterGui();
        gui.add(master, 'OpenMesh').name('Open Mesh');
        gui.add(master, 'SaveMesh').name('Save Mesh');

// RENDER CONTROLS _________________________________________________

        var rc = {
            'wireframe': false,
            'wfLineWidth': 1,
            'wfcolor': '#fc1b1b',
            'alight': false,
            'acolor': '#111111',
            'dlight': false,
            'dcolor': '#ffffff',
            'posx': 1,
            'posy': 1,
            'posz': 1,
            'flat': false,
            'smooth': false,
            'Shading': 'shading',
            'color': '#a0a0a0',
            'emissive': '#7c7b7b',
            'specular': '#ffffff',
            'Shininess': 100,
            'vertexdots': false,
            'vdcolor': '#fc1b1b',
            'vdsize': 1.0,
            'hlight': true,
            'hcolor': '#ffffff',
            'hintensity': 0.5
        };

        var renderControls = gui.addFolder('Render');
        renderControls.open();

        //AMBIENT LIGHT
        var alightFolder = renderControls.addFolder('Ambient Light');
        alightFolder.open();

        alightFolder.add(rc, 'alight').name('on / off')
                .onFinishChange(function (value) {
                    ambientLight.setOn(value);
                });

        alightFolder.addColor(rc, 'acolor').name('Light color')
                .onChange(function (value) {
                    ambientLight.setColor(value);
                });

        //HEADLIGHT
        var headlightFolder = renderControls.addFolder('Headlight');
        headlightFolder.open();

        headlightFolder.add(rc, 'hlight').name('on / off')
                .onFinishChange(function (value) {
                    headlight.setOn(value);
                });

        headlightFolder.addColor(rc, 'hcolor').name('Light color')
                .onChange(function (value) {
                    headlight.setColor(value);
                });

        headlightFolder.add(rc, 'hintensity', 0.0, 20, 0.1).name('Intensity')
                .onChange(function (value) {
                    headlight.setIntensity(value);
                });

        //DIRECTIONAL LIGHT
//        var dlightFolder = renderControls.addFolder('Directional Light');
//        //dlightFolder.open();
//
//        dlightFolder.add(rc, 'dlight').name('on / off')
//                .onFinishChange(function (value) {
//                    directionalLight.setOn(value);
//                });
//
//        dlightFolder.addColor(rc, 'dcolor').name('Light color')
//                .onChange(function (value) {
//                    directionalLight.setColor(value);
//                });
//
//        dlightFolder.add(rc, 'posx', -700, 700, 1).name('X position')
//                .onChange(function (value) {
//                    directionalLight.setPosX(value);
//                });
//
//        dlightFolder.add(rc, 'posy', -700, 700, 1).name('Y position')
//                .onChange(function (value) {
//                    directionalLight.setPosY(value);
//                });
//
//        dlightFolder.add(rc, 'posz', -700, 700, 1).name('Z position')
//                .onChange(function (value) {
//                    directionalLight.setPosZ(value);
//                });

        //MATERIAL
        var materialFolder = renderControls.addFolder('Mesh material');
        //materialFolder.open();

        materialFolder.addColor(rc, 'color').name('Diffuse color')
                .onChange(function (value) {
                    material.setColor(value);
                });

        materialFolder.addColor(rc, 'emissive').name('Emissive color')
                .onChange(function (value) {
                    material.setEmissive(value);
                });

        materialFolder.addColor(rc, 'specular').name('Specular color')
                .onChange(function (value) {
                    material.setSpecular(value);
                });

        materialFolder.add(rc, 'Shading').options({"Flat": 1, "Smooth": 2})
                .onChange(function (value) {
                    material.setShading(value);
                });

        materialFolder.add(rc, 'Shininess', 0, 100, 1)
                .onChange(function (value) {
                    material.setShininess(value);
                });

        //Wireframe
        var wireframeFolder = renderControls.addFolder('Wireframe');
        wireframeFolder.open();

        wireframeFolder.add(rc, 'wireframe').name('Show / hide')
                .onFinishChange(function (value) {
                    wireframe.setWireframe(value);
                });

        wireframeFolder.add(rc, 'wfLineWidth', 1, 10, 0.5).name('Line width')
                .onChange(function (value) {
                    setWireframeLineWidth(value);
                });

        wireframeFolder.addColor(rc, 'wfcolor').name('Color')
                .onChange(function (value) {
                    wireframe.setColor(value);
                });

        //Vertex dots
        var verticesFolder = renderControls.addFolder('Vertices');
        verticesFolder.open();

        verticesFolder.add(rc, 'vertexdots').name("Show / hide")
                .onChange(function (value) {
                    vertexDots.setOn(value);
                });

        verticesFolder.addColor(rc, 'vdcolor').name('Vertex color')
                .onChange(function (value) {
                    vertexDots.setColor(value);
                });

        verticesFolder.add(rc, 'vdsize', 1, 10, 0.5).name('Vertex size')
                .onChange(function (value) {
                    vertexDots.setSize(value);
                });

//_______________________________________________ END RENDER CONTROLS

        folderFilter = gui.addFolder('Filters');

    },
    /**
     * Update elements of dat.GUI manually 
     * (required for correct visualization)
     */
    updateDatGui: function () {
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    },
    /**
     * Load plugin async 
     * (required for function call order)
     */
    loadPlugin: function () {
        SmoothPlugin();
        RefinePlugin();
        RandomPlugin();
    },
    /**
     * Call functions 'handleFileSelect', 'addElementOpenedMesh' and 'OnClickSelectCurrent'
     * (required for async function call)
     */
    loadFileCreateElement: function (evt) {
        var mlgui = new MeshLabJsGui();
        mlgui.handleFileSelect(evt);
        mlgui.addElementOpenedMesh();
        mlgui.OnClickSelectCurrent(fileNameGlobal);

    },
    /**
     * Function for load file and pass it on functions for creation mesh
     * Function called by FileReader EventHandler
     * @param {Object} evt - Event Handled
     */
    handleFileSelect: function (evt) {
        if (evt.target.files.length != 0) {
            var files = evt.target.files; // FileList object
            console.time("File Reading Time");
            //extract format file
            var oldFileName = files[0].name;
            var fileName = oldFileName;
            var format = fileName.split(".");
            var ext = format[format.length - 1];
            fileName = "tmp." + ext;
            format[format.length - 1] = '';
            fileNameGlobal = files[0].name;
            switch (ext) {
                case "off":
                {
                    fileExtension = 'off';
                    break;
                }
                case "obj":
                {
                    fileExtension = 'obj';
                    break;
                }
                case "ply":
                {
                    fileExtension = 'ply';
                    break;
                }
                case "stl":
                {
                    fileExtension = 'stl';
                    break;
                }
                case "vmi":
                {
                    fileExtension = 'vmi';
                    break;
                }
                default :
                {
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
                console.log("Read file", fileLoadedEvent.target.result.byteLength);
                console.timeEnd("File Reading Time");
                console.time("Parsing mesh Time");
                var Opener = new Module.Opener();
                var resOpen = Opener.openMesh(fileName);
                if (resOpen != 0) {
                    alert("Ops! Error in Opening File.\nTry again.");
                    FS.unlink(fileName);
                } else {
                    console.timeEnd("Parsing Mesh Time");
                    ptrMesh = Opener.getMesh();
                    var mlRender = new MeshLabJsRender();
                    mlRender.createMesh(ptrMesh, files[0].name);
                    mlRender.render();
                    FS.unlink(fileName);
                    openMesh[files[0].name] = ptrMesh;
                }//end else
            }; //end Onload
            fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
        }
    },
    /**
     * Add row elements on right Gui of Opened Mesh
     */
    addElementOpenedMesh: function () {
        //create new row of table, new checkbox and relative label, append these
        var mlgui = new MeshLabJsGui();
        var name = fileNameGlobal;
        var pointer = openMesh[name];
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
        row.setAttribute('onclick', 'var m = new MeshLabJsGui(); m.OnClickCheckBox("' + name + '");  ');
        coloumn.setAttribute('onclick', 'var m = new MeshLabJsGui(); m.OnClickSelectCurrent("' + name + '");  ');
    },
    /**
     * Function which show/hide mesh when user click on checkbox
     * @param {String} name Mesh file name
     */
    OnClickCheckBox: function (name) {
        var isChecked = document.getElementsByName(name)[0].checked;
        var mlRender = new MeshLabJsRender();
        if (isChecked == false) {
            mlRender.hideMeshByName(name);
        } else {
            mlRender.showMeshByName(name);
            document.getElementsByName(name)[0].checked = true;
        }
    },
    /**
     * Function which select mesh when user click on element of rigth
     * @param {String} name Mesh file name
     */
    OnClickSelectCurrent: function (name) {
        var cells = document.getElementById("field").getElementsByTagName("td");
        for (var i = 1; i < cells.length; i++) {
            cells[i].style.borderLeftColor = "#111";
        }
        fileNameGlobal = name;
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === fileNameGlobal) {
                var infoArea = document.getElementById('infoMesh');
                infoArea.value = scene.children[i].infoMesh + scene.children[i].VNFN;
                break;
            }
        }
        document.getElementById(name).style.borderLeftColor = "yellow";
    }
};
/**
 * Asssociative array of opened mesh, key is name, value is pointer
 * @type {Array.<string, number>}
 */
openMesh = new Object();
