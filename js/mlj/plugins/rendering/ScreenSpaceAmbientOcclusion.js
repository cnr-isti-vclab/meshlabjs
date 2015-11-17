
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "SSAO",
        tooltip: "Enable Screen Space Ambient Occlusion",
        toggle: true,
        on: false,
        //icon: "",
        loadShader: ["SSAODistanceMapVertex.glsl", "SSAODistanceMapFragment.glsl",
            "SSAOVertex.glsl", "SSAOFragment.glsl", "SSAOBlurFragment.glsl"]
    });

    function generateSphereSamples() {
        var samples = [];
        var k = 0; var ccc = 0;
        for (var i = 0; i < 32; ++i) {
            do {
                var pt = new THREE.Vector3(
                    Math.random() * 2.0 - 1.0,
                    Math.random() * 2.0 - 1.0,
                    Math.random()
                );
            } while (pt.length() > 1);

            //check this
            //pt.normalize();
            //var x = i / 32;
            //pt.multiplyScalar(Math.max(0.1, x*x));


            samples[k++] = pt.x;
            samples[k++] = pt.y;
            samples[k++] = pt.z;
        }
        console.log("--"+ccc);
        return samples;
    }

    function generateNoiseTexture() {
        var vals = new Float32Array(16*3);
        for (var i = 0; i < 16; ++i) {
            var rad = Math.random() * Math.PI * 2;
            vals[i*3] = Math.sin(rad);
            vals[i*3 + 1] = Math.cos(rad);
            vals[i*3 + 2] = rad;
        }
        var texture = new THREE.DataTexture(vals, 4, 4, THREE.RGBFormat, THREE.FloatType, THREE.UVMapping,
            THREE.RepeatWrapping, THREE.RepeatWrapping);
        texture.needsUpdate = true; // Critical, otherwise the texture is not loaded
        return texture;
    }

    var AOPassUniforms =
    {
        samples:        { type: "fv", value: generateSphereSamples() },
        sampleRadius:   { type: "f",  value: 1.0 },
        occlusionPower: { type: "f",  value: 1.0 },
        noise:          { type: "t",  value: generateNoiseTexture() },
        uvMultiplier:   { type: "v2", value: new THREE.Vector2() },
        dmap:           { type: "t",  value: null }
    }

    var blurPassUniforms =
    {
        cmap:       { type: "t",  value: null },
        aomap:      { type: "t",  value: null },
        screenStep: { type: "v2", value: new THREE.Vector2() },
        blurFlag:   { type: "i",  value: 1 }
    }

    var radiusControl, powerControl, blurFlag;
    plug._init = function (guiBuilder) {
        radiusControl = guiBuilder.RangedFloat({
            label: "Radius",
            tooltip: "Scales the sample hemisphere radius",
            min: 0.05, step: 0.05, max:5.0,
            defval: AOPassUniforms.sampleRadius.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    AOPassUniforms.sampleRadius.value = value;
                };
                bindToFun.toString = function () { return "MLJ_SSAO_Radius"; };
                return bindToFun;
            })()
        });

        radiusControl = guiBuilder.RangedFloat({
            label: "Ambient Occlusion Power",
            tooltip: "The occlusion factor is raised to this power (occluded surfaces \
                get darker)",
            min: 1.0, step: 0.1, max:5.0,
            defval: AOPassUniforms.occlusionPower.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    AOPassUniforms.occlusionPower.value = value;
                };
                bindToFun.toString = function () { return "MLJ_SSAO_Power"; };
                return bindToFun;
            })()
        });

        blurFlag = guiBuilder.Bool({
            label: "Blur",
            tooltip: "If checked, the Ambient Occlusion pass is filtered to remove noise",
            defval: true,
            bindTo: (function () {
                var bindToFun = function (value) {
                    blurPassUniforms.blurFlag.value ^= 1;
                };
                bindToFun.toString = function () { return "MLJ_SSAO_BlurFlag"; };
                return bindToFun;
            })()
        });
    };

    function SSAOContext() {
        var distanceMapTarget = new THREE.WebGLRenderTarget(0, 0, {
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter
        });

        var ambientOcclusionMapTarget = new THREE.WebGLRenderTarget(0, 0, {
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter
        });

        var distanceMapMaterial = new THREE.RawShaderMaterial({
            uniforms: {},
            vertexShader: plug.shaders.getByKey("SSAODistanceMapVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("SSAODistanceMapFragment.glsl")
        });

        var quadGeometry = new THREE.PlaneBufferGeometry(2,2,1,1);

        // quadGeometry gets a frustumCorner attribute (updated on resize) which
        // links each quad corner with the corresponding corner of the frustum
        // lying the near plane. This allows the shader to compute an interpolated
        // view direction for each fragment.
        function updateFrustumAttribute() {
            var camera = scene.getCamera();
            var nearHeight = 2.0 * Math.tan((camera.fov * Math.PI / 180) / 2.0) * camera.near;
            var nearWidth = camera.aspect * nearHeight;

            if (quadGeometry.attributes.frustumCorner) {
                delete quadGeometry.attributes.frustumCorner;
            }
            quadGeometry.addAttribute('frustumCorner', new THREE.BufferAttribute(
                new Float32Array([-nearWidth/2, nearHeight/2, -camera.near, nearWidth/2, nearHeight/2, -camera.near,
                    -nearWidth/2, -nearHeight/2, -camera.near, nearWidth/2, -nearHeight/2, -camera.near]),
                3)
            );
            quadGeometry.attributes.frustumCorner.needsUpdate = true;
        }

        updateFrustumAttribute();
        $(window).on("resize", updateFrustumAttribute);


        AOPassUniforms.dmap.value = distanceMapTarget;
        var AOPassMesh = new THREE.Mesh(quadGeometry, new THREE.RawShaderMaterial({
            uniforms: AOPassUniforms,
            attributes: quadGeometry.attributes,
            vertexShader: plug.shaders.getByKey("SSAOVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("SSAOFragment.glsl")
        }));

        blurPassUniforms.aomap.value = ambientOcclusionMapTarget;
        var blurPassMesh = new THREE.Mesh(quadGeometry, new THREE.RawShaderMaterial({
            uniforms: blurPassUniforms,
            attributes: quadGeometry.attributes,
            vertexShader: plug.shaders.getByKey("SSAOVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("SSAOBlurFragment.glsl")
        }));
        
        var AOPassScene = new THREE.Scene();
        AOPassScene.add(AOPassMesh);

        var blurPassScene = new THREE.Scene();
        blurPassScene.add(blurPassMesh);

        this.dispose = function () {
            $(window).off("resize", updateFrustumAttribute);
            distanceMapTarget.dispose();
            ambientOcclusionMapTarget.dispose();
            AOPassScene.remove(AOPassMesh);
            blurPassScene.remove(blurPassMesh);
            AOPassMesh.geometry.dispose();
            AOPassMesh.material.dispose();
            blurPassMesh.material.dispose();
            AOPassUniforms.dmap.value = null;
            blurPassUniforms.aomap.value = null;
        };

        this.pass = function (inputBuffer, outputBuffer) {
            var renderer = scene.getRenderer();
            var threeScene = scene.getScene();

            // normals and depth pass
            threeScene.overrideMaterial = distanceMapMaterial;
            distanceMapTarget.setSize(inputBuffer.width, inputBuffer.height);
            renderer.render(threeScene, scene.getCamera(), distanceMapTarget, true);
            threeScene.overrideMaterial = null;

            // ambient occlusion pass
            ambientOcclusionMapTarget.setSize(inputBuffer.width, inputBuffer.height);
            AOPassUniforms.uvMultiplier.value.set(inputBuffer.width/4, inputBuffer.height/4);
            renderer.render(AOPassScene, scene.getCamera(), ambientOcclusionMapTarget, true);

            // blur pass
            blurPassUniforms.cmap.value = inputBuffer;
            blurPassUniforms.screenStep.value.set(1.0/outputBuffer.width, 1.0/outputBuffer.height);
            renderer.render(blurPassScene, scene.getCamera(), outputBuffer, true);
            blurPassUniforms.cmap.value = null;
        };
    }

    var context = null;
    plug._applyTo = function (on) {
        if (on) {
            context = new SSAOContext();
            scene.addPostProcessPass(plug.getName(), context.pass);
        } else {
            scene.removePostProcessPass(plug.getName());
            context.dispose();
            context = null;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
