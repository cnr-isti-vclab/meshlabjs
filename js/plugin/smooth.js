//Smooth Plugin
function SmoothPlugin () { }

SmoothPlugin.prototype = {
    loadSmoothPlugin : function () {
        var Smooth;
        var StepSmooth = 1;
        var smoGui = {
            stepSmooth : 1,
            smooth : function() { 
                    var mlRender = new MeshLabJsRender();
                    var mesh = mlRender.arrThreeJsMeshObj[fileNameGlobal];
                    var statusVisible = mesh.visible;
                    scene.remove(mesh);
                    console.time("Smooth time ");
                    Module.Smooth(currentPtr, StepSmooth);
                    console.timeEnd("Smooth time ");
                    console.time("Update mesh ");
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

        var folderSmooth = folderFilter.addFolder('Smooth');
        var stepSmoothController = folderSmooth.add(smoGui,'stepSmooth',1,5).step(1).name('Smooth Step');
                
        stepSmoothController.onChange(function(value) {
            StepSmooth=value;
        });

        folderSmooth.add(smoGui,'smooth').name('Smooth Mesh');
    }
};
