MeshLabJS Code Documentation
=========
Basic Concepts
----------------


Filters
-------
MeshLabJS works on a flat set of meshes, called layers.
Filters are simple functional processing pieces that works on the current meshes and, according to the parameters perform some mesh processing task.
Filters structure is quite rigid. There are three kind of filters according to the number of meshes that they can take in input:
- 0 - Creation filters
- 1 - Single mesh filters (they can be applied to all the layers togheter
- n>1 - Filters that take in input two or more meshes and perform something else (like transferring information, computing distances etc.)

Filters parameters are standardized and there are only a few possible types of input. Each type correspond to a widget defined in {@link MLJ.gui.MLWidget } This is a requirement for building up uniform interfaces.
- Integer
- Float
- Color {@link MLJ.gui.MLWidget.Color}


Rendering Passes
---------
Rendering is organized in *passes*. Code for the pass is independent and isolated (as plugins).  
Each pass can be switched on/off independently per layer and the pass parameters are independent per layer.
The tab is organized as a list of icons. The first two icons are different and global (see below).
For each pass there is an icon with a small triangle below.
Behaviour:
-  Click on icon -> on/off rendering pass for the current layer. When a pass is off, nothing is done for that pass, the rendering callback for that layer is skipped (so if all the passes are off nothing is rendered)
- ‘Control’ modifier means “apply to all layers”. This means also that the current pass parameters are applied to all the layers.
- Right Click on icon-> on of the pass e off all the other ones.
- Click on triangle -> show parameters (for current layer)
change of the current layer means that the displayed status of the icons and of the parameters has to be updated accordingly.


Code Structure
-------------
The main namespace is {@link MLJ.core} and the two main elements are the {@link MLJ.core.Scene}
 namespace that holds the whole document concept of the system, e.g. the set of meshes on which
 you work, and the {@link MLJ.core.MeshFile} class that actually holds each one of the mesh.

Two part of MeshLabJs are designed for extendibility, *filters* and *rendering passes*.

Interface
---------
The system at startup builds the whole interface as follows...

Development Environment
-------------
MeshLabJS is written in C++ and JavaScript. All the code in C++ is compiled to Javascript with emscripten compiler.
It also use various libraries:
-   [**VCG Library**](http://vcg.isti.cnr.it/vcglib/): a open source portable C++ templated library for manipulation, processing and displaying with OpenGL of triangle and tetrahedral meshes.
-   [**Threes.js**](http://threejs.org/): a library for a simpler use of WebGL. Used for the rendering part.
-   [**jQuery**](https://jquery.com/): the famous JavaScript library.

### Build Instructions

For both Windows and Linux, you need to:  
1.  Download and install [**Emscripten**](https://kripken.github.io/emscripten-site/).  
2.  Download and install a generic webserver (**xammp**, **lamp**), necessary for cross origin requests used in the code.  
3.   Download [**VCG Library**](http://vcg.isti.cnr.it/vcglib/install.html) in the webserver public folder.  
4.  Clone the repository of *MeshLabJS* in the same folder of *vcglib*.  

After those passages the folder structure should be:
```
htdocs_or_www_webserver_folder  
|-- MeshLabJS  
|   |-- css
|   |-- doc
|   |-- img
|   |-- js
|   |-- mesh
|   |-- sources
|   |   |-- build.bat
|   |   `-- MakeFileJS
|   |-- test
|   |-- index.html
|   |-- LICENSE
|   `-- README.md
|-- vcglib
    |-- apps
    |-- docs
    |-- eigenlib
    |-- img
    |-- vcg
    `-- wrap
```

Note: not all file are listed above.

##### Windows
-  open *MeshLabJS/sources/* and launch *build.bat*

##### Linux
- open a terminal in *MeshLabJS/sources/*
-   execute the following commands:  
    >make -f MakefileJS clean  
    >make -f MakefileJS  
    >make -f MakefileJS install

##### Using
Launch the webserver and open the *MeshLabJS* folder (usually *http://localhost/MeshLabJS/*) with any javascript-capable browser.

### Documentation
For the code documentation, see *MeshLabJS/doc/readme.md* file.

Javascript & C++ Interaction
----------------------------
All the mesh processing tasks are performed in C++ compiled to asm.js using emscripten.
In the C++ functions is necessary to specify a emscripten bindings for the functions to be exported:
```cpp
#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLCreatePlugin) {
    emscripten::function("Function1Name", &Function1Pointer);
    ...
    emscripten::function("FunctionNName", &FunctionNPointer);
}
#endif
```
After that, with the object *Module* (a global JavaScript object with attributes that Emscripten-generated code calls at various points in its execution) is possible to call the function:
```javascript
Module.Function1Name(parameter_1, ...., parameter_n);
```
