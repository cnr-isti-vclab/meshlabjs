(function (plugin, core, scene) {
    
    var plug = new plugin.TexturePanel({
    });
    
    plug._init = function(guiBuilder){   
        texturePane = MLJ.widget.TabbedPane.getTexturePane();
        texturePane.append('<label for="textureName"></label> ');
        texturePane.append('<label for="textureInfos"> </label> ');
        texturePane.append('<div id="texCanvasWrapper" > <canvas id="texGlCanvas"> </canvas></div>');
    };

    plug._applyTo = function (meshFile, layersNum, $) {
        var texNameLabel = $("label[for='textureName']");
        var textureInfos = $("label[for='textureInfos']");
        
        if(meshFile.texture.hasTexture && layersNum > 0){  
            texNameLabel.text("Texture file name: " +meshFile.texture.fileName);
            textureInfos.text("Info: "+meshFile.texture.width +"x" +meshFile.texture.height +"   " +meshFile.texture.components);
            
            var ctx = $("#texGlCanvas")[0].getContext('2d');
            var canvas = $("#texGlCanvas");
            var axesSize = 20;
            
            ctx.canvas.height = meshFile.texture.height+axesSize;
            ctx.canvas.width = meshFile.texture.width+axesSize; 
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
            

            ctx.putImageData(imageData, axesSize, 0, 0, 0, meshFile.texture.width, meshFile.texture.height);
            ctx.beginPath();
            ctx.font = "5px Arial";
            ctx.fillText("100",0,0);
            ctx.lineWidth =0.5;
            ctx.moveTo(0,0);
            ctx.lineTo(0,meshFile.texture.height+axesSize/2);
            ctx.lineTo(meshFile.texture.width,meshFile.texture.height+axesSize/2);
            ctx.stroke();
            
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
        }
        else if(layersNum > 0){
            texNameLabel.text("No texture");
            textureInfos.text("");           
            var ctx = $("#texGlCanvas")[0].getContext('2d');
            ctx.canvas.height = 0;
            ctx.canvas.width = 0; 
        }
        else {
            texNameLabel.text("");
            textureInfos.text("");        
            var ctx = $("#texGlCanvas")[0].getContext('2d');
            ctx.canvas.height = 0;
            ctx.canvas.width = 0;             
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
