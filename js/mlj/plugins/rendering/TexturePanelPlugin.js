(function (plugin, core, scene) {


    var texCamera, texScene, texRenderer, texControls, canvas;

    var DEFAULTS = {
        uvParam: false
    };


    var plug = new plugin.TexturePanel({
        name: "TexturePanel",
        tooltip: "Show the texture image and parametrization attached to the mesh",
        toggle: true,
        on: true}, DEFAULTS);

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
                var bindToFun = function (choice, overlay) {
                    console.log(choice);
                    console.log(overlay);
                };
                bindToFun.toString = function () {
                    return 'uvParam';
                }; // name of the parameter used to keep track of the associated value
                return bindToFun;
            }())
        });
        
        canvasInit();        
    };

    plug._applyTo = function (meshFile, layersNum, $) {
        var texNameLabel = $("label[for='textureName']");
        var textureInfos = $("label[for='textureInfos']");
        
        //Always remove everything from the scene, before adding the new textures
        $("#texCanvasWrapper").append(texRenderer.domElement);     
            
        //delete every mesh from the scene
        for( var i = texScene.children.length - 1; i >= 0; i--) {
            texScene.remove(texScene.children[i]);
        }            

        if (meshFile.texture.hasTexture && layersNum > 0) { 
            
            texNameLabel.text("Texture file name: " + meshFile.texture.fileName);
            textureInfos.text("Info: " + meshFile.texture.width + "x" + meshFile.texture.height + "   " + meshFile.texture.components);
            var texWidth = meshFile.texture.width;
            var texHeight = meshFile.texture.height;
            var texComponents = meshFile.texture.nComponents;
            var texFormats = meshFile.texture.formats;
            var imgBuff = meshFile.texture.imgBuff;

            //Material used to show the parametrization
            var paramMaterial = new THREE.MeshBasicMaterial();
            paramMaterial.wireframe = true;
            paramMaterial.wireframeLinewidth = 3;
            paramMaterial.color = new THREE.Color('#FFFFFF');
            paramMaterial.side = THREE.DoubleSide;

            var paramGeom = new THREE.BufferGeometry();

            //Let's get started with uvs, vertices and colors
            //We're now taking an array structured as [u,v,0] for each vertex of each face, hence the 3*3*FN size
            var bufferptr = meshFile.cppMesh.getUvParamCoordinates();
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, bufferptr, meshFile.FN * 9);

            //Once I get the x,y,z values of the texture parametrization mesh
            //I need to create the faces and for each faces I need to compute its vertices color
            //from the texture image                
            var indices = new Uint16Array(meshFile.FN * 3);
            for (var i = 0; i < indices.length; i++)
                indices[i] = i;

            paramGeom.addAttribute('index', new THREE.BufferAttribute(indices, 3));
            paramGeom.addAttribute('position', new THREE.BufferAttribute(facesCoordsVec, 3));
            paramGeom.center(); //center the mesh in the scene

            //generate the mesh and position, scale it to its size and move it to the center
            var paramMesh = new THREE.Mesh(paramGeom, paramMaterial);
            paramMesh.scale.set(texWidth, texHeight, 1);
            paramMesh.position.x = 0;
            paramMesh.position.y = 0;
            paramMesh.position.z = 0;
            
            
            
            /**
             * Plane with applied texture for testing
             * In the future may be useful to show or hide this plane in order to show or not the parametrization
             */0,2
            var planeGeometry = new THREE.PlaneBufferGeometry(texWidth, texHeight);
            planeGeometry.center();

            var planeTexture = new THREE.DataTexture(imgBuff, texWidth, texHeight, texFormats);
            planeTexture.needsUpdate = true;
            planeTexture.wrapS = planeTexture.wrapT = THREE.ClampToEdgeWrapping;
            planeTexture.minFilter = THREE.LinearFilter;
            var planeMaterial = new THREE.MeshBasicMaterial({map: planeTexture});

            var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            planeMesh.position.x = 0;
            planeMesh.position.y = 0;
            planeMesh.position.z = 0;
            planeMesh.material.side = THREE.DoubleSide;
            /**
             * End plane Testing
             */   

            //Add the mesh to the scene, now is paramMesh, but can be switched with planeMesh
            texCamera.aspect = texWidth/texHeight;
            texControls.reset();
            texRenderer.setSize(texWidth, texHeight);
            texScene.add(planeMesh);
            
        } else if (layersNum > 0) {
            texNameLabel.text("No texture");
            textureInfos.text("");
        } else {
            texNameLabel.text("No Layer Selected");
            textureInfos.text("");
        }
        
        texRenderer.render(texScene, texCamera);
    };
    
    
     function canvasInit(){
         //The camera is ortographic and set at the center of the scene, better than prospectic in this case
        texCamera = new THREE.PerspectiveCamera(70, 512/512, 1, 5000);
        texCamera.position.z = 500; //500 seems like the perfect value, not sure why, I think it is because of the near/fara frustum
        texScene = new THREE.Scene();
        
        texControls = new THREE.TrackballControls(texCamera);
        texControls.staticMoving = true;
        texControls.noRoll = true;
        texControls.noRotate = true;
        texControls.noPan = false;
        texControls.minDistance = texCamera.near;
        texControls.maxDistance = texCamera.far;
        texControls.zoomSpeed = 0.2; //default is 1.2
        texControls.panSpeed = 1.; //default is 1.2
        texControls.staticMoving = false;
        texControls.addEventListener('change', render);
        
        
        canvas = document.getElementById("texGlCanvas");
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
