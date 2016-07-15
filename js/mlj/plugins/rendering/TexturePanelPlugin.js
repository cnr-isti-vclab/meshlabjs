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
            textureInfos.text("Info: "+meshFile.texture.width +"x" +meshFile.texture.height +" " +meshFile.texture.components);
            
            var ctx = $("#texGlCanvas")[0].getContext('2d');
            ctx.canvas.height = meshFile.texture.width;
            ctx.canvas.width = meshFile.texture.height; 
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

            ctx.putImageData(imageData, 0, 0);
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
