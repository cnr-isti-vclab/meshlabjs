//Smooth Plugin

var Smooth;
var StepSmooth = 1;
var smoGui = {
    stepSmooth : 1,
    smooth : function() { 
            var statusVisible = isCurrentMeshVisible;
            if(statusVisible)
                removeMeshByName(fileNameGlobal);
            console.time("Smooth time ");
            Module.Smooth(currentPtr, StepSmooth);
            console.timeEnd("Smooth time ");
            console.time("Update mesh ");
            arrThreeJsMeshObj[fileNameGlobal] = createMesh(currentPtr,fileNameGlobal);
            if(statusVisible)
                addMeshByName(fileNameGlobal);
            console.timeEnd("Update mesh ");
            infoArea.value = arrInfoMeshOut[fileNameGlobal]+arrVNFNMeshOut[fileNameGlobal];

    } //end smooth  
}; 

var folderSmooth = folderFilter.addFolder('Smooth');
var stepSmoothController = folderSmooth.add(smoGui,'stepSmooth',1,5).step(1).name('Smooth Step');
        
stepSmoothController.onChange(function(value) {
    StepSmooth=value;
});

folderSmooth.add(smoGui,'smooth').name('Smooth Mesh');
