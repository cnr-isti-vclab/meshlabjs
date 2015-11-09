
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "GreenFilter",
        tooltip: "For testing purposes, to be removed",
        //icon: "",
        toggle: true,
        on: false,
        loadShader: ["RSPass2Vertex.glsl"]
    });

    var p1Uniforms =
    {
       intensity: { type: "f", value: 0.4 },
       cmap: { type: "t", value: null }
    };

    var intensityControl;
    plug._init = function (guiBuilder) {
        intensityControl = guiBuilder.RangedFloat({
            label: "Intensity",
            tooltip: "",
            min: 0, step: 0.02, max:1.0,
            defval: p1Uniforms.intensity.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p1Uniforms.intensity.value = value;
                };
                bindToFun.toString = function () { return "MLJ_Green_Intensity"; };
                return bindToFun;
            })()
        });
    };

    function GreenContext() {

        var plane = new THREE.PlaneBufferGeometry(2,2);
        var quadMesh = new THREE.Mesh(plane,
            new THREE.RawShaderMaterial({
                uniforms: p1Uniforms,
                vertexShader: plug.shaders.getByKey("RSPass2Vertex.glsl"),
                fragmentShader: "precision highp float; uniform float intensity; uniform sampler2D cmap; varying vec2 vUv; \
                void main(void) { \
                    gl_FragColor = texture2D(cmap, vUv); \
                    if (gl_FragColor.a > 0.0 && intensity > 0.0) { \
                        gl_FragColor*=vec4(1.0-intensity,1.0, 1.0-intensity,1.0); \
                    } \
                }",
            })
        );

        var quadScene = new THREE.Scene();
        quadScene.add(quadMesh);

        var threeScene = scene.getScene();

        this.dispose = function () {
            quadScene.remove(quadMesh);
            quadMesh.geometry.dispose();
            quadMesh.material.dispose();
        }

        var dummyCamera = new THREE.OrthographicCamera();

        this.pass = function(b1, b2) {

            var renderer = scene.getRenderer();

            quadMesh.material.uniforms.cmap.value = b1;

            renderer.autoClear = false;
            renderer.render(quadScene, dummyCamera, b2, true);
            renderer.autoClear = true;

            quadMesh.material.uniforms.cmap.value = null;
        };
    }

    var context = null;
    plug._applyTo = function (on) {
        if (on) {
            context = new GreenContext();
            scene.addPostProcessPass(plug.getName(), context.pass);
        } else {
            scene.removePostProcessPass(plug.getName());
            context.dispose();
            context = null;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
