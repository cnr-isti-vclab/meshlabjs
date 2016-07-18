(function (plugin, core, scene) {


    var texCamera, texScene, texRenderer, texControls;
    var canvasHeight;
    
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
    var widgets;

    plug._init = function (guiBuilder) {
        widgets = [];

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
        
        widgets.push(parametrizationWidget);
        hideWidgets();
        
        canvasHeight = 500;
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
            showWidgets();
            
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
            var panelWidth = $("#texCanvasWrapper").parent().parent().parent().width();
            texCamera.aspect = panelWidth / canvasHeight;
            texCamera.position.z = 80;
            texCamera.updateProjectionMatrix();
            texControls.reset();
            texRenderer.setSize(panelWidth, canvasHeight);
            
            //In base al parametro UV attualmente selezionato, aggiungo una mesh o l'altra 
            if(meshFile.texture.texPanelParam.uvParam)
                texScene.add(meshFile.texture.paramMesh);
            else
                texScene.add(meshFile.texture.planeMesh);                        
            
        } else {
            hideWidgets();
            
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
        texCamera.position.z = 80; //80 seems like the perfect value, not sure why, I think it is because of the near/fara frustum
        texScene = new THREE.Scene();
        
        texControls = new THREE.TrackballControls(texCamera);
        texControls.staticMoving = false;
        texControls.noRoll = true;
        texControls.noRotate = true;
        texControls.noPan = false;
        texControls.minDistance = texCamera.near;
        texControls.maxDistance = texCamera.far;
        texControls.zoomSpeed = 0.8;
        texControls.panSpeed = 1;
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
    
    $(window).resize(function () {
        resizeCanvas();
    });    
    
    function resizeCanvas(){
        if(texRenderer && texCamera && texScene){
            var panelWidth = $("#texCanvasWrapper").parent().parent().parent().width();
            texCamera.aspect = panelWidth / canvasHeight;
            texCamera.updateProjectionMatrix();
            texRenderer.setSize(panelWidth, canvasHeight);
            texRenderer.render(texScene, texCamera);
        }        
    }
    
    function hideWidgets(){
        //call the parent to hide the div containing both label and button set
        for(var i = 0; i < widgets.length; i++){
            widgets[i].choice.$.parent().parent().hide(200);
        }
        $("#texCanvasWrapper").hide(200);
    }
    
    function showWidgets(){
        //call the parent to show the div containing both label and button set
        for(var i = 0; i < widgets.length; i++){
            widgets[i].choice.$.parent().parent().show(200);
        }
        $("#texCanvasWrapper").show(200);
    }   
    
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
