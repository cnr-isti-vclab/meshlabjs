(function (plugin, core, scene) {


    var texCamera, texScene, texRenderer, texControls;
    
    var DEFAULTS = {
        uvParam: false
    };

    var plug = new plugin.Texturing({
        name: "TexturePanel",
        tooltip: "Show the texture image and parametrization attached to the mesh",
        toggle: true,
        on: true
    }, DEFAULTS);

    var parametrizationWidget;

    plug._init = function (guiBuilder) {

        parametrizationWidget = guiBuilder.Choice({
            label: "UV Parametrization",
            tooltip: "",
            options: [
                {content: "Off", value: false, selected: true},
                {content: "On", value: true}
            ],
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option                
                var bindToFun = function (choice) {
                    //if there is a layer selected and that layer has a texture, let's switch meshes
                    if(MLJ.core.Scene.getSelectedLayer().name !== null && MLJ.core.Scene.getSelectedLayer().texture.hasTexture ){
                        if(choice){
                            texScene.remove( texScene.getObjectByName("planeMesh" ));    
                            texScene.add(MLJ.core.Scene.getSelectedLayer().texture.paramMesh);
                        }
                        else {   
                            texScene.remove( texScene.getObjectByName("paramMesh" ));    
                            texScene.add(MLJ.core.Scene.getSelectedLayer().texture.planeMesh);                       
                        }

                        texRenderer.render(texScene, texCamera);
                    }
                };
                bindToFun.toString = function () {
                    return 'uvParam';
                }; // name of the parameter used to keep track of the associated value
                return bindToFun;
            }())
        });
        
        parametrizationWidget.choice.$.hide();
        parametrizationWidget.label.$.hide();
        
        canvasInit();        
    };
    

    plug._applyTo = function (meshFile, layersNum, $) {
        var texNameLabel = $("label[for='textureName']");
        var textureInfos = $("label[for='textureInfos']");
        
        $("#texCanvasWrapper").append(texRenderer.domElement);           
        
        //Always remove everything from the scene when creating the meshes and adding them to the scene
        for( var i = texScene.children.length - 1; i >= 0; i--) {
            texScene.remove(texScene.children[i]);
        }

        if (meshFile.texture.hasTexture && layersNum > 0) {
            $("#texCanvasWrapper").show();
            parametrizationWidget.choice.$.show();
            parametrizationWidget.label.$.show(); 
            
            texNameLabel.text("Texture file name: " + meshFile.texture.fileName);
            textureInfos.text("Info: " + meshFile.texture.width + "x" + meshFile.texture.height + "   " + meshFile.texture.components);
            
            var texWidth = meshFile.texture.width;
            var texHeight = meshFile.texture.height;
            var texComponents = meshFile.texture.nComponents;
            var texFormats = meshFile.texture.formats;
            var imgBuff = meshFile.texture.imgBuff;

            //If a layer is added, we need to create the parametrization flat mesh for the first time, so, if it's undefined
            //We'll create it only now in order to avoid useless computation on each layer selections
            if(!meshFile.texture.paramMesh){;
                //Let's get started with uvs, vertices and colors
                //We're now taking an array structured as [u,v,0] for each vertex of each face, hence the 3*3*FN size
                var bufferptr = meshFile.cppMesh.getUvParamCoordinates();
                var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, bufferptr, meshFile.FN * 9);

                //Material used to show the parametrization
                var paramGeomBuff = new THREE.BufferGeometry();
                paramGeomBuff.addAttribute('position', new THREE.BufferAttribute(facesCoordsVec, 3));
                var paramGeom = new THREE.Geometry().fromBufferGeometry(paramGeomBuff);
                paramGeom.center(); //center the mesh in the scene       
                var paramMesh = new THREE.Mesh(paramGeom, new THREE.MeshBasicMaterial({wireframe: true, color: 0xFF0000})); //generate the mesh and position, scale it to its size and move it to the center 
                paramMesh.position.x = paramMesh.position.y = paramMesh.position.z = 0;
                paramMesh.scale.x = paramMesh.scale.y = 70;
                paramMesh.name = "paramMesh";
                meshFile.texture.paramMesh = paramMesh;
            }

            //If a layer is added, we need to create the planar mesh with the texture for the first time, so, if it's undefined
            //We'll create it only now in order to avoid useless computation on each layer selections
            if(!meshFile.texture.planeMesh){
                var ratio = texWidth/texHeight; //The texture may not be squared
                var planeGeometry = new THREE.PlaneBufferGeometry(ratio, 1);
                planeGeometry.center();
                var planeTexture = new THREE.DataTexture(imgBuff, texWidth, texHeight, texFormats);
                planeTexture.needsUpdate = true;
                planeTexture.wrapS = planeTexture.wrapT = THREE.ClampToEdgeWrapping;
                planeTexture.minFilter = THREE.LinearFilter;
                var planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: planeTexture}));     
                planeMesh.position.x = planeMesh.position.y = planeMesh.position.z = 0;
                planeMesh.scale.x = planeMesh.scale.y = 70;
                planeMesh.name = "planeMesh";
                meshFile.texture.planeMesh = planeMesh;
            }  

            //Add the mesh to the scene, now is paramMesh, but can be switched with planeMesh
            texCamera.aspect = texWidth / texHeight;
            texCamera.position.z = 70;
            texCamera.updateProjectionMatrix();
            texControls.reset();
            texRenderer.setSize(texWidth, texHeight);
            
            //In base al parametro UV attualmente selezionato, aggiungo una mesh o l'altra 
            if(meshFile.texture.texPanelParam.uvParam)
                texScene.add(meshFile.texture.paramMesh);
            else
                texScene.add(meshFile.texture.planeMesh);                        
            
        } else {
            parametrizationWidget.choice.$.hide();
            parametrizationWidget.label.$.hide();
            $("#texCanvasWrapper").hide();
            
            if(layersNum < 1)
                texNameLabel.text("No Layer Selected");
            else 
                texNameLabel.text("No texture");
            
            textureInfos.text("");
        }     
        
        texRenderer.render(texScene, texCamera);   //Always render, if nothing is shown, then no layer is selected     
    };
    
    
     function canvasInit(){
         //The camera is ortographic and set at the center of the scene, better than prospectic in this case
        texCamera = new THREE.PerspectiveCamera(70, 512/512, 1, 5000);
        texCamera.position.z = 50; //500 seems like the perfect value, not sure why, I think it is because of the near/fara frustum
        texScene = new THREE.Scene();
        
        texControls = new THREE.TrackballControls(texCamera);
        texControls.staticMoving = true;
        texControls.noRoll = true;
        texControls.noRotate = true;
        texControls.noPan = false;
        texControls.minDistance = texCamera.near;
        texControls.maxDistance = texCamera.far;
        texControls.zoomSpeed = 0.8;
        texControls.panSpeed = 3;
        texControls.addEventListener('change', render);        
        
        texRenderer = new THREE.WebGLRenderer({
            antialiasing: true,
            preserveDrawingBuffer:true});
        texRenderer.setPixelRatio(window.devicePixelRatio);
        
        animate();
    }
    
    
    function animate(){
        requestAnimationFrame(animate);
        texControls.update();
    }


    function render(){
        texRenderer.render(texScene, texCamera);
    }
   
    
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
