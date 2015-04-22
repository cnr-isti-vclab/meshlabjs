//Refine Plugin
var Refine;
var StepRefine = 1;
var refGui = {
    stepRefine : 1,
    refine : function() { 
        removeMeshByName(fileNameGlobal);
    	console.time("Refine time ");
    	Refine = new Module.MyRefine(currentPtr);
    	Refine.myRefine(StepRefine);
    	console.timeEnd("Refine time ");
    	console.time("Update mesh ");
    	var resultMesh = createMesh(currentPtr,name);
        arrThreeJsMeshObj[fileNameGlobal] = resultMesh;
        addMeshByName(fileNameGlobal);
	    console.timeEnd("Update mesh ");
    } //end refine  
}; 

var folderRefine = folderFilter.addFolder('Refine');
var stepRefineController = folderRefine.add(refGui,'stepRefine',1,5).step(1).name('Refine Step');
        
stepRefineController.onChange(function(value) {
    StepRefine=value;
});

folderRefine.add(refGui,'refine').name('Refine Mesh');