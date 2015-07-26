MeshLabJS Code Documentation
=========

The main namespace is {@link MLJ.core} and the two main elements are the {@link MLJ.core.Scene}
 namespace that holds the whole document concept of the system, e.g. the set of meshes on which
 you work, and the {@link MLJ.core.MeshFile} class that actually holds each one of the mesh.

Two part of MeshLabJs are designed for extendability, *filters* and *rendering passes*.

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


Interface
--------- 
The system at startup builds the whole interface as follows...


Javascript & C++ Interaction
----------------------------
All the mesh processing tasks are performed in C++ compiled to asm.js using emscripten.

