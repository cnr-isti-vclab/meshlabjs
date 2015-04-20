//Smooth Plugin

var Smooth;
var StepSmooth = 1;
var smoGui = {
    stepSmooth : 1,
    smooth : function() { 
            console.time("Smooth time ");
            Smooth = new Module.MySmooth(ptrMesh);
            Smooth.mySmooth(StepSmooth);
            console.timeEnd("Smooth time ");
            console.time("Update mesh ");
            createMesh(ptrMesh);
            console.timeEnd("Update mesh ");
    } //end smooth  
}; 

var folderSmooth = gui.addFolder('Smooth');
var stepSmoothController = folderSmooth.add(smoGui,'stepSmooth',1,5).step(1).name('Smooth Step');
        
stepSmoothController.onChange(function(value) {
    StepSmooth=value;
});

folderSmooth.add(smoGui,'smooth').name('Smooth Mesh');
