        var camera, scene, renderer, controls, time, mesh, ptrMesh;
        //declaration of plugin global variable
        var Refine,Smooth;

        //array of opened mesh
        var openedMesh=[];
        var countRadio=0;

        //Declaration DAT.GUI
        var masterGui = function() {
            this.OpenMesh = function() {
                $('#files').click(); 
            }; //end OpenMesh di dat.gui
        };//end mastergui
        
        var gui = new dat.GUI({ autoPlace: false });
        document.getElementById('controls').appendChild(gui.domElement);
        var master = new masterGui();
        gui.add(master, 'OpenMesh');

        //end Declaration DAT.GUI


        //Declaration Plugin Refine
        var Step = 1;
        var refGui = {
            stepRefine : 1,
            refine : function() { 
                console.time("Refine time ");
                Refine = new Module.MyRefine(ptrMesh);
                Refine.myRefine(Step);
                console.timeEnd("Refine time ");
                console.time("Update mesh ");
                createMesh(ptrMesh);
                console.timeEnd("Update mesh ");
            } //end refine  
        }; 

        var folderRefine = gui.addFolder('Refine');
        var stepController = folderRefine.add(refGui,'stepRefine',1,5).step(1).name('Refine Step');
        
        stepController.onChange(function(value) {
            Step=value;
        });
        folderRefine.add(refGui, 'refine').name('Refine Mesh');


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
                
                // go
                // if(openedMesh.length>4){
                //     document.getElementById('field').elements[0].remove();
                //     document.getElementsByTagName('label')[0].parentNode.removeChild(document.getElementsByTagName('label')[0]);
                //     document.getElementsByTagName('br')[0].parentNode.removeChild(document.getElementsByTagName('br')[0]);
                //     // openedMesh.shift();
                // }
                //go

                //count how many radiobox exist
                // var countRadio=0;
                // var field = document.getElementById('field')
                // for(var i=0; i<field.elements.length; i++) {
                //     var el = field.elements[i];
                //     if(el.type == 'radio') 
                //         countRadio++;
                // }
                //create new checkbox and relative label, append this
                // var checkbox = document.createElement('input');
                // checkbox.type = "checkbox";
                // checkbox.name = "checkbox";
                // checkbox.value = ptrMesh;
                // checkbox.text = files[0].name;
                // checkbox.checked="checked";

                //go
                // var radio = document.createElement('input');
                // radio.type = "radio";
                // radio.name = "mesh";
                // radio.value = countRadio;
                // radio.text = files[0].name;
                // radio.checked = "checked";
                // $(radio).on('click',  OnChangeRadio);
                //go
                //     // var int8buf = new Int8Array(openedMesh[radio.value]); 
                //     // FS.createDataFile("/", fileName, int8buf, true, true);
                //     // var Opener = new Module.Opener();
                //     // var resOpen = Opener.openMesh(fileName);
                
                //     // console.log("Open mesh with result "+resOpen);
                //     // console.timeEnd("Parsing mesh Time");
                //     // ptrMesh = Opener.getMesh();
                //     // createMesh(ptrMesh);
                //     // animate();
                //     // FS.unlink(fileName);
                    
                //     alert(radio.value);
                //  });
                // radio.onchange = OnChangeRadio(this);
                // radio.addEventListener ("RadioStateChange", alert("pippo"), false);
                
                //go
                // var label = document.createElement('label')
                // label.htmlFor = files[0].name;
                // label.appendChild(document.createTextNode(files[0].name));
                // // document.getElementById('field').appendChild(checkbox);
                // document.getElementById('field').appendChild(radio);
                // document.getElementById('field').appendChild(label);
                // var br = document.createElement('br');
                // document.getElementById('field').appendChild(br);
                
                // openedMesh[countRadio]=int8buf;
                // countRadio++;
                //go

                }//end else
                }; //end Onload

                fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");  // Efficient binary read.
            }
            document.getElementById('files').addEventListener('change', handleFileSelect, false);

            // $('input[type="radio"]').on('click change', function(e) {
            // alert(e.type);
            // });
        function OnChangeRadio(){              
        // $('input[type="radio"]').on('click', function(e) {
            var myRadio = $('input[name=mesh]');
            var checkedValue = myRadio.filter(':checked').val();
            var int8buf = new Int8Array(openedMesh[checkedValue]); 
            var fileName = $("input:radio:checked").next().text();
            FS.createDataFile("/", fileName, int8buf, true, true);
            var Opener = new Module.Opener();
            var resOpen = Opener.openMesh(fileName);    
            console.log("Open mesh with result "+resOpen);
            console.timeEnd("Parsing mesh Time");
            ptrMesh = Opener.getMesh();
            createMesh(ptrMesh);
            animate();
            FS.unlink(fileName);
        // });
        }



            



            //handler for plugin SMOOTH
            // document.getElementById('smoothed').addEventListener('click', function smoothMesh(){
            // console.time("Smooth time ");
            // Smooth = new Module.MySmooth(ptrMesh);
            // Smooth.mySmooth(1);
            // console.timeEnd("Smooth time ");
            // console.time("Update mesh ");
            // createMesh(ptrMesh);
            // console.timeEnd("Update mesh ");
            // });
            

