
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "BackgroundGrid",
        tooltip: "Draws a gridded background that can be used as a reference.",
        icon: "img/icons/background_grid.png",
        toggle: true,
        on: false,
        loadShader: ["BackgroundGridVertex.glsl", "BackgroundGridFragment.glsl"]
    });
    
    var backgroundGrid; // Object3D that will contain the grid (which is formed of several different components)
    var flatMeshList; // Array that will contain the reference to the flat meshes. Needed to set them visible or invisible once the plugin is enabled
    
    var DEFAULTS = {
        boxRatio : 2,
        majorSpacing : 10,
        minorSpacing : 1,
        frontGridCulling: true,
        silhouettes : false,
        backGridColor : new THREE.Color(0xededed),
        frontGridColor : new THREE.Color(0xededed)
    };
    
    // Shading object for the shader. The values are set when the shading is used
    var SHADING = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            {
                "backColor": {type: "v3", value: ""},
                "frontColor": {type: "v3", value: ""},
                "alpha": {type: "f", value: ""},
                "normal": {type: "v3", value: ""},
                "frontGridCulling": {type: "i", value: ""},
                "scaleFactor" : {type: "f", value: ""},
                "offset" : {type: "v3", value: ""},
            }
        ])
    };
    
    var boxRatio, majorSpacing, minorSpacing, frontGridCulling, silhouettes, backGridColor, frontGridColor;

    plug._init = function (guiBuilder) {
        boxRatio = guiBuilder.Integer({
            min: 1, step: 1, defval: DEFAULTS.boxRatio,
            label: "Box Ratio",
            tooltip: "The size of the grid around the object w.r.t. the bbox of the object",
            bindTo: (function() {
                var bindToFun = function() {
                    if(boxRatio.getValue() > 0)
                        plug._onBackgroundGridParamChange();
                };
                bindToFun.toString = function() {
                    return 'boxRatio';
                }
                return bindToFun;
            }())
        });
        
        majorSpacing = guiBuilder.Integer({
            min: 1, step: 1, defval: DEFAULTS.majorSpacing,
            label: "Major Spacing",
            tooltip: "It defines the spacing between major squares on the grid",
            bindTo: (function() {
                var bindToFun = function() {
                    if(boxRatio.getValue() > 0)
                        plug._onBackgroundGridParamChange();
                };
                bindToFun.toString = function() {
                    return 'majorSpacing';
                }
                return bindToFun;
            }())
        });
        
        minorSpacing = guiBuilder.Integer({
            min: 1, step: 1, defval: DEFAULTS.minorSpacing,
            label: "Minor Spacing",
            tooltip: "It defines the spacing between minor squares on the grid",
            bindTo: (function() {
                var bindToFun = function() {
                    if(boxRatio.getValue() > 0)
                        plug._onBackgroundGridParamChange();
                };
                bindToFun.toString = function() {
                    return 'minorSpacing';
                }
                return bindToFun;
            }())
        });
        
        frontGridCulling = new guiBuilder.Bool({
            defval: DEFAULTS.frontGridCulling,
            label: "Front Grid Culling",
            tooltip: "If true, parts of the grid in front of the camera will not be displayed",
            bindTo: (function() {
                var bindToFun = function() {
                    if(scene._backgroundGrid)
                        changeShaderUniform(backgroundGrid, "frontGridCulling", frontGridCulling.getValue());
                };
                bindToFun.toString = function() {
                    return 'silhouettes';
                }
                return bindToFun;
            }())
        });  
        
        silhouettes = new guiBuilder.Bool({
            defval: DEFAULTS.silhouettes,
            label: "Show Silhouette",
            tooltip: "If true, the silhouettes of the layer will be displayed on the grid",
            bindTo: (function() {
                var bindToFun = function() {
//                    plug._onBackgroundGridParamChange();
                    if(scene._backgroundGrid)
                    {
                        for(var i = 0; i < flatMeshList.length; i++)
                            flatMeshList[i].visible = silhouettes.getValue();
                    }
                };
                bindToFun.toString = function() {
                    return 'silhouettes';
                }
                return bindToFun;
            }())
        });  
        
        backGridColor = guiBuilder.Color({
            label: "Back Grid Color",
            tooltip: "",
            color: "#" + DEFAULTS.backGridColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onBackgroundGridParamChange();
                };
                bindToFun.toString = function() {
                    return 'backGridColor';
                }
                return bindToFun;
            }())
        });
        
        frontGridColor = guiBuilder.Color({
            label: "Front Grid Color",
            tooltip: "",
            color: "#" + DEFAULTS.frontGridColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onBackgroundGridParamChange();
                };
                bindToFun.toString = function() {
                    return 'frontGridColor';
                }
                return bindToFun;
            }())
        });
    };
    
    
    plug._onBackgroundGridParamChange = function() {
//        var currentLayer = MLJ.core.Scene.getSelectedLayer();
//        if (currentLayer.properties.getByKey(plug.getName()) === true) {
        if(scene._backgroundGrid)
        {
            this._applyTo(false);
            this._applyTo(true);
        }
    };
   
    plug._applyTo = function (on) {
        if (on) {
            var backgroundGrid = createBackgroundGrid();
            
            scene._backgroundGrid = true;
               
            scene.addSceneDecorator(plug.getName(), backgroundGrid);
        } else {
            scene.removeSceneDecorator(plug.getName());

            scene._backgroundGrid = false;
        }
    };
    
    // Helper function that takes an object and applies recursively a value to the material's 
    // uniform of the object  and all of his children (if there are any)
    function changeShaderUniform(object, uniformName, value)
    {
        if(object.material !== undefined)
            object.material.uniforms[uniformName].value = value;
                
        var children = object.children;
                            
        for(var i = 0; i <  children.length; i++)
            changeShaderUniform(children[i], uniformName, value);
    }
    
    // Auxiliary funtion that computes mod operation with better accuracy over floats
    function fmod(a, b) 
    { 
        return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); 
    }
    
    /*
     * Creates the background grid for the scene
     * 
     * @returns {THREE.Object3D} the background grid created
     */
    function createBackgroundGrid()
    {
        // Parameters from the GUI
        var scalefactor = boxRatio.getValue() - 1; 
        var majorTick = majorSpacing.getValue();
        var minorTick = minorSpacing.getValue();
        var backColor = new THREE.Color(backGridColor.getColor());
        var frontColor = new THREE.Color(frontGridColor.getColor());
                  
        var bbox = scene.getBBox();
        
        
        // List of flat meshes. Initially empty
        flatMeshList = [];
        
        // Scale vector for the grid
        var scaleVector = new THREE.Vector3();
        scaleVector.copy(bbox.max);
        scaleVector.sub(bbox.min);
        scaleVector.multiplyScalar((scalefactor));
        
        // New minimum point for the bounding box, according to the scale factor
        var bbMin = new THREE.Vector3();
        bbMin.copy(bbox.min);
        bbMin.sub(scaleVector);
        
        // New maximum point for the bounding box, according to the scale factor
        var bbMax = new THREE.Vector3();
        bbMax.copy(bbox.max);
        bbMax.add(scaleVector);
        
        // Switching to arrays to make operations on the x,y,z components easier
        var minPArray = bbMin.toArray();
        var maxPArray = bbMax.toArray();
        
        // Arrays that will store the minimum and maximum points of the grids
        var minGArray = [];
        var maxGArray = [];
        
        // For each axis we need to make the box well rounded with respect to the major tick value
        for(var i = 0; i < 3; ++i) 
        {
            if(minPArray[i] > 0 ) minGArray[i] = minPArray[i] - fmod(minPArray[i],majorTick) - majorTick;
            if(minPArray[i] ==0 ) minGArray[i] = majorTick;
            if(minPArray[i] < 0 ) minGArray[i] = minPArray[i] + fmod(Math.abs(minPArray[i]),majorTick) - majorTick;
            if(maxPArray[i] > 0 ) maxGArray[i] = maxPArray[i] - fmod(maxPArray[i],majorTick) + majorTick;
            if(maxPArray[i] ==0 ) maxGArray[i] = majorTick;
            if(maxPArray[i] < 0 ) maxGArray[i] = maxPArray[i] + fmod(Math.abs(maxPArray[i]),majorTick);
        }

        // Switching back to vectors
        var minPVec = new THREE.Vector3();
        var maxPVec = new THREE.Vector3();
        var minGVec = new THREE.Vector3();
        var maxGVec = new THREE.Vector3();

        minPVec.fromArray(minPArray);
        maxPVec.fromArray(maxPArray);
        minGVec.fromArray(minGArray);
        maxGVec.fromArray(maxGArray);
        
        // Object that will store the whole background grid
        backgroundGrid = new THREE.Object3D();

        // Middle point between minPVec and maxPVec
        var centerVec = new THREE.Vector3(minPVec.x, minPVec.y, minPVec.z);
        centerVec.add(maxPVec);
        centerVec.divideScalar(2);
       
        // Current viewpoint. Needed to check whether a given grid of the box is front facing
        var viewPos = scene.getCamera().position.clone();
        
        // The viewpoint of the camera is given with respect to the center of the bounding box of the scene; since the bounding box of the grid
        // is given in world coordinates, we need to convert the camera coordinates to world coordinates. To do that, we apply the same transformation
        // which is applied to the scene when an object is loaded. In this way with get the absolute camera position and with that we can compute which parts
        // of the grid are in front of the camera (needed for face culling)
        var scaleFac = 15.0 / (bbox.min.distanceTo(bbox.max));
        var offset = bbox.center().negate();
        offset.multiplyScalar(scaleFac);
       
        // Applying the transformation backwards. After this, the viewpoint will be in world coordinates
        viewPos.sub(offset);
        viewPos.divideScalar(scaleFac);

        // Iterations over every side of the box
        for(var i = 0; i < 3; ++i)
        {
            for(var j = 0; j < 2; ++j)
            {
                // Creating the grid
                var grid = createGrid(i, j, minGVec, maxGVec, minorTick, majorTick, backColor, frontColor);
                backgroundGrid.add(grid);

                // Creating the silhouettes (which will be invisible if the option is not enabled)
                backgroundGrid.add(createFlatMesh(i, j, minGVec, maxGVec));
            } 
        }
                
        return backgroundGrid;
    }
    
    
    
    /**
     * Creates a single grid of the box
     * 
     * @param {int} axis current axis the grid is perpendicular to (x == 0, y == 1, z == 2)
     * @param {int} side the side of the box (either 0 or 1)
     * @param {THREE.Vector3} minGVec minimum point of the grid
     * @param {THREE.Vector3} maxGVec maximum point of the grid
     * @param {int} minorTick value that describes how many squares are presenet in each inner square of the grid
     * @param {int} majorTick value that describes how many inner squares are presenet in the grid
     * @param {THREE.Color} backColor color of the faces of the box that are behind the viewpoint
     * @param {THREE.Color} frontColor color of the faces of the box that are in front of the viewpoint
     * @returns {THREE.Object3D} the grid
     */
    function createGrid(axis, side, minGVec, maxGVec, minorTick, majorTick, backColor, frontColor)
    {
        // To facilitate the creation of the grid, we consider the grid to be always perpendicular to the Z axis 
        // (so the grid represent a XY plane)
        var xAxis = (1 + axis) % 3;
        var yAxis = (2 + axis) % 3;
        var zAxis = (0 + axis) % 3; 
        
        // Colors are a bit diffrent to separate the inner squares. The separating lines are a bit lighter
        var minorBackColor = backColor;
        var majorBackColor = new THREE.Color();
        majorBackColor.r = Math.min(255.0, minorBackColor.r * 2.0); 
        majorBackColor.g = Math.min(255.0, minorBackColor.g * 2.0);
        majorBackColor.b = Math.min(255.0, minorBackColor.b * 2.0);
        
        var minorFrontColor = frontColor;
        var majorFrontColor = new THREE.Color();
        majorFrontColor.r = Math.min(255.0, minorFrontColor.r * 2.0); 
        majorFrontColor.g = Math.min(255.0, minorFrontColor.g * 2.0);
        majorFrontColor.b = Math.min(255.0, minorFrontColor.b * 2.0);
        
        // We draw orizontal and vertical lines onto the XY plane snapped with the major ticks. These points 
        // will store the coordinates of each line while the geometry is built (p1 and p2 will be horizzontal lines, p3 and p4 vertical lines)
        var p1 = [];
        var p2 = [];
        var p3 = [];
        var p4 = [];
        
        // Switching to arrays for easier computations
        var minGArray = minGVec.toArray();
        var maxGArray = maxGVec.toArray();
        
        // The value of the perpendicular component depends on the current side of the box
        p1[zAxis] = p2[zAxis] = p3[zAxis] = p4[zAxis] = side ? maxGArray[zAxis] : minGArray[zAxis];

        // p1 and p2 represent horizzontal lines, so the y values is fixed; the opposite happens with p3 and p4
        p1[yAxis] = minGArray[yAxis];
        p2[yAxis] = maxGArray[yAxis];
        p3[xAxis] = minGArray[xAxis];
        p4[xAxis] = maxGArray[xAxis];

        // Geometries for the minor and major ticks
        var geometryMinor = new THREE.BufferGeometry();
        var geometryMajor = new THREE.BufferGeometry();
        
        // Computing the normal (used by the shader), which is normalized and perpendicular to the (theoretical) Z axis
        var normalArray = [];
        normalArray[xAxis] = 0;
        normalArray[yAxis] = 0;
        normalArray[zAxis] = side ? -1 : 1;

        var normalVec = new THREE.Vector3();
        normalVec.fromArray(normalArray);
        
        // The position of the camera used in the shader is given with respect to the center of the bounding box of the scene; since the bounding box of 
        // the grid is given in world coordinates, we need to convert the camera coordinates to world coordinates. To do that, we apply the same transformation
        // which is applied to the scene when an object is loaded. In this way with get the absolute camera position and with that we can compute which parts
        // of the grid are in front of the camera (needed for face culling)
        var bbox = scene.getBBox();
        var scaleFac = 15.0 / (bbox.min.distanceTo(bbox.max));
        var offset = bbox.center().negate();
        offset.multiplyScalar(scaleFac);
        
        // Trasforming the Color objects into Vector3 elements so that they can be directly used in the shader program
        minorBackColor = new THREE.Vector3(minorBackColor.r, minorBackColor.g, minorBackColor.b);
        minorFrontColor = new THREE.Vector3(minorFrontColor.r, minorFrontColor.g, minorFrontColor.b);
        
        // Uniforms for the minor part of the grid
        var uniformsMinor = THREE.UniformsUtils.clone(SHADING.uniforms);
        uniformsMinor.backColor.value = minorBackColor;
        uniformsMinor.frontColor.value = minorFrontColor;
        uniformsMinor.alpha.value = 0.2;
        uniformsMinor.normal.value = normalVec;
        uniformsMinor.frontGridCulling.value = frontGridCulling.getValue();
        uniformsMinor.scaleFactor.value = scaleFac;
        uniformsMinor.offset.value = offset;
        
        
        var majorBackColor = new THREE.Vector3(majorBackColor.r, majorBackColor.g, majorBackColor.b);
        var majorFrontColor = new THREE.Vector3(majorFrontColor.r, majorFrontColor.g, majorFrontColor.b);
        
        var uniformsMajor = THREE.UniformsUtils.clone(SHADING.uniforms);
        uniformsMajor.backColor.value = majorBackColor;
        uniformsMajor.frontColor.value = majorFrontColor;
        uniformsMajor.alpha.value = 0.2;
        uniformsMajor.normal.value = normalVec;
        uniformsMajor.frontGridCulling.value = frontGridCulling.getValue();
        uniformsMajor.scaleFactor.value = scaleFac;
        uniformsMajor.offset.value = offset;
        
        
        // Container-mesh that will contain all the lines of the grid
        var gridMesh = new THREE.Object3D();
        
        // Iterations range for the lines that represent minor ticks (aMin, aMax) and major ticks (bMin, bMax)
        var aMin = minGArray[xAxis];
        var aMax = maxGArray[xAxis];
        var bMin = minGArray[yAxis];
        var bMax = maxGArray[yAxis];
        
        var vertices = []; 

        // Iterations to create the horizzontal minor lines
        for(var step = aMin; step <= aMax; step += minorTick)
        {
            // Defining the step
            p1[xAxis] = p2[xAxis] = step;
            // Adding the vertices to the geometry
            vertices.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);     
        }
          
 
        // Iterations to create the vertical minor lines
        for (var step = bMin; step <= bMax; step += minorTick)
        {
            p3[yAxis] = p4[yAxis] = step;
            vertices.push(p3[0], p3[1], p3[2], p4[0], p4[1], p4[2]);   
        }
        
        // Adding the vertices as attribute to the geometry
        geometryMinor.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        
        
        var shaderParametersMinor = {
            vertexShader: plug.shaders.getByKey("BackgroundGridVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("BackgroundGridFragment.glsl"),
            uniforms: uniformsMinor,
            attributes: geometryMinor.attributes,
            transparent: true,
            lights: true
        };
        
        // Creating lines as set of lines and adding them to the container mesh
        var materialMinor = new THREE.RawShaderMaterial(shaderParametersMinor);
        var minorGrid = new THREE.Line(geometryMinor, materialMinor, THREE.LinePieces);
        
        gridMesh.add(minorGrid);
        
        
        vertices = [];
        
        // Iterations to create the horizzontal major lines
        for (var step = aMin; step <= aMax; step += majorTick)
        {
            p1[xAxis] = p2[xAxis] = step;
            vertices.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);             
        }
        
        // Iterations to create the vertical major lines
        for (var step = bMin; step <= bMax; step += majorTick)
        {
            p3[yAxis] = p4[yAxis] = step;
            vertices.push(p3[0], p3[1], p3[2], p4[0], p4[1], p4[2]);   
        }
        
        geometryMajor.addAttribute( 'position', new THREE.BufferAttribute(new Float32Array(vertices), 3 ) );
        
        var shaderParametersMajor = {
            vertexShader: plug.shaders.getByKey("BackgroundGridVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("BackgroundGridFragment.glsl"),
            uniforms: uniformsMajor,
            attributes: geometryMajor.attributes,
            transparent: true,
            lights: true
        };
        
        var materialMajor = new THREE.RawShaderMaterial(shaderParametersMajor);
        var majorGrid = new THREE.Line(geometryMajor, materialMajor, THREE.LinePieces);
        
        gridMesh.add(majorGrid);

        return gridMesh;
    }
    
    /**
     * Creates a flat version of the currently active mesh and positions it on the grid perpendicular to the given axis, in one
     * of the 2 sides
     * 
     * @param {int} axis current axis the flat mesh needs to be perpendicular to (x == 0, y == 1, z == 2)
     * @param {int} side the side of the box considered (either 0 or 1)
     * @param {THREE.Vector3} minGVec minimum point of the grid
     * @param {THREE.Vector3} maxGVec maximum point of the grid
     * @returns {THREE.Mesh} the flattened mesh
     */
    function createFlatMesh(axis, side, minGVec, maxGVec)
    {
        // The flat mesh is always the one of the currently selected layer, so we need to get the THREE.Mesh object of the layer
        var currentMesh = MLJ.core.Scene.getSelectedLayer().getThreeMesh();
        
        // We are going to make copies of the mesh, so we need the geometry of the current mesh. Because of deallocation needs, we need
        // to get a copy of the geometry, otherwise when this plugin is deselected, the geometry of the current mesh would be deleted too
        var currentMeshGeometry = currentMesh.geometry.clone();       
        
        // To facilitate the creation of the grid, we consider the flat mesh to be always perpendicular to the Z axis 
        // (so the flat mesh will be placed, theoretically, on the XY plane)
        var xAxis = (1 + axis) % 3;
        var yAxis = (2 + axis) % 3;
        var zAxis = (0 + axis) % 3; 
        
        // We compute the normal (used by the shader), which is normalized and perpendicular to the Z axis
        var normalArray = [];
        normalArray[xAxis] = 0;
        normalArray[yAxis] = 0;
        normalArray[zAxis] = side ? -1 : 1;

        var normalVec = new THREE.Vector3();
        normalVec.fromArray(normalArray);
        
        // Color to be passed to the shader as uniform
        var colorObj = new THREE.Color(0xb5c0c4);
        var color = new THREE.Vector3(colorObj.r, colorObj.g, colorObj.b);
        
        // The position of the camera used in the shader is given with respect to the center of the bounding box of the scene; since the bounding box of 
        // the grid is given in world coordinates, we need to convert the camera coordinates to world coordinates. To do that, we apply the same transformation
        // which is applied to the scene when an object is loaded. In this way with get the absolute camera position and with that we can compute which parts
        // of the grid are in front of the camera (needed for face culling)
        var bbox = scene.getBBox();
        var scaleFac = 15.0 / (bbox.min.distanceTo(bbox.max));
        var offset = bbox.center().negate();
        offset.multiplyScalar(scaleFac);
        
        // Uniforms for the shader
        var uniforms = THREE.UniformsUtils.clone(SHADING.uniforms);
        uniforms.backColor.value = color;
        uniforms.frontColor.value = color;
        uniforms.alpha.value = 0.9;
        uniforms.normal.value = normalVec;
        uniforms.frontGridCulling.value = frontGridCulling.getValue();
        uniforms.scaleFactor.value = scaleFac;
        uniforms.offset.value = offset;
        
        // Position array (containing vertex coordinates) 
        var pos = currentMeshGeometry.getAttribute('position').array;       
        
        // Creating the new geometry and adding the position array as attribute
        var flatMeshGeometry = new THREE.BufferGeometry();
        flatMeshGeometry.addAttribute('position', new THREE.BufferAttribute((pos), 3));
 
        // Index array
        var indexAttribute = currentMeshGeometry.getAttribute('index');
        
        // If the current mesh is a point cloud, the index array isn't defined; so, I only add the indices as attributes if they are present
        if(indexAttribute)
            flatMeshGeometry.addAttribute('index', new THREE.BufferAttribute((indexAttribute.array), 3));
        
        // Parameters of the shader material
        var shaderParameters = {
            vertexShader: plug.shaders.getByKey("BackgroundGridVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("BackgroundGridFragment.glsl"),
            uniforms: uniforms,
            attributes: flatMeshGeometry.attributes,
            transparent: true,
            lights: true
        };
        
        // Creating lines as set of lines and adding them to the container mesh
        var material = new THREE.RawShaderMaterial(shaderParameters);
        var flatMesh = new THREE.Mesh(flatMeshGeometry, material);
        
        // Scaling factor. Small value to make the mesh look like 2D
        var scaleFactor = 0.01;
        
        // We scale the given axis so the mesh gets flattened
        switch(axis)
        {
            case 0:
                flatMesh.scale.x = scaleFactor;
                break;
            case 1:
                flatMesh.scale.y = scaleFactor;
                break;
            case 2:
                flatMesh.scale.z = scaleFactor;
                break;
        }   
        
        // Transform array. We need to position the new flat mesh along its grid, depending on the side
        var transArray = side ? maxGVec.toArray() : minGVec.toArray();
        
        // In order to avoid some flickering, we need to move just a little bit on the [axis] coordinate so 
        // that the mesh looks like to be on the grid, but it's actually a bit shifted
        transArray[axis] += side ? -0.1 : 0.1;
        transArray[(axis+1) % 3] = 0;
        transArray[(axis+2) % 3] = 0;
        
        // Changing the position
        flatMesh.position.set(transArray[0], transArray[1], transArray[2]);
        
        // In order for the shader to work correctly when the face culling is active, we need to change the vertex position at the 
        // geometry level, so that all the vertexes end up in the same plane. To do that, we update the matrix and apply it to the geometry;
        // then, we reset position, rotation and scale of the mesh and update the matrix again
        flatMesh.updateMatrix();
        flatMesh.geometry.applyMatrix(flatMesh.matrix);
        flatMesh.position.set(0, 0, 0);
        flatMesh.rotation.set(0, 0, 0);
        flatMesh.scale.set(1, 1, 1);
        flatMesh.updateMatrix();

        // The choice whether to make the mesh visible or not depends on the GUI parameter
        flatMesh.visible = silhouettes.getValue();

        // Keeping a reference of the mesh, so that when the silhouette option changes we can set the mesh visible/invisible acoordingly
        flatMeshList.push(flatMesh);
        
        return flatMesh;
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
