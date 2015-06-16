/**
 * @class RandomPlugin
 * @name RandomPlugin
 * @description Represent plugin RandomDisplacement with methods for add plugin in dat.Gui and method for Random mesh 
 */
function RandomPlugin () { 
    var RandomDisplacemnt;
    var dispAmount = 0.01;
    var rndGui = {
        dispAmount : 0.01,
        randomDisp : function() {         
                var mesh;
                for (var i = 1; i < scene.children.length; i++){
                    if(scene.children[i].name == fileNameGlobal){
                        mesh = scene.children[i];
                        break;
                    }
                }
                console.log(mesh);
                var statusVisible = mesh.visible;
                var ptr = mesh.pointer;
                scene.remove(mesh);
                console.time("random time ");
                Module.RandomDisplacement(ptr, dispAmount);
                console.timeEnd("random time ");
                var mlRender = new MeshLabJsRender();
                mesh = mlRender.createMesh(ptr,fileNameGlobal);
                if(!statusVisible)
                    mlRender.hideMeshByName(fileNameGlobal);
                console.timeEnd("Update mesh ");
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
