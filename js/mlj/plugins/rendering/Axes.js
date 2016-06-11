
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "Axes",
        tooltip: "Show world space axes",
        icon: "img/icons/axis.png",
        on: false,
        //loadShader: []
    });


    plug._init = function (guiBuilder) {

    };

    plug._applyTo = function (on) {
        if (on) {
//            var bbox = scene.getBBox();
//            scene.addSceneDecorator(plug.getName(), new THREE.AxisHelper(bbox.min.distanceTo(bbox.max)/2));
            
            var currentLayer = MLJ.core.Scene.getSelectedLayer();
//            var geometry = currentLayer.getThreeMesh().geometry;
            var geometry = new THREE.BoxGeometry( 10, 10, 10);
            	
            var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('/crateTex.jpg')});
//    console.log("Scene Texture: " + (scene._texture === undefined));
//            var material = new THREE.MeshPhongMaterial( { map: scene._texture });

           var mesh = new THREE.Mesh(geometry, material );
           mesh.position.z += 3;
            scene.addSceneDecorator(plug.getName(), mesh);      
        } else {
            scene.removeSceneDecorator(plug.getName());
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
