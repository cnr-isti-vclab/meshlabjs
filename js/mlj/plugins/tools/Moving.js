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
            label: "Mode",
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
            label: "Transformation origin",
            tooltip: "Select the mode to view the gizmo on the screen: always at the world center or centered into the current mesh.",
            options: [
                {content: "Global", value: GLOBAL, selected : true},
                {content: "Barycenter", value: BARYCENTER}
            ],
            bindTo: (function() {
                var bindToFun = function () {
                    if(isBarycenter===false&&toolActive===true) {
                        toolEnabled(false);
                        toolEnabled(true);
                    }
                    else if(toolActive===true&&isBarycenter===true) {
                        setBarycenter(false);
                        toolEnabled(false);
                        toolEnabled(true);
                    }
                    control.setSize(changeSize.getValue());
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
        changeSize = guiBuilder.RangedFloat({
            label: "Gizmo size",
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
    var applyTransform =function(matrix){
        var layer=scene.getSelectedLayer();
        var matrixMoving=new Float32Array(matrix.toArray());
            
        var nMatrixMovBytes=matrixMoving.length*matrixMoving.BYTES_PER_ELEMENT;
        var matrixMovPtr=Module._malloc(nMatrixMovBytes);
        for(var i=0;i<16;i++){
            setValue(matrixMovPtr+(i*matrixMoving.BYTES_PER_ELEMENT),matrixMoving[i],"float");
        }
        Module.moveMesh(layer.ptrMesh(), matrixMovPtr);
        Module._free(matrixMovPtr);
    };
    
    var toolEnabled = function(active){
        var camera=scene.getCamera();
        var object=scene.getSelectedLayer().getThreeMesh();
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
                    if(isBarycenter===true) setBarycenter(false);
                    break;
                }
                case BARYCENTER:{
                    if(isBarycenter===false) setBarycenter(true);
                    break;
                }
            }
            control.addEventListener( 'change', updateControls );
            //control.setScaleSpeed(Math.round(diameterMesh));
            if(isBarycenter===false)control.attach(object);
            else control.attach(scene.getSelectedLayer().getThreeMeshOrigin());
            scene.getScene().add(control);
            control.name="transformControl";
            updateControls();
        }
        else{
            if(!object.position.equals(new THREE.Vector3(0,0,0))||!object.scale.equals(new THREE.Vector3(1,1,1))||!object.quaternion.equals(new THREE.Quaternion(0,0,0,1))) applyTransform(object.matrix);
            //reset threejs Object
            object.position.set(0,0,0);
            object.scale.set(1,1,1);
            object.quaternion.set(0,0,0,1);
            object.updateMatrix();
            layer.updateThreeMesh();
            $(document).trigger("SceneLayerUpdatedRendering",[layer]);
            
            if(control instanceof THREE.TransformControls) control.detach();
            scene.getScene().remove(scene.getScene().getObjectByName("transformControl"));
            scene.getControls().enabled=true;
            scene.render();
        }
    };
    
    var minusBary=new THREE.Vector3();
    var plusBary=new THREE.Vector3();
    var matrixMinusBary= new THREE.Matrix4();
    var matrixPlusBary = new THREE.Matrix4();
    
    var setBarycenter = function(active){
        if(active&&isBarycenter===false){
            var meshGroup = scene.getSelectedLayer().getThreeMeshOrigin();
            var object=scene.getSelectedLayer().getThreeMesh();
            object.geometry.computeBoundingSphere();
            
            minusBary=object.geometry.boundingSphere.center.clone().negate();
            plusBary.copy(object.geometry.boundingSphere.center.clone());
            matrixMinusBary.makeTranslation(minusBary.x,minusBary.y,minusBary.z);
            matrixPlusBary.makeTranslation(plusBary.x,plusBary.y,plusBary.z);
            
            meshGroup.position.set(plusBary.x,plusBary.y,plusBary.z);
            meshGroup.updateMatrix();
            //meshGroup.updateMatrixWorld();
            
            object.position.applyMatrix4(matrixMinusBary);
            object.updateMatrix();
            //object.updateMatrixWorld();

            control.attach(meshGroup);
            isBarycenter=true;
        }
        else if(isBarycenter===true){
            var meshGroup = scene.getSelectedLayer().getThreeMeshOrigin();
            var object=scene.getSelectedLayer().getThreeMesh();
            
            var positionMove = meshGroup.position.clone();
            var rotScaleMove=meshGroup.matrix.clone().setPosition(new THREE.Vector3(0,0,0));
            var positionMatrixMove=new THREE.Matrix4();
            positionMatrixMove.makeTranslation(positionMove.x,positionMove.y,positionMove.z);
            //applying rotation and scale changing
            applyTransform(matrixMinusBary);
            applyTransform(rotScaleMove);
            applyTransform(matrixPlusBary);
            //restore meshGroup to original location
            meshGroup.position.set(0,0,0);
            meshGroup.scale.set(1,1,1);
            meshGroup.quaternion.set(0,0,0,1);
            meshGroup.updateMatrix();
            //meshGroup.updateMatrixWorld();
            //restore object to original location according with plus translation
            object.position.applyMatrix4(positionMatrixMove);
            object.updateMatrix();
            //object.updateMatrixWorld();
            applyTransform(object.matrix);
            //restore object
            object.position.set(0,0,0);
            object.scale.set(1,1,1);
            object.quaternion.set(0,0,0,1);
            object.updateMatrix();
            
            control.attach(object);
            minusBary=new THREE.Vector3();
            plusBary=new THREE.Vector3();
            isBarycenter=false;
            
        }
        scene.getBBox();
        updateControls();
    };
    var fireKeyEvent= function(keyParam){
         if(keyParam.keyPressed===true){
            if(keyParam.event.altKey){
                toolEnabled(false);
                keyParam.event.preventDefault(); 
            }
        }
        if(keyParam.keyReleased===true){
            var KeyID = (window.event) ? event.keyCode : keyParam.event.keyCode;
            if(KeyID===18){
                toolEnabled(true);
            }
        }
    };
    plug._applyTo = function (meshFile, on, keyParam) {
        if(keyParam !== undefined){
            if(keyParam.event!== null) {
                fireKeyEvent(keyParam);
                return;
            }
        }
        if(on&&meshFile.getThreeMesh().visible===true){
            toolActive=true;
            toolEnabled(true);
        }
        else if(toolActive===true){
            if(isBarycenter===true) setBarycenter(false);
            toolEnabled(false);
            toolActive=false;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);