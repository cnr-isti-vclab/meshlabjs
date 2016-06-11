
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


        var squareGeometry = new THREE.Geometry();
           squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, 0.0));
           squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, 0.0));
           squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
           squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
           squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
           squareGeometry.faces.push(new THREE.Face3(0, 2, 3));
           // Create a white basic material and activate the 'doubleSided' attribute.

           var UVS = [
               new THREE.Vector2(0, 0),
               new THREE.Vector2(0, 1),
               new THREE.Vector2(1, 1),
               new THREE.Vector2(1, 0),

           ];
           squareGeometry.faceVertexUvs[0][0] = [UVS[0],UVS[1],UVS[2]];
           squareGeometry.faceVertexUvs[0][1] = [UVS[0],UVS[2],UVS[3]];



            
            var currentLayer = MLJ.core.Scene.getSelectedLayer();
            var geometry = currentLayer.getThreeMesh().geometry;
//            var geometry = new THREE.BoxGeometry( 10, 10, 10);
//    console.log("Scene Texture: " + (scene._texture === undefined));
//            var material = new THREE.MeshPhongMaterial( { map: scene._texture });
            var uvsBufferTmp = currentLayer.cppMesh.getVertexTexCoordinates();            
            var colorsBuffer = new Float32Array(Module.HEAPU8.buffer, uvsBufferTmp, currentLayer.VN*2);
            
//            UV are stored in arrays of arrays (to allow for multiple UV sets). Try this:
//
//            geometry.faceUvs = [[]];
//            geometry.faceVertexUvs = [[]];
//
//            geometry.faceUvs[0].push(new THREE.UV(0,1));
//            geometry.faceVertexUvs[0].push(faceuv);

            geometry.faceVertexUvs = [];
            geometry.faceVertexUvs[0] = [];
            var j = 1;
            for(var i = 0; i < currentLayer.VN*2; i){
//                console.log("\n" +i +" " +colorsBuffer[i] +" " +colorsBuffer[++i]);
//                bulbaUVs.push(new THREE.Vector2(colorsBuffer[i], colorsBuffer[++i]));
//                  geometry.faceVertexUvs[0].push(new THREE.UV(colorsBuffer[i],colorsBuffer[++i]));
//                  console.log("\nVertex " + (j++) + " " +colorsBuffer[i+1] +" " +colorsBuffer[i+2]);
                  geometry.faceVertexUvs[0].push(new THREE.Vector2(colorsBuffer[i++],colorsBuffer[i++]));
            }
            geometry.uvsNeedUpdate = true;
           
            texture = THREE.ImageUtils.loadTexture('\Bulbasaur.png', {}, function() {
                MLJ.core.Scene.render();
                console.log("\nTexture Loaded!!! Yay!!");                
                var material = new THREE.MeshPhongMaterial( { map: texture, specular: 0x555555, emissive: 0x333333 });
                var mesh = new THREE.Mesh(geometry, material );  //NOT WORKING :(
//                var mesh = new THREE.Mesh(squareGeometry, material ); //WORKING
                mesh.position.z += 1;
//                console.log("\nTexture?: " +texture.image);
                scene.addSceneDecorator(plug.getName(), mesh);  
            });    
        } else {
            scene.removeSceneDecorator(plug.getName());
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
