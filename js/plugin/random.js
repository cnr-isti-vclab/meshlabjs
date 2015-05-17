//Smooth Plugin
function RandomPlugin () { }

RandomPlugin.prototype = {
    loadRandomPlugin : function () {
    var RandomDisplacemnt;
    var dispAmount = 0.01;
    var rndGui = {
        dispAmount : 0.01,
        randomDisp : function() {         
                var mlRender = new MeshLabJsRender();
                var mesh = mlRender.arrThreeJsMeshObj[fileNameGlobal];
                var statusVisible = mesh.visible;
                scene.remove(mesh);
                console.time("random time ");
                Module.RandomDisplacement(currentPtr, dispAmount);
                console.timeEnd("random time ");
                mlRender.arrThreeJsMeshObj[fileNameGlobal] = mlRender.createMesh(currentPtr,fileNameGlobal);
                if(!statusVisible)
                    mlRender.hideMeshByName(fileNameGlobal);
                console.timeEnd("Update mesh ");
                var mlGui = new MeshLabJsGui();
                document.getElementById('infoMesh').value = 
                    mlGui.arrInfoMeshOut[fileNameGlobal]+mlRender.arrVNFNMeshOut[fileNameGlobal];
                mlRender.render();
        } //end smooth  
    }; 

    var folderRandom = folderFilter.addFolder('RandomDisplacement');
    var dispAmountController = folderRandom.add(rndGui,'dispAmount',0,0.1).step(0.01).name('Displacement Amount');
            
    dispAmountController.onChange(function(value) {
        dispAmount=value;
    });

    folderRandom.add(rndGui,'randomDisp').name('Random Displacement');
    }
};
