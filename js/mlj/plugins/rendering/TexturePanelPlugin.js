(function (plugin, core, scene) {


    var texCamera, texScene, texRenderer, texControls;

    var DEFAULTS = {
        uvParam: false,
        planeOpacity: 1,
        paramColorWidget: new THREE.Color('#FF0000'),
        selectedTexture: 0
    };

    var plug = new plugin.Texturing({
        name: "TexturePanel",
        tooltip: "Show the texture image and parametrization attached to the mesh",
        toggle: true,
        on: true
    }, DEFAULTS);

    var textureSelectionWidget, parametrizationWidget, opacityPlaneWidget, paramColorWidget;
    var widgets;
    var texNameLabel, textureInfos;

    plug._init = function (guiBuilder) {
        widgets = [];

        textureSelectionWidget = guiBuilder.Choice({
            label: "Texture:",
            tooltip: "",
            options: [{content: "dummy1", value: 1, selected: true}, //I'm gonna put 4 dummy value in order to trigger the selection menu creation
                {content: "dummy2", value: 2},
                {content: "dummy3", value: 3},
                {content: "dummy4", value: 4}
            ],
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option                
                var bindToFun = function (value) {
                    var layer = MLJ.core.Scene.getSelectedLayer();
                    if (layer.name !== null && layer.texturesNum > 0) {
                        layer.selectedTexture = value;
                        texScene.remove(texScene.getObjectByName("planeMesh"));
                        texScene.remove(texScene.getObjectByName("paramMesh"));

                        layer.texture[value].planeMesh.material.opacity = layer.texture[value].texPanelParam.planeOpacity;
                        texScene.add(layer.texture[value].planeMesh);

                        if (layer.texture[value].texPanelParam.uvParam) {
                            layer.texture[value].paramMesh.material.color = layer.texture[value].texPanelParam.paramColorWidget;
                            texScene.add(layer.texture[value].paramMesh);
                        }

                        texRenderer.render(texScene, texCamera);
                        paramColorWidget.color.setColor("#" + layer.texture[value].texPanelParam.paramColorWidget.getHexString());
                        opacityPlaneWidget.rangedfloat.setValue(layer.texture[value].texPanelParam.planeOpacity);
                        parametrizationWidget.choice.selectByValue(layer.texture[value].texPanelParam.uvParam);
                        
                        if(textureInfos && texNameLabel){
                            texNameLabel.text("Texture file name: " + layer.texture[value].fileName);
                            textureInfos.text("Info: " + layer.texture[value].width + "x" + layer.texture[value].height + "   " + layer.texture[value].components);
                        }
                    }
                };
                bindToFun.toString = function () {
                    return "selectedTexture";
                };
                return bindToFun;
            }())
        });


        parametrizationWidget = guiBuilder.Choice({
            label: "UV Parametrization",
            tooltip: "",
            options: [
                {content: "Off", value: false, selected: true},
                {content: "On", value: true}
            ],
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option                
                var bindToFun = function (choice) {
                    //if there is a layer selected and that layer has a texture, we'll show the parametrization
                    var layer = MLJ.core.Scene.getSelectedLayer();
                    if (layer.name !== null && layer.texturesNum > 0) {
                        if (choice) {
                            texScene.add(layer.texture[layer.selectedTexture].paramMesh);
                        } else {
                            texScene.remove(texScene.getObjectByName("paramMesh"));
                        }

                        texRenderer.render(texScene, texCamera);
                    }
                };
                bindToFun.toString = function () {
                    return 'uvParam';
                };
                return bindToFun;
            }())
        });

        opacityPlaneWidget = guiBuilder.RangedFloat({
            label: "Plane Opacity",
            tooltip: "How shiny the specular highlight is. A higher value gives a sharper highlight",
            min: 0, max: 1, step: 0.01,
            defval: 1,
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option                
                var bindToFun = function (value) {
                    //if there is a layer selected and that layer has a texture we'll modify its opacity
                    var layer = MLJ.core.Scene.getSelectedLayer();
                    if (layer.name !== null && layer.texturesNum > 0) {
                        layer.texture[layer.selectedTexture].planeMesh.material.opacity = value;
                        texRenderer.render(texScene, texCamera);
                    }
                };
                bindToFun.toString = function () {
                    return 'planeOpacity';
                };
                return bindToFun;
            }())
        });

        paramColorWidget = guiBuilder.Color({
            label: "Color",
            tooltip: "Change parametrization mesh color",
            color: "#" + DEFAULTS.paramColorWidget.getHexString(),
            bindTo: (function () {  // here we define also a callback to invoke at every change of this option                
                var bindToFun = function (value) {
                    //if there is a layer selected and that layer has a texture we'll modify its color
                    var layer = MLJ.core.Scene.getSelectedLayer();
                    if (layer.name !== null && layer.texturesNum > 0) {
                        layer.texture[layer.selectedTexture].paramMesh.material.color = value;
                        texRenderer.render(texScene, texCamera);
                    }
                };
                bindToFun.toString = function () {
                    return 'paramColorWidget';
                };
                return bindToFun;
            }())
        });

        widgets.push(parametrizationWidget, opacityPlaneWidget, paramColorWidget);
        hideWidgets();
        canvasInit();
    };


    plug._applyTo = function (meshFile, layersNum, $) {

        texNameLabel = $("label[for='textureName']");
        textureInfos = $("label[for='textureInfos']");

        $("#texCanvasWrapper").append(texRenderer.domElement);

        //Always remove everything from the scene when creating the meshes and adding them to the scene
        for (var i = texScene.children.length - 1; i >= 0; i--) {
            texScene.remove(texScene.children[i]);
        }

        if (meshFile.texturesNum > 0 && layersNum > 0) {

            createTextureSelectionWidget(meshFile);
            showWidgets();

            for (var i = 0; i < meshFile.texturesNum; i++) {
                var texWidth = meshFile.texture[i].width;
                var texHeight = meshFile.texture[i].height;
                var texFormat = meshFile.texture[i].format;
                var imgBuff = meshFile.texture[i].imgBuff;

                //If a layer is added, we need to create the parametrization flat mesh for the first time, so, if it's undefined
                //We'll create it only now in order to avoid useless computation on each layer selections
                if (!meshFile.texture[i].paramMesh) {
                    //Let's get started with uvs, vertices and colors
                    //We're now taking an array structured as [u,v,0] for each vertex of each face, hence the 3*3*FN size
                    var bufferptr = meshFile.cppMesh.getUvParamCoordinates(0); //we're, for now, using just the first texture uv data
                    var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, bufferptr, meshFile.FN * 9);

                    //Material used to show the parametrization
                    var paramGeomBuff = new THREE.BufferGeometry();
                    paramGeomBuff.addAttribute('position', new THREE.BufferAttribute(facesCoordsVec, 3));
                    var paramGeom = new THREE.Geometry().fromBufferGeometry(paramGeomBuff);
                    paramGeom.center(); //center the mesh in the scene       
                    var paramMesh = new THREE.Mesh(paramGeom, new THREE.MeshBasicMaterial({wireframe: true, color: meshFile.texture[i].texPanelParam.paramColorWidget})); //generate the mesh and position, scale it to its size and move it to the center 
                    paramMesh.position.x = paramMesh.position.y = 0;
                    paramMesh.position.z = 0.2; //sta un pò sopra la planeMesh
                    paramMesh.scale.x = paramMesh.scale.y = 70;
                    paramMesh.name = "paramMesh";
                    meshFile.texture[i].paramMesh = paramMesh;
                }

                //If a layer is added, we need to create the planar mesh with the texture for the first time, so, if it's undefined
                //We'll create it only now in order to avoid useless computation on each layer selections
                if (!meshFile.texture[i].planeMesh) {
                    var ratio = texWidth / texHeight; //The texture may not be squared
                    var planeGeometry = new THREE.PlaneBufferGeometry(ratio, 1);
                    planeGeometry.center();
                    var planeTexture = new THREE.DataTexture(imgBuff, texWidth, texHeight, texFormat);
                    planeTexture.needsUpdate = true;
                    planeTexture.wrapS = planeTexture.wrapT = THREE.ClampToEdgeWrapping;
                    planeTexture.minFilter = THREE.LinearFilter;
                    var planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: planeTexture, transparent: true, opacity: meshFile.texture[i].texPanelParam.planeOpacity}));
                    planeMesh.position.x = planeMesh.position.y = planeMesh.position.z = 0;
                    planeMesh.scale.x = planeMesh.scale.y = 70;
                    planeMesh.name = "planeMesh";
                    meshFile.texture[i].planeMesh = planeMesh;
                }
            }
            //Add the mesh to the scene, now is paramMesh, but can be switched with planeMesh
            texControls.reset();

            //La plane mesh è sempre visibile
            texScene.add(meshFile.texture[meshFile.selectedTexture].planeMesh);

            //Ma la parametrizzazione va mostrata in base alla selettore on/off
            if (meshFile.texture[meshFile.selectedTexture].texPanelParam.uvParam)
                texScene.add(meshFile.texture[meshFile.selectedTexture].paramMesh);
            
            
            texNameLabel.text("Texture file name: " + meshFile.texture[meshFile.selectedTexture].fileName);
            textureInfos.text("Info: " + meshFile.texture[meshFile.selectedTexture].width + "x" + meshFile.texture[meshFile.selectedTexture].height + "   " + meshFile.texture[meshFile.selectedTexture].components);

        } else {
            hideWidgets();

            if (layersNum < 1)
                texNameLabel.text("No Layer Selected");
            else
                texNameLabel.text("No texture");

            textureInfos.text("");
        }

        resizeCanvas();
        texRenderer.render(texScene, texCamera);   //Always render, if nothing is shown, then no layer is selected     
    };


    function canvasInit() {
        //The camera is ortographic and set at the center of the scene, better than prospectic in this case
        texCamera = new THREE.PerspectiveCamera(70, 512 / 512, 1, 5000);
        texCamera.position.z = 80; //80 seems like the perfect value, not sure why, I think it is because of the near/fara frustum
        texScene = new THREE.Scene();

        texRenderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            alpha: true});
        texRenderer.setPixelRatio(window.devicePixelRatio);
        texRenderer.setClearColor(0XDBDBDB, 1); //Webgl canvas background color

        texControls = new THREE.TrackballControls(texCamera, texRenderer.domElement); //with this, controls are limited to the canvas but right click does not work
        texControls.staticMoving = false;
        texControls.noRoll = true;
        texControls.noRotate = true;
        texControls.noPan = false;
        texControls.minDistance = texCamera.near;
        texControls.maxDistance = texCamera.far;
        texControls.zoomSpeed = 0.8;
        texControls.panSpeed = 0.6;
        texControls.addEventListener('change', render);

        animate();
    }


    function animate() {
        requestAnimationFrame(animate);
        texControls.update();
    }


    function render() {
        texRenderer.render(texScene, texCamera);
    }

    $(window).resize(function () {
        resizeCanvas();
        if (texRenderer && texCamera && texScene)
            texRenderer.render(texScene, texCamera);
    });


    //NEEDED TO MAKE the CONTROLS WORKING AS SOON AS THE TEXTURE TAB IS OPENED!!
    //Apparently when the canvas goes from hidden to shown, it's necessary to "update" controls in order
    //to make them work correctly
    //The mouse click won't work otherwise, unless texControls.handleResized() is called
    //Since it may be possible that the panel has been resized, better call resizeCanvas and be sure that
    //camera, controls and aspect are correct. If the tab opened is not the texture tab better resizing it
    $(window).on('tabsactivate', function (event, ui) {
        if (ui.newPanel.attr('id') === MLJ.widget.TabbedPane.getTexturePane().parent().attr('id')) {
            resizeCanvas();
            if (texRenderer && texCamera && texScene)
                texRenderer.render(texScene, texCamera);
        } else
            $(window).trigger('resize'); //This one is needed to reset the size (since it is impossible to resize the canvas back
    });

    function resizeCanvas() {
        if (texRenderer && texCamera && texScene) {
            //92.5% of the tab width, higher value makes it bigger, lower values makes schrinking impossible/slow
            var panelWidth = $("#tab-Texture").width() * 0.925;
            var panelHeight = $("#tab-Texture").height() * 0.785; //78.5% of the tab height

            texControls.handleResize();
            texCamera.aspect = panelWidth / panelHeight;
            texCamera.updateProjectionMatrix();
            texRenderer.setSize(panelWidth, panelHeight);
        }
    }

    function createTextureSelectionWidget(meshFile) {
        var selectMenu = textureSelectionWidget.choice.$;
        selectMenu.empty();
        
        for (var i = 0; i < meshFile.texturesNum; i++) {
            selectMenu.append($("<option></option>").attr("value", i).text(meshFile.texture[i].fileName));
        }
        
        selectMenu.val(meshFile.selectedTexture);
        selectMenu.selectmenu('refresh', true); //NEEDED TO UPDATE THE MENU
        
        textureSelectionWidget.choice.$.parent().parent().prependTo(MLJ.widget.TabbedPane.getTexturePane().find("div")[0]);
    }


    function hideWidgets() {
        //call the parent to hide the div containing both label and button set
        for (var i = 0; i < widgets.length; i++) {
            if (widgets[i].rangedfloat)
                widgets[i].rangedfloat.$.parent().parent().hide(200);
            if (widgets[i].color)
                widgets[i].color.$.parent().parent().hide(200);
            if (widgets[i].choice)
                widgets[i].choice.$.parent().parent().hide(200);
        }

        if (textureSelectionWidget)
            textureSelectionWidget.choice.$.parent().parent().hide(200);
        $("#texCanvasWrapper").hide(200);
    }

    function showWidgets() {
        //call the parent to show the div containing both label and button set
        for (var i = 0; i < widgets.length; i++) {
            if (widgets[i].rangedfloat)
                widgets[i].rangedfloat.$.parent().parent().show(200);
            if (widgets[i].color)
                widgets[i].color.$.parent().parent().show(200);
            if (widgets[i].choice)
                widgets[i].choice.$.parent().parent().show(200);
        }

        if (textureSelectionWidget)
            textureSelectionWidget.choice.$.parent().parent().show(200);
        $("#texCanvasWrapper").show(200);
    }



    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
