/**
 * @class RefinePlugin
 * @name RefinePlugin
 * @description Represent plugin Refine with methods for add plugin in dat.Gui and method for Refine mesh 
 */
function RefinePlugin () { 
    var Refine;
    var StepRefine = 1;
    var refGui = {
        stepRefine : 1,
        refine : function() { 
                var mesh;
                for (var i = 1; i < scene.children.length; i++){
                    if(scene.children[i].name == fileNameGlobal){
                        mesh = scene.children[i];
                        break;
                    }
                }
                var statusVisible = mesh.visible;
                var ptr = mesh.pointer;
                scene.remove(mesh);
            	console.time("Refine time ");
            	Refine = new Module.MyRefine(ptr);
            	Refine.myRefine(StepRefine);
            	console.timeEnd("Refine time ");
            	console.time("Update mesh ");
                var mlRender = new MeshLabJsRender();
                mesh = mlRender.createMesh(ptr,fileNameGlobal);
                if(!statusVisible)
                    mlRender.hideMeshByName(fileNameGlobal);
                console.timeEnd("Update mesh ");
                document.getElementById('infoMesh').value = mesh.infoMesh + mesh.VNFN;
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