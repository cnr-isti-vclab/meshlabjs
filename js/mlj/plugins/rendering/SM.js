
(function (plugin, core, scene) {
  /*
    SOON Multiple render targets might be added to THREE.js:
    RECALL: integrate normal map rendering and use normal map in shadowfrag to endarken faces facing away from light
            render position map and normal map (at least) in a single render pass
*/
  let shadowPassUniforms = {
    blurMap: { type: "t", value: null },
    depthMap: { type: "t", value: null },
    colorMap: { type: "t", value: null },
    lightViewProjection: { type: "m4", value: null },
    intensity: { type: "f", value: 0.5 },
    lightDir: { type: 'v3', value: null },
    blurFlag: { type: 'i', value: 1 },
    bleedBias: { type: "f", value: 0.5 },
    bufWidth: { type: "f", value: null },
    bufHeight: { type: "f", value: null },
    texSize: { type: "f", value: 1024 },
    pointSize: { type: "f", value: null }
  };

  let shadowPassOptions = {
    depthTarget: null,
    hBlurTarget: null,
    vBlurTarget: null,
    SMVert: null,
    SMFrag: null,
    ShadowFrag: null,
    ShadowVert: null,
    VShadowFrag: null,
    ShadowFrag: null,
    debug: false,
    vsm: true
  }

  let plug = new plugin.GlobalRendering({
    name: "Shadow Mapping",
    tooltip: "Activate Shadow Mapping render pass",
    toggle: true,
    on: false,
    icon: "img/icons/sm_ugly.png",
    loadShader: [
      "VShadowFrag.glsl", "VSMVertex.glsl", "VSMFrag.glsl", "SMVertex.glsl", "SMFrag.glsl",
      "ShadowVertex.glsl", "ShadowFrag.glsl", "horBlurFrag.glsl", "verBlurFrag.glsl", "blurVertex.glsl"
    ]
  });

  let intensityRng, bleedRng, bufferWidth, debugChoice, blurFlag, kindChoice;
  plug._init = (guiBuilder) => {

    kindChoice = guiBuilder.Choice({
      label: `Shadow Mapping Technique`,
      tooltip: `Chooses the Shadow Mapping algorithm: <br>
        VSM -> Variance Shadow Mapping (supports MipMapping and Blurring) <br>
        Standard -> Usual plain Shadow Mapping algorithm (supports PCF for soft shadows)`,
      options: [
        { content: "VSM", value: true, selected: true },
        { content: "Standard", value: false }
      ],
      bindTo: (function () {
        var callback = function (vsm) {
          shadowPassOptions.vsm = vsm;
          let renderTargetParams = {
            type: THREE.FloatType,
            minFilter: (vsm) ? THREE.LinearMipMapNearestFilter : THREE.NearestFilter,
            magFilter: (vsm) ? THREE.LinearMipMapNearestFilter : THREE.NearestFilter
          };
          shadowPassOptions.depthTarget = new THREE.WebGLRenderTarget(shadowPassUniforms.texSize.value, shadowPassUniforms.texSize.value, renderTargetParams);
          shadowPassOptions.hBlurTarget = new THREE.WebGLRenderTarget(shadowPassUniforms.texSize.value / 2, shadowPassUniforms.texSize.value / 2, renderTargetParams);
          shadowPassOptions.vBlurTarget = new THREE.WebGLRenderTarget(shadowPassUniforms.texSize.value / 2, shadowPassUniforms.texSize.value / 2, renderTargetParams);
        };
        callback.toString = function () { return "MLJ_SM_Algorithm"; };
        return callback;
      }())
    });

    intensityRng = guiBuilder.RangedFloat({
      label: "Shadow Transparency",
      tooltip: "Manages shadow intensity: 0 is black shadows, 1 is soft shadows",
      min: 0.0, max: 1.0, step: 0.001,
      defval: 0.5,
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassUniforms.intensity.value = value;
          scene.render();
        };
        bindToFun.toString = function () { return 'MLJ_SM_Intensity'; }
        return bindToFun;
      }())
    });

    bleedRng = guiBuilder.RangedFloat({
      label: "Bleed containment bias",
      tooltip: "Manages the bias applied in VSM to contain bleed effects",
      min: 0.0, max: 0.5, step: 0.0001,
      defval: 0.5,
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassUniforms.bleedBias.value = value;
          scene.render();
        };
        bindToFun.toString = function () { return 'MLJ_SM_BleedBias'; }
        return bindToFun;
      }())
    });

    bufferWidth = guiBuilder.Choice({
      label: `Shadow Buffer Width`,
      tooltip: `Manages the shadow buffer width, it allows only powers of 2
      to guarantee the creation of mipmaps`,
      options: [
        { content: "128", value: 128 },
        { content: "256", value: 256 },
        { content: "512", value: 512 },
        { content: "1024", value: 1024, selected: true },
        { content: "2048", value: 2048 },
        { content: "4096", value: 4096 }
      ],
      bindTo: (function () {
        var callback = function (bufferWidth) {
          shadowPassUniforms.texSize.value = bufferWidth;
        };
        callback.toString = function () { return "MLJ_SM_BufferWidth"; };
        return callback;
      }())
    });

    blurFlag = guiBuilder.Bool({
      label: "Soft Shadows",
      tooltip: "If the VSM algorithm is in use this will toggle a blur pass on the shadow map, if the Standard " +
      " is in use it will toggle PCF during the shadowmap sampling.",
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
        { content: "On", value: true }
      ],
      bindTo: (function () {
        var bindToFun = function (value) {
          shadowPassOptions.debug = value;
        };
        bindToFun.toString = function () { return 'MLJ_SM_DEBUG'; };
        return bindToFun;
      }())
    });
  };

  function SMContext() {
    /* shaders */
    shadowPassOptions.SMVert = plug.shaders.getByKey("SMVertex.glsl");
    shadowPassOptions.SMFrag = plug.shaders.getByKey("SMFrag.glsl");
    shadowPassOptions.VSMVert = plug.shaders.getByKey("VSMVertex.glsl");
    shadowPassOptions.VSMFrag = plug.shaders.getByKey("VSMFrag.glsl");
    shadowPassOptions.ShadowVert = plug.shaders.getByKey("ShadowVertex.glsl");
    shadowPassOptions.VShadowFrag = plug.shaders.getByKey("VShadowFrag.glsl");
    shadowPassOptions.ShadowFrag = plug.shaders.getByKey("ShadowFrag.glsl");
    shadowPassOptions.blurVert = plug.shaders.getByKey("blurVertex.glsl");
    shadowPassOptions.horBlurFrag = plug.shaders.getByKey("horBlurFrag.glsl");
    shadowPassOptions.verBlurFrag = plug.shaders.getByKey("verBlurFrag.glsl");

    /* weights and offset of the gaussian distrib (for a 35x35 kernel) */
    let gWeights = [0.13135, 0.10855, 0.10406, 0.07216, 0.04380,
      0.02328, 0.01083, 0.00441, 0.00157];
    let gOffsets = [0.66293, 2.47904, 4.46232, 6.44568, 8.42917,
      10.41281, 12.39664, 14.38070, 16.36501];
    // let gOffsets = [0.0, 1.3846153846, 3.2307692308];
    // let gWeights = [0.2270270270, 0.3162162162, 0.0702702703 ];

    shadowPassOptions.gaussWeights = gWeights;
    shadowPassOptions.gaussOffsets = gOffsets;

    let renderTargetParams = {
      type: THREE.FloatType,
      minFilter: (shadowPassOptions.vsm) ? THREE.LinearMipMapNearestFilter : THREE.NearestFilter,
      magFilter: (shadowPassOptions.vsm) ? THREE.LinearMipMapNearestFilter : THREE.NearestFilter
    };

    shadowPassOptions.depthTarget = new THREE.WebGLRenderTarget(shadowPassUniforms.texSize.value, shadowPassUniforms.texSize.value, renderTargetParams);
    shadowPassOptions.hBlurTarget = new THREE.WebGLRenderTarget(shadowPassUniforms.texSize.value / 2, shadowPassUniforms.texSize.value / 2, renderTargetParams);
    shadowPassOptions.vBlurTarget = new THREE.WebGLRenderTarget(shadowPassUniforms.texSize.value / 2, shadowPassUniforms.texSize.value / 2, renderTargetParams);

    let hBlurUniforms = {
      depthMap: { type: "t", value: shadowPassOptions.depthTarget },
      gWeights: { type: "1fv", value: shadowPassOptions.gaussWeights },
      gOffsets: { type: "1fv", value: shadowPassOptions.gaussOffsets },
      texSize: { type: "f", value: shadowPassUniforms.texSize.value }
    };
    let vBlurUniforms = {
      depthMap: { type: "t", value: shadowPassOptions.hBlurTarget },
      gWeights: { type: "1fv", value: shadowPassOptions.gaussWeights },
      gOffsets: { type: "1fv", value: shadowPassOptions.gaussOffsets },
      texSize: { type: "f", value: shadowPassUniforms.texSize.value }
    };

    /*
        material containing the blur pass shaders. The depth map will be blurred using this 
        shaders.
    */
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
      material containing the depth pass shaders. The original scene will be
      rendered using this shaders to produce a depth map
    */
    let prepareDepthMaterial = (size, vsm) => {
      let mat = new THREE.RawShaderMaterial({
        uniforms: { pointSize: { type: 'f', value: size } },
        side: THREE.DoubleSide,
        derivatives: true,
        vertexShader: (vsm) ? shadowPassOptions.VSMVert : shadowPassOptions.SMVert,
        fragmentShader: (vsm) ? shadowPassOptions.VSMFrag : shadowPassOptions.SMFrag
      });
      return mat;
    }
    let prepareShadowMaterial = (size, vsm) => {
      shadowPassUniforms.pointSize.value = size;
      let mat = new THREE.RawShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(shadowPassUniforms),// (needed to attach diff pointsize to diff meshes)
        side: THREE.DoubleSide,
        vertexShader: shadowPassOptions.ShadowVert,
        fragmentShader: (vsm) ? shadowPassOptions.VShadowFrag : shadowPassOptions.ShadowFrag
      });
      return mat;
    }
    /*
      This is the quad to draw on to output the rendering pass
    */
    let quad = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    let horBlurMesh = new THREE.Mesh(quad, horBlurMaterial);
    let verBlurMesh = new THREE.Mesh(quad, verBlurMaterial);
    let horBlurScene = new THREE.Scene(); horBlurScene.add(horBlurMesh);
    let verBlurScene = new THREE.Scene(); verBlurScene.add(verBlurMesh);

    this.dispose = () => {
      scene.disposeObject(shadowPassOptions.depthTarget);
      scene.disposeObject(shadowPassOptions.hBlurTarget);
      scene.disposeObject(shadowPassOptions.vBlurTarget);

      shadowPassUniforms.depthMap.value = undefined;
      hBlurUniforms.depthMap.value = undefined;
      vBlurUniforms.depthMap.value = undefined;

      horBlurScene.remove(horBlurMesh); scene.disposeObject(horBlurMesh);
      verBlurScene.remove(verBlurMesh); scene.disposeObject(verBlurMesh);

      horBlurMaterial.dispose(); verBlurMaterial.dispose();
    }

    /*
    receives an input buffer in Scene.js and outputs an output buffer that will
    be used as a texture for the last pass of the deferred rendering pipe.
    */
    this.pass = (inBuffer, outBuffer) => {
      MLJ.core.Scene.resizeWebGLRenderTarget(shadowPassOptions.depthTarget, shadowPassUniforms.texSize.value, shadowPassUniforms.texSize.value);
      MLJ.core.Scene.resizeWebGLRenderTarget(shadowPassOptions.hBlurTarget, shadowPassUniforms.texSize.value / 2, shadowPassUniforms.texSize.value / 2);
      MLJ.core.Scene.resizeWebGLRenderTarget(shadowPassOptions.vBlurTarget, shadowPassUniforms.texSize.value / 2, shadowPassUniforms.texSize.value / 2);

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
        -(diag / 2), (diag / 2),
        (diag / 2), -(diag / 2),
        -(diag / 2), (diag / 2)
      );
      /* Prepare light position, based on current light position */
      let lightD = scene.lights.Headlight.getWorldPosition();
      /* LightCamera setup */
      lightCamera.position.set(0, 0, 0);    // camera centered in (0,0,0) since it's directional only
      lightCamera.lookAt(lightD.negate());  // setting actual camera direction
      lightCamera.updateMatrixWorld();      // update camera's matrices
      lightCamera.updateProjectionMatrix();

      /******************debug flag**************/
      // the debug flag sets the renderer to display the depthmap instead of rendering the actual shadowed scene
      let dBuf, bBuf;
      if (shadowPassOptions.debug) {
        bBuf = outBuffer;
        dBuf = (shadowPassUniforms.blurFlag.value && shadowPassOptions.vsm) ? shadowPassOptions.depthTarget : outBuffer;
      } else {
        bBuf = shadowPassOptions.vBlurTarget;
        dBuf = shadowPassOptions.depthTarget;
      }
      /*************************************/
      /* Hide decorators (that should not be shadowed) */
      let decos = scene.getDecoratorsGroup();
      let layers = scene.getLayersGroup();
      let hidden = [];
      let materialChanged = [];

      decos.traverse(function (deco) {
        if (deco.visible && deco.geometry) {
          deco.visible = false;
          hidden.push(deco);
        }
      });
      /********************PREPARE DEPTH MAP*******************/
      /* Selectively attach depth map material to every mesh layer in the scene  */
      /* Filled layers and point layers will have different shader materials      */
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
            overlay.material = prepareDepthMaterial(pointSz, shadowPassOptions.vsm);
            overlay.__mlj_smplugin_pointSize = pointSz;
            materialChanged.push(overlay);
          } else if (overlay.visible && overlay.geometry) {
            overlay.visible = false;
            hidden.push(overlay);
          }
        }
      }
      /* render depth map (the clear color is set to white in order to avoid artifacts during blurring*/
      let c = renderer.getClearColor();
      let a = renderer.getClearAlpha();
      renderer.setClearColor(0xffffff, 1);
      renderer.render(sceneGraph, lightCamera, dBuf, true);
      renderer.setClearColor(c, a);
      //make decorators visible again...we need to draw em in the last render pass
      hidden.forEach(function (mesh) {
        mesh.visible = true;
      });
      /*****************PREPARE BLUR MAPS**********************/
      if (shadowPassUniforms.blurFlag.value && shadowPassOptions.vsm) {
        hBlurUniforms.depthMap.value = shadowPassOptions.depthTarget;
        vBlurUniforms.depthMap.value = shadowPassOptions.hBlurTarget;
        hBlurUniforms.texSize.value = shadowPassUniforms.texSize.value;
        vBlurUniforms.texSize.value = shadowPassUniforms.texSize.value;

        renderer.render(horBlurScene, sceneCam, shadowPassOptions.hBlurTarget, true);
        renderer.render(verBlurScene, sceneCam, bBuf, true);
      }
      /*******************FINAL RENDER PASS********************/
      let projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lightCamera.matrixWorldInverse);
      //set render pass bound uniforms
      shadowPassUniforms.lightViewProjection.value = projScreenMatrix;
      shadowPassUniforms.colorMap.value = inBuffer;
      shadowPassUniforms.depthMap.value = shadowPassOptions.depthTarget;
      shadowPassUniforms.lightDir.value = lightCamera.getWorldDirection();
      shadowPassUniforms.bufWidth.value = outBuffer.width;
      shadowPassUniforms.bufHeight.value = outBuffer.height;
      if (shadowPassUniforms.blurFlag.value && shadowPassOptions.vsm)
        shadowPassUniforms.blurMap.value = shadowPassOptions.vBlurTarget;
 
      /* Selectively attach shadow material only to filled and point meshes*/
      materialChanged.forEach(function (mesh) {
        mesh.material = prepareShadowMaterial(mesh.__mlj_smplugin_pointSize, shadowPassOptions.vsm);
      });

      if (!shadowPassOptions.debug)
        renderer.render(sceneGraph, sceneCam, outBuffer, true);

      shadowPassUniforms.blurMap.value = null;

      // Restore all the previous materials
      materialChanged.forEach(function (mesh) {
        mesh.material = mesh.__mlj_smplugin_material;
        delete mesh.__mlj_smplugin_material;
        delete mesh.__mlj_smplugin_pointSize;
      });
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
