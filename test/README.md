# test 
This folder contains minimal code samples for testing the basic mechanisms for a **client-side-only**, javascript based, mesh processing application that is based on emscripten and the vcglib for the core processing part. 

The high level objective is to set up in the most efficient way a framework that allows: 

1. loading a mesh from local storage
2. visualising it using either three.js or spidergl or even direct webgl. 
3. applying some mesh processing algorithm on it using the c++ code compiled in asm.js
4. passing back to three.js and substituting the currently shown mesh
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

* `LoadRender1 (PLY)` implement a basic load-render pipeline using three.js. It takes a file from the local file system, parse it using the three.js loaders and render it. 
	* Loader ply (PLYloader.js file in the folder js) was in version 63 of the library Three.js, and today, in version 70, no longer exists. I found it in another repository (https://github.com/josdirksen/learning-threejs), together with the file Three.js (This Three.js version is in js folder). It doesn't work with all the mesh, but only with some: test.ply, which is a mesh of example found in the repository above, is shown, while density.ply no. In addition, the loader ply is incompatible with API FileReader of html5, because the function does a get with the argument passed to the loader, and get going to search for the file in the server hosting our page, not finding nothing.
	**Status**: Complete

* `LoadRender1 (JSON)` implement a basic load-render pipeline using three.js. It takes a file from the local file system, parse it using the three.js loaders and render it.
	* Three.js today, in the official documentation, provides various loader, including those for json file. Following the examples of the documentation I tried to load the mesh in json (one found in a repository, the other created through MeshLab) but returns error. Do not load any files.
	**Status**: Complete

* `LoadRender1 (parse BLOB)` 
	* It reads files encoded OFF and COFF (ignoring the colors) using a function, 'parseOff', which parse the content of a blob, blob created by file loaded using fileReader html5 Api 
	**Status**: Complete

* `LoadProcRender2` alternative approach. The mesh is loaded using three.js parsers and then the mesh data are passed in some compact way to the emscripten that trasform it back into a vcg mesh.
	**Status**: Unavaiable


* `PassArrayCppToEmScripten` 
	Example of bind a vector from cpp to js. Since we don't know the length of the vector at runtime, you need to call 'getLength' that returns the length of the vector. In js, method 'getVector' returns the pointer to the first memory address of the vector and, knowing the length of the vector and the content type, we can iterate for each element of the vector, retrieving through
			Module.getValue (pointer, 'type')
	where type can be '*' or 'i8*' 
	NBB: Emcc compiler needs to specify the flag --bind
	**Status**: Complete


* `LoadProcRender1.0` OFF file -> mem -> c++ Mem Parsing -> three.js
	* File OFF is loaded using html5 file api, then it passed to the allocator read as MyMesh by method 'openStream' (vcglib-> wrap/io_trimesh/import_off.h). From methods 'openMesh', 'getVertexNumber', 'getVertexVector', 'getFaceNumber' and 'getFaceVector' the mesh is passed to 'createMesh' for renderize in three.js
	When you load another mesh, the previous one is deleted.
	**Status**: Complete

* `LoadProcRender1.1` OFF file -> mem -> c++ mem to file -> c++ File Parsing -> three.js
	* File OFF is loaded using html5 file api, then it passed to the allocator, wrote to a tmp file in c++, read by classic method 'open' (vcglib-> wrap/io_trimesh/import_off.h). From methods 'openMesh', 'getVertexNumber', 'getVertexVector', 'getFaceNumber' and 'getFaceVector' the mesh is passed to 'createMesh' for renderize in three.js
	When you load another mesh, the previous one is deleted.
	**Status**: Complete

* `LoadProcRender1.2` Same of above but for ply
	**Status**:  work for ascii. report error for binary...

* `LoadProcRender1.3` STL file -> mem -> c++ mem to file -> c++ File Parsing -> three.js
	* File STL (ascii or binary) is loaded using html5 file api, then it passed to the allocator, wrote to a tmp file in c++, read by classic method 'open' but, rather than read file in a classical "string" way and write in c++ file in a basic way, Emscripten, for read binary files, needs to read data as arrayBuffer of the data. In fact file is loaded in an ArrayBuffer of size equals to file size, then it passed in an array and finally write in memory by 'Module.writeArrayToMemory' call. In c++, file is written by 'ofstream' call with parameter 'std::ofstream::binary', i.e 'ofstream f("tmp.stl", std::ofstream::binary);' and file is written using f.write rathen than '<<' operator.
	**Status**: Complete

* `LoadProcRender1.4` mesh file -> tmp file -> c++ File Parsing -> three.js
	* File (ascii or binary, format obj, ply, stl, off, vmi)  is loaded using html5 file api, then it read from FileReader html5 Api, wrote to a tmp file in Js, read by classic method 'open'.
	Don't work with html5 FileWriter Api because, despite Js created the file, cpp code compiled by Emscripten is unable to retreive this file.
	The solution is create file by Emscripten function 'FS.createDataFile(position,fileName,content,readable,writable)' which permits to create a file directy in memory by Js without require allocation of memory and read/write data in low-level memory, but simply work with file.
	* NBB: It can't pass directly file name for incompatibility problems with the length of name
	**Status**: Complete

* `LoadProcRender2.0` mesh file -> tmp file -> c++ File Parsing -> three.js
	* Same as above, but in cpp source there is more elegant class 'MeshLabJs' instead of a set of function. Conseguently in JS functions are called by instance of 'Module.MeshLabJs' in a way similar to OOP.
	**Status**: Complete

* `Shaders` The folder contains exemples of shaders implementation using three.js
	* `PhongShader` Simple exemple of a shader using phong illumination model. **Status**: Complete
	* `Wireframe1.0` First test to create wireframe with shaders using Lambert illumination model. **Status**: Complete
	* `Wireframe2.0` Same as above, but to dodecahedron on the left is applied the Phong illumination model. The dodecahedron on the right is the seame of `Wireframe1.0`. **Status**: Complete

* `jQueryGUI` The folder contains the development steps to realize the graphic user interface of MeshLabJs and its code refactoring
	* `v1` GUI first version.
	* `v2` The GUI main widgets are almost all implemented. Initial phase of development of the new ad hoc library (`mlj`) to build and control MeshLabJs GUI.
	* `v3` Varius improvements to `mlj` library. Now is possible to load multiple mesh file at the same time. 
	
	