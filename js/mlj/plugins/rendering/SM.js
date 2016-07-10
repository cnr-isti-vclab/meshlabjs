///GUARDA DEFERRED SHADING.....
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
  //
  //  let varianceFlag;
  //  plug._init = (guiBuilder) => {
  //    varianceFlag = guiBuilder.Bool({
  //      label : "Debug SM",
  //      tooltip : "g",
  //      defval : false,
  //    });
  //  };

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

    let lightCamera;

    // var geometry = new THREE.BoxGeometry( sz.x, sz.y, sz.z );
    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.getScene().add( cube );
    //
    // let box = new THREE.BoundingBoxHelper(scene.getScene(), 0x888888);
    // box.update();
    // scene.getScene().add(box);

    /*
    receives an input buffer in Scene.js and outputs an output buffer that will
    be used as a texture for the last pass of the deferred rendering pipe.
    */
    this.pass = (inBuffer, outBuffer) => {

      let sceneGraph = scene.getScene();
      let sceneCam = scene.getCamera();
      let renderer = scene.getRenderer();

      depthMapTarget.setSize(inBuffer.width, inBuffer.height);
      positionMapTarget.setSize(inBuffer.width, inBuffer.height);

      /////************WORK IN PROGRESS***********///////////
      //TODO: fixa come fitti la camera della luce al bbox della scena...
      //      per ora funzionicchia

      // scene.getBBox() returns a -1-1-1 111 bbox always..
      let bbox = new THREE.Box3().setFromObject(scene.getScene());
      let center = bbox.center();

      let lookAt = new THREE.Matrix4();
      let camPos = new THREE.Vector3(0,0,0);
      let viewD = new THREE.Vector3(-1,0,0);
      lookAt.lookAt(camPos, viewD, new THREE.Vector3(0,1,0));

      console.log(lookAt.toArray());
      console.log(sceneCam.position.toArray());

      bbox.applyMatrix4(lookAt);

      let sz = bbox.size();
      let diag = bbox.min.distanceTo(bbox.max);

      console.log(bbox.min.x+ " b "+bbox.max.x);
      console.log(bbox.min.y+ " b"+bbox.max.y);
      console.log(bbox.min.z+ " b"+bbox.max.z);
      console.log(diag);

      let x = bbox.max.x - bbox.min.x;
      let y = bbox.max.y - bbox.min.y;
      let z = bbox.max.z - bbox.min.z;

      console.log(sz.x);
      lightCamera = new THREE.OrthographicCamera(
        bbox.min.x,
        bbox.max.x,
        bbox.max.y,
        bbox.min.y,
        bbox.min.z,
        bbox.max.z //non riesco a settarl obene
      );

      lightCamera.position.set(camPos.x, camPos.y, camPos.z);
      lightCamera.lookAt(viewD);
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

      shadowPassUniforms.lightViewProjection.value = projScreenMatrix;
      shadowPassUniforms.depthMap.value = depthMapTarget;
      shadowPassUniforms.positionMap.value = positionMapTarget;
      shadowPassUniforms.colorMap.value = inBuffer;

      renderer.render(shadowScene, sceneCam, outBuffer, true);

      shadowPassUniforms.depthMap.value = null;
      shadowPassUniforms.colorMap.value = null;
      shadowPassUniforms.positionMap.value = null;
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
