/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (plugin, core, scene) {
    var DISTANCEPOINTS_DISABLED=0; //it means that the measure tool is disabled
    var DISTANCEPOINTS_ENABLED=1; // it means that the measure tool is enabled
    
    var DEFAULTS = {
       distanceEnable : 1
    };

    var plug = new plugin.Tool({
        name: "Measure Tool",
        tooltip: "Measure Tooltip",
        icon: "img/icons/points.png",
        toggle: true,
        on: false
    }, DEFAULTS);
    
    var distancePoints;
    plug._init = function (guiBuilder) {
        distancePoints = guiBuilder.Choice({
            label: "Get Points Distance",
            tooltip: "Choose two points on the current layer and get the distance between them.",
            options: [
                {content: "Enable", value: DISTANCEPOINTS_ENABLED, selected : true},
                {content: "Disable", value: DISTANCEPOINTS_DISABLED}
            ],
            bindTo: (function() {
                var bindToFun = function () {
                    var selectedLayer=MLJ.core.Scene.getSelectedLayer();
                    if(selectedLayer.getThreeMesh().visible===false){//if the selected layer is not visible we cannot use the tool
                        distancePoints._changeValue(DISTANCEPOINTS_DISABLED); //it changes the options tab in "Disabled" 
                        return;
                    }
                    if(distancePoints.getValue()===DISTANCEPOINTS_ENABLED){//if the options tab is set on "Enabled" the measure tool can be activated
                        toolEnabled(true);
                    }
                    else{//when the options tab is set on "Disabled" the measure tool is deactivated
                        toolEnabled(false);
                    }
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
    };
    /**
     * A set of global variables the tool use to work properly
     *
     * @type point1 {THREE.Point3} - this is the first picked point by the user where the measuring stars (it is expressed in local coordinates according to the selected mesh)
     * @type point2 {THREE.Point3} - this is the second picked point (in local coordinates) by the user, when it is available a method can calculate 
     * the local distance between the first and the second one
     * @type firstSphere {THREE.Mesh} - it will be a THREE.Mesh, a yellow sphere, that will be attached on the selected layer to make visible 
     * point1, so this sphere will be built around this point
     * @type secondSphere {THREE.Mesh} - it will be a THREE.Mesh, a yellow sphere, that will be attached on the selected layer to make visible 
     * point2, so this sphere will be built around this point
     * @type lineDown {THREE.Line} - it is a yellow dashed line that will be printed between point1 and point2; this line is always visible 
     * even if another mesh is upon it
     * @type lineUp {THREE.Line} - it is a yellow continuous line that will be printed between point1 and point2; this line is visible only if 
     * there are nothing else between the line and the camera. Two lines are used to obtain a particular effect that is a dashed line is visible
     * when the line is beneath the current mesh and a continuous one is visible when the line is above the current mesh.
     * @type distance {int} - it is the local mesh distance between the selected points
     */
    var point1; 
    var point2;
    var firstSphere; 
    var secondSphere;
    var lineDown;
    var lineUp;
    var distance;
    /**
     * This function performs all the operations needed to activate or deactivate, according with the active parameter, the measure tool: 
     * for example enable or disable the trackball control, substituting it with a differet cursor, attach an event listener and so on
     * @param {boolean} active - true if the measure tool must be actived, false otherwise
     */
    var toolEnabled=function(active){
        if(active){
            $('#_3D').css('cursor','crosshair');
            scene.getControls().enabled=false;
            $('#_3D').attr('onmousedown','return false');
            $('#_3D').bind('mousedown.measure',applyMeasure);
            var tool=MLJ.core.plugin.Manager.getToolPlugins().getByKey("Measure Tool");
            var btn=tool.getButton();
            btn.toggle("on");
        }
        else{
            $('#_3D').css('cursor','default');
            scene.getControls().enabled=true;
            $('#_3D').unbind('mousedown.measure');
            $('#_3D').removeAttr("onmousedown");

        }
    };
    /**
     * This function is invoked when the tool have to be disabled fastly, 
     * it removes all the objects attached on the current layers by the tool itself
     */
    var removeTool = function(){
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        sceneGroup.remove(sceneGroup.getObjectByName("s1"));
        sceneGroup.remove(sceneGroup.getObjectByName("s2"));
        sceneGroup.remove(sceneGroup.getObjectByName("Linedown"));
        sceneGroup.remove(sceneGroup.getObjectByName("Lineup"));
        sceneGroup.remove(sceneGroup.getObjectByName("labelDist"));
        sceneGroup.remove(sceneGroup.getObjectByName("labelP1"));
        sceneGroup.remove(sceneGroup.getObjectByName("labelP2"));
        scene.render();
    };
    /**
    * This function manages the key pressed and released events in the actual tool plugin
    * @param {Object} keyParam - this parameter comes from Tool.js where the listeners about these kind of events are built;
    * it conatins the event triggered and two boolean fields that specify if the event is a keydown or a keyup one.
    */
    var fireKeyEvent= function(keyParam){
        if(keyParam.keyPressed===true){// a keydown event occurs
           if(keyParam.event.altKey){//if ALT is pressed the measure tool have to be disabled to restore the trackball control and allow the user to zoom in or out and move the camera
               toolEnabled(false);
               keyParam.event.preventDefault(); 
           }
       }
       if(keyParam.keyReleased===true){//a keyup event occurs
           var KeyID = (window.event) ? event.keyCode : keyParam.event.keyCode;
           if(KeyID===18){//ALT is released so the measure tool is activated again
               toolEnabled(true);
           }
       }
    };
    /**
     * This function gets a screen 2D point and returns the first 3D local point on the current mesh which is intersected by a ray, which starts from 
     * the first one. In this method is used a well-know approach to picked up a set of points on the current mesh that are displayed under the
     * same 2D point on the screen. It is performed by firing a ray from the screen point, which is projected in 3D coordinates, and finding all 
     * the mesh points are intersected by this ray. The first one is returned.
     * @param {Object} mouse2D - an object that contains the screen coordinates of the clicked point by the user
     * @returns {Object} - an object that contains the distance between the picked point on the mesh and the camera, the picked point in local
     * coordinates, the mesh intersected by the ray, the face intersected an so on
     */
    function getPickedPoints(mouse2D){
        //collecting all the objects needed to perform this the above described operation
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        var layerName=MLJ.core.Scene.getSelectedLayer().name;
        var camera=MLJ.core.Scene.getCamera();
        //updating the render enviroment to be sure to use the correct setting
        scene.updateGeometry(sceneGroup.getObjectByName(layerName));
        scene.render();
        camera.updateMatrixWorld();
        camera.updateMatrix();
        camera.updateProjectionMatrix();
        //building the ray object by THREEJS
        var raycaster=new THREE.Raycaster();
        raycaster.setFromCamera(mouse2D,camera);
        //calculating the set of points on the mesh that are intersected by the ray; the second parameter means that 
        //we have to take into account the selected mesh's sons too.
        var intersects=raycaster.intersectObject(sceneGroup.getObjectByName(layerName),true);
        var pickedInfo;
        if(intersects.length>0){
            pickedInfo=intersects[0]; //we just take the first intersected point on the mesh, the nearest to the camera
            var scalingMatrix=new THREE.Matrix4();
            scalingMatrix.getInverse(sceneGroup.matrix);
            pickedInfo.point.applyMatrix4(scalingMatrix);//the 3D point have to be adjusted according with the main object3D's scaling matrix
        }
        return pickedInfo;
    }
    /**
     * Triggered when a mouseDown event occurs while the tool is active. This is the main function that is run when the user click on the current 
     * mesh: with the first click, the first point with its own local coordinates is displayed on the screen in the right place that is where 
     * the user clicked; with the second click the second point with its own local coordinates is displayed on the screen and the method prints the
     * lines and displays the local distance between them as well; finally the third click resets the measure tool by removing all the previous added objects
     * @param {Event} event 
     */
    function applyMeasure(event) {
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        var camera= scene.getCamera();
        event.preventDefault();
        var _canvas=$("#_3D");
        var mouse2D = { //this is the point on the screen, in screen coordinates, the user clicked
          x: event.pageX - this.offsetLeft,
          y: event.pageY - this.offsetTop
        };
        mouse2D.x = (mouse2D.x / _canvas.width()) * 2 - 1; //the mouse coordinates have to be adjusted in the domain [-1,1]
        mouse2D.y = -(mouse2D.y / _canvas.height()) * 2 + 1;
        var pickedInfo=getPickedPoints(mouse2D); //the first 3D point on the current mesh which is beneath the screen point the user selected
        if(pickedInfo !== undefined&& pickedInfo.object.visible === true){ //check if the mesh to whom belongs the picked point is visible
            var point=pickedInfo.point;
            var scalability={ //this object is used to provide the best parameters have to be used to display properly, with the right dimension, firstSphere and secondSphere. Their dimensions have to be always the same regardless the position or the current camera zoom
                param1: camera.position.distanceTo(new THREE.Vector3(mouse2D.x,mouse2D.y,0.5)),
                param2: sceneGroup.scale.length()
            };
            point.x=Math.round(point.x*1000)/1000;
            point.y=Math.round(point.y*1000)/1000;
            point.z=Math.round(point.z*1000)/1000;
            var geometrySphere = new THREE.SphereGeometry(0.005*(scalability.param1/scalability.param2), 32, 32 );
            var materialSphere = new THREE.MeshBasicMaterial( {
                    color: 0xffff00,
                    depthWrite: false,
                    depthTest: false
                } );
            if(sceneGroup.getObjectByName("s1") === undefined){ //if this object doesn't exist it means that the first point have to be added on the current mesh
                point1=point;
                firstSphere = new THREE.Mesh( geometrySphere, materialSphere );
                firstSphere.name="s1";
                firstSphere.position.x=point1.x;
                firstSphere.position.y=point1.y;
                firstSphere.position.z=point1.z;
                sceneGroup.add( firstSphere );
                scene.makeTextSprite(//this is a label that show the local coordinates of the first selected point on the mesh
                    "("+point1.x+","+point1.y+","+point1.z+")",
                    point1,
                    {name:"labelP1"},
                    sceneGroup 
                );
                scene.render();
            }
            else if(sceneGroup.getObjectByName("s2") === undefined){//if the previous if-statment fails and this object doesn't exist, it means that the second point have to be added on the current mesh
                point2=point;
                secondSphere = new THREE.Mesh( geometrySphere, materialSphere );
                secondSphere.name="s2";
                secondSphere.position.x=point2.x;
                secondSphere.position.y=point2.y;
                secondSphere.position.z=point2.z;
                sceneGroup.add( secondSphere );
                //since the user selected two points the method can calculate the distance between them and it can print the lineDown and the lineUp
                distance= Math.round((point2.distanceTo(point1))*1000)/1000;
                var materialLineDown = new THREE.LineDashedMaterial({
                        color: 0xffff00,
                        dashSize: distance/500,
                        gapSize: distance*2/500,
                        depthWrite: false,
                        depthTest: false,
                });
                var materialLineUp = new THREE.LineBasicMaterial({
                        color: 0xffff00
                });
                var geometryLine = new THREE.Geometry();
                geometryLine.vertices.push(
                        new THREE.Vector3( point1.x, point1.y, point1.z ),
                        new THREE.Vector3( point2.x, point2.y, point2.z )
                );
                geometryLine.computeLineDistances();
                lineDown = new THREE.Line( geometryLine, materialLineDown );
                lineDown.name="Linedown";
                sceneGroup.add( lineDown );
                lineUp=new THREE.Line( geometryLine, materialLineUp );
                lineUp.name="Lineup";
                sceneGroup.add( lineUp );
                scene.makeTextSprite(//this is a label that show the local distance between the two points
                    distance,
                    new THREE.Vector3((point1.x+point2.x)/2,(point1.y+point2.y)/2,(point1.z+point2.z)/2),
                    {name:"labelDist"},
                    sceneGroup
                );
                scene.makeTextSprite(//this is a label that show the local coordinates of the second selected point on the mesh
                    "("+point2.x+","+point2.y+","+point2.z+")",
                    point2,
                    {name: "labelP2"},
                    sceneGroup
                );
                scene.render();
            }
            else {//if two points are selected on the screen with their distance and the user click again on the mesh then the measure tool must be resetted
                removeTool();
                point1=undefined;
                point2=undefined;
            }
        }
    }
   
    plug._applyTo = function (meshFile, on, keyParam) {
        if(keyParam !== undefined){// this "if" statement is run when a keydown or keyup event is triggered and this tool have to manage it
            if(keyParam.event!== null) {
                fireKeyEvent(keyParam);
                return;
            }
        }
        if(on){
            distancePoints._changeValue(DISTANCEPOINTS_ENABLED);
            MLJ.core.plugin.Manager.getToolPlugins().getByKey("Measure Tool").getParam().label.flag("bindTo").call(); // the distancePoint's bindTo function is performed
        }
        else{
            toolEnabled(false);
            distancePoints._changeValue(DISTANCEPOINTS_DISABLED);
            removeTool();
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
