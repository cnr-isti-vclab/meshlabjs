
(function (plugin, core, scene) {
  //REVIEW : bug in meshlab..se traslo mesh le ombre non vanno
  // TODO: refactoring---commenting---memorycleanupondispose---icon
  // TODO:
  // aggiungere uno switch per vsm o sm
  // aggiungere un controllo sulla dimensione del buffer di shadowmap (done)
  // fare modo che vsm e sm vadano per point - based  (studia)
  // -> ma si può fare?
  //  dubbio1: ne' rs ne ssao lo fanno e non si fa nemmeno in meshlab
  //  dubbio2: come distinguere mesh point based da mesh poligonali? io non ho un controllo cosi granulare
  //  dubbio3: come distinguere mesh point based (senza normali) da altre mesh senza normali che davvero non
  //             voglio disegnare
  //  dubbio4: i punti noi li mettiamo come overlaylayer del layer che contiene la mesh, ossia aggiungiamo
  //            la pointscloud alla mesh del nostro layer...quando tiro su una mesh point-based il layer cos'è??
  //            a fare un po' di test sembra roba continua, che contiene tutti i punti...quindi non li vedo a part i punti
  //            come fo a distinguere cosa voglio fare?
  //  dubbio5: noi usiamo pointscloud, il cui rendering, e presumo anche settare GL_POINTS come render mode
  //          è gestito da three....usando gli shaders di threee pare ci sia verso fare le ombre dei punti,
  //          ma noi, usando shaders interamente nostri ce la facciamo?
  //
//    dubbio6: in effetti three (almeno nella versione corrente) per le pointscloud setta isPoints = true
//             questo sarà usato in renderbufferdirect per settare GL_POINTS come render mode,
//================> REVIEW: ok...settando gl_pointsize riesco a disegnare i points nella shadowmap...il problema ora è
//                    che disegna anche la mesh....anche nel caso di shoulau che in teoria sono solo points...
//                  devo investigare in mlj loadmesh e in threejs....mmm però funziona solo per i punti della mesh
//                  la pointcloud che disegno sembra non funzionare...

//    dubbio7: in render() sembra che shadowmap.render sia sempre chiamato

  // IDEA:penso di aver individuato l'errore: (risolto)
  // per adesso correggere la direzione di luce ha fixato tutto tranne laurana e mano,
  // questo perché entrambi presentano la stessa caratteristica:
  //  il bbox che calcolo per loro, si trova "di fronte" alla mesh, e non sotto/sopra/alcentro/intornoperbene
  //  e quindi siccome la direzione della luce va da ~camera a bbox.center, in quei casi
  //  lo spostamento della camera rispetto la mesh non rispecchia lo spostamento rispetto
  //  il bbox...
  //  TODO: cerca di risolvere sta cosa del bbox... (DONE)

  // TODO : pensa alla cosa del point-based..

  // REVIEW: ho tentato di eliminare il passo di rendering della positionmap, ricostruendo coordinates
  //        mondo a partire dalle coordinate vUV => NDC => world ma vUv non è sufficiente...avrei bisogno di
  //           conoscere la profondità di quel pixel.... ------> semmai ripensaci un po'
  //      --> mi sa che è un gran bel NAH

  //  IDEA una cosa che potrei fare e ottimizzare leggermente è salvare dentro position map direttamente
  //      coordinate in spazio luce....ora le salvo in mondo, ma le uso solo in spazio luce poi...le usavo per debug mi sa

  /*******************************************************************
  *                                                                  *
  ******************************DEBUG*********************************
  *                                                                  *
  *******************************************************************/
  let debugBox = (bbox) => {
    let sz = bbox.size();

    let geometry = new THREE.BoxGeometry( sz.x, sz.y, sz.z );
    let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    let cube = new THREE.Mesh( geometry, material );

    // scene.getThreeJsGroup().add( cube );

    let box = new THREE.BoundingBoxHelper(scene.getScene(), 0x888888);
    box.update();
    console.log("bboxdiag: "+box.box.min.distanceTo(box.box.max) + " min: "+box.box.min.toArray()+ "max: "+box.box.max.toArray()+ "center: "+box.box.center().toArray());
    scene.getScene().add(box);
  }
  /*******************************************************************/

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
    intensity:            { type: "f", value: null}
  };

  // let depthPassUniforms = {
  //   variance : { type : "i", value : 0}
  // };

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
    /**************************************************************
    var particles, geometry, materials = [], parameters, i, h, color, size;
        geometry = new THREE.Geometry();
    for ( i = 0; i < 20000; i ++ ) {
      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2000 - 1000;
      vertex.y = Math.random() * 2000 - 1000;
      vertex.z = Math.random() * 2000 - 1000;
      geometry.vertices.push( vertex );
    }
    parameters = [
      [ [1, 1, 0.5], 5 ],
      [ [0.95, 1, 0.5], 4 ],
      [ [0.90, 1, 0.5], 3 ],
      [ [0.85, 1, 0.5], 2 ],
      [ [0.80, 1, 0.5], 1 ]
    ];
    for ( i = 0; i < parameters.length; i ++ ) {
      color = parameters[i][0];
      size  = parameters[i][1];
      //materials[i] = new THREE.PointsMaterial( { size: size } );
      particles = new THREE.PointCloud( geometry);//, materials[i] );
      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;
      scene.getScene().add( particles );
    }
    **************************************************************/
    shadowPassOptions.minFilter = THREE.LinearMipMapNearestFilter;
    // shaders
    shadowPassOptions.SMVert = plug.shaders.getByKey("VSMVertex.glsl");
    shadowPassOptions.SMFrag = plug.shaders.getByKey("VSMFrag.glsl");
    shadowPassOptions.shadowFrag = plug.shaders.getByKey("VShadowFrag.glsl");

    shadowPassOptions.blurVert = plug.shaders.getByKey("blurVertex.glsl");
    shadowPassOptions.horBlurFrag = plug.shaders.getByKey("horBlurFrag.glsl");
    shadowPassOptions.verBlurFrag = plug.shaders.getByKey("verBlurFrag.glsl");

    // pesi e offset per la distribuzione gaussiana
     let gWeights = [0.10855, 0.13135, 0.10406, 0.07216, 0.04380,
                      0.02328, 0.01083, 0.00441, 0.00157];
     let gOffsets = [0.66293, 2.47904, 4.46232, 6.44568, 8.42917,
                      10.41281, 12.39664, 14.38070, 16.36501];

    shadowPassOptions.gaussWeights = gWeights;
    shadowPassOptions.gaussOffsets = gOffsets;
    /*
    render target where the depth values will be saved, used as texture
    in the render pass which draws the shadows
    */
    // non posso specificare come solo depth?? su opengl mi pare si possa
    // quando implementerai VSM dovresti poter usare mipmapping! ricontrolla
    let depthMapTarget = new THREE.WebGLRenderTarget(0, 0, {
      type: THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: THREE.Linear
    });

    let horBlurTarget = new THREE.WebGLRenderTarget(0, 0, {
      type: THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: THREE.Linear
    });

    let verBlurTarget = new THREE.WebGLRenderTarget(0, 0, {
      type: THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: THREE.Linear
    });

    let positionMapTarget = new THREE.WebGLRenderTarget(0, 0, {
      type: THREE.FloatType,
      minFilter: shadowPassOptions.minFilter,
      magFilter: THREE.Linear
    });

    /*
    material containing the depth pass shaders. The original scene will be
    rendered using this shaders to produce a depth map
    */
    let depthMaterial = new THREE.RawShaderMaterial({
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

    let horBlurMaterial = new THREE.RawShaderMaterial({
      uniforms: {},
      side: THREE.DoubleSide,
      vertexShader: shadowPassOptions.blurVert,
      fragmentShader: shadowPassOptions.horBlurFrag
    });

    let verBlurMaterial = new THREE.RawShaderMaterial({
      uniforms: {},
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

      depthMapTarget.setSize(shadowPassOptions.bufferWidth, shadowPassOptions.bufferHeight);
      positionMapTarget.setSize(shadowPassOptions.bufferWidth, shadowPassOptions.bufferHeight);
      horBlurTarget.setSize(shadowPassOptions.bufferWidth / 2, shadowPassOptions.bufferHeight / 2);
      verBlurTarget.setSize(shadowPassOptions.bufferWidth / 2, shadowPassOptions.bufferHeight / 2);

      let bbox = scene.getBBox();

      let scale = 15.0 / (bbox.min.distanceTo(bbox.max));
      let bbmax = new THREE.Vector3().copy(bbox.max);
      let bbmin = new THREE.Vector3().copy(bbox.min);

      bbmax.multiplyScalar(scale);
      bbmin.multiplyScalar(scale);

      bbox.set(bbmin, bbmax);

      let sceneCamPos = sceneCam.position;

      if(!fixedLight) {
        shadowPassOptions.lightPos = new THREE.Vector3(
          sceneCamPos.x + 4,
          sceneCamPos.y - 1,
          sceneCamPos.z
        );
      }

      //let lookAt = new THREE.Matrix4().lookAt(new THREE.Vector3(0,0,0), lightD.negate(), new THREE.Vector3(0,1,0));

      let diag = bbox.min.distanceTo(bbox.max);
      // console.log("diag: "+ diag + " min: "+bbox.min.toArray()+ "max: "+bbox.max.toArray()+"center"+bbox.center().toArray()  );

      //se uso gli estremi di bbox su certe scene (tipo toroid)
      //parti del modello escono dal frusto e quindi finiscono in ombra
      //con diag invece per le prove che ho fatto funziona bene
      lightCamera = new THREE.OrthographicCamera(
        -(diag) / 2,
        diag / 2,
        diag / 2,
        -(diag / 2),
        -(diag / 2),
        diag / 2
      );

      let lightD = new THREE.Vector3(shadowPassOptions.lightPos.x,shadowPassOptions.lightPos.y,shadowPassOptions.lightPos.z );

      lightCamera.position.set(0, 0, 0);
      lightCamera.lookAt(lightD.negate());
      lightCamera.updateMatrixWorld();
      lightCamera.updateProjectionMatrix();

      /* Hide layers that should not be shadowed */
      if (!debug) {
        sceneGraph.traverse(function (obj) {
            if (obj.visible && obj.geometry) {
                if (!(obj instanceof THREE.Mesh) ||
                            (obj.geometry.type === "BufferGeometry" &&
                                    obj.geometry.getAttribute('normal') === undefined)) {
                    obj.visible = false;
                    obj.__mlj_smplugin_sweep_flag = true;
                }
            }
        });
      }
      /******************debug**************/
      let buf = depthMapTarget;
      if (debug) buf = outBuffer;
      /********************PREPARE DEPTH MAP*******************/
      sceneGraph.overrideMaterial = depthMaterial;
      // renderer.render(sceneGraph, lightCamera, buf, true);
      renderer.render(sceneGraph, lightCamera, depthMapTarget, true);
      sceneGraph.overrideMaterial = null;
      /******************PREPARE POSITION MAP********************/
      sceneGraph.overrideMaterial = positionMaterial;
      renderer.render(sceneGraph, sceneCam, positionMapTarget, true);
      sceneGraph.overrideMaterial = null;

      /* Make hidden layers visible again */
      sceneGraph.traverse(function (obj) {
          if (obj.__mlj_smplugin_sweep_flag === true) {
              obj.visible = true;
              delete obj.__mlj_smplugin_sweep_flag;
          }
      });
      /*****************PREPARE BLUR MAPS**********************/
      /* horizontal blur map */
      horBlurMaterial.uniforms.depthMap = {type: "t", value: depthMapTarget};
      horBlurMaterial.uniforms.gWeights = {type: "1fv", value: shadowPassOptions.gaussWeights};
      horBlurMaterial.uniforms.gOffsets = {type: "1fv", value: shadowPassOptions.gaussOffsets};
      horBlurMaterial.uniforms.texSize  = {type: "f", value: shadowPassOptions.bufferWidth};
      // renderer.render(horBlurScene, sceneCam, horBlurTarget, true);
      renderer.render(horBlurScene, sceneCam, horBlurTarget, true);
      /* vertical blur map */
      verBlurMaterial.uniforms.depthMap = {type: "t", value: depthMapTarget};
      verBlurMaterial.uniforms.gWeights = {type: "1fv", value: shadowPassOptions.gaussWeights};
      verBlurMaterial.uniforms.gOffsets = {type: "1fv", value: shadowPassOptions.gaussOffsets};
      verBlurMaterial.uniforms.texSize  = {type: "f", value: shadowPassOptions.bufferWidth};
      renderer.render(verBlurScene, sceneCam, verBlurTarget, true);

      /*******************FINAL RENDER PASS********************/
      let projScreenMatrix = new THREE.Matrix4();
      projScreenMatrix.multiplyMatrices(lightCamera.projectionMatrix, lightCamera.matrixWorldInverse);

      shadowPassUniforms.lightViewProjection.value  = projScreenMatrix;
      shadowPassUniforms.depthMap.value             = depthMapTarget;
      shadowPassUniforms.positionMap.value          = positionMapTarget;
      shadowPassUniforms.colorMap.value             = inBuffer;
      shadowPassUniforms.vBlurMap.value             = verBlurTarget;
      shadowPassUniforms.hBlurMap.value             = horBlurTarget;
      shadowPassUniforms.intensity.value            = intensity;

       renderer.render(shadowScene, sceneCam, outBuffer, true);

      shadowPassUniforms.lightViewProjection.value  = null;
      shadowPassUniforms.depthMap.value             = null;
      shadowPassUniforms.colorMap.value             = null;
      shadowPassUniforms.positionMap.value          = null;
      shadowPassUniforms.vBlurMap.value             = null;
      shadowPassUniforms.hBlurMap.value             = null;
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
      /* add disposing of objects */
      context = null;
    }

  };

  plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
