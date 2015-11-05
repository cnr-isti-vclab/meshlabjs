
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "RadianceScaling",
        tooltip: "Enable Radiance Scaling to enhance surface features. \
            Radiance Scaling is described in: \
            'Radiance Scaling for Versatile Surface Enhancement.' \
            Romain Vergne, Romain Pacanowski, Pascal Barla, Xavier Granier, Christophe Schlick. \
            I3D ’10: Proc. symposium on Interactive 3D graphics and games, Feb 2010, Boston, United States.ACM, 2010.",
        icon: "img/icons/radiancescaling.png",
        toggle: true,
        on: false,
        loadShader: ["RSPass1Vertex.glsl", "RSPass1Fragment.glsl", "RSPass2Vertex.glsl", "RSPass2Fragment.glsl"]
    });

    var p1Uniforms =
    {
       foreshortening: { type: "f", value: 0.4 },
       fnflag:         { type: "i", value: 0 }
    };

    var p2Uniforms =
    {
        gamma:       { type: "f", value: 2.5 },
        alpha:       { type: "f", value: 0.5 },
        attenuation: { type: "f", value: 0.22 },
        cflag:       { type: "i", value: 0 },
        gmap:        { type: "t", value: null },
        cmap:        { type: "t", value: null },
        xstep:       { type: "f", value: 0 },
        ystep:       { type: "f", value: 0 }
    };

    var gammaControl, alphaControl, attenuationControl, foreshorteningControl,
        curvatureFlag, faceNormalsFlag;
    plug._init = function (guiBuilder) {
        gammaControl = guiBuilder.RangedFloat({
            label: "Enhancement",
            tooltip: "",
            min: 0, step: 0.1, max:5.0,
            defval: p2Uniforms.gamma.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p2Uniforms.gamma.value = value;
                };
                bindToFun.toString = function () { return "MLJ_RS_Gamma"; };
                return bindToFun;
            })()
        });
        alphaControl = guiBuilder.RangedFloat({
            label: "Scaling point",
            tooltip: "Controls the scaling point of the enhancement function, which \
                determines how convex/concave features are brightened and darkened.",
            min: 0, step: 0.02, max:0.98,
            defval: p2Uniforms.alpha.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p2Uniforms.alpha.value = value;
                };
                bindToFun.toString = function () { return "MLJ_RS_Alpha"; };
                return bindToFun;
            })()
        });
        attenuationControl = guiBuilder.RangedFloat({
            label: "Curvature attenuation",
            tooltip: "",
            min: 0.02, step: 0.02, max:0.98,
            defval: p2Uniforms.attenuation.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p2Uniforms.attenuation.value = value;
                };
                bindToFun.toString = function () { return "MLJ_RS_Attenuation"; };
                return bindToFun;
            })()
        });
        foreshorteningControl = guiBuilder.RangedFloat({
            label: "Foreshortening",
            tooltip: "",
            min: 0, step: 0.05, max:1,
            defval: p1Uniforms.foreshortening.value,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p1Uniforms.foreshortening.value = value;
                };
                bindToFun.toString = function () { return "MLJ_RS_Foreshortening"; };
                return bindToFun;
            })()
        });
        curvatureFlag = guiBuilder.Bool({
            label: "Show screen space curvature",
            tooltip: "If checked, screen space curvature is highlighted. \
                Red maps to positive values, blue maps to negative values, \
                flat regions are white.",
            defval: false,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p2Uniforms.cflag.value ^= 1;
                };
                bindToFun.toString = function () { return "MLJ_RS_CurvatureFlag"; };
                return bindToFun;
            })()
        });
        faceNormalsFlag = guiBuilder.Bool({
            label: "Use per-face normals",
            tooltip: "",
            defval: false,
            bindTo: (function () {
                var bindToFun = function (value) {
                    p1Uniforms.fnflag.value ^= 1;
                };
                bindToFun.toString = function () { return "MLJ_RS_FaceNormalsFlag"; };
                return bindToFun;
            })()
        });
    };

    function RSContext() {
        var gradientMap = new THREE.WebGLRenderTarget(0, 0, {
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter
        });

        var normMaterial = new THREE.RawShaderMaterial({
            uniforms: p1Uniforms,
            vertexShader: plug.shaders.getByKey("RSPass1Vertex.glsl"),
            fragmentShader: plug.shaders.getByKey("RSPass1Fragment.glsl")
        });

        var dummyCamera = new THREE.OrthographicCamera();

        var plane = new THREE.PlaneBufferGeometry(2,2);
        var quadMesh = new THREE.Mesh(plane,
            new THREE.RawShaderMaterial({
                uniforms: p2Uniforms,
                vertexShader: plug.shaders.getByKey("RSPass2Vertex.glsl"),
                fragmentShader: plug.shaders.getByKey("RSPass2Fragment.glsl"),
            })
        );
        quadMesh.material.uniforms.gmap.value = gradientMap;

        var quadScene = new THREE.Scene();
        quadScene.add(quadMesh);

        var threeScene = scene.getScene();

        this.dispose = function () {
            gradientMap.dispose();
            normMaterial.dispose();
            quadScene.remove(quadMesh);
            quadMesh.geometry.dispose();
            quadMesh.material.dispose();
            p2Uniforms.gmap.value = null;
            p2Uniforms.cmap.value = null;
        }

        this.pass = function(b1, b2) {
            var renderer = scene.getRenderer();

            threeScene.overrideMaterial = normMaterial;

            // Hide objects without normals
            threeScene.traverse(function (obj) {
                if (obj.visible && obj.geometry) {
                    if (!(obj instanceof THREE.Mesh) ||
                                (obj.geometry.type === "BufferGeometry" && 
                                        obj.geometry.getAttribute('normal') === undefined)) {
                        obj.visible = false;
                        obj.__mlj_rsplugin_sweep_flag = true;
                    }
                }
            });

            gradientMap.setSize(b1.width, b1.height);
            renderer.render(threeScene, scene.getCamera(), gradientMap, true);

            threeScene.traverse(function (obj) {
                if (obj.__mlj_rsplugin_sweep_flag === true) {
                    obj.visible = true;
                    delete obj.__mlj_rsplugin_sweep_flag;
                }
            });

            threeScene.overrideMaterial = null;

            quadMesh.material.uniforms.cmap.value = b1;
            quadMesh.material.uniforms.xstep.value = 1.0 / gradientMap.width;
            quadMesh.material.uniforms.ystep.value = 1.0 / gradientMap.height;

            renderer.autoClear = false;
            renderer.render(quadScene, dummyCamera, b2, true);
            renderer.autoClear = true;
            quadMesh.material.uniforms.cmap.value = null;
        };
    }

    var context = null;
    plug._applyTo = function (on) {
        if (on) {
            context = new RSContext();
            scene.addPostProcessPass(plug.getName(), context.pass);
        } else {
            scene.removePostProcessPass(plug.getName());
            context.dispose();
            context = null;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
