/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (plugin, core, scene) {
    var DISTANCEPOINTS_DISABLED=0;
    var DISTANCEPOINTS_ENABLED=1;
    
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
                var bindToFun = function (color) {
                    var selectedLayer=MLJ.core.Scene.getSelectedLayer();
                    if(selectedLayer.getThreeMesh().visible===false){
                        distancePoints._changeValue(DISTANCEPOINTS_DISABLED);
                        return;
                    }
                    if(distancePoints.getValue()===DISTANCEPOINTS_ENABLED){
                        toolEnabled(true);
                    }
                    else{
                        toolEnabled(false);
                    }
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
    };
    
    var point1;
    var point2;
    var firstSphere;
    var secondSphere;
    var lineDown;
    var lineUp;
    var distance;
    
    
    var toolEnabled=function(active){
        if(active){
            $('#_3D').css('cursor','crosshair');
            scene.getControls().enabled=false;
            $('#_3D').attr('onmousedown','return false');
            $('#_3D').bind('mousedown.measure',getPickedPoint);
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
    function getWorldPos(mouse2D){
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        var layerName=MLJ.core.Scene.getSelectedLayer().name;
        var camera=MLJ.core.Scene.getCamera();
        scene.updateGeometry(sceneGroup.getObjectByName(layerName));
        scene.render();
        camera.updateMatrixWorld();
        camera.updateMatrix();
        camera.updateProjectionMatrix();

        var raycaster=new THREE.Raycaster();
        raycaster.setFromCamera(mouse2D,camera);
        var intersects=raycaster.intersectObject(sceneGroup.getObjectByName(layerName),true);
        var pickedInfo;
        if(intersects.length>0){
            pickedInfo=intersects[0];
            var scalingMatrix=new THREE.Matrix4();
            scalingMatrix.getInverse(sceneGroup.matrix);
            pickedInfo.point.applyMatrix4(scalingMatrix);
        }
        return pickedInfo;
    }
    function getPickedPoint(event) {
        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
        var camera= scene.getCamera();
        event.preventDefault();
        var _canvas=$("#_3D");
        var mouse2D = {
          x: event.pageX - this.offsetLeft,
          y: event.pageY - this.offsetTop
        };
        mouse2D.x = (mouse2D.x / _canvas.width()) * 2 - 1;
        mouse2D.y = -(mouse2D.y / _canvas.height()) * 2 + 1;
        var pickedInfo=getWorldPos(mouse2D);
        if(pickedInfo !== undefined&& pickedInfo.object.visible === true){

            var point=pickedInfo.point;
            var scalability={
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
            if(sceneGroup.getObjectByName("s1") === undefined){ //only one point is selected we just have to highlight it
                point1=point;
                firstSphere = new THREE.Mesh( geometrySphere, materialSphere );
                firstSphere.name="s1";
                firstSphere.position.x=point1.x;
                firstSphere.position.y=point1.y;
                firstSphere.position.z=point1.z;
                sceneGroup.add( firstSphere );
                scene.makeTextSprite(
                    "("+point1.x+","+point1.y+","+point1.z+")",
                    point1,
                    {name:"labelP1"},
                    sceneGroup 
                );
                scene.render();
            }
            else if(sceneGroup.getObjectByName("s2") === undefined){
                point2=point;
                secondSphere = new THREE.Mesh( geometrySphere, materialSphere );
                secondSphere.name="s2";
                secondSphere.position.x=point2.x;
                secondSphere.position.y=point2.y;
                secondSphere.position.z=point2.z;
                sceneGroup.add( secondSphere );
                distance= Math.round((point2.distanceTo(point1))*1000)/1000;
                var materialLineDown = new THREE.LineDashedMaterial({
                        color: 0xffff00,
                        dashSize: distance/500,
                        gapSize: distance*2/500,
                        depthWrite: false,
                        depthTest: false,
                });
                var materialLineUp = new THREE.LineBasicMaterial({
                        color: 0xffff00,
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

                scene.makeTextSprite(
                    distance,
                    new THREE.Vector3((point1.x+point2.x)/2,(point1.y+point2.y)/2,(point1.z+point2.z)/2),
                    {name:"labelDist"},
                    sceneGroup
                );

                scene.makeTextSprite(
                    "("+point2.x+","+point2.y+","+point2.z+")",
                    point2,
                    {name: "labelP2"},
                    sceneGroup
                );
                scene.render();
            }
            else {
                sceneGroup.remove(sceneGroup.getObjectByName("s1"));
                sceneGroup.remove(sceneGroup.getObjectByName("s2"));
                sceneGroup.remove(sceneGroup.getObjectByName("Linedown"));
                sceneGroup.remove(sceneGroup.getObjectByName("Lineup"));
                sceneGroup.remove(sceneGroup.getObjectByName("labelDist"));
                sceneGroup.remove(sceneGroup.getObjectByName("labelP1"));
                sceneGroup.remove(sceneGroup.getObjectByName("labelP2"));
                scene.render();
                point1=undefined;
                point2=undefined;
            }
        }
    }
   
    plug._applyTo = function (meshFile, on, keyParam) {
        if(keyParam !== undefined){
            if(keyParam.event!== null) {
                fireKeyEvent(keyParam);
                return;
            }
        }
        
        if(on){
            distancePoints._changeValue(DISTANCEPOINTS_ENABLED);
            MLJ.core.plugin.Manager.getToolPlugins().getByKey("Measure Tool").getParam().label.flag("bindTo").call();
        }
        else{
            var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
            toolEnabled(false);
            distancePoints._changeValue(DISTANCEPOINTS_DISABLED);
            sceneGroup.remove(sceneGroup.getObjectByName("s1"));
            sceneGroup.remove(sceneGroup.getObjectByName("s2"));
            sceneGroup.remove(sceneGroup.getObjectByName("Linedown"));
            sceneGroup.remove(sceneGroup.getObjectByName("Lineup"));
            sceneGroup.remove(sceneGroup.getObjectByName("labelDist"));
            sceneGroup.remove(sceneGroup.getObjectByName("labelP1"));
            sceneGroup.remove(sceneGroup.getObjectByName("labelP2"));
            scene.render();
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
