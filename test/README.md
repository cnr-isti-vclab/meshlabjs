# test 
This folder contains minimal code samples for testing the basic mechanisms for **client side only** javascript mesh processing application that is based on emscripten for the core processing part. 

The high level objective is to set up in the most efficient way a framework that allows 
1. loading a mesh from local storage
2. visualising it using either three.js or spidergl or even direct webgl. 
3. applying some mesh processing algorithm on it using the c++ code compiled in asm.js
4. saving back the result

There are a number of pitfalls here and there. 
Each sample aims to to be the smallest example for each tech. 

* `LoadProc` implement the minimal load-process pipeline using the HTML5 file api. Issue:
    * It require ascii file formats. The basic mechanism passing is done using allocation inside ems, and filling this mem with a string loaded from a file using html5 file api. Reading is done inside VCG by parsing the large string.
* `LoadProcSave1` implement a basic load-process-save pipeline using the HTML5 file api. Issue:
 *  the download attribute is not implemented on safari and the model to be saved is simply opened in a different tab
* `LoadProcSave2` implement a basic load-process-save pipeline using a flash based trick. Issue:
	* Require a image button and the non standard, doomed to die, deprecated *flash*.
* `LoadRender1` implement a basic load-render pipeline using three.js. It takes a file from the local file system, parse it using the three.js loaders and render it. 
* `LoadProcRender1` implement a direct pass of the mesh data as kept by the emscripten compiled code to the rendering engine. The file is parsed into a mesh using the vcg parsing code and passed back to three.js
* `LoadProcRender2` alternative approach. The mesh is loaded using three.js parsers and then the mesh data are passed in some compact way to the emscripten that trasform it back into a vcg mesh.