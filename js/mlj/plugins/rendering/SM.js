///GUARDA DEFERRED SHADING.....
/// per ora mi salvo depthmap e positionmap....la depth map funziona bene...positionmap sembra anche
(function (plugin, core, scene) {

  let intensity = 0.7;

  let shadowPassUniforms = {
    depthMap:             { type: "t", value: null },
    positionMap:          { type: "t", value: null },
    colorMap:             { type: "t", value: null },
    lightViewProjection:  { type: "m4", value: null},
    intensity:            { type: "f", value: null}
  };

  let depthPassUniforms = {
    variance : { type : "i", value : 0}
  };

  let shadowPassOptions = {
    minFilter: null,
    SMVert: null,
    SMFrag: null,
    ShadowFrag: null
  }


  let plug = new plugin.GlobalRendering({
    name: "Shadow Mapping",
    tooltip: "Activate Shadow Mapping render pass",
    toggle: true,
    on: false,
    icon: "img/icons/ambientocclusion.png",
    loadShader: ["VShadowFrag.glsl", "VSMVertex.glsl", "VSMFrag.glsl",
              "SMVertex.glsl", "SMFrag.glsl", "ShadowVertex.glsl",
              "ShadowFrag.glsl", "PositionVertex.glsl", "PositionFragment.glsl"]
  });
  //
  //  let varianceFlag;
  let intensityRng;
  plug._init = (guiBuilder) => {
    intensityRng = guiBuilder.RangedFloat({
      label : "Shadow Transparency",
      tooltip : "Manages shadow intensity: 0 is black shadows, 1 is no shadows",
      min: 0.0, max: 1.0, step: 0.001,
      defval : 0.7,
      bindTo: (function() {
          var bindToFun = function (value) {
            intensity = value;
            scene.render();
          };
          bindToFun.toString = function () { return 'MLJ_SM_Intensity'; }
          return bindToFun;
      }())
    });
  };


  function SMContext() {

    shadowPassOptions.minFilter = THREE.NearestFilter;
    shadowPassOptions.SMVert = plug.shaders.getByKey("SMVertex.glsl");
    shadowPassOptions.SMFrag = plug.shaders.getByKey("SMFrag.glsl");
    shadowPassOptions.shadowFrag = plug.shaders.getByKey("ShadowFrag.glsl");

    /*
    render target where the depth values will be saved, used as texture
    in the render pass which draws the shadows
    */
    // non posso specificare come solo depth?? su opengl mi pare si possa
    // quando implementerai VSM dovresti poter usare mipmapping! ricontrolla
    depthMapTarget = new THREE.WebGLRenderTarget(0, 0, {
      type: THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: shadowPassOptions.minFilter
    });


    let positionMapTarget = new THREE.WebGLRenderTarget(0, 0, {
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter
    });

    /*
    material containing the depth pass shaders. The original scene will be
    rendered using this shaders to produce a depth map
    */
    depthMaterial = new THREE.RawShaderMaterial({
      uniforms: {},
      side: THREE.DoubleSide,
      derivatives: true,
      vertexShader: shadowPassOptions.SMVert,
      fragmentShader: shadowPassOptions.SMFrag
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
    shadowMapMesh = new THREE.Mesh(quad, new THREE.RawShaderMaterial({
      uniforms: shadowPassUniforms,
      side: THREE.DoubleSide,
      vertexShader: plug.shaders.getByKey("ShadowVertex.glsl"),
      fragmentShader: shadowPassOptions.shadowFrag
    }));

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

      // depthMapTarget.setSize(inBuffer.width, inBuffer.height);
      // positionMapTarget.setSize(inBuffer.width, inBuffer.height);
      depthMapTarget.setSize(2048, 2048);
      positionMapTarget.setSize(2048, 2048);
      /////************WORK IN PROGRESS***********///////////
      //TODO: fixa come fitti la camera della luce al bbox della scena...
      //      per ora funzionicchia

      // scene.getBBox() returns a -1-1-1 111 bbox always..

      // let bbox = new THREE.Box3().setFromObject(scene.getScene());
      let bbox = scene.getBBox();
      let center = bbox.center();

      let scale = 15.0 / (bbox.min.distanceTo(bbox.max));

      let bbmax = new THREE.Vector3().copy(bbox.max);
      let bbmin = new THREE.Vector3().copy(bbox.min);

      bbmax.multiplyScalar(scale);
      bbmin.multiplyScalar(scale);

      let sceneCamPos = sceneCam.position;

      let lookAt = new THREE.Matrix4();
      let camPos = new THREE.Vector3(0,0,0);
      let viewD = new THREE.Vector3(-1,0,0);  //usate per la luce fissa a dx

      let lightPos = new THREE.Vector3(
        sceneCamPos.x + 4,
        sceneCamPos.y - 4,
        sceneCamPos.z
      );

      let lightD = new THREE.Vector3().subVectors(center, lightPos);

      lookAt.lookAt(camPos, lightD, new THREE.Vector3(0,1,0));

      bbox.set(bbmin, bbmax);
      let diag = bbox.min.distanceTo(bbox.max);

      //debugging bboxes
        // let sz = bbox.size();
        // var geometry = new THREE.BoxGeometry( sz.x, sz.y, sz.z );
        // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        // var cube = new THREE.Mesh( geometry, material );
        // scene.getScene().add( cube );
        //
        // let box = new THREE.BoundingBoxHelper(scene.getScene(), 0x888888);
        // box.update();
        // scene.getScene().add(box);

      bbox.applyMatrix4(lookAt);

      // console.log(bbox.min.x+ " b "+bbox.max.x);
      // console.log(bbox.min.y+ " b"+bbox.max.y);
      // console.log(bbox.min.z+ " b"+bbox.max.z);

      //se uso gli estremi di bbox su certe scene (tipo toroid)
      //parti del modello escono dal frusto e quindi finiscono in ombra
      //con diag invece per le prove che ho fatto funziona bene
      lightCamera = new THREE.OrthographicCamera(
        -(diag/2),
        diag/2,
        diag/2,
        -(diag/2),
        -(diag/2),
        diag/2
      );

      lightCamera.position.set(0, 0, 0);
      lightCamera.lookAt(lightD);
      lightCamera.updateMatrixWorld();
      lightCamera.updateProjectionMatrix();


      sceneGraph.overrideMaterial = depthMaterial;
      renderer.render(sceneGraph, lightCamera, depthMapTarget, true);

      // render the position map
      sceneGraph.overrideMaterial = positionMaterial;
      renderer.render(sceneGraph, sceneCam, positionMapTarget, true);
      sceneGraph.overrideMaterial = null;


      let projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lightCamera.matrixWorldInverse);

      shadowPassUniforms.lightViewProjection.value  = projScreenMatrix;
      shadowPassUniforms.depthMap.value             = depthMapTarget;
      shadowPassUniforms.positionMap.value          = positionMapTarget;
      shadowPassUniforms.colorMap.value             = inBuffer;
      shadowPassUniforms.intensity.value            = intensity;

      renderer.render(shadowScene, sceneCam, outBuffer, true);

      shadowPassUniforms.lightViewProjection.value  = null;
      shadowPassUniforms.depthMap.value             = null;
      shadowPassUniforms.colorMap.value             = null;
      shadowPassUniforms.positionMap.value          = null;
      shadowPassUniforms.intensity.value            = null;
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
