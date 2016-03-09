/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (plugin, core, scene) {
    var DISTANCEPOINTS_DISABLED=0;
    var DISTANCEPOINTS_ENABLED=1;
    
    var DEFAULTS = {
       distanceEnable : 0
    };

    var plug = new plugin.Tool({
        name: "Measure Tool",
        tooltip: "Measure Tooltip",
        icon: "img/icons/color.png",
        global : true,
    }, DEFAULTS);
    
    var distancePoints;
    plug._init = function (guiBuilder) {
        distancePoints = guiBuilder.Choice({
            label: "Get Points Distance",
            tooltip: "Choose two points on the current layer and get the distance between them.",
            options: [
                {content: "Enable", value: DISTANCEPOINTS_ENABLED},
                {content: "Disable", value: DISTANCEPOINTS_DISABLED, selected : true}
            ],
            bindTo: (function() {
                var bindToFun = function (color) {
                    var point1;
                    var point2;
                    var firstSphere;
                    var secondSphere;
                    var line;
                    var distance;
                    function makeTextSprite( message, position, parameters )
                    {
                        if ( parameters === undefined ) parameters = {};

                        //extract label params
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
                        var texture = new THREE.Texture(canvas)
                        texture.needsUpdate = true;
                        texture.minFilter = THREE.LinearFilter;
                        var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xffffff, fog: true, depthWrite: false,
                                    depthTest: false  } );
                        var sprite = new THREE.Sprite( spriteMaterial );
                        sprite.scale.set( textWidth/100, fontsize/100, 1 );
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
                    function getPickedPoint(event) {
                        event.preventDefault();
                        var _canvas=$("#_3D");
                        var mouse2D = {
                          x: event.pageX - this.offsetLeft,
                          y: event.pageY - this.offsetTop
                        };
                        var lblParameters = {
                        
                            fontSize : 20,
                            borderThickness : 5,
                            borderColor : {r:0, g:0, b:0, a:0},
                            bgColor : {r:255, g:255, b:255, a:0}

                        };
                        var camera= scene.getCamera();
                        var bbox=MLJ.core.Scene.getBBox();
                        var scaling=(15.0/bbox.min.distanceTo(bbox.max));/*
                        var offset = bbox.center().negate();
                        //console.log("scaling "+scaling);
                        camera.scale.set(scaling,scaling,scaling);
                        camera.position.set(offset.x*scaling,offset.y*scaling,offset.z*scaling);
                        camera.matrix.compose( camera.position, camera.quaternion, camera.scale );
                        camera.updateMatrix();
                        //camera.updateMatrixWorld();
                        //camera.updateProjectionMatrix();
                        console.log(camera);
                        */var raycaster = new THREE.Raycaster();
                        mouse2D.x = (mouse2D.x / _canvas.width()) * 2 - 1;
                        mouse2D.y = -(mouse2D.y / _canvas.height()) * 2 + 1;
                        console.log(mouse2D);
                        var mouseD = new THREE.Vector2( mouse2D.x, mouse2D.y );
                        
                        console.log(raycaster.setFromCamera( mouseD, camera ));
                        
                        //raycaster.set( camera.position, mouse3D.sub( camera.position ).normalize() );

                        //var intersects = raycaster.intersectObject( MLJ.core.Scene.getScene().children[0],true)
                        // Change color if hit block
                        //console.log(intersects);
                        
                        var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
                        var intersects = raycaster.intersectObject( sceneGroup, true);
                        var pickedInfo;
                        if ( intersects.length > 0 ) {
                            pickedInfo=intersects[ 0 ];
                        }
                        var groupTransf = new THREE.Matrix4();
                        groupTransf.getInverse(sceneGroup.matrixWorld);
                        var worldPos = new THREE.Vector3();
                        worldPos.copy(pickedInfo.point);
                        worldPos.applyMatrix4(groupTransf);
                        
                        
                        //if ( intersects.length > 0 ) {
                          //  var point=intersects[ 0 ];
                        //}
                        var point=worldPos;
                        //var scaling=(15.0/MLJ.core.Scene.getBBox().min.distanceTo(MLJ.core.Scene.getBBox().max));
                        point.x=Math.round(point.x*1000)/1000;
                        point.y=Math.round(point.y*1000)/1000;
                        point.z=Math.round(point.z*1000)/1000;
                        console.log(point);
                        if(point !== undefined){
                            if(point1 === undefined){ //only one point is selected we just have to highlight it
                                point1=point;
                                var geometry = new THREE.SphereGeometry( 0.05, 32, 32 );
                                var material = new THREE.MeshBasicMaterial( {
                                    color: 0xffff00,
                                    depthWrite: false,
                                    depthTest: false
                                } );
                                firstSphere = new THREE.Mesh( geometry, material );
                                firstSphere.name="s1";
                                firstSphere.position.x=point1.x;
                                firstSphere.position.y=point1.y;
                                firstSphere.position.z=point1.z;
                                scene.getScene().add( firstSphere );
                                scene.render();
                            }
                            else if(point2 === undefined){
                                point2=point;
                                var geometry = new THREE.SphereGeometry( 0.05, 32, 32 );
                                var material = new THREE.MeshBasicMaterial( {
                                    color: 0xffff00,
                                    depthWrite: false,
                                    depthTest: false
                                } );
                                secondSphere = new THREE.Mesh( geometry, material );
                                secondSphere.name="s2";
                                secondSphere.position.x=point2.x;
                                secondSphere.position.y=point2.y;
                                secondSphere.position.z=point2.z;
                                distance= Math.round((point2.distanceTo(point1))*1000)/1000;
                                scene.getScene().add( secondSphere );
                                var materialLineDown = new THREE.LineDashedMaterial({
                                        color: 0xffff00,
                                        dashSize: distance/500,
                                        gapSize: distance*5/500,
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
                                var linedown = new THREE.Line( geometryLine, materialLineDown );
                                linedown.name="Linedown";
                                scene.getScene().add( linedown );
                                var lineup=new THREE.Line( geometryLine, materialLineUp );
                                lineup.name="Lineup";
                                scene.getScene().add( lineup );
                                
                                
                                var sprite = makeTextSprite(
                                                            distance,
                                                            { x: point1.x, y: point1.y, z: point1.z},
                                                            lblParameters
                                                           );
                                sprite.name="label";
                                scene.getScene().add( sprite );
                                
                                console.log("distance is "+ distance);
                                
                                scene.render();
                                scene.getCamera().updateMatrix();
                            }
                            else {
                                scene.getScene().remove(scene.getScene().getObjectByName("s1"));
                                scene.getScene().remove(scene.getScene().getObjectByName("s2"));
                                scene.getScene().remove(scene.getScene().getObjectByName("Linedown"));
                                scene.getScene().remove(scene.getScene().getObjectByName("Lineup"));
                                scene.getScene().remove(scene.getScene().getObjectByName("label"));
                                scene.render();
                                point1=undefined;
                                point2=undefined;
                            }
                        }
                    } 
                    if(distancePoints.getValue()===DISTANCEPOINTS_ENABLED){
                        $('#_3D').css('cursor','crosshair');
                        scene.getControls().enabled=false;
                        $('#_3D').attr('onmousedown','return false');
                        $('#_3D').bind('mousedown.measure',getPickedPoint);
                        MLJ.core.Scene.getScene().children[0].updateMatrixWorld();
                        MLJ.core.Scene.getCamera().updateProjectionMatrix();
                        MLJ.core.Scene.getCamera().updateMatrixWorld();
                        MLJ.core.Scene.getCamera().updateMatrix();
                        MLJ.core.Scene.render();
                    }
                    else{
                        $('#_3D').css('cursor','default');
                        scene.getControls().enabled=true;
                        $('#_3D').unbind('mousedown.measure');
                    }
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
    };
    
    
    
    plug._applyTo = function (meshFile, on) {
        var materialLine = new THREE.LineDashedMaterial({
                color: 0xff0000,
                dashSize: 0.1,
                gapSize: 0.5
        });

        var geometryLine = new THREE.Geometry();
        geometryLine.vertices.push(
                new THREE.Vector3( 0,0,0 ),
                new THREE.Vector3( 1,1,1 )
        );
        
        var line = new THREE.Line( geometryLine, materialLine );
        line.name="line";
        scene.getScene().add( line );
        MLJ.core.Scene.render();
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
