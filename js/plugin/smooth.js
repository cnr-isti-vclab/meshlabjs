//Smooth Plugin

var Smooth;
var StepSmooth = 1;
var smoGui = {
    stepSmooth : 1,
    smooth : function() { 
            removeMeshByName(fileNameGlobal);
            console.time("Smooth time ");
            Module.Smooth(currentPtr, StepSmooth);
            console.timeEnd("Smooth time ");
            console.time("Update mesh ");
            var resultMesh = createMesh(currentPtr,name);
            arrThreeJsMeshObj[fileNameGlobal] = resultMesh;
            addMeshByName(fileNameGlobal);
            console.timeEnd("Update mesh ");
    } //end smooth  
}; 

var folderSmooth = folderFilter.addFolder('Smooth');
var stepSmoothController = folderSmooth.add(smoGui,'stepSmooth',1,5).step(1).name('Smooth Step');
        
stepSmoothController.onChange(function(value) {
    StepSmooth=value;
});

folderSmooth.add(smoGui,'smooth').name('Smooth Mesh');
