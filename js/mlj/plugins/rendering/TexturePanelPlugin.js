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
            var axesSize = 10;
            var yOffset = 2;
            var txtSize = 9;
            var tickSize = 6;
            var stepSize = 10;
            var xOffset = 8;
            
            ctx.canvas.height = meshFile.texture.height+axesSize+txtSize+yOffset+6;
            ctx.canvas.width = meshFile.texture.width+axesSize+txtSize+tickSize+xOffset; 
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
            

            ctx.putImageData(imageData, axesSize+xOffset+tickSize+6, yOffset, 0, 0, meshFile.texture.width, meshFile.texture.height);
            ctx.beginPath();
            ctx.font = txtSize+"px Arial";
            ctx.fillStyle = "blue";
            
            ctx.moveTo(axesSize+xOffset,yOffset);
            var step = meshFile.texture.height/stepSize;
            for(var i = 0; i <= stepSize; i++){
                var text = (stepSize-i)/stepSize;
                if(i > 0 && i < stepSize)
                    ctx.fillText(text,0,step*i+txtSize/2+yOffset-1);
                else if(i === stepSize)
                    ctx.fillText(text,4,step*i+txtSize/2+yOffset-8);
                else
                    ctx.fillText(text,0,step*i+txtSize/2+yOffset+3);
                
                ctx.lineTo(axesSize+xOffset,step*i+yOffset);
                ctx.lineTo(axesSize+xOffset+tickSize,step*i+yOffset);
                ctx.moveTo(axesSize+xOffset,step*i+yOffset);
            }        
            
            
            ctx.font = (txtSize+3)+"px Arial";
            ctx.fillText("u",xOffset,meshFile.texture.height+axesSize+yOffset-1);
            ctx.fillText("v",axesSize+xOffset,meshFile.texture.height+axesSize+txtSize+yOffset-1);
            ctx.font = txtSize+"px Arial";
            
            ctx.moveTo(axesSize+xOffset+tickSize+6,meshFile.texture.height+axesSize+yOffset)
            var step = meshFile.texture.width/stepSize;
            for(var i = 0; i <= stepSize; i++){
                var text = i/stepSize;
                if(i > 0 && i < stepSize)
                    ctx.fillText(text,step*i+axesSize+xOffset+tickSize+6-6,meshFile.texture.height+axesSize+txtSize+yOffset+1);                    
                else if(i === stepSize)
                    ctx.fillText(text,step*i+axesSize+xOffset+tickSize+6-6,meshFile.texture.height+axesSize+txtSize+yOffset+1); 
                else
                    ctx.fillText(text,step*i+axesSize+xOffset+tickSize+6-2,meshFile.texture.height+axesSize+txtSize+yOffset+1);   
                          
                
                ctx.lineTo(step*i+axesSize+xOffset+tickSize+6,meshFile.texture.height+axesSize+yOffset); 
                ctx.lineTo(step*i+axesSize+xOffset+tickSize+6,meshFile.texture.height+axesSize+yOffset-tickSize);
                ctx.moveTo(step*i+axesSize+xOffset+tickSize+6,meshFile.texture.height+axesSize+yOffset);
            }
            
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
