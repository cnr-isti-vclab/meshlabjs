MeshLabJS Code Documentation
============================
Basic Concepts
--------------


Filters
-------
MeshLabJS works on a flat set of meshes, called layers.
Filters are simple functional processing pieces that works on the current meshes and, according to the parameters perform some mesh processing task.
Filters structure is quite rigid. There are three kinds of filters according to the number of meshes that they can take in input:
- 0 - Creation filters
- 1 - Single mesh filters (they can be applied to all the layers together
- n>1 - Filters that take in input two or more meshes and perform something else (like transferring information, computing distances etc.)

Filters parameters are standardized and there are only a few possible types of input. 
Each type correspond to a widget defined in {@link MLJ.gui.MLWidget }.
This is a requirement for building up uniform interfaces.
- Integer
- Float
- Color {@link MLJ.gui.MLWidget.Color}
- Layer

The filters have the following strict requirements:
- You can assume that the vcg mesh is compact and you have to leave it so.
- You can assume that the bounding box is computed and you have to leave it so.
- You can assume that in triangular meshes normals per vertex and per face are computed and they are normalized.

Rendering Passes
----------------
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
 you work, and the {@link MLJ.core.Layer} class that actually holds each one of the mesh.

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
Launch a local webserver serving the pages from the root of the git repo and open the *MeshLabJS* folder (usually *http://localhost/MeshLabJS/*) with your web browser.

### Documentation
For building the code documentation see *MeshLabJS/doc/readme.md* file.

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


## Scene Rendering in MeshLabJS

A scene in MeshLabJS is composed by a set of meshes (called layers) loaded from files or generated through filter tools and rendered using modes such as filled, wireframe or point, eventually enhanced with the visualization of face/vertex normals,  selected vertices/faces, etc. and with some effects as radiance scaling and screen space ambient occlusion.

Internally MeshLabJS represents mesh entities as layers objects, rendering modes/enhancements as overlaying 3js mesh objects and special effects through objects that force the render system to use deferred rendering like techniques.

######  Layers, overlays and rendering plugins

A {@link MLJ.core.Layer} object represents a single loaded or computed mesh. It is based on a cppMesh object which stores the actual mesh representation and offers access to vcg library functions compiled in asm.js for querying information about the mesh: 
vertices, indices to vertices, normals, colors are extracted to fill some [3js BufferAttribute](http://threejs.org/docs/#Reference/Core/BufferAttribute) objects and to build then a [3js BufferGeometry](http://threejs.org/docs/#Reference/Core/BufferGeometry) and from this a [3js Mesh](http://threejs.org/docs/#Reference/Objects/Mesh) object. This 3js object is also used as group contained and will store temporary transformations. The mesh of a layer can be visualized only through the activation of one or more rendering modes (filled, wired etc). Each rendering mode and other enhancements (show selected vertices/faces, normals etc) is handled by a separate rendering plugin which creates a new [3js Mesh](http://threejs.org/docs/#Reference/Objects/Mesh) every time it's activated. This 3js mesh is attached as son of the layer 3js mesh. Each overlay 3js node  uses a [BufferGeometry](http://threejs.org/docs/#Reference/Core/BufferGeometry) which is either the original BufferGeometry of the layer (parent) or a newly created one (to represent for example a subset of the whole geometry or a new geometry as the lines that represent normals) and to a new [3js Material](http://threejs.org/docs/#Reference/Materials/Material) created using plugin-specific shaders and values for shader uniforms/parameters taken from the current settings displayed by the widgets on the left, in the rendering tab of the gui.
Each layer maintains a collection overlays parameters corresponding to each option that can be changed from the gui widgets.
Since those widgets can be used to visualize the settings for different layers in different times, in MeshLabJS there is a notion of current selected layer from which the current settings can be read and visualized.
Another type of rendering plugin is the one used to activate effects which require post processings on the scene. At each activation, an object which encapsulates a post processing logic is created, saved and used in rendering.

######  How to add a new rendering plugin

Current rendering plugins all share a common structure. To extend MeshLabJS framework with new plugins we can proceed using that structure. 
If we define a new plugin in newPlugin.js in js/mlj/plugins/rendering folder, we add this in head element in index.html:
```
<script src="js/mlj/plugins/rendering/newPlugin.js"></script>.
```
We proceed creating a JavaScript IIFE:

```javascript
(function (plugin, core, scene) {
    // we put our new plugin definition here:
        // plugin object creation
        // data (for plugin logic, parameters, materials etc)
        // definition of _init and _applyTo
        // installation within the framework
})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
```
To create a new plugin, we create a new object representing a plugin in the framework and then we define two functions, _init and _applyTo as its methods. The first, _init, executes at framework startup, and  usually instantiates widgets to permit the users to change plugin's associated parameters and defines callbacks to be invoked at each parameter change. The second, _applyTo, executes every time the user activates/deactivates the plugin for the current layer. In case of a new rendering mode for example, in _applyTo usually we define a new [3js Mesh](http://threejs.org/docs/#Reference/Objects/Mesh) from a [BufferGeometry](http://threejs.org/docs/#Reference/Core/BufferGeometry) and a [3js Material](http://threejs.org/docs/#Reference/Materials/Material). Then we add the new mesh as a new overlay of the current layer. In case of a new post process effect, we add a function which implements the effect as a new post processing pass. Finally we install the plugin inside the framework.

######  Scene Graph

The {@link MLJ.core.Scene} object which represent a MeshLabJS scene organizes its entites on several collections: a collection of layers, a collection of decorators which represent scene level "background" meshes, a collection of post processing passes which represent the effects that require a post processing pass and a collection of 2d scene overlays. But to effectively render an image from 3D data with 3js, a scene has to be created, so the Scene object also stores and initializes a [3js scene](http://threejs.org/docs/#Reference/Scenes/Scene) object, a [3js camera](http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera) for perspective rendering, a [3js camera](http://threejs.org/docs/#Reference/Cameras/OrthographicCamera) for orthographic rendering for special effects, and a [directional light](http://threejs.org/docs/#Reference/Lights/DirectionalLight). A typical scene in 3js consists of several hierarchical 3D objects each with different transformations and properties, here instead a single [3js 3D object](http://threejs.org/docs/#Reference/Core/Object3D) is used as a group for all the meshes of the scene. It stores the global transformation that brings the global bbox of the scene in the camera reference system and all 3js meshes object of scene decorators and of current active layers overlays are added to it as its children. In this way scene MeshLabJS delegates to 3js the scene managament for rendering.

######  Rendering
When the stats option for fps/ms counting is disabled, a scene is rendered only when an event associated to the underlying canvas occurs (for example, mouse movement or drag) or when the scene changes. Otherwise, when stats counting is active, a traditional rendering loop with requestAnimationFrame is used. In either cases to render a scene, if there are no post process effects enabled, MeshLabJS uses  3js to do a classic forward rendering of its scene containing a single 3D group object with all the created  meshes from overlays and decorators. Note that MeshLabJS does not ensure any specific criterion for sorting meshes to render, so all depends on  3js which actually sorts and renders opaque meshes in front to back and then sorts and renders transparent meshes in back to front. MeshLabJS uses this fact to render as transparent not only those meshes that require transparency (for example the meshes for wireframe rendering, see the technique in corresponding fragment shader) but also those meshes that should be rendered after the opaque ones (such as the meshes containing the selected faces/vertices, which do only z reading and not z buffering). But obviously, among opaque or transparent meshes, MeshLabJS has no control on the rendering order, in particular 3js sorts opaque/transparent meshes with same depth in an arbitrary way. 
Otherwise to render a scene when some post process effect is enabled, 3js is used first to render the scene to an off screen buffer on which post process passes are applied one after the other according to the user's activation order, finally the resulting buffer is rendered to the screen.
