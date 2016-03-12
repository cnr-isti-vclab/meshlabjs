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
        icon: "img/icons/color.png",
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
                    var point1;
                    var point2;
                    var firstSphere;
                    var secondSphere;
                    var lineDown;
                    var lineUp;
                    var labelDistance;
                    var labelPoint1;
                    var labelPoint2;
                    var distance;
                    var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
                    var layerName=MLJ.core.Scene.getSelectedLayer().name;
                    var camera= scene.getCamera();
                    function makeTextSprite( message, position, parameters, scalability )
                    {
                        if ( parameters === undefined ) parameters = {};
                        var fontface = parameters.hasOwnProperty("fontFace") ?
                            parameters["fontFace"] : "Arial";
                        var fontsize = parameters.hasOwnProperty("fontSize") ?
                                parameters["fontSize"] : 10;
                        var fontweight = parameters.hasOwnProperty("fontWeight") ?
                            parameters["fontWeight"] : "normal" //white, visible
                        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
                                parameters["borderThickness"] : 4;
                        var borderColor = parameters.hasOwnProperty("borderColor") ?
                                parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 }; //black, visible
                        var backgroundColor = parameters.hasOwnProperty("bgColor") ?
                                parameters["bgColor"] : {r:255, g:255, b:255, a:1.0} //white, visible
                        //prepare label
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        context.font = fontweight + " " + fontsize + "px " + fontface;
                        // get size data (height depends only on font size)
                        var textWidth = context.measureText(message).width;
                        canvas.width = textWidth + borderThickness * 2;
                        canvas.height = fontsize + borderThickness * 2;
                        //set the param font into context
                        context.font = fontweight + " " + fontsize + "px " + fontface;
                        //set context background color
                        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                                                                  + backgroundColor.b + "," + backgroundColor.a + ")";
                        //set context border color
                        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                                                                  + borderColor.b + "," + borderColor.a + ")";
                        //set border thickness
                        context.lineWidth = borderThickness;
                        /** //MEMO : (add +x) ~~ go right; (add +y) ~~ go down) ]
                           Set the rectangular frame (ctx, top-left, top, width, height, radius of the 4 corners)
                        */
                        roundRect(context,
                                  borderThickness/2,
                                  borderThickness/2,
                                  textWidth + borderThickness,
                                  fontsize + borderThickness,
                                  6);
                        context.fillStyle = "rgba(255, 255, 255, 1.0)";
                        /** Set starting point of text, in which pt(borderThickness, fontsize+borderThickness/2) represent the
                        top left of the top-left corner of the texture text in the canvas. */
                        context.fillText( message, borderThickness, fontsize + borderThickness/2);
                        //canvas contents will be used for create a texture
                        var texture = new THREE.Texture(canvas);
                        texture.needsUpdate = true;
                        texture.minFilter = THREE.LinearFilter;
                        var spriteMaterial = new THREE.SpriteMaterial({ 
                            map: texture,
                            useScreenCoordinates: false, 
                            color: 0xffffff, 
                            depthWrite: false,
                            depthTest: false, 
                            fog: true  } );
                        var sprite = new THREE.Sprite( spriteMaterial );
                        var scaleFact= scalability.param1/scalability.param2;
                        sprite.scale.set(0.3*scaleFact,0.05*scaleFact,1);
                        sprite.position.set( position.x , position.y, position.z);
                        return sprite;
                    }
                    
                    //function for drawing rounded rectangles
                    function roundRect(ctx, x, y, w, h, r)
                    {
                        ctx.beginPath();
                        ctx.moveTo(x+r, y);
                        ctx.lineTo(x+w-r, y);
                        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
                        ctx.lineTo(x+w, y+h-r);
                        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
                        ctx.lineTo(x+r, y+h);
                        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
                        ctx.lineTo(x, y+r);
                        ctx.quadraticCurveTo(x, y, x+r, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                    function checkKeyPressed(event){
                        if(event.altKey){
                            bindMeasureEvent(false);
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
                                bindMeasureEvent(true);
                           break; 

                           case 17://CTRL
                               //TO DO
                           break;

                           case 16://SHIFT
                               //TO DO
                           break;
                        }
                    }
                    function bindMeasureEvent(active){
                        if(active){
                            $('#_3D').css('cursor','crosshair');
                            scene.getControls().enabled=false;
                            $('#_3D').attr('onmousedown','return false');
                            $('#_3D').bind('mousedown.measure',getPickedPoint);
                            scene.getControls().addEventListener("change",function(){});
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
                    }
                    function getWorldPos(mouse2D){
                        var camera=MLJ.core.Scene.getCamera();
                        var raycaster=new THREE.Raycaster();
                        
                        raycaster.setFromCamera(mouse2D,camera);
                        var intersects=raycaster.intersectObject(sceneGroup.getObjectByName(layerName),true);
                        var pickedInfo;
                        if(intersects.length>0){
                            pickedInfo=intersects[0];
                            //console.log(pickedInfo);
                            var scalingMatrix=new THREE.Matrix4();
                            scalingMatrix.getInverse(sceneGroup.matrix);
                            //console.log(scalingMatrix);
                            pickedInfo.point.applyMatrix4(scalingMatrix);
                        }
                        return pickedInfo;
                    }
                    function getPickedPoint(event) {
                        event.preventDefault();
                        var _canvas=$("#_3D");
                        var mouse2D = {
                          x: event.pageX - this.offsetLeft,
                          y: event.pageY - this.offsetTop
                        };
                        var lblParameters = {
                        
                            fontSize : 15,
                            borderThickness : 5,
                            borderColor : {r:229, g:244, b:248, a:0},
                            bgColor : {r:255, g:100, b:100, a:0.5}

                        };
                        mouse2D.x = (mouse2D.x / _canvas.width()) * 2 - 1;
                        mouse2D.y = -(mouse2D.y / _canvas.height()) * 2 + 1;
                        var pickedInfo=getWorldPos(mouse2D);
                        if(pickedInfo !== undefined&& pickedInfo.object.visible === true){
                            
                            var point=pickedInfo.point;
                            var scalability={
                                param1: pickedInfo.distance,
                                param2: sceneGroup.scale.length()
                            }
                            //console.log(scalability.param1+" "+scalability.param2);
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
                                labelPoint1 = makeTextSprite(
                                    "("+point1.x+","+point1.y+","+point1.z+")",
                                    { x: point1.x, y: point1.y, z: point1.z},
                                    lblParameters,scalability
                                );
                                labelPoint1.name="labelP1";
                                sceneGroup.add( labelPoint1 );
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
                                distance= Math.round((point2.distanceTo(point1))*1000000)/1000000;
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
                                
                                labelDistance = makeTextSprite(
                                    distance,
                                    { x: (point1.x+point2.x)/2, y: (point1.y+point2.y)/2, z: (point1.z+point2.z)/2},
                                    lblParameters,scalability
                                );
                                labelDistance.name="labelDist";
                                sceneGroup.add( labelDistance );
                                
                                labelPoint2 = makeTextSprite(
                                    "("+point2.x+","+point2.y+","+point2.z+")",
                                    { x: point2.x, y: point2.y, z: point2.z},
                                    lblParameters,scalability
                                );
                                labelPoint2.name="labelP2";
                                sceneGroup.add( labelPoint2 );
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
                    var selectedLayer=MLJ.core.Scene.getSelectedLayer();
                    if(selectedLayer.getThreeMesh().visible===false){
                        distancePoints._changeValue(DISTANCEPOINTS_DISABLED);
                        return;
                    }
                    if(distancePoints.getValue()===DISTANCEPOINTS_ENABLED){
                        bindMeasureEvent(true);
                        $(document).bind('keydown.measure',checkKeyPressed);
                        $(document).bind('keyup.measure',checkKeyReleased);
                    }
                    else{
                        bindMeasureEvent(false);
                        $(document).unbind('keydown.measure');
                        $(document).unbind('keyup.measure');
                    }
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
    };
    
    
    plug._applyTo = function (meshFile, on) {
        if(on){
            distancePoints._changeValue(DISTANCEPOINTS_ENABLED);
            MLJ.core.plugin.Manager.getToolPlugins().getByKey("Measure Tool").getParam().label.flag("bindTo").call()
        }
        else{
            var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
            $('#_3D').css('cursor','default');
            scene.getControls().enabled=true;
            $('#_3D').unbind('mousedown.measure');
            $('#_3D').removeAttr("onmousedown");
            $(document).unbind('keydown.measure');
            $(document).unbind('keyup.measure');
            //console.log("FAKE");
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
