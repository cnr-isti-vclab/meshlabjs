/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (plugin, core, scene) {
    /*
     * Moving tool works in three different ways, it allow the user to translate, to rotate or to scale the mesh has focus.
     * The tool make available these functionalities by displaying a gizmo, the user can interact with the gizmo to perform 
     * the previous operations in two differet ways: the global manner, where the gizmo is located at the center of the 3D world, 
     * in correspondance of the xyz axis; or the barycenter one where the gizmo is moved at the center of the current mesh to perform operations
     * on it handly.
     */
    var MOVING_TRANSLATE=0; //it means that the user is using the moving tool to translate a mesh
    var MOVING_ROTATE=1; //it means that the user is using the moving tool to rotate a mesh
    var MOVING_SCALE=2;//it means that the user is using the moving tool to scale a mesh
    var GLOBAL=3;//it means that the user is using the moving tool in global manner where the gizmo is located at the world coordinates (0,0,0)
    var BARYCENTER=4;//it means that the user is using the moving tool in barycenter manner that is the gizmo is moved at the center of the current mesh
    var SIZE_GIZMO=1;
    var clearButton;//it is a toobar button that can be used by the user to throw away all changes he performed on the current mesh
    var applyButton;// it is a toolbar button that can be used by the user to apply all moving he performed on the current mesh
    var pauseButton; //this is used to temporarly suspend the tool and restore the usual trackball control
    /**
     * @type {THREE.TransformControls} control  - this object is the gizmo that is displayed on the screen when the tool is active, this
     * kind of control has to be attached to the object the user want to move or scale, besides the gizmo will be located at the local position
     * of the attached object but in world coordinates
     * @type {boolean} isBarycenter - true if the barycenter mode is used by the user, false otherwise
     * @type {boolean} toolActive - treu if the tool is active, false otherwise
     */
    var control; 
    var isBarycenter=false;
    var toolActive= false;
    
    var DEFAULTS = {
       movingMode : MOVING_TRANSLATE,
       spaceMode : GLOBAL,
       sizeGizmo : SIZE_GIZMO
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
                        if(movMode.getValue()===0) control.setMode("translate"); //this method changes the gizmo shape to adapt it for realizing translation
                        else if (movMode.getValue()===1) control.setMode("rotate");//this method changes the gizmo shape to adapt it for realizing rotation
                        else if(movMode.getValue()===2) control.setMode("scale");//this method changes the gizmo shape to adapt it for realizing scaling
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
                    if(isBarycenter===false&&toolActive===true) {//the barycenter mode is selected
                        applyTransform(scene.getSelectedLayer().getThreeMesh().matrix); //when the user switch from global to barycenter mode the transformations are fixed
                        toolEnabled(false);
                        toolEnabled(true);
                    }
                    else if(isBarycenter===true&&toolActive===true) {//the global mode is selected
                        setBarycenter(false); //when the user switch from barycenter to global mode the transformations are fixed
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
                    if(control instanceof THREE.TransformControls) control.setSize(changeSize.getValue()); //this method changes the gizmo size 
                };
                bindToFun.toString = function () { return 'normalFaceSize'; }
                return bindToFun;
            }())
        });
        
    };
    /**
     * This function update the gizmo control position and the scene itself.
     */
    var updateControls = function (){
        control.update();
        scene.render();
    };
    /**
     * This function get a matrix and apply its transformation to the current selected mesh by the c++ function MoveMesh.
     * This method is fundamental because, even if the gizmo changes the mesh matrices, we have to make permanently these local changes in order to
     * export them in the geometry to the mesh itself.
     * @param {THREE.Matrix4} matrix
     */
    var applyTransform =function(matrix){
        var layer=scene.getSelectedLayer();
        var matrixMoving=new Float32Array(matrix.toArray());    
        var nMatrixMovBytes=matrixMoving.length*matrixMoving.BYTES_PER_ELEMENT;
        var matrixMovPtr=Module._malloc(nMatrixMovBytes);
        for(var i=0;i<16;i++){
            setValue(matrixMovPtr+(i*matrixMoving.BYTES_PER_ELEMENT),matrixMoving[i],"float");
        }
        /**
         * This function applies the transformations, that the user performed on the current mesh by using the gizmo, to a lower level of the
         * mesh that is a VGC function will modify the geometry of the mesh itself according with the matrix provided. 
         * @param {Object} meshFile - this is the actual mesh to be moved, rotated or scaled, it is turned into a form a c++ function is able to understand
         * @param {Object} matrixMovPtr - link to a location where is stored the matrix transformation, this form is used to allow the c++
         * function to have full access to a variable that is defined into another programming language
         */
        Module.moveMesh(layer.ptrMesh(), matrixMovPtr);
        Module._free(matrixMovPtr);
    };
    /**
     * This function is responsable of the activation and deactivation of the moving tool: in the first case, first of all, the trackball control have to be disabled
     * to enable the TransformControls object, then the method sets the moving mode (translation, rotation or scalaling - global mode or barycenter mode)
     * according with the options the user selected in the proper panel; finally the TransformControls object is attached to the mesh. 
     * In the tool deactivation, first of all, the method applies the transformations, that are introduced by the user action, on the current mesh, then it can 
     * reset all the objects used, detach the TransformControls object and restore the trackball control.
     * @param {boolean} active - true if the function has to active the moving tool, false otherwise
     */
    var toolEnabled = function(active){
        var camera=scene.getCamera();
        var object=scene.getSelectedLayer().getThreeMesh();
        var meshGroup = scene.getSelectedLayer().getThreeMeshOrigin();
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
            control.addEventListener( 'change', updateControls ); //every time the gizmo changes, the updateControls function is invoked
            //control.setScaleSpeed(Math.round(diameterMesh));
            if(isBarycenter===false){
                control.attach(object);
            }
            else {
                control.attach(meshGroup);
            }
            scene.getScene().add(control);
            control.name="transformControl";
            updateControls();
        }
        else{
            meshGroup.position.set(0,0,0);
            meshGroup.scale.set(1,1,1);
            meshGroup.quaternion.set(0,0,0,1);
            meshGroup.updateMatrix();
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
        toolActive=active;
    };
    /** 
     * @type {THREE.Vector3} minusBary - this vector will contain the barycenter point of the current mesh in local coordinates, which is negated
     * @type {THREE.Vector3} plusBary - this vector will contain the arycenter point of the current mesh in local coordinates
     * @type {THREE.Matrix4} matrixMinusBary - this is a translation matrix, it will be used to move any mesh in the minusBary direction
     * @type {THREE.Matrix4} matrixPlusBary - this is a translation matrix, it will be used to move any mesh in the plusBary direction
     */
    var minusBary=new THREE.Vector3();
    var plusBary=new THREE.Vector3();
    var matrixMinusBary= new THREE.Matrix4();
    var matrixPlusBary = new THREE.Matrix4();
    /*
     * This method change the moving mode the user can use from barycenter mode to global mode and viceversa. For this purpose a little trick is used:
     * first of all we have to know that each mesh is included in a origin THREE.Object3D object that we can call "origin mesh", and the gizmo
     * is always located in the object position (THREE.Vector3) the control object is attached to, usually it is the vector (0,0,0) because the position
     * vector is always expressed in local coordinates. 
     * @param {boolean} active - true if the user want to use the barycenter mode, false otherwise
     */
    var setBarycenter = function(active){
        if(active&&isBarycenter===false){//it is activating the barycenter mode
            var meshGroup = scene.getSelectedLayer().getThreeMeshOrigin();
            var object=scene.getSelectedLayer().getThreeMesh();
            object.geometry.computeBoundingSphere();
            //calculating the barycenter (and its nagation) of the mesh to transform and realizing from it a translation matrix
            minusBary=object.geometry.boundingSphere.center.clone().negate();
            plusBary.copy(object.geometry.boundingSphere.center.clone());
            matrixMinusBary.makeTranslation(minusBary.x,minusBary.y,minusBary.z);
            matrixPlusBary.makeTranslation(plusBary.x,plusBary.y,plusBary.z);
            /*
             * since the control object will be attached to the origin of the current mesh, we have move this object3D, and his sons, in plusBary 
             * position so that the gizmo itself can be moved there. This operation moves the mesh as well because it is a son of the origin 
             */
            meshGroup.position.set(plusBary.x,plusBary.y,plusBary.z);
            meshGroup.updateMatrix();
            /*
             * to restore the original position of the mesh we can apply on it the reverse translation
             */
            object.position.applyMatrix4(matrixMinusBary);
            object.updateMatrix();
            /*
             * the gizmo is attached to the origin of the current mesh, so now the scene is unchanged but
             * the gizmo is located in the center of the mesh itself; now the problem is that any change is applyed to the origin mesh matrix
             */
            control.attach(meshGroup);
            isBarycenter=true;
        }
        else if(isBarycenter===true){//it is activating the global mode
            var meshGroup = scene.getSelectedLayer().getThreeMeshOrigin();
            var object=scene.getSelectedLayer().getThreeMesh();
            /*
             * this variable will store the translation introduced by the user
             */
            var positionMove = meshGroup.position.clone();
            var positionMatrixMove=new THREE.Matrix4();
            positionMatrixMove.makeTranslation(positionMove.x,positionMove.y,positionMove.z);
            /*
             * this variable will contain just the rotation and scaling transformations that are introduced by the user, all in a matrix
             */
            var rotScaleMove=meshGroup.matrix.clone().setPosition(new THREE.Vector3(0,0,0));
            /*
             * applying rotation and scale changing 
             */
            applyTransform(matrixMinusBary);
            applyTransform(rotScaleMove);
            applyTransform(matrixPlusBary);
            /*
             * restoring meshGroup to original location so that the mesh too is moved
             */
            meshGroup.position.set(0,0,0);
            meshGroup.scale.set(1,1,1);
            meshGroup.quaternion.set(0,0,0,1);
            meshGroup.updateMatrix();
            /*
             * restore object (mesh) to original location according with plus translation
             */
            object.position.applyMatrix4(positionMatrixMove);
            object.updateMatrix();
            /*
             * applying residual transalation changing to the mesh
             */
            applyTransform(object.matrix);
            /*
             * restoring object position
             */
            object.position.set(0,0,0);
            object.scale.set(1,1,1);
            object.quaternion.set(0,0,0,1);
            object.updateMatrix();
            /*
             * the gizmo is attached to the mesh again because the tool works in global mode now
             */
            control.attach(object);
            minusBary=new THREE.Vector3();
            plusBary=new THREE.Vector3();
            isBarycenter=false;
            
        }
        scene.getBBox();
        updateControls();
    };
    /**
    * This function manages the key pressed and released events in the actual tool plugin
    * @param {Object} keyParam - this parameter comes from Tool.js where the listeners about these kind of events are built;
    * it conatins the event triggered and two boolean fields that specify if the event is a keydown or a keyup one.
    */
    plug.fireKeyEvent= function(keyParam){
         if(keyParam.keyPressed===true){//a keydown event occurs
            if(keyParam.event.altKey){//when ALT key is pressed the moving tool is disabled and restored the trackball control
                if(control instanceof THREE.TransformControls) control.detach();
                scene.getScene().remove(scene.getScene().getObjectByName("transformControl"));
                scene.getControls().enabled=true;
                scene.render();
                toolActive=false;
                pauseButton.toggle('on');
                keyParam.event.preventDefault(); 
            }
        }
        if(keyParam.keyReleased===true){//a keyup event occurs
            var KeyID = (window.event) ? event.keyCode : keyParam.event.keyCode;
            if(KeyID===18){//when ALT key is released the moving tool is restore to the previous state
                toolEnabled(true);
                pauseButton.toggle('off');
            }
        }
    };
    plug._applyTo = function (meshFile, on) {
        if(on&&meshFile.getThreeMesh().visible===true){
            toolEnabled(true);
            clearButton= new MLJ.gui.component.Button({//instantiating the clear, apply toolbar buttons
                tooltip: "Throw away all changes",
                icon: "img/icons/github.png",
                right:true
            });
            applyButton=new MLJ.gui.component.Button({
                tooltip: "Apply changes",
                icon: "img/icons/github.png",
                right:true
            });
            pauseButton= new MLJ.gui.component.ToggleButton({//instantiating the clear button
                tooltip: "Pause the tool and restore the original trackball control.",
                icon: "img/icons/github.png",
                right:true, 
                toggle: true,
                on: false
            });
            clearButton.onClick(function (){//appending a specific function on "clear" button
                if(isBarycenter===true) isBarycenter=false;  
                toolEnabled(false);
                toolEnabled(true);
            });
            pauseButton.onClick(function (){
                if(toolActive){
                    if(control instanceof THREE.TransformControls) control.detach();
                    scene.getScene().remove(scene.getScene().getObjectByName("transformControl"));
                    scene.getControls().enabled=true;
                    scene.render();
                    toolActive=false;
                }
                else{
                    toolEnabled(true);
                }
            });
            applyButton.onClick(function (){
                var object= scene.getSelectedLayer().getThreeMesh();
                var layer= scene.getSelectedLayer();
                if(isBarycenter===false){//Global mode is selected
                    if(!object.position.equals(new THREE.Vector3(0,0,0))||!object.scale.equals(new THREE.Vector3(1,1,1))||
                        !object.quaternion.equals(new THREE.Quaternion(0,0,0,1))) {//if something in the current mesh matrix is changed, we can apply these transformations
                            applyTransform(object.matrix);
                    }
                    //let's reset the object matrix
                    object.position.set(0,0,0);
                    object.scale.set(1,1,1);
                    object.quaternion.set(0,0,0,1);
                    object.updateMatrix();
                    //let's update the mesh's overlays
                    layer.updateThreeMesh();
                    $(document).trigger("SceneLayerUpdatedRendering",[layer]);  
                    updateControls();
                }
                else{//Barycenter mode is selected
                    setBarycenter(false); //fixing changes
                    layer.updateThreeMesh();
                    $(document).trigger("SceneLayerUpdatedRendering",[layer]);
                    updateControls();
                    spaMode._changeValue(GLOBAL); //after that always GLOBAL mode is selected
                }
            });
            MLJ.widget.TabbedPane.getToolsToolBar().add(pauseButton);
            MLJ.widget.TabbedPane.getToolsToolBar().add(clearButton);//adding the clear button to the TOOL toolbar
            MLJ.widget.TabbedPane.getToolsToolBar().add(applyButton);
        }
        else{
            if(isBarycenter===true) isBarycenter=false;
            toolEnabled(false);
            if (clearButton instanceof MLJ.gui.component.Component) {//removing the toolbar buttons
                MLJ.widget.TabbedPane.getToolsToolBar().remove(clearButton);
                MLJ.widget.TabbedPane.getToolsToolBar().remove(applyButton);
                MLJ.widget.TabbedPane.getToolsToolBar().remove(pauseButton);
            }
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);