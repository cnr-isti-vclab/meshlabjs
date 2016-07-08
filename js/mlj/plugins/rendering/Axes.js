
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
            var geometry = currentLayer.getThreeMesh().geometry;
            var bufferptr = currentLayer.cppMesh.getWedgeTextureCoordinates();
            var bufferData = new Float32Array(new Float32Array(Module.HEAPU8.buffer, bufferptr, currentLayer.FN*6));
            
//*****//           UV are stored in arrays of arrays (to allow for multiple UV sets). Try this:
//
//            geometry.faceUvs = [[]];
//            geometry.faceVertexUvs = [[]];
//
//            geometry.faceUvs[0].push(new THREE.UV(0,1));
//            geometry.faceVertexUvs[0].push(faceuv);   
//*****//

            var newGeom = new THREE.Geometry().fromBufferGeometry(geometry);
            console.log(newGeom);

            newGeom.uvsNeedUpdate = true;
           
//            geometry.faceVertexUvs = []; 
            newGeom.faceVertexUvs[0] = [];
             for(var i = 0; i < currentLayer.FN*6; i++){
//                    if(i < 30)
//                        console.log("\nFILLED.JS TEX: " +i +" " + bufferData[i] +" " +bufferData[i+1] +"\n " +bufferData[i+2] +" " +bufferData[i+3]  +"\n " +bufferData[i+4]  +" " +bufferData[i+5]);
                 newGeom.faceVertexUvs[0].push([
                         new THREE.Vector2(bufferData[i],   bufferData[++i]),
                         new THREE.Vector2(bufferData[++i], bufferData[++i]),
                         new THREE.Vector2(bufferData[++i], bufferData[++i])
                     ]);
             }
//               geom.faceVertexUvs[0] = bufferData;

            
            var material = new THREE.MeshBasicMaterial( {
                 map:THREE.ImageUtils.loadTexture( '\Bulbasaur.png', {}, function() {console.log("\nTexture Loaded!!! Yay!!");}),
                 specular: 0x555555,
                 emissive: 0x333333});
             
            var mesh = new THREE.Mesh(newGeom, material);  //NOT WORKING :(
            mesh.position.z += 1;
            scene.addSceneDecorator(plug.getName(), mesh)
        } else {
            scene.removeSceneDecorator(plug.getName());
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
