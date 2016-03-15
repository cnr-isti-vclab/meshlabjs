/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (plugin, core, scene) {

    var MOVING_TRANSLATE=0;
    var MOVING_ROTATE=1;
    var MOVING_SCALE=2;
    var SPACE_WORLD=3;
    var SPACE_LOCAL=4;
    var INCREASE=5;
    var DECREASE=6;
    
    var camera=scene.getCamera();
    //var _canvas=$('#_3D');
    var control;
    
    var DEFAULTS = {
       movingMode : MOVING_TRANSLATE,
       spaceMode : SPACE_WORLD
    };
    
    var plug = new plugin.Tool({
        name: "Moving Tool",
        tooltip: "Moving Tooltip",
        icon: "img/icons/selectTool.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: false
    }, DEFAULTS);

    var movMode, spaMode, changeSett;
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
                    if(movMode.getValue()===0) control.setMode("traslate");
                    else if (movMode.getValue()===1) control.setMode("rotate");
                    else if(movMode.getValue()===2) control.setMode("scale");
                    camera.updateProjectionMatrix();
                    scene.render();
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
        spaMode = guiBuilder.Choice({
            label: "Space Mode",
            tooltip: "Select the space in which the current layer has to been moved by the above transformation.",
            options: [
                {content: "World", value: SPACE_WORLD, selected : true},
                {content: "Local", value: SPACE_LOCAL}
            ],
            bindTo: (function() {
                var bindToFun = function () {
                    control.setSpace( control.space === "local" ? "world" : "local" );
                    camera.updateProjectionMatrix();
                    scene.render();
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
        changeSett = guiBuilder.Choice({
            label: "Change setting size",
            tooltip: "Increase or decrease the setting size useful to translate, rotate or scale the current layer.",
            options: [
                {content: "Increase", value:INCREASE , selected : true},
                {content: "Decrease", value:DECREASE}
            ],
            bindTo: (function() {
                var bindToFun = function () {
                    if(changeSett.getValue()===INCREASE) control.setSize(control.size+0.1);
                    else control.setSize(Math.max(control.size-0.1, 0.1));
                    camera.updateProjectionMatrix();
                    scene.render();
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
    };
    plug._applyTo = function (meshFile, on) {
        
        
        if(on&&meshFile.getThreeMesh().visible===true){
            scene.getControls().enabled=false;
            var sceneGroup = MLJ.core.Scene.getThreeJsGroup();
            var selectedLayer=scene.getSelectedLayer().name;
            var camera=scene.getCamera();
            var _canvas=document.getElementById("_3D");
            control= new THREE.TransformControls(camera,_canvas);
            control.attach(sceneGroup.getObjectByName(selectedLayer));
            scene.getScene().add(control);
        }
        else{
            if(control instanceof THREE.TransformControls) control.detach();
            scene.getControls().enabled=true;
            
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);