///GUARDA DEFERRED SHADING.....
///TODO: PROBLEMI nel CAPIRE QUANDO è in shadow....

/// per ora mi salvo depthmap e positionmap....la depth map funziona bene...positionmap sembra anche
/// lo shader per capire se sono in ombra non va....probabilmente sbagli position map e e trasformazione
///devo lavorare su shadowFrag....current è sbagliato prolly

(function (plugin, core, scene) {

    let SIZE = { w : window.innerWidth, h : window.innerHeight};

    let shadowPassUniforms = {
      depthMap: { type: "t", value: null },
      lightViewProjection: { type: "m4", value: null},
    };

    let depthPassUniforms = {
      variance : { type : "i", value : 0}
    };

    let plug = new plugin.GlobalRendering({
        name: "Shadow Mapping",
        tooltip: "Activate Shadow Mapping render pass",
        toggle: true,
        on: false,
        icon: "img/icons/ambientocclusion.png",
        loadShader : ["SMVertex.glsl", "SMFrag.glsl", "ShadowVertex.glsl", "ShadowFrag.glsl", "PositionVertex.glsl", "PositionFragment.glsl"]
    });

    // let varianceFlag;
    // plug._init = (guiBuilder) => {
    //   varianceFlag = guiBuilder.Bool({
    //     label : "Variance Shadow Mapping",
    //     tooltip : "If checked will apply Variance Shadow Mapping",
    //     defval : false,
    //   });
    // };

    function SMContext() {

      /*
         render target where the depth values will be saved, used as texture
         in the render pass which draws the shadows
      */
      // non posso specificare come solo depth?? su opengl mi pare si possa
      let depthMapTarget = new THREE.WebGLRenderTarget(SIZE.w, SIZE.h, {
        type: THREE.FloatType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter
      });

      /*
          material containing the depth pass shaders. The original scene will be
          rendered using this shaders to produce a depth map
      */
      let depthMaterial = new THREE.RawShaderMaterial({
        uniforms: {},
        side: THREE.DoubleSide,
        vertexShader: plug.shaders.getByKey("SMVertex.glsl"),
        fragmentShader: plug.shaders.getByKey("SMFrag.glsl")
      });

      let shadowMaterial = new THREE.RawShaderMaterial({
        uniforms: shadowPassUniforms,
        transparent: true,
        opacity: 0.5,
        blending: THREE["NormalBlending"],
        side: THREE.DoubleSide,
        vertexShader: plug.shaders.getByKey("ShadowVertex.glsl"),
        fragmentShader: plug.shaders.getByKey("ShadowFrag.glsl")
      })

      // poi costruiscilo usando bbox
      let lightCamera = new THREE.OrthographicCamera(
                              -20,
                              20,
                              20,
                              -20,
                              1,
                              25);
      lightCamera.position.set(8, 0, 0);
      lightCamera.lookAt(new THREE.Vector3(0, 0, 0));
      lightCamera.updateProjectionMatrix();
      let projScreenMatrix = new THREE.Matrix4();


      /*
         receives an input buffer in Scene.js and outputs an output buffer that will
         be used as a texture for the last pass of the deferred rendering pipe.
      */
      this.renderShadow = () => {

        let sceneGraph = scene.getScene();
        let sceneCam = scene.getCamera();
        let renderer = scene.getRenderer();
        //TODO : light is on camera!!! (didn't notice it)..
        // things should be easier then..
        // lightCamera.position = sceneCam.position;
        // lightCamera.lookAt(sceneCam.getWorldDirection());
        // lightCamera.updateProjectionMatrix();
        // console.log(JSON.stringify(lightCamera.position));

        sceneGraph.overrideMaterial = depthMaterial;
        renderer.render(sceneGraph, lightCamera, depthMapTarget, true);

        projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lightCamera.matrixWorldInverse);

        sceneGraph.overrideMaterial = shadowMaterial;
        shadowPassUniforms.lightViewProjection.value = projScreenMatrix;
        shadowPassUniforms.depthMap.value = depthMapTarget;

        renderer.autoClearColor = false;
        renderer.render(sceneGraph, sceneCam);
        renderer.autoClearColor = true;

        shadowPassUniforms.depthMap.value = null;
        sceneGraph.overrideMaterial = null;

      };
    }

    let context = null;
    plug._applyTo = (on) => {
        if (on) {
          context = new SMContext();
          scene.setupShadowMapping(context);
        } else {
          context = null;
          scene.disposeShadowMapping();
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
