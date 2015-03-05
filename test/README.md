# Experiments 
This folder contains minimal code samples for testing the basic mechanisms for **client side only** javascript mesh processing application that is based on emscripten for the core processing part. 

The high level objective is to set up in the most efficient way a framework that allows 
1. loading a mesh from local storage
2. visualising it using either three.js or spidergl or even direct webgl. 
3. applying some mesh processing algorithm on it using the c++ code compiled in asm.js
4. saving back the result

There are a number of pitfalls here and there. 
Each sample aims to to be the smallest example for each tech. 

* `LoadSave1` implement a basic load-process-save pipeline using the HTML5 file api. Issue:
 *  the download attribute is not implemented on safari and the model to be saved is simply opened in a different tab
* `LoadSave2` implement a basic load-process-save pipeline using a flash based trick. Issue:
	* Require a image button and the non standard, doomed to die, deprecated *flash*.
* `LoadRender1` implement a basic load-render pipeline using three.js