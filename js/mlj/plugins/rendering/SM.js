///GUARDA DEFERRED SHADING.....
///TODO: PROBLEMI nel CAPIRE QUANDO è in shadow....

/// per ora mi salvo depthmap e positionmap....la depth map funziona bene...positionmap sembra anche
/// lo shader per capire se sono in ombra non va....probabilmente sbagli position map e e trasformazione
///devo lavorare su shadowFrag....current è sbagliato prolly

(function (plugin, core, scene) {

    let SIZE = { w : window.innerWidth, h : window.innerHeight};

    let shadowPassUniforms = {
      depthMap: { type: "t", value: null },
      positionMap: { type: "t", value: null },
      colorMap: { type: "t", value: null },
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


      let positionMapTarget = new THREE.WebGLRenderTarget(SIZE.w, SIZE.h, {
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

      let positionMaterial = new THREE.RawShaderMaterial({
        uniforms: {},
        side: THREE.DoubleSide,
        vertexShader: plug.shaders.getByKey("PositionVertex.glsl"),
        fragmentShader: plug.shaders.getByKey("PositionFragment.glsl")
      });

      /*
        quad che disegno per il passo di defferred rendering
      */
      let quad = new THREE.PlaneBufferGeometry(2,2, 1, 1);
      let shadowMapMesh = new THREE.Mesh(quad, new THREE.RawShaderMaterial({
        uniforms: shadowPassUniforms,
        side: THREE.DoubleSide,
        vertexShader: plug.shaders.getByKey("ShadowVertex.glsl"),
        fragmentShader: plug.shaders.getByKey("ShadowFrag.glsl")
      }));

      let shadowScene = new THREE.Scene();
      shadowScene.add(shadowMapMesh);

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
      console.log(JSON.stringify(lightCamera.projectionMatrix));
      /*
         receives an input buffer in Scene.js and outputs an output buffer that will
         be used as a texture for the last pass of the deferred rendering pipe.
      */
      this.pass = (inBuffer, outBuffer) => {

        let sceneGraph = scene.getScene();
        let sceneCam = scene.getCamera();
        let renderer = scene.getRenderer();
        //TODO : light is on camera!!! (didn't notice it)..
        // things should be easier then..

        // forces the renderer to use the depth mapping shaders for the whole scene
        // lightCamera.position.set(sceneCam.position.x, sceneCam.position.y, sceneCam.position.z);
        // lightCamera.lookAt(sceneCam.getWorldDirection());
        // lightCamera.updateProjectionMatrix();
        //renderer.setClearColor(0xFFFFFF);
        sceneGraph.overrideMaterial = depthMaterial;
        renderer.render(sceneGraph, lightCamera, depthMapTarget, true);
        //renderer.setClearColor(clearClr.getHex());

        // render the position map
        sceneGraph.overrideMaterial = positionMaterial;
        renderer.render(sceneGraph, sceneCam, positionMapTarget, true);
        sceneGraph.overrideMaterial = null;


         let projScreenMatrix = new THREE.Matrix4();
         let lookAt = new THREE.Matrix4();
         lookAt.lookAt(lightCamera.position, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
         projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lookAt);

        shadowPassUniforms.lightViewProjection.value = projScreenMatrix;
        shadowPassUniforms.depthMap.value = depthMapTarget;
        shadowPassUniforms.positionMap.value = positionMapTarget;
        shadowPassUniforms.colorMap.value = inBuffer;
        renderer.render(shadowScene, sceneCam, outBuffer, true);

        shadowPassUniforms.depthMap.value = null;
        shadowPassUniforms.colorMap.value = null;
      };
    }

    let context = null;
    plug._applyTo = (on) => {
        if (on) {
          context = new SMContext();
          scene.addPostProcessPass(plug.getName(), context.pass);
        } else {
          scene.removePostProcessPass(plug.getName());
          context = null;
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
