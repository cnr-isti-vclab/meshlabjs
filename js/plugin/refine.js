//Refine Plugin
function RefinePlugin () { }

RefinePlugin.prototype = {
    loadRefinePlugin : function () {
    var Refine;
    var StepRefine = 1;
    var refGui = {
        stepRefine : 1,
        refine : function() { 
                var mlRender = new MeshLabJsRender();
                var mesh = mlRender.arrThreeJsMeshObj[fileNameGlobal];
                var statusVisible = mesh.visible;
                scene.remove(mesh);
            	console.time("Refine time ");
            	Refine = new Module.MyRefine(currentPtr);
            	Refine.myRefine(StepRefine);
            	console.timeEnd("Refine time ");
            	console.time("Update mesh ");
                mlRender.arrThreeJsMeshObj[fileNameGlobal] = mlRender.createMesh(currentPtr,fileNameGlobal);
                if(!statusVisible)
                    mlRender.hideMeshByName(fileNameGlobal);
                console.timeEnd("Update mesh ");
                var mlGui = new MeshLabJsGui();
                document.getElementById('infoMesh').value = 
                    mlGui.arrInfoMeshOut[fileNameGlobal] + mlRender.arrVNFNMeshOut[fileNameGlobal];
                mlRender.render();

        } //end refine  
    }; 

    var folderRefine = folderFilter.addFolder('Refine');
    var stepRefineController = folderRefine.add(refGui,'stepRefine',1,5).step(1).name('Refine Step');
            
    stepRefineController.onChange(function(value) {
        StepRefine=value;
    });

    folderRefine.add(refGui,'refine').name('Refine Mesh');
    }
};