/**
 * @class SmoothPlugin
 * @name SmoothPlugin
 * @description Represent plugin Smooth with methods for add plugin in dat.Gui and method for smooth mesh 
 */
function SmoothPlugin () { 
        var Smooth;
        var StepSmooth = 1;
        var smoGui = {
            stepSmooth : 1,
            smooth : function() { 
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
                    console.time("Smooth time ");
                    Module.Smooth(ptr, StepSmooth);
                    console.timeEnd("Smooth time ");
                    console.time("Update mesh ");
                    var mlRender = new MeshLabJsRender();
                    mesh = mlRender.createMesh(ptr,fileNameGlobal);
                    if(!statusVisible)
                        mlRender.hideMeshByName(fileNameGlobal);
                    console.timeEnd("Update mesh ");
                    document.getElementById('infoMesh').value = mesh.infoMesh + mesh.VNFN;
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
