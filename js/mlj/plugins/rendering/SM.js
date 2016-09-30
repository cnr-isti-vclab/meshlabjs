
(function (plugin, core, scene) {

  //TODO: usando decorators e layers associative arrays puoi evitare il discorso di due gruppi separati

  // IDEA : prova a limitare di più il bleeding, magari con un test sulla normale
  //TODO: togli doubleside su filled e lo shader suo!!

  //IDEA: Per permettere la scelta della direzione di luce dovrei:
  /*
      ===> integrare transformControls.... :

            -- dovrei attacchare il control alla luce, ma la luce non ha matrici di trasformazione (cerca un modo) 
              (tinkera un po per vedere se riesci a fare il modo (alla fine è object3d))

            -- altrimenti attacchalo a un oggetto e poi applica la trasformazione alla posizione dell'oggeto 
              (questa più facile ma sa di hack)

            => in Scene.js: 
              - 
              -
              -
            => in un plugin (Global.js forse?):
              -
              -
              -
  */
  // TODO: refactoring---commenting---memorycleanupondispose---icon

  /* variables for ui interaction */
  let intensity = 1.0;
  let fixedLight = false;
  let debug = false;

  let shadowPassUniforms = {
    vBlurMap:             { type: "t", value: null },
    hBlurMap:             { type: "t", value: null },
    depthMap:             { type: "t", value: null },
    positionMap:          { type: "t", value: null },
    colorMap:             { type: "t", value: null },
    lightViewProjection:  { type: "m4", value: null},
    intensity:            { type: "f", value: null },
    lightDir:             { type: 'v3', value: null}
  };

  let shadowPassOptions = {
    minFilter: null,
    SMVert: null,
    SMFrag: null,
    ShadowFrag: null,
    bufferWidth: 512,
    bufferHeight: 512,
    lightPos: null
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
  let intensityRng;

  plug._init = (guiBuilder) => {
    intensityRng = guiBuilder.RangedFloat({
      label : "Shadow Transparency",
      tooltip : "Manages shadow intensity: 0 is black shadows, 1 is soft shadows",
      min: 0.0, max: 1.0, step: 0.001,
      defval : 1.0,
      bindTo: (function() {
          var bindToFun = function (value) {
            intensity = value;
            scene.render();
          };
          bindToFun.toString = function () { return 'MLJ_SM_Intensity'; }
          return bindToFun;
      }())
    });

    bufferWidth = guiBuilder.Choice({
      label : `Shadow Buffer Width`,
      tooltip : `Manages the shadow buffer width, it allows only powers of 2
      to guarantee the creation of mipmaps`,
      options: [
        {content: "128", value: 128},
        {content: "256", value: 256},
        {content: "512", value: 512, selected: true},
        {content: "1024", value: 1024},
        {content: "2048", value: 2048},
        {content: "4096", value: 4096}
      ],
      bindTo: (function() {
          var callback = function (bufferWidth) {
            plug._applyTo(false);
            shadowPassOptions.bufferWidth = bufferWidth;
            shadowPassOptions.bufferHeight = bufferWidth;
            plug._applyTo(true);
          };
          callback.toString = function () { return "MLJ_SM_BufferWidth"; };
          return callback;
      }())
    });

    guiBuilder.Choice({
        label: "Fix Light",
        tooltip: "Fix light in current position, unbinding it from camera",
        options: [
            {content: "Off", value: false, selected: true},
            {content: "On", value: true }
        ],
        bindTo: (function() {
            var bindToFun = function (value) {
                fixedLight = value;
            };
            bindToFun.toString = function () { return 'MLJ_SM_FixedLight'; };
            return bindToFun;
        }())
    });

    guiBuilder.Choice({
        label: "Debug MODE",
        tooltip: "Use me sometimes",
        options: [
            {content: "Off", value: false, selected: true},
            {content: "On", value: true }
        ],
        bindTo: (function() {
            var bindToFun = function (value) {
                debug = value;
            };
            bindToFun.toString = function () { return 'MLJ_SM_DEBUG'; };
            return bindToFun;
        }())
    });
  };

  function SMContext() {
    shadowPassOptions.minFilter = THREE.LinearMipMapNearestFilter;
    /* shaders */
    shadowPassOptions.SMVert = plug.shaders.getByKey("VSMVertex.glsl");
    shadowPassOptions.SMFrag = plug.shaders.getByKey("VSMFrag.glsl");
    shadowPassOptions.shadowFrag = plug.shaders.getByKey("VShadowFrag.glsl");
    shadowPassOptions.blurVert = plug.shaders.getByKey("blurVertex.glsl");
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
      type: THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: THREE.Linear
    };

    let depthMapTarget = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth, shadowPassOptions.bufferHeight, renderTargetParams);
    let horBlurTarget = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth / 2, shadowPassOptions.bufferHeight / 2, renderTargetParams);
    let verBlurTarget = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth / 2, shadowPassOptions.bufferHeight / 2, renderTargetParams);
    let positionMapTarget = new THREE.WebGLRenderTarget(shadowPassOptions.bufferWidth, shadowPassOptions.bufferHeight, renderTargetParams);

    shadowPassUniforms.depthMap.value     = depthMapTarget;
    shadowPassUniforms.positionMap.value  = positionMapTarget;
    shadowPassUniforms.vBlurMap.value     = verBlurTarget;
    shadowPassUniforms.hBlurMap.value     = horBlurTarget;
    /*
    material containing the depth pass shaders. The original scene will be
    rendered using this shaders to produce a depth map
    */
    let prepareDepthMaterial = (size) => {
      let mat = new THREE.RawShaderMaterial({
        uniforms: { pointSize: {type: 'f', value: size } },
        side: THREE.DoubleSide,
        derivatives: true,
        vertexShader: shadowPassOptions.SMVert,
        fragmentShader: shadowPassOptions.SMFrag
      });
      return mat;
    }
    let preparePositionMaterial = (size) => {
      let mat = new THREE.RawShaderMaterial({
        uniforms: { pointSize: {type: 'f', value: size } },
        side: THREE.DoubleSide,
        vertexShader: plug.shaders.getByKey("PositionVertex.glsl"),
        fragmentShader: plug.shaders.getByKey("PositionFragment.glsl")
      });
      return mat;
    }

    let blurUniforms = {
      depthMap: {type: "t", value: depthMapTarget},
      gWeights: {type: "1fv", value: shadowPassOptions.gaussWeights},
      gOffsets: {type: "1fv", value: shadowPassOptions.gaussOffsets},
      texSize: {type: "f", value: shadowPassOptions.bufferWidth}
    };

    let horBlurMaterial = new THREE.RawShaderMaterial({
      uniforms: blurUniforms,
      side: THREE.DoubleSide,
      vertexShader: shadowPassOptions.blurVert,
      fragmentShader: shadowPassOptions.horBlurFrag
    });

    let verBlurMaterial = new THREE.RawShaderMaterial({
      uniforms: blurUniforms,
      side: THREE.DoubleSide,
      vertexShader: shadowPassOptions.blurVert,
      fragmentShader: shadowPassOptions.verBlurFrag
    });
    /*
    quad che disegno per il passo di defferred rendering
    */
    let quad = new THREE.PlaneBufferGeometry(2,2, 1, 1);
    let shadowMapMesh = new THREE.Mesh(quad, new THREE.RawShaderMaterial({
      uniforms: shadowPassUniforms,
      side: THREE.DoubleSide,
      vertexShader: plug.shaders.getByKey("ShadowVertex.glsl"),
      fragmentShader: shadowPassOptions.shadowFrag
    }));

    let horBlurMesh = new THREE.Mesh(quad, horBlurMaterial);
    let verBlurMesh = new THREE.Mesh(quad, verBlurMaterial);

    let horBlurScene = new THREE.Scene();
    horBlurScene.add(horBlurMesh);
    let verBlurScene = new THREE.Scene();
    verBlurScene.add(verBlurMesh);
    let shadowScene = new THREE.Scene();
    shadowScene.add(shadowMapMesh);

    let lightCamera;
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
      lightCamera = new THREE.OrthographicCamera(
        -(diag) / 2,
        diag / 2,
        diag / 2,
        -(diag / 2),
        -(diag / 2),
        diag / 2
      );
      /* Prepare light position, based on current camera position */
      let lightPos = scene.lights.Headlight.getPosition();
      if(!fixedLight) {
        shadowPassOptions.lightPos = new THREE.Vector3(
          lightPos.x + 4,
          lightPos.y - 1,
          lightPos.z
        );
      }
      let lightD = new THREE.Vector3(shadowPassOptions.lightPos.x,shadowPassOptions.lightPos.y,shadowPassOptions.lightPos.z );
      /* LightCamera setup */
      lightCamera.position.set(0, 0, 0);
      lightCamera.lookAt(lightD.negate());
      lightCamera.updateMatrixWorld();
      lightCamera.updateProjectionMatrix();

      /******************debug**************/
      let buf;
      if (debug) buf = outBuffer;
      else buf = horBlurTarget;
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
      renderer.render(sceneGraph, lightCamera, depthMapTarget, true);

      /******************PREPARE POSITION MAP********************/
      /*Selectively attach position map material */
      for (let mesh in materialChanged) {
        materialChanged[mesh].material = preparePositionMaterial(materialChanged[mesh].__mlj_smplugin_pointSize);
      }
      renderer.render(sceneGraph, sceneCam, positionMapTarget, true);

      /* Make hidden layers visible again  &  restore geometry materials */
      for(let mesh in hidden) {
        hidden[mesh].visible = true;
      }
      for (let mesh in materialChanged) {
        materialChanged[mesh].material = materialChanged[mesh].__mlj_smplugin_material;
        delete materialChanged[mesh].__mlj_smplugin_material;
        delete materialChanged[mesh].__mlj_smplugin_pointSize;
      }

      /*****************PREPARE BLUR MAPS**********************/
      renderer.render(horBlurScene, sceneCam, buf, true);
      renderer.render(verBlurScene, sceneCam, verBlurTarget, true);
      /*******************FINAL RENDER PASS********************/
      let projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lightCamera.matrixWorldInverse);

      shadowPassUniforms.lightViewProjection.value  = projScreenMatrix;
      shadowPassUniforms.colorMap.value             = inBuffer;
      shadowPassUniforms.intensity.value            = intensity;
      shadowPassUniforms.lightDir.value             = lightD;

      if(!debug)
       renderer.render(shadowScene, sceneCam, outBuffer, true);

      shadowPassUniforms.lightViewProjection.value  = null;
      shadowPassUniforms.colorMap.value             = null;
      shadowPassUniforms.intensity.value            = null;
      shadowPassUniforms.lightDir.value             = null;
    };
  }

  let context = null;
  plug._applyTo = (on) => {
    if (on) {
      context = new SMContext();
      scene.addPostProcessPass(plug.getName(), context.pass);
    } else {
      scene.removePostProcessPass(plug.getName());
      /* add disposing of objects */
      context = null;
    }

  };

  plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
