//Smooth Plugin

var RandomDisplacemnt;
var dispAmount = 0.01;
var rndGui = {
    dispAmount : 0.01,
    randomDisp : function() { 
            console.time("random time ");
            Module.RandomDisplacement(ptrMesh, dispAmount);
            console.timeEnd("random time ");
            createMesh(ptrMesh);
    } //end smooth  
}; 

var folderRandom = folderFilter.addFolder('RandomDisplacement');
var dispAmountController = folderRandom.add(rndGui,'dispAmount',0,0.1).step(0.01).name('Displacement Amount');
        
dispAmountController.onChange(function(value) {
    dispAmount=value;
});

folderRandom.add(rndGui,'randomDisp').name('Random Displacement');
