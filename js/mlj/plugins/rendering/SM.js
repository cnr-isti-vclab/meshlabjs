
(function (plugin, core, scene) {
  /*

Per il fatto del peterpanning quello in realtà vedo che è parecchio presente anche in meshlab, solo che è nascosto dal fatto che l'ombra è molto più nera…per quanto riguarda mesh non convesse (aperte) ci saranno sempre dei problemi

INOLTRE PER QUANTO RIGUARDA I TOOLS di ANTNIC, PENSO CHE QUESTI DOVREBBERO ESSERE RIFATTORIZZATI UN PO' IN MODO CHE SIANO DEFINITI COME 
DECORATORI E NON ATTACCATI DIRETTI ALLA SCENA

  */
  // TODO: refactoring---commenting---memorycleanupondispose---icon
  /* refattorizza blur per usare una sola mappa ===> se si vuole anche aumentare il blur allora usa 2 mappe + ping-pong */
  /* variables for ui interaction */

  let shadowPassUniforms = {
    blurMap:              { type: "t",  value: null },
    depthMap:             { type: "t",  value: null },
    positionMap:          { type: "t",  value: null },
    colorMap:             { type: "t",  value: null },
    lightViewProjection:  { type: "m4", value: null },
    intensity:            { type: "f",  value: 1 },
    lightDir:             { type: 'v3', value: null },
    blurFlag:             { type: 'i',  value: 1 },
    bleedBias:            { type: "f",  value: 0.0 }
  };

  let shadowPassOptions = {
    minFilter:    THREE.LinearMipMapNearestFilter,
    SMVert:       null,
    SMFrag:       null,
    ShadowFrag:   null,
    bufferWidth:  1024,
    debug:        false
  }

  let plug = new plugin.GlobalRendering({
    name: "Shadow Mapping",
    tooltip: "Activate Shadow Mapping render pass",
    toggle: true,
    on: false,
    icon: "img/icons/ambientocclusion.png",
    loadShader: ["VShadowFrag.glsl", "VSMVertex.glsl", "VSMFrag.glsl",
      "SMVertex.glsl", "SMFrag.glsl", "ShadowVertex.glsl",
      "ShadowFrag.glsl", "PositionVertex.glsl", "PositionFragment.glsl",
      "horBlurFrag.glsl", "verBlurFrag.glsl", "blurVertex.glsl"]
  });
  //
  //  let varianceFlag;
  let intensityRng, bleedRng, bufferWidth, debugChoice, blurFlag;

  plug._init = (guiBuilder) => {
    intensityRng = guiBuilder.RangedFloat({
      label: "Shadow Transparency",
      tooltip: "Manages shadow intensity: 0 is black shadows, 1 is soft shadows",
      min: 0.0, max: 1.0, step: 0.001,
      defval: 1.0,
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassUniforms.intensity.value = value;
          scene.render();
        };
        bindToFun.toString = function () { return 'MLJ_SM_Intensity'; }
        return bindToFun;
      } ())
    });

    bleedRng = guiBuilder.RangedFloat({
      label: "Bleed containment bias",
      tooltip: "Manages the bias applied in VSM to contain bleed effects",
      min: 0.0, max: 0.5, step: 0.0001,
      defval: 0.0,
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassUniforms.bleedBias.value = value;
          scene.render();
        };
        bindToFun.toString = function () { return 'MLJ_SM_BleedBias'; }
        return bindToFun;
      } ())
    });

    bufferWidth = guiBuilder.Choice({
      label: `Shadow Buffer Width`,
      tooltip: `Manages the shadow buffer width, it allows only powers of 2
      to guarantee the creation of mipmaps`,
      options: [
        { content: "128",   value: 128 },
        { content: "256",   value: 256 },
        { content: "512",   value: 512 },
        { content: "1024",  value: 1024, selected: true },
        { content: "2048",  value: 2048 },
        { content: "4096",  value: 4096 }
      ],
      bindTo: (function () {
        var callback = function (bufferWidth) {
          plug._applyTo(false);
          shadowPassOptions.bufferWidth = bufferWidth;
          plug._applyTo(true);
        };
        callback.toString = function () { return "MLJ_SM_BufferWidth"; };
        return callback;
      } ())
    });

    blurFlag = guiBuilder.Bool({
      label: "Blur",
      tooltip: "If checked, the shadow map gets filtered to smooth shadow borders and shadow aliasing is contained",
      defval: true,
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassUniforms.blurFlag.value ^= 1;
        };
        bindToFun.toString = function () { return "MLJ_SM_BlurFlag"; };
        return bindToFun;
      })()
    });

    debugChoice = guiBuilder.Choice({
      label: "Debug mode",
      tooltip: "If 'On', it renders the variance shadow map on screen",
      options: [
        { content: "Off", value: false, selected: true },
        { content: "On",  value: true }
      ],
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassOptions.debug = value;
        };
        bindToFun.toString = function () { return 'MLJ_SM_DEBUG'; };
        return bindToFun;
      } ())
    });
  };

  function SMContext() {
    /* shaders */
    shadowPassOptions.SMVert      = plug.shaders.getByKey("VSMVertex.glsl");
    shadowPassOptions.SMFrag      = plug.shaders.getByKey("VSMFrag.glsl");
    shadowPassOptions.shadowFrag  = plug.shaders.getByKey("VShadowFrag.glsl");
    shadowPassOptions.blurVert    = plug.shaders.getByKey("blurVertex.glsl");
    shadowPassOptions.horBlurFrag = plug.shaders.getByKey("horBlurFrag.glsl");
    shadowPassOptions.verBlurFrag = plug.shaders.getByKey("verBlurFrag.glsl");

    /* weights and offset of the gaussian distrib (for a 35x35 kernel) */
    let gWeights = [0.10855, 0.13135, 0.10406, 0.07216, 0.04380,
      0.02328, 0.01083, 0.00441, 0.00157];
    let gOffsets = [0.66293, 2.47904, 4.46232, 6.44568, 8.42917,
      10.41281, 12.39664, 14.38070, 16.36501];

    shadowPassOptions.gaussWeights = gWeights;
    shadowPassOptions.gaussOffsets = gOffsets;

    let renderTargetParams = {
      type:      THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: THREE.Linear
    };

    let depthMapTarget    = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth, shadowPassOptions.bufferWidth, renderTargetParams);
    let horBlurTarget     = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth / 2, shadowPassOptions.bufferWidth / 2, renderTargetParams);
    let verBlurTarget     = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth / 2, shadowPassOptions.bufferWidth / 2, renderTargetParams);
    let positionMapTarget = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth, shadowPassOptions.bufferWidth, renderTargetParams);

    shadowPassUniforms.depthMap.value = depthMapTarget;
    shadowPassUniforms.positionMap.value = positionMapTarget;

    /*
    material containing the depth pass shaders. The original scene will be
    rendered using this shaders to produce a depth map
    */
    let prepareDepthMaterial = (size) => {
      let mat = new THREE.RawShaderMaterial({
        uniforms:       { pointSize: { type: 'f', value: size } },
        side:           THREE.DoubleSide,
        derivatives:    true,
        vertexShader:   shadowPassOptions.SMVert,
        fragmentShader: shadowPassOptions.SMFrag
      });
      return mat;
    }
    let preparePositionMaterial = (size) => {
      let mat = new THREE.RawShaderMaterial({
        uniforms:       { pointSize: { type: 'f', value: size } },
        side:           THREE.DoubleSide,
        vertexShader:   plug.shaders.getByKey("PositionVertex.glsl"),
        fragmentShader: plug.shaders.getByKey("PositionFragment.glsl")
      });
      return mat;
    }

    let hBlurUniforms = {
      depthMap: { type: "t",    value: depthMapTarget },
      gWeights: { type: "1fv",  value: shadowPassOptions.gaussWeights },
      gOffsets: { type: "1fv",  value: shadowPassOptions.gaussOffsets },
      texSize:  { type: "f",    value: shadowPassOptions.bufferWidth }
    };
    let vBlurUniforms = {
      depthMap: { type: "t",    value: horBlurTarget },
      gWeights: { type: "1fv",  value: shadowPassOptions.gaussWeights },
      gOffsets: { type: "1fv",  value: shadowPassOptions.gaussOffsets },
      texSize:  { type: "f",    value: shadowPassOptions.bufferWidth }
    };

    let horBlurMaterial = new THREE.RawShaderMaterial({
      uniforms: hBlurUniforms,
      side: THREE.DoubleSide,
      vertexShader: shadowPassOptions.blurVert,
      fragmentShader: shadowPassOptions.horBlurFrag
    });

    let verBlurMaterial = new THREE.RawShaderMaterial({
      uniforms: vBlurUniforms,
      side: THREE.DoubleSide,
      vertexShader: shadowPassOptions.blurVert,
      fragmentShader: shadowPassOptions.verBlurFrag
    });
    /*
    quad che disegno per il passo di defferred rendering
    */
    let quad = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    let shadowMapMesh = new THREE.Mesh(quad, new THREE.RawShaderMaterial({
      uniforms: shadowPassUniforms,
      side: THREE.DoubleSide,
      vertexShader: plug.shaders.getByKey("ShadowVertex.glsl"),
      fragmentShader: shadowPassOptions.shadowFrag
    }));

    let horBlurMesh = new THREE.Mesh(quad, horBlurMaterial);
    let verBlurMesh = new THREE.Mesh(quad, verBlurMaterial);

    let horBlurScene = new THREE.Scene(); horBlurScene.add(horBlurMesh);
    let verBlurScene = new THREE.Scene(); verBlurScene.add(verBlurMesh);
    let shadowScene = new THREE.Scene(); shadowScene.add(shadowMapMesh);

    this.dispose = () => {
      depthMapTarget.dispose();     depthMapTarget    = undefined;
      positionMapTarget.dispose();  positionMapTarget = undefined
      horBlurTarget.dispose();      horBlurTarget     = undefined;
      verBlurTarget.dispose();      verBlurTarget     = undefined;

      shadowScene.remove(shadowMapMesh); shadowScene   = undefined;
      horBlurScene.remove(horBlurMesh);  horBlurScene  = undefined;
      verBlurScene.remove(verBlurMesh);  verBlurScene  = undefined;

      shadowMapMesh = undefined;
      horBlurMesh   = undefined;
      verBlurMesh   = undefined;

      horBlurMaterial.dispose();  horBlurMaterial = undefined;
      verBlurMaterial.dispose();  verBlurMaterial = undefined;
    }

    /*
    receives an input buffer in Scene.js and outputs an output buffer that will
    be used as a texture for the last pass of the deferred rendering pipe.
    */
    this.pass = (inBuffer, outBuffer) => {
      let sceneGraph = scene.getScene();
      let sceneCam = scene.getCamera();
      let renderer = scene.getRenderer();

      /* Get bbox and scale it */
      let bbox = scene.getBBox();
      let scale = 15.0 / (bbox.min.distanceTo(bbox.max));
      let bbmax = new THREE.Vector3().copy(bbox.max);
      let bbmin = new THREE.Vector3().copy(bbox.min);
      bbmax.multiplyScalar(scale);
      bbmin.multiplyScalar(scale);
      bbox.set(bbmin, bbmax);

      /* Prepare light view camera frustum (orthographic for directional lights) */
      let diag = bbox.min.distanceTo(bbox.max);
      let lightCamera = new THREE.OrthographicCamera(
        -(diag / 2), diag / 2,
        diag / 2, -(diag / 2),
        -(diag / 2), diag / 2
      );
      /* Prepare light position, based on current light position */
      let lightD = scene.lights.Headlight.getWorldPosition();
      /* LightCamera setup */
      lightCamera.position.set(0, 0, 0);
      lightCamera.lookAt(lightD.negate());
      lightCamera.updateMatrixWorld();
      lightCamera.updateProjectionMatrix();

      /******************debug flag**************/
      let dBuf, bBuf;
      if (shadowPassOptions.debug) { 
        bBuf = outBuffer; 
        dBuf = (shadowPassUniforms.blurFlag.value) ? depthMapTarget : outBuffer;
      } else { 
        bBuf = verBlurTarget; 
        dBuf = depthMapTarget; 
      }
      /*************************************/

      let decos = scene.getDecoratorsGroup();
      let layers = scene.getLayersGroup();
      /* Hide decorators  (that should not be shadowed) */
      let hidden = [];
      let materialChanged = [];

      decos.traverse(function (deco) {
        if (deco.visible && deco.geometry) {
          deco.visible = false;
          hidden.push(deco);
        }
      });
      /********************PREPARE DEPTH MAP*******************/
      /*Selectively attach depth map material */
      let layersIterator = scene.getLayers().iterator();
      while (layersIterator.hasNext()) {

        let layer = layersIterator.next();
        /* if layer is drawn as filled, i don't consider points in shadowmap */
        let pointSz = (layer.overlays.getByKey('Filled')) ? 0.0 : layer.overlaysParams.getByKey('Points').size;

        let overlaysIterator = layer.overlays.iterator();
        while (overlaysIterator.hasNext()) {
          let overlay = overlaysIterator.next();
          if (overlay.name == 'Points' || overlay.name == 'Filled') {
            overlay.__mlj_smplugin_material = overlay.material;
            overlay.material = prepareDepthMaterial(pointSz);
            overlay.__mlj_smplugin_pointSize = pointSz;
            materialChanged.push(overlay);
          } else if (overlay.visible && overlay.geometry) {
            overlay.visible = false;
            hidden.push(overlay);
          }
        }
      }
      /* render depth map */
      renderer.render(sceneGraph, lightCamera, dBuf, true);

      /******************PREPARE POSITION MAP********************/
      /*Selectively attach position map material */
      for (let mesh in materialChanged) {
        materialChanged[mesh].material = preparePositionMaterial(materialChanged[mesh].__mlj_smplugin_pointSize);
      }
      /* render position map */
      renderer.render(sceneGraph, sceneCam, positionMapTarget, true);

      /* Make hidden layers visible again  &  restore geometry materials */
      for (let mesh in hidden) {
        hidden[mesh].visible = true;
      }
      for (let mesh in materialChanged) {
        materialChanged[mesh].material = materialChanged[mesh].__mlj_smplugin_material;
        delete materialChanged[mesh].__mlj_smplugin_material;
        delete materialChanged[mesh].__mlj_smplugin_pointSize;
      }

      /*****************PREPARE BLUR MAPS**********************/
      if (shadowPassUniforms.blurFlag.value) {
        renderer.render(horBlurScene, sceneCam, horBlurTarget, true);
        renderer.render(verBlurScene, sceneCam, bBuf, true);
      }
      /*******************FINAL RENDER PASS********************/
      let projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lightCamera.matrixWorldInverse);

      shadowPassUniforms.lightViewProjection.value  = projScreenMatrix;
      shadowPassUniforms.colorMap.value             = inBuffer;
      shadowPassUniforms.lightDir.value             = lightD;

      if (shadowPassUniforms.blurFlag.value)
        shadowPassUniforms.blurMap.value = verBlurTarget;
  
      if (!shadowPassOptions.debug)
        renderer.render(shadowScene, sceneCam, outBuffer, true);

      shadowPassUniforms.blurMap.value = null;

    };
  }

  let context = null;
  plug._applyTo = (on) => {
    if (on) {
      context = new SMContext();
      scene.addPostProcessPass(plug.getName(), context.pass);
    } else {
      scene.removePostProcessPass(plug.getName());
      context.dispose();
      context = null;
    }
  };

  plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
