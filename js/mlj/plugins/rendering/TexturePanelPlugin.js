(function (plugin, core, scene) {

    var DEFAULTS = {
        uvParam: false
    };
    

    var plug = new plugin.TexturePanel({
        name: "TexturePanel",
        tooltip: "Show the texture image and parametrization attached to the mesh",
        toggle: true,
        on: true}, DEFAULTS);

    var parametrizationWidget;
    var param = false;

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


    };

    plug._applyTo = function (meshFile, layersNum, $) {
        var texNameLabel = $("label[for='textureName']");
        var textureInfos = $("label[for='textureInfos']");

        if (meshFile.texture.hasTexture && layersNum > 0) {
            texNameLabel.text("Texture file name: " + meshFile.texture.fileName);
            textureInfos.text("Info: " + meshFile.texture.width + "x" + meshFile.texture.height + "   " + meshFile.texture.components);

            if (param) {
                var ctx = $("#texGlCanvas")[0].getContext('2d');
                var axesSize = 10;
                var yOffset = 2;
                var txtSize = 9;
                var tickSize = 6;
                var stepSize = 10;
                var xOffset = 8;

                ctx.canvas.height = meshFile.texture.height + axesSize + txtSize + yOffset + 6;
                ctx.canvas.width = meshFile.texture.width + axesSize + txtSize + tickSize + xOffset;
                var imageData = ctx.createImageData(meshFile.texture.width, meshFile.texture.height);
                var counter = 0;

                for (var i = 0; i < meshFile.texture.width * meshFile.texture.height * meshFile.texture.nComponents; i += meshFile.texture.nComponents) {
                    if (meshFile.texture.nComponents > 3) {
                        imageData.data[i] = meshFile.texture.imgBuff[i];   //red
                        imageData.data[i + 1] = meshFile.texture.imgBuff[i + 1]; //green
                        imageData.data[i + 2] = meshFile.texture.imgBuff[i + 2]; //blue
                        imageData.data[i + 3] = meshFile.texture.imgBuff[i + 3]; //alpha
                    } else {
                        imageData.data[i + counter] = meshFile.texture.imgBuff[i];   //red
                        imageData.data[i + 1 + counter] = meshFile.texture.imgBuff[i + 1]; //green
                        imageData.data[i + 2 + counter] = meshFile.texture.imgBuff[i + 2]; //blue  
                        imageData.data[i + 3 + counter] = 255;
                        counter++;
                    }
                }

                ctx.putImageData(imageData, axesSize + xOffset + tickSize + 6, yOffset, 0, 0, meshFile.texture.width, meshFile.texture.height);

                /**
                 * AXES drawing
                 */
                ctx.beginPath();
                ctx.font = txtSize + "px Arial";
                ctx.fillStyle = "blue";

                ctx.moveTo(axesSize + xOffset, yOffset);
                var step = meshFile.texture.height / stepSize;
                for (var i = 0; i <= stepSize; i++) {
                    var text = (stepSize - i) / stepSize;
                    if (i > 0 && i < stepSize)
                        ctx.fillText(text, 0, step * i + txtSize / 2 + yOffset - 1);
                    else if (i === stepSize)
                        ctx.fillText(text, 4, step * i + txtSize / 2 + yOffset - 8);
                    else
                        ctx.fillText(text, 0, step * i + txtSize / 2 + yOffset + 3);

                    ctx.lineTo(axesSize + xOffset, step * i + yOffset);
                    ctx.lineTo(axesSize + xOffset + tickSize, step * i + yOffset);
                    ctx.moveTo(axesSize + xOffset, step * i + yOffset);
                }


                ctx.font = (txtSize + 3) + "px Arial";
                ctx.fillText("u", xOffset, meshFile.texture.height + axesSize + yOffset - 1);
                ctx.fillText("v", axesSize + xOffset, meshFile.texture.height + axesSize + txtSize + yOffset - 1);
                ctx.font = txtSize + "px Arial";

                ctx.moveTo(axesSize + xOffset + tickSize + 6, meshFile.texture.height + axesSize + yOffset)
                var step = meshFile.texture.width / stepSize;
                for (var i = 0; i <= stepSize; i++) {
                    var text = i / stepSize;
                    if (i > 0 && i < stepSize)
                        ctx.fillText(text, step * i + axesSize + xOffset + tickSize + 6 - 6, meshFile.texture.height + axesSize + txtSize + yOffset + 1);
                    else if (i === stepSize)
                        ctx.fillText(text, step * i + axesSize + xOffset + tickSize + 6 - 6, meshFile.texture.height + axesSize + txtSize + yOffset + 1);
                    else
                        ctx.fillText(text, step * i + axesSize + xOffset + tickSize + 6 - 2, meshFile.texture.height + axesSize + txtSize + yOffset + 1);


                    ctx.lineTo(step * i + axesSize + xOffset + tickSize + 6, meshFile.texture.height + axesSize + yOffset);
                    ctx.lineTo(step * i + axesSize + xOffset + tickSize + 6, meshFile.texture.height + axesSize + yOffset - tickSize);
                    ctx.moveTo(step * i + axesSize + xOffset + tickSize + 6, meshFile.texture.height + axesSize + yOffset);
                }

                ctx.stroke();
                /**
                 * END of axes drawing
                 */

//            var canvasOffset=$("#texGlCanvas").offset();
//            var offsetX=512;
//            var offsetY=512;
//            var canvasWidth=canvas.width;
//            var canvasHeight=canvas.height;
//            var isDragging=false;
//            var canMouseX;
//            var canMouseY;

//            function handleMouseDown(e){
//                canMouseX=parseInt(e.clientX-offsetX);
//                canMouseY=parseInt(e.clientY-offsetY);
//                // set the drag flag
//                isDragging=true;
//              }
//
//              function handleMouseUp(e){
//                canMouseX=parseInt(e.clientX-offsetX);
//                canMouseY=parseInt(e.clientY-offsetY);
//                // clear the drag flag
//                isDragging=false;
//              }
//
//              function handleMouseOut(e){
//                canMouseX=parseInt(e.clientX-offsetX);
//                canMouseY=parseInt(e.clientY-offsetY);
//                // user has left the canvas, so clear the drag flag
//                //isDragging=false;
//              }
//
//              function handleMouseMove(e){
//                canMouseX=parseInt(e.clientX-offsetX);
//                canMouseY=parseInt(e.clientY-offsetY);
////                console.log(canMouseX +" " +canMouseY);
//                // if the drag flag is set, clear the canvas and draw the image
//                if(isDragging){
//                    ctx.clearRect(0,0,canvasWidth,canvasHeight);
////                    ctx.drawImage(img,canMouseX-128/2,canMouseY-120/2,128,120);
//                    ctx.putImageData(imageData, 0, 0, canMouseX-meshFile.texture.width/2, meshFile.texture.height-120/2, meshFile.texture.width, meshFile.texture.height);
//                }
//              }
//
//              $("#texGlCanvas").mousedown(function(e){handleMouseDown(e);});
//              $("#texGlCanvas").mousemove(function(e){handleMouseMove(e);});
//              $("#texGlCanvas").mouseup(function(e){handleMouseUp(e);});
//              $("#texGlCanvas").mouseout(function(e){handleMouseOut(e);});
            } else {                
                var container = document.getElementById( "texGlCanvas" );
                
                var texCamera, texScene, texRenderer;
                
                var texWidth = meshFile.texture.width;
                var texHeight = meshFile.texture.height;
                var texComponents = meshFile.texture.nComponents;
                var texFormats = meshFile.texture.formats;
                var imgBuff = meshFile.texture.imgBuff;
                
                //The camera is ortographic and set at the center of the scene, better than prospectic in this case
                texCamera = new THREE.OrthographicCamera( texWidth / - 2, texWidth / 2, texHeight / 2, texHeight / - 2, 1, 2000 );
                texCamera.position.z = 500; //500 seems like the perfect value, not sure why, I think it is because of the near/fara frustum

                texScene = new THREE.Scene();

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
                paramGeom.addAttribute('position', new THREE.BufferAttribute(facesCoordsVec, 3));
                
                paramGeom.center(); //center the mesh in the scene
                
                //generate the mesh and position, scale it to its size and move it to the center
                var paramMesh = new THREE.Mesh( paramGeom, paramMaterial );
                paramMesh.scale.set(texWidth,texHeight,1);
                paramMesh.position.x = 0;
                paramMesh.position.y = 0;
                paramMesh.position.z = 0;                
                /**
                 * Plane with applied texture for testing
                 * In the future may be useful to show or hide this plane in order to show or not the parametrization
                 */
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
                texScene.add( paramMesh );

                texRenderer = new THREE.WebGLRenderer({canvas: container, antialiasing: true});                
                texRenderer.setPixelRatio( window.devicePixelRatio );
                texRenderer.setSize(texWidth,texHeight);
                texRenderer.render( texScene, texCamera );                
                
                var controls = new THREE.OrthographicTrackballControls ( texCamera );
                controls.noRoll = true;
                controls.noRotate = true;
                controls.zoomSpeed = 0.4; //default is 1.2
                controls.staticMoving = false;
                controls.addEventListener( 'change', render );
                
                animate();
                function animate()
                {
                    requestAnimationFrame(animate);
                    controls.update();
                }


                function render()
                {
                    texRenderer.render( texScene, texCamera );
                }
                
                
            }
        } else if (layersNum > 0) {
            texNameLabel.text("No texture");
            textureInfos.text("");
            var ctx = $("#texGlCanvas")[0].getContext('2d');
            ctx.canvas.height = 0;
            ctx.canvas.width = 0;
        } else {
            texNameLabel.text("No Layer Selected");
            textureInfos.text("");
            var ctx = $("#texGlCanvas")[0].getContext('2d');
            ctx.canvas.height = 0;
            ctx.canvas.width = 0;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
