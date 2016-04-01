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
                    
                    if(isBarycenter===false&&toolActive===true) setBarycenter(true);
                    else if(toolActive===true&&isBarycenter===true) setBarycenter(false);
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
    function checkKeyPressed(event){
        if(event.altKey){
            initializeMoving(false);
            event.preventDefault(); 
        }
        else if(event.shiftKey){
            //TO DO
        }
        else if( event.ctrlKey){
            //TO DO
        }
    }
    function checkKeyReleased(e){
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        switch(KeyID)
        {
           case 18://alt
                initializeMoving(true);
           break; 

           case 17://CTRL
               //TO DO
           break;

           case 16://SHIFT
               //TO DO
           break;
        }
    }
    var initializeMoving = function(active){
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
            control.attach(object);
            scene.getScene().add(control);
            control.name="transformControl";
            updateControls();
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
        var object=scene.getSelectedLayer().getThreeMesh();
        if(active&&isBarycenter===false){
            setBary=object.geometry.boundingSphere.center.clone().negate();
            unsetBary.copy(object.geometry.boundingSphere.center.clone());
            barycenterTra.makeTranslation(setBary.x,setBary.y,setBary.z);
            for(var i=0; i<sceneGroup.children.length;i++){
                var mesh=sceneGroup.children[i];
                mesh.geometry.applyMatrix(barycenterTra);
                updateGeometry(mesh);
            }
            var iter=scene.getLayers().iterator();
            while(iter.hasNext()){
                var layer=iter.next();
                var mesh=layer.getThreeMesh();
                if(mesh instanceof THREE.Mesh){
                    Module.Translate(layer.ptrMesh(), setBary.x, setBary.y, setBary.z, false);
                    layer.updateThreeMesh();
                }
                $(document).trigger("SceneLayerUpdatedRendering",[layer]);
                
            }
            setBary=new THREE.Vector3();
            isBarycenter=true;
        }
        else if(isBarycenter===true){
            barycenterTra.makeTranslation(unsetBary.x, unsetBary.y, unsetBary.z);
            for(var i=0; i<sceneGroup.children.length;i++){
                var mesh=sceneGroup.children[i];
                mesh.geometry.applyMatrix(barycenterTra);
                updateGeometry(mesh);
            }
            var iter=scene.getLayers().iterator();
            while(iter.hasNext()){
                var layer=iter.next();
                var mesh=layer.getThreeMesh();
                if(mesh instanceof THREE.Mesh){
                    Module.Translate(layer.ptrMesh(), unsetBary.x, unsetBary.y, unsetBary.z, false);
                    layer.updateThreeMesh();
                }
                $(document).trigger("SceneLayerUpdatedRendering",[layer]);
            }
            unsetBary=new THREE.Vector3();
            isBarycenter=false;
        }
        sceneGroup.updateMatrix();
        object.updateMatrix();
        scene.getBBox();
        updateControls();
    };

    plug._applyTo = function (meshFile, on) {
        
        
        if(on&&meshFile.getThreeMesh().visible===true){
            toolActive=true;
            initializeMoving(true);
            $(document).bind('keydown.moving',checkKeyPressed);
            $(document).bind('keyup.moving',checkKeyReleased);
        }
        else if(toolActive===true){
            initializeMoving(false);
            if(isBarycenter===true) setBarycenter(false);
            $(document).unbind('keydown.moving');
            $(document).unbind('keyup.moving');
            toolActive=false;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);