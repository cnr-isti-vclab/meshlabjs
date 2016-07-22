
// This function is called at framework startup to add a new plugin
(function (plugin, core, scene) {

    // Default values for parameters used for this plugin
    var DEFAULTS = {
        specular: new THREE.Color('#505050'),
        emissive: new THREE.Color('#000000'),
        shininess: 15.0,
        lights: true,
        texBool: true,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        shading: THREE.FlatShading,
        sides: THREE.DoubleSide,
        mljColorMode: MLJ.ColorMode.Uniform
    };

    // Objects that define a collection of uniform for shaders used with this plugin
    var PHONG = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            {
                "shading": {type: "i", value: DEFAULTS.shading},
                "diffuse": {type: "c", value: {}},
                "emissive": {type: "c", value: DEFAULTS.emissive},
                "specular": {type: "c", value: DEFAULTS.specular},
                "shininess": {type: "f", value: DEFAULTS.shininess},
                "lights": {type: "i", value: DEFAULTS.lights},
                "texBool": {type: "i", value: DEFAULTS.texBool},
                "mljColorMode": {type: "i", value: DEFAULTS.mljColorMode}
            }
        ])
    };

    // Ok, now first build the object that represents the plugin
    var plug = new plugin.Rendering({
        name: "Filled",
        tooltip: "Enable the rendering of the triangle mesh surface of the current layer.",
        icon: "img/icons/flat.png",
        toggle: true,
        on: true,
        loadShader: ["PhongFragment.glsl", "PhongVertex.glsl"]
    }, DEFAULTS);

    // and then define _init, _applyTo functions on that object

    // here some variables for plugin functions state
    var texWidget, lightingWidget, shadingWidget, shininessWidget,
            specularColor, emissiveColor, texWrapWidgetS, texWrapWidgetT;

    var texturingChoiceWidgets = [];
    // define its init function
    plug._init = function (guiBuilder) {

        // create some associated widget options for the gui to allow parameters change

        specularColor = guiBuilder.Color({
            label: "Specular",
            tooltip: "Specular color of the material, i.e. how shiny the material is and the color of its shine. Setting this the same color as the diffuse value (times some intensity) makes the material more metallic-looking; setting this to some gray makes the material look more plastic",
            color: "#" + DEFAULTS.specular.getHexString(),
            bindTo: "specular"
        });

        emissiveColor = guiBuilder.Color({
            label: "Emissive",
            tooltip: "Emissive (light) color of the material, essentially a solid color unaffected by other lighting",
            color: "#" + DEFAULTS.emissive.getHexString(),
            bindTo: "emissive"
        });

        shininessWidget = guiBuilder.RangedFloat({
            label: "Shininess",
            tooltip: "How shiny the specular highlight is. A higher value gives a sharper highlight",
            min: 0, max: 100, step: 1,
            defval: DEFAULTS.shininess,
            bindTo: "shininess"
        });

        shadingWidget = guiBuilder.Choice({
            label: "Shading",
            tooltip: "How the triangles of a curved surface are rendered: as a smooth surface, as flat separate facets, or no shading at all",
            options: [
                {content: "Flat", value: THREE.FlatShading, selected: true},
                {content: "Smooth", value: THREE.SmoothShading}
            ],
            bindTo: "shading" // name of the parameter used to keep track of the associated value. It is linked directly to a uniform when changed
        });

        texWidget = guiBuilder.Choice({
            label: "Texturing",
            tooltip: "Enable/disable texturing",
            options: [
                {content: "On", value: true, selected: true},
                {content: "Off", value: false}
            ],
            bindTo: "texBool"
        });

        texWrapWidgetS = guiBuilder.Choice({
            label: "Tex Wrapping S",
            tooltip: "Enable/disable texturing",
            options: [
                {content: "On", value: THREE.RepeatWrapping},
                {content: "Off", value: THREE.ClampToEdgeWrapping, selected: true}
            ],
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option
                var bindToFun = function (wrapValue, overlay) {
                    if (MLJ.core.Scene.getSelectedLayer().texturesNum > 0) {
                        for (var i = 0; i < MLJ.core.Scene.getSelectedLayer().texturesNum; i++) {
                            overlay.material.uniforms.texture.value.wrapS = wrapValue;  // material update
                            overlay.material.uniforms.texture.value.needsUpdate = true;
                        }
                    }
                };
                bindToFun.toString = function () {
                    return 'wrapS';
                }; // name of the parameter used to keep track of the associated value
                return bindToFun;
            }())
        });

        texWrapWidgetT = guiBuilder.Choice({
            label: "Tex wrapping T",
            tooltip: "Enable/disable texturing",
            options: [
                {content: "On", value: THREE.RepeatWrapping},
                {content: "Off", value: THREE.ClampToEdgeWrapping, selected: true}
            ],
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option
                var bindToFun = function (wrapValue, overlay) {
                    if (MLJ.core.Scene.getSelectedLayer().texturesNum > 0) {
                        for (var i = 0; i < MLJ.core.Scene.getSelectedLayer().texturesNum; i++) {
                            overlay.material.uniforms.texture.value.wrapT = wrapValue;  // material update
                            overlay.material.uniforms.texture.value.needsUpdate = true;
                        }
                    }
                };
                bindToFun.toString = function () {
                    return 'wrapT';
                }; // name of the parameter used to keep track of the associated value
                return bindToFun;
            }())
        });

        texturingChoiceWidgets.push(texWidget, texWrapWidgetS, texWrapWidgetT);
        hideTexWidgets();

        lightingWidget = guiBuilder.Choice({
            label: "Lighting",
            tooltip: "Enable/disable lighting",
            options: [
                {content: "On", value: true, selected: true},
                {content: "Off", value: false}
            ],
            bindTo: "lights"
        });

        guiBuilder.Choice({
            label: "Back Face Culling",
            tooltip: "Activate/Deactivate Back Face Culling",
            options: [
                {content: "Off", value: THREE.DoubleSide, selected: true},
                {content: "On", value: THREE.FrontSide}
            ],
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option
                var bindToFun = function (sideValue, overlay) {
                    overlay.material.side = sideValue;  // material update
                };
                bindToFun.toString = function () {
                    return 'sides';
                }; // name of the parameter used to keep track of the associated value
                return bindToFun;
            }())
        });
    };


    // define its _applyTo function. This is called at plugin activation/deactivation
    plug._applyTo = function (meshFile, on) {

        if (on) {
            // take or create a geometry for a new mesh
            var geom = meshFile.getThreeMesh().geometry;
            // in this case, we take geometry of the layer meshFile, otherwise we can proceed this way:
            // create geometry data in buffers (for example calling c++ modules)
            // build BufferAttributes on the data, and associate to a new BufferGeometry

            //geom.computeFaceNormals();
            //geom.computeVertexNormals();

            // then, we proceed with the creation of the material

            // the uniforms names are taken from early defined object
            var uniforms = THREE.UniformsUtils.clone(PHONG.uniforms);
            // but their values are taken from current parameters setting in the layer meshFile
            var params = meshFile.overlaysParams.getByKey(plug.getName());
            var colorParams = meshFile.overlaysParams.getByKey("ColorWheel");

            // so we update them
            uniforms.emissive.value = params.emissive;
            uniforms.specular.value = params.specular;
            uniforms.lights.value = params.lights;
            uniforms.texBool.value = params.texBool;
            uniforms.shading.value = params.shading;
            uniforms.diffuse.value = colorParams.diffuse;
            uniforms.mljColorMode.value = colorParams.mljColorMode;

            // we create an object for material parameters
            var parameters = {
                fragmentShader: this.shaders.getByKey("PhongFragment.glsl"),
                vertexShader: this.shaders.getByKey("PhongVertex.glsl"),
                uniforms: uniforms,
                attributes: geom.attributes,
                lights: true,
                side: params.sides,
                wrapS: params.wrapS,
                wrapT: params.wrapT
            };

            //The BufferGeometry MUST have an attribute called "uv", used in the PhongFragment and in PhongVertex          
            var mat = new THREE.RawShaderMaterial(parameters);

//            console.log("Reading FS's root content " + FS.readdir("/"));
//            console.log("Reading layer folder's content " + FS.readdir("/"+meshFile.name));
            var texturesNumber = meshFile.cppMesh.getTextureNumber(); //we are going to try and load all of the texture attached to the mesh
            var textureIndex = 0;
            meshFile.texture = []; //let's create the layer-dependent texture array

            for (var i = 0; i < texturesNumber; i++) { //iterate through all the mesh texture and try to load them from the FS               
                var textureName = meshFile.cppMesh.getTextureName(i); //let's save the texture name 

                //If the mesh has a texture and this texture is present in the Emscripten file system root
                //x is returned when no texture is bounded to the mesh
                if (textureName !== "x" && FS.readdir("/").indexOf(textureName) > -1) {
                    var mat = new THREE.RawShaderMaterial(parameters); //material creation **TODO: may be useful to actually apply and show multiple texture with multiple materials

                    //We're using the i index and not the textureIndex since in c++ the meshes name are all stored even if not present in the File System
                    var textureName = meshFile.cppMesh.getTextureName(i);
                    var textureInfoPtr = meshFile.cppMesh.getTextureImage(i); //This function loads the texture and give as a result an array with width, height, number of components, pointer to the image array
                    var textureInfoBuff = new Int32Array(Module.HEAPU8.buffer, textureInfoPtr, 4);   //let's load the image informations and store them
                    var texWidth = textureInfoBuff[0];
                    var texHeight = textureInfoBuff[1];
                    var texComponents = textureInfoBuff[2];
                    var texImgPtr = textureInfoBuff[3]; //this is the pointer to the image, which is encoded as an array with a length of width*height*nComponents

                    //Let's recreate the array as an Uint8Array, every pixel will be encoded with a number of attribute equal to the number of components
                    //Hence, the image array full size will be numOfPixels*components, which will be width*height*components
                    //The array will be then ready for creating the DataTexture
                    var imgBuff = new Uint8Array(Module.HEAPU8.buffer, texImgPtr, texWidth * texHeight * texComponents);

                    //the most common format is the RGB format, but just in case the format is different it will be changed accordingly
                    var format = THREE.RGBFormat;
                    var texComponentsTitle;
                    if (texComponents === 1) {
                        format = THREE.LuminanceFormat; //From the stbi lib: 1 = grey
                        texComponentsTitle = "Grey";
                    } else if (texComponents === 2) {
                        format = THREE.LuminanceAlphaFormat; //From the stbi lib: 2 = grey, alpha
                        texComponentsTitle = "Grey, Alpha";
                    } else if (texComponents === 3) {
                        format = THREE.RGBFormat; //From the stbi lib: 3 = red, green, blue (RGB)
                        texComponentsTitle = "RGB";
                    } else if (texComponents === 4) {
                        format = THREE.RGBAFormat; //From the stbi lib: 4 = red, green, blue, alpha (RGBA)
                        texComponentsTitle = "RGBA";
                    }

                    //We're going to create the texture object
                    var texture = new THREE.DataTexture(imgBuff, texWidth, texHeight, format);
                    texture.wrapS = parameters.wrapS; //standard wrapping
                    texture.wrapT = parameters.wrapT; //standard wrapping
                    texture.needsUpdate = true; //We need to update the texture
                    texture.minFilter = THREE.LinearFilter;   //Needed when texture is not a power of 2

                    //Let's create the texture object in order to store the texture options
                    meshFile.texture[textureIndex] = {
                        fileName: textureName,
                        height: texHeight,
                        width: texWidth,
                        nComponents: texComponents,
                        components: texComponentsTitle,
                        format: format,
                        data: texture,
                        imgBuff: imgBuff
                    };

                    textureIndex++;
                    console.log("Loading texture " + i + " " + textureName + " " + texWidth + "x" + texHeight + " " + texComponentsTitle);
                } else {
                    console.warn("Could not load texture " + i + " " + textureName);
                }
            }

            //if the array has been defined then there was at least a texture, for now, we are gonna show ONLY the first one
            if (meshFile.texture.length > 0) {
                //After the for cycle we'll show ONLY THE FIRST TEXTURE (TODO in the future), and actually enable the textures in the shaders
                mat.uniforms.texture = {type: 't', value: meshFile.texture[0].data}; //Attach the texture   
                mat.uniforms.enableTexture = {type: 'i', value: 1}; //turn on the texture-checking in the fragment shader
                meshFile.texturesNum = textureIndex; //we'll need this to know if the mesh has texture and how many
                showTexWidgets();
            } else {
                //if no texture are found we'll attach a dummy texture to the shader in order to avoid annpying warnings
                console.warn("No Texture found or attached");
                meshFile.texture[0] = {data: new THREE.DataTexture(new Uint8Array(1 * 1 * 3), 1, 1, THREE.RGBFormat)}; //We need to create the object
                meshFile.texture[0].data.needsUpdate = true; //We need to update the texture to avoid the warning
                meshFile.texturesNum = 0; //there are no textures
                mat.uniforms.texture = {type: 't', value: meshFile.texture[0].data}; //Attach the dummy texture  
                mat.uniforms.enableTexture = {type: 'i', value: 0}; //turn off the texture-checking in the fragment shader
                hideTexWidgets();
            }

            //let's build the mesh and create the overlay layer
            var filled = new THREE.Mesh(geom, mat);
            scene.addOverlayLayer(meshFile, plug.getName(), filled);
            scene.render();
        } else {
            scene.removeOverlayLayer(meshFile, plug.getName()); // when plugin is deactivated we can release resources
        }
    };


    $(document).on("SceneLayerAdded SceneLayerSelected SceneLayerRemoved", function (event, layer) {
        if (layer.texturesNum > 0) {
            showTexWidgets();
        } else {
            hideTexWidgets();
        }
    });


    function hideTexWidgets() {
        //call the parent to hide the div containing both label and button set
        for (var i = 0; i < texturingChoiceWidgets.length; i++) {
            texturingChoiceWidgets[i].choice.$.parent().parent().hide(200);
        }
    }

    function showTexWidgets() {
        //call the parent to show the div containing both label and button set
        for (var i = 0; i < texturingChoiceWidgets.length; i++) {
            texturingChoiceWidgets[i].choice.$.parent().parent().show(200);
        }
    }

    // the plugin has been created, now we install it on the framework
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);