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

            //Let's get started with uvs, vertices and colors
            //We're now taking an array structured as [u,v,0] for each vertex of each face, hence the 3*3*FN size
            var bufferptr = meshFile.cppMesh.getUvParamCoordinates();
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, bufferptr, meshFile.FN * 9);

            //Material used to show the parametrization
            var paramGeom = new THREE.BufferGeometry();
            paramGeom.addAttribute('position', new THREE.BufferAttribute(facesCoordsVec, 3));
            paramGeom.center(); //center the mesh in the scene            
            var paramMesh = new THREE.WireframeHelper(new THREE.Mesh(paramGeom, new THREE.LineBasicMaterial(), 0x00ff00)); //generate the mesh and position, scale it to its size and move it to the center 
            paramMesh.position.set = (0,0,0); 

            /**
             * Plane with applied texture for testing
             * In the future may be useful to show or hide this plane in order to show or not the parametrization
             */
            var planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
            planeGeometry.center();
            var planeTexture = new THREE.DataTexture(imgBuff, texWidth, texHeight, texFormats);
            planeTexture.needsUpdate = true;
            planeTexture.wrapS = planeTexture.wrapT = THREE.ClampToEdgeWrapping;
            planeTexture.minFilter = THREE.LinearFilter;
            var planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: planeTexture}));
            planeMesh.position.set = (0,0,0);
            planeMesh.position.x = 1;

            //Add the mesh to the scene, now is paramMesh, but can be switched with planeMesh
            texCamera.aspect = texWidth/texHeight;
            texControls.reset();
            texRenderer.setSize(texWidth, texHeight);
            texScene.add(paramMesh);
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
        texCamera = new THREE.PerspectiveCamera(70, 512/512, 1, 10000);
        texCamera.position.z = 1; //500 seems like the perfect value, not sure why, I think it is because of the near/fara frustum
        texScene = new THREE.Scene();
        
        texControls = new THREE.TrackballControls(texCamera);
        texControls.staticMoving = true;
        texControls.noRoll = true;
        texControls.noRotate = true;
        texControls.noPan = false;
        texControls.minDistance = texCamera.near;
        texControls.maxDistance = texCamera.far;
        texControls.zoomSpeed = 0.3; //default is 1.2
        texControls.panSpeed = 3; //default is 1.2
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
