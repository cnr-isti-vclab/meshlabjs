
// This function is called at framework startup to add a new plugin
(function (plugin, core, scene) {

    // Default values for parameters used for this plugin
    var DEFAULTS = {
        specular: new THREE.Color('#505050'),
        emissive: new THREE.Color('#000000'),
        shininess: 15.0,
        lights: true,
        texBool: false,
        shading: THREE.FlatShading,
        sides : THREE.DoubleSide,
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
        loadShader: ["PhongFragment.glsl","PhongVertex.glsl"]
    }, DEFAULTS);

    // and then define _init, _applyTo functions on that object

    // here some variables for plugin functions state
    var texturingWidget, lightingWidget, shadingWidget, shininessWidget,
            specularColor, emissiveColor;

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
        
        texturingWidget = guiBuilder.Choice({
            label: "Texturing",
            tooltip: "Enable/disable texturing",
            options: [
                {content: "On" , value: true},
                {content: "Off", value: false, selected: true}
            ],
            bindTo: "texBool"
        });

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
                {content: "On", value: THREE.FrontSide }
            ],
            bindTo: (function() {  // here we define also a callback to invoke at every change of this option
                var bindToFun = function (sideValue, overlay) {
                    overlay.material.side = sideValue;  // material update
                };
                bindToFun.toString = function () { return 'sides'; }; // name of the parameter used to keep track of the associated value
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
                side: params.sides
            };
            
            //The BufferGeometry MUST have an attribute called "uv", used in the PhongFragment and in PhongVertex
            // The problem here (I guess) is that the shader is pre-compiled, so it loads the texture even when it is undefined or null
            //hence, everytime I load a mesh, the uniforms.texture gets updated with the mesh's texture
            //if the next texture does NOT have a texture or the texture could not be found, then the mat.uniforms.texture saved in the sader will stay the same
            //IN FACT loading two differents meshes with two different textures will properly show both different textures since mat.uniforms.texture changes
            
            var mat = new THREE.RawShaderMaterial(parameters);
            
          
            //TESTING Dynamic texture creation from data received by nodejs file system, Just change meshFile.texture with texBulba
            var imgPtr = meshFile.cppMesh.getTextureImage(); //Carico la texture restituita da c++
            var imgBuff= new Uint8Array(Module.HEAPU8.buffer, imgPtr, 512*512*4); //La textura ha di default 4 canali (RGBA), resta da sistemare la dimensione dell'immagine e del canale

            var texBulba = new THREE.DataTexture(imgBuff, 512, 512, THREE.RGBAFormat); //Avendo 4 canali il formato è RGBA
            texBulba.needsUpdate = true;
 //           console.log("Image buffer");
//            console.log(imgBuff);          
//            console.log("\nImage");
//            console.log(texBulba);
         
            
            
            
//            /*Data texture*/
//            var side = 32; // power of two textures are better cause powers of two are required by some algorithms. Like ones that decide what color will pixel have if amount of pixels is less than amount of textels (see three.js console error when given non-power-of-two texture)
//
//            var amount = Math.pow(side, 2); // you need 4 values for every pixel in side*side plane
//            var data = new Uint8Array(amount);
//            /* 
//              You can also use any js typed array or ArrayBuffer itself
//              Most popular is Uint8Array (it can contain itegers from 0 to 255)
//            */
//            for (var i = 0; i < amount; i++) {
//              data[i] = Math.random()*256; // generates random r,g,b,a values from 0 to 1
//              /*  
//                When using Uint8Array multiply the random value by 255 to get same results
//                'cause in that case you use integers from 0 to 255 to represent colors
//                which is limiting but is more widely supported (see comment below)
//              */
//            }





            console.log("Leggo contenuto " + FS.readdir("/"));
//            console.log("\n Texture presente " +meshFile.cppMesh.getTextureName() +": " +(FS.readdir("/").indexOf(meshFile.cppMesh.getTextureName())));
//            
            //If the mesh has a texture and this texture is present in the Emscripten file system root
            if(meshFile.cppMesh.getTextureName() !== "x" && FS.readdir("/").indexOf(meshFile.cppMesh.getTextureName()) > -1){ //x is returned when no texture is bounded to the mesh
                console.log("Loading texture " +meshFile.cppMesh.getTextureName());
                meshFile.texture = THREE.ImageUtils.loadTexture("/" +meshFile.cppMesh.getTextureName(), {}, function() {
                      console.log("Texture Loaded!");   
//                      console.log(meshFile.texture);
                      mat.uniforms.texture = {type: 't', value: texBulba}; //Just for testing
//                      mat.uniforms.texture = {type: 't', value: meshFile.texture};
                      var filled = new THREE.Mesh(geom, mat);  //WORKING!! This create the new mesh to be added as an overlay layer
                      scene.addOverlayLayer(meshFile, plug.getName(), filled); 
                },
                function(){    
                      console.log("Error loading texture"); 
                      mat.uniforms.texture = {type: 't', value: texBulba}; //Just for testing
//                      delete meshFile.texture;
//                      delete mat.uniforms.texture;
                      var filled = new THREE.Mesh(geom, mat);  //WORKING!! This create the new mesh to be added as an overlay layer
                      scene.addOverlayLayer(meshFile, plug.getName(), filled); 
                });
            }
            else {
              console.log("Mesh without texture");
              var filled = new THREE.Mesh(geom, mat);  //WORKING!! This create the new mesh to be added as an overlay layer
              scene.addOverlayLayer(meshFile, plug.getName(), filled); 
            }


            // build the new mesh
            // add it as an overlay to the layer       

        } else {
            // when plugin is deactivated we can release resources
            scene.removeOverlayLayer(meshFile, plug.getName());
        }

    };

    // the plugin has been created, now we install it on the framework
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);