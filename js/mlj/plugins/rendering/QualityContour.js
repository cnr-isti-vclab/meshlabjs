
(function (plugin, core, scene) {

    var DEFAULTS = {
        quality_min: 0,
        quality_max: 1,
        stripe_num: 20,
        stripe_width: 0.5,
        stripe_alpha: 0.5,
        stripe_ramp: 1
    };


    var SHADING = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            {
                "quality_min": {type: "f", value: DEFAULTS.quality_min},
                "quality_max": {type: "f", value: DEFAULTS.quality_max},
                "stripe_num" : { type: "f", value: DEFAULTS.stripe_num},
                "stripe_width": {type: "f", value: DEFAULTS.stripe_width},
                "stripe_alpha": {type: "f", value: DEFAULTS.stripe_alpha},
                "stripe_ramp": {type: "i", value: DEFAULTS.stripe_ramp}
            }

        ])
    };


    var plug = new plugin.Rendering({
        name: "QualityContour",
        tooltip: "Enable the visualization of the quality contour of the mesh for the current layer",
        icon: "img/icons/wire.png",
        toggle: true,
        on: false,
        loadShader: ["QualityContourFragment.glsl", "QualityContourVertex.glsl"]
    }, DEFAULTS);


    plug._init = function (guiBuilder) {
        guiBuilder.Integer({
            label: "Number of Contours",
            tooltip: "The number of contours that are drawn between min and max of the quality values.",
            min: 1, 
            defval: DEFAULTS.stripe_num,
            bindTo: "stripe_num"
        });
        
        guiBuilder.RangedFloat({
            label: "Width",
            tooltip: "The width of the contours.",
            min: 0, max: 1, step: 0.01,
            defval: DEFAULTS.stripe_width,
            bindTo: "stripe_width"
        });
        
        guiBuilder.RangedFloat({
            label: "Alpha of Contours",
            tooltip: "The alpha of the contours.",
            min: 0, max: 1, step: 0.01,
            defval: DEFAULTS.stripe_alpha,
            bindTo: "stripe_alpha"
        });

        guiBuilder.Bool({
            label: "Ramp Contour",
            tooltip: "If enabled shows a ramp that gives you info about the gradient of the quality field (transparent to opaque means increasing values)",
            defval: DEFAULTS.stripe_ramp === 1,
            bindTo: "stripe_ramp"
        });
    };

    plug._applyTo = function (meshFile, on) {

        if(on === false) {
            Module._free(meshFile.attributesVecQualityPtr);
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        var quality_min = Module.qualityMin(meshFile.ptrMesh());
        var quality_max = Module.qualityMax(meshFile.ptrMesh());
        
        // Creating the array that contains the quality for each vertex of the mesh
        var qualityVecSize = meshFile.VN;
        var qualityVecStart = Module.buildVertexQualityVec(meshFile.ptrMesh());
        var vert_quality = new Float32Array(Module.HEAPU8.buffer, qualityVecStart, qualityVecSize);
        
        meshFile.attributesVecQualityPtr = qualityVecStart;
        
        // Adding the vertex quality attribute to the geometry of the mesh
        var geometry = meshFile.getThreeMesh().geometry;
        geometry.addAttribute('vert_quality', new THREE.BufferAttribute(vert_quality, 1));
        
        var uniforms = THREE.UniformsUtils.clone(SHADING.uniforms);
        var params = meshFile.overlaysParams.getByKey(plug.getName());

        // Updating the uniforms values that the shader will use
        uniforms.quality_min.value = quality_min;
        uniforms.quality_max.value = quality_max;
        uniforms.stripe_num.value = params.stripe_num;
        uniforms.stripe_width.value = params.stripe_width;
        uniforms.stripe_alpha.value = params.stripe_alpha;
        uniforms.stripe_ramp.value = params.stripe_ramp;
        
        // Parameters for the shader
        var parameters = {
            vertexShader: this.shaders.getByKey("QualityContourVertex.glsl"),
            fragmentShader: this.shaders.getByKey("QualityContourFragment.glsl"),
            uniforms: uniforms,
            attributes: geometry.attributes,
            transparent: true,
            lights: true
        };
        
        var mat = new THREE.RawShaderMaterial(parameters);
        var qualityContour = new THREE.Mesh(geometry, mat);

        scene.addOverlayLayer(meshFile, plug.getName(), qualityContour);
    };

    plugin.Manager.install(plug);

}) (MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
        