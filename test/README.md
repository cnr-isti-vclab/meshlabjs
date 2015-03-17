# test 
This folder contains minimal code samples for testing the basic mechanisms for a **client-side-only**, javascript based, mesh processing application that is based on emscripten and the vcglib for the core processing part. 

The high level objective is to set up in the most efficient way a framework that allows: 

1. loading a mesh from local storage
2. visualising it using either three.js or spidergl or even direct webgl. 
3. applying some mesh processing algorithm on it using the c++ code compiled in asm.js
4. 
5. saving back the result on the local storage
 
There are a number of pitfalls here and there. The purpose of the samples in this folder is to test all the possible ways of implementing the above points, for feasibility and for efficiency testing. 
Each sample should be as minimal as possible showing the strict necessary for functioning. 

* `LoadProc` implement the minimal load-process pipeline using the HTML5 file api. Issue:
    * It requires ascii file formats. The basic mechanism passing is done using allocation inside ems, and filling this mem with a string loaded from a file using html5 file api. Reading is done inside VCG by parsing the large string.
    * **Status**: Complete
* `LoadProcSave1` implement a basic load-process-save pipeline using the HTML5 file api. Issue:
 *  the download attribute is not implemented on safari and the model to be saved is simply opened in a different tab
 * **Status**: Complete
* `LoadProcSave2` implement a basic load-process-save pipeline using a flash based trick. Issue:
	* Require a image button and the non standard, doomed to die, deprecated *flash*.
    * **Status**: Complete

* `LoadRender1` implement a basic load-render pipeline using three.js. It takes a file from the local file system, parse it using the three.js loaders and render it. 
* `LoadProcRender1` implement a direct pass of the mesh data as kept by the emscripten compiled code to the rendering engine. The file is parsed into a mesh using the vcg parsing code and passed back to three.js
* `LoadProcRender2` alternative approach. The mesh is loaded using three.js parsers and then the mesh data are passed in some compact way to the emscripten that trasform it back into a vcg mesh.


Update test:
* `LoadProc` OK
* `LoadProcSave1` OK
* `LoadProcSave2` OK  

* `LoadRender1` 

	* test PLY in `LoadRender1 (PLY)` folder: 
	Loader ply (PLYloader.js file in the folder js) was in version 63 of the library Three.js, and today, in version 70, no longer exists. I found it in another repository (https://github.com/josdirksen/learning-threejs), together with the file Three.js (I uploaded js folder of our repository). As well as with json, it doesn't work with all the mesh, but only with some: test.ply, which is a mesh of example found in the repository above, is shown, while density.ply (which is a mesh that comes from the examples of his lectures) no. In addition, the loader ply is incompatible with API FileReader of html5, because the function does a get with the argument passed to the loader, and get going to search for the file in the server hosting our page, not finding nothing.

	* Test with JSON
	Three.js today, in the official documentation, provides various loader, including those for json file. Following the examples of the documentation I tried to load the mesh in json (one found in a repository, the other created through MeshLab) but returns error. Do not load any files.

	* Parser in the folder 'LoadRender2':
	It reads files encoded OFF and COFF (ignoring the colors)
	Problem: centralize and scale rendering of the mesh automatically

* `PassArrayCppToEmScripten` 
	test vector from cpp to js. Since we don't know the length of the vector at runtime, you need to call getLength that returns the length of the vector. In js method getVector returns the pointer to the first memory address of the vector and, knowing the length of the vector and the content type, we can iterate for each element of the vector, retrieving through
			Module.getValue (pointer, 'type')
	where type can be '*' or 'i8*' 
	NBB: compiling specify the flag --bind

* `LoadProcRender1` OK
	file is loaded using html5 file api, then it passed to the allocator, read as MyMesh and from methods 'openMesh', 'getVertexNumber', 'getVertexVector', 'getFaceNumber' and 'getFaceVector' passed to 'createMesh' for renderize in three.js
	
* `LoadProcRender2`
	Same problem as LoadRender1 

