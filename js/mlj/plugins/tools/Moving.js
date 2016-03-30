/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (plugin, core, scene) {

    var MOVING_TRANSLATE=0;
    var MOVING_ROTATE=1;
    var MOVING_SCALE=2;
    var GLOBAL=3;
    var BARYCENTER=4;
    var SIZE_GIZMO=1;
    
    var control;
    
    var isBarycenter=false;
    var toolActive= false;
    
    var DEFAULTS = {
       movingMode : MOVING_TRANSLATE,
       spaceMode : GLOBAL,
       sizeGizmo: SIZE_GIZMO
    };
    
    var plug = new plugin.Tool({
        name: "Moving Tool",
        tooltip: "Moving Tooltip",
        icon: "img/icons/selectTool.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: false
    }, DEFAULTS);

    var movMode, spaMode, changeSize;
    plug._init = function (guiBuilder) {
        movMode = guiBuilder.Choice({
            label: "Moving Mode",
            tooltip: "Choose one of the possible ways to move the current layer by translation, rotation or scalation.",
            options: [
                {content: "Translate", value: MOVING_TRANSLATE, selected : true},
                {content: "Rotate", value: MOVING_ROTATE},
                {content: "Scale", value: MOVING_SCALE}
            ],
            bindTo: (function() {
                var bindToFun = function () {
                    if(control instanceof THREE.TransformControls){
                        if(movMode.getValue()===0) control.setMode("translate");
                        else if (movMode.getValue()===1) control.setMode("rotate");
                        else if(movMode.getValue()===2) control.setMode("scale");
                    }
                    
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
        spaMode = guiBuilder.Choice({
            label: "Tool Mode",
            tooltip: "Select the mode to view the gizmo on the screen: always at the world center or centered into the current mesh.",
            options: [
                {content: "Global", value: GLOBAL, selected : true},
                {content: "Barycenter", value: BARYCENTER}
            ],
            bindTo: (function() {
                var bindToFun = function () {
                    
                    if(spaMode.getValue()===BARYCENTER&&toolActive===true) setBarycenter(true);
                    else if(toolActive===true) setBarycenter(false);
                    control.setSize(changeSize.getValue());
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
        changeSize = guiBuilder.RangedFloat({
            label: "Change setting size",
            tooltip: "Increase or decrease the setting size useful to translate, rotate or scale the current layer.",
            min: 0.1, max: 3, step: 0.1,
            defval: DEFAULTS.sizeGizmo,
            bindTo: (function() {
                var bindToFun = function (size, overlay) {
                    if(control instanceof THREE.TransformControls) control.setSize(changeSize.getValue());
                };
                bindToFun.toString = function () { return 'normalFaceSize'; }
                return bindToFun;
            }())
        });
        
    };
    var updateControls = function (){
        control.update();
        scene.render();
    };
    var updateGeometry = function(mesh){
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeFaceNormals();
        mesh.geometry.computeVertexNormals();
        try{
            mesh.geometry.computeMorphNormals();
        }
        catch(err){}
        mesh.updateMatrix();
    };
    var initializeMoving = function(active){
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        var layerName=scene.getSelectedLayer().name;
        var camera=scene.getCamera();
        var object=sceneGroup.getObjectByName(layerName);
        var layer=scene.getSelectedLayer();
        var _canvas=document.getElementById("_3D");
        if(active){
            scene.getControls().enabled=false;
            var diameterMesh=object.geometry.boundingSphere.radius;
            control= new THREE.TransformControls(camera,_canvas);
            switch (movMode.getValue()) {
                case MOVING_TRANSLATE:{
                    control.setMode("translate"); 
                    break;
                }case MOVING_ROTATE:{    
                    control.setMode("rotate");
                    break;
                }case MOVING_SCALE:{
                    control.setMode("scale");
                    break;
                }
            }
            control.setSize(changeSize.getValue());
            switch (spaMode.getValue()){
                case GLOBAL:{
                    setBarycenter(false);
                    break;
                }
                case BARYCENTER:{
                    setBarycenter(true);
                    break;
                }
            }
            control.addEventListener( 'change', updateControls );
            control.setScaleSpeed(Math.round(diameterMesh));
            control.attach(object);
            scene.getScene().add(control);
            control.name="transformControl";
            scene.render();
        }
        else{
            var matrixMoving=new Float32Array(object.matrix.toArray());
            var nMatrixMovBytes=matrixMoving.length*matrixMoving.BYTES_PER_ELEMENT;
            var matrixMovPtr=Module._malloc(nMatrixMovBytes);
            for(var i=0;i<16;i++){
                setValue(matrixMovPtr+(i*matrixMoving.BYTES_PER_ELEMENT),matrixMoving[i],"float");
            }
            Module.moveMesh(layer.ptrMesh(), matrixMovPtr);
            Module._free(matrixMovPtr);
            //reset threejs Object
            object.position.set(0,0,0);
            object.scale.set(1,1,1);
            object.quaternion.set(0,0,0,1);
            object.updateMatrix();
            layer.updateThreeMesh();
            //scene.getBBox();
            $(document).trigger("SceneLayerUpdatedRendering",[layer]);
            
            if(control instanceof THREE.TransformControls) control.detach();
            scene.getScene().remove(scene.getScene().getObjectByName("transformControl"));
            scene.getControls().enabled=true;
            scene.render();
        }
    };
    
    var setBary=new THREE.Vector3();
    var unsetBary=new THREE.Vector3();
    
    var setBarycenter = function(active){
        var barycenterTra= new THREE.Matrix4();
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        var layerName=scene.getSelectedLayer().name;
        var object=sceneGroup.getObjectByName(layerName);
        if(active&&isBarycenter===false){
            setBary=object.geometry.boundingSphere.center.clone().negate();
            unsetBary.copy(object.geometry.boundingSphere.center.clone());
            barycenterTra.makeTranslation(setBary.x,setBary.y,setBary.z);
            for(var i=0; i<sceneGroup.children.length;i++){
                var mesh=sceneGroup.children[i];
                mesh.geometry.applyMatrix(barycenterTra);
                updateGeometry(mesh);
                var layer=scene.getLayerByName(mesh.name);
                if(mesh instanceof THREE.Mesh&&mesh.name!==""){
                    Module.Translate(layer.ptrMesh(), setBary.x, setBary.y, setBary.z, false);
                    layer.updateThreeMesh();
                }
                
            }
            setBary=new THREE.Vector3();
            sceneGroup.updateMatrix();
            scene.getBBox();
            updateControls();
            isBarycenter=true;
        }
        else{
            barycenterTra.makeTranslation(unsetBary.x, unsetBary.y, unsetBary.z);
            for(var i=0; i<sceneGroup.children.length;i++){
                var mesh=sceneGroup.children[i];
                mesh.geometry.applyMatrix(barycenterTra);
                updateGeometry(mesh);
                var layer=scene.getLayerByName(mesh.name);
                if(mesh instanceof THREE.Mesh&&mesh.name!==""){
                    Module.Translate(layer.ptrMesh(), unsetBary.x, unsetBary.y, unsetBary.z, false);
                    layer.updateThreeMesh();
                }
                
            }
            unsetBary=new THREE.Vector3();
            sceneGroup.updateMatrix();
            scene.getBBox();
            updateControls();
            isBarycenter=false;
        }
    };

    plug._applyTo = function (meshFile, on) {
        
        
        if(on&&meshFile.getThreeMesh().visible===true){
            toolActive=true;
            initializeMoving(true);
        }
        else if(toolActive===true){
            initializeMoving(false);
            setBarycenter(false);
            toolActive=false;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);