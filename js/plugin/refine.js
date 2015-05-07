//Refine Plugin
var Refine;
var StepRefine = 1;
var refGui = {
    stepRefine : 1,
    refine : function() { 
        var statusVisible = isCurrentMeshVisible;
        if(statusVisible)
            removeMeshByName(fileNameGlobal);
    	console.time("Refine time ");
    	Refine = new Module.MyRefine(currentPtr);
    	Refine.myRefine(StepRefine);
    	console.timeEnd("Refine time ");
    	console.time("Update mesh ");
        arrThreeJsMeshObj[name] = createMesh(currentPtr,fileNameGlobal);
        if(statusVisible)
            addMeshByName(fileNameGlobal);
	    console.timeEnd("Update mesh ");
        infoArea.value = arrInfoMeshOut[fileNameGlobal]+arrVNFNMeshOut[fileNameGlobal];

    } //end refine  
}; 

var folderRefine = folderFilter.addFolder('Refine');
var stepRefineController = folderRefine.add(refGui,'stepRefine',1,5).step(1).name('Refine Step');
        
stepRefineController.onChange(function(value) {
    StepRefine=value;
});

folderRefine.add(refGui,'refine').name('Refine Mesh');