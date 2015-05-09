        var BBGlobal, offset, scenebbox, meshContainer;
        var lastBB;
        // var bbCenter;
        // var cnt=0;

        // var bbMin, bbMax;
        function init() {
        var div_WIDTH = document.body.offsetWidth,
            div_HEIGHT = document.body.offsetHeight;
        // sezione di set-up di progetto, di iniziazione
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 45, div_WIDTH/div_HEIGHT, 0.1, 1800 );
        camera.position.z = 15;
        renderer = new THREE.WebGLRenderer({alpha:true});
        renderer.shadowMapEnabled = true;
        // renderer.setClearColor(0x00000f, 1); //colore di sfondo del render
        renderer.setSize(div_WIDTH, div_HEIGHT);
        document.body.appendChild(renderer.domElement);
        scene.add( camera );
        var container = document.getElementsByTagName('canvas')[0];
        controls = new THREE.TrackballControls( camera ,container);
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 2.0;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        controls.addEventListener( 'change', render );
        addAxes();
        addBboxScene();
        // BBGlobal = new THREE.Box3();
        lastBB = new THREE.Box3();
        } //end init
        
        function animate() {        
            requestAnimationFrame( animate );//crea un loop
             controls.update();
             render();
        }
         
        function render() {

            renderer.render(scene, camera);
        }

        function createMesh(ptrMesh,name) {
            console.time("Getting Mesh Properties Time");
            var MeshProperties = new Module.MeshLabJs(ptrMesh);
            var VN = MeshProperties.getVertexNumber();
            var vert = MeshProperties.getVertexVector();
            var face = MeshProperties.getFaceVector();
            var FN = MeshProperties.getFaceNumber();
            console.timeEnd("Getting Mesh Properties Time");
            // scene.remove(mesh);
            var geometry = new THREE.Geometry();
            console.time("Time to create mesh: ");
            for(var i=0; i<VN*3; i++){
                var v1 = Module.getValue(vert+parseInt(i*4),'float'); i++;
                var v2 = Module.getValue(vert+parseInt(i*4),'float'); i++;
                var v3 = Module.getValue(vert+parseInt(i*4),'float'); 
                geometry.vertices.push( new THREE.Vector3(v1,v2,v3) );
            }
            for(var i=0; i<FN*3; i++){
                var a = Module.getValue(face+parseInt(i*4),'*'); i++;
                var b = Module.getValue(face+parseInt(i*4),'*'); i++;
                var c = Module.getValue(face+parseInt(i*4),'*'); 
                geometry.faces.push( new THREE.Face3(a,b,c));
            }
            console.timeEnd("Time to create mesh: ");
            //green : 00ff00
            var material = new THREE.MeshBasicMaterial( { color: 0xa0a0a0, wireframe: true }); 
            mesh = new THREE.Mesh( geometry, material );
            mesh.name = name;
            // mesh.visible = false;
            arrThreeJsMeshObj[name] = mesh;
            box = new THREE.Box3().setFromObject(mesh);   
            // bbMin = box.min;
            // bbMax = box.max;  
            // BBGlobal = new THREE.Box3(box.min,box.max);       
            mesh.position = box.center();//.multiplyScalar(scale);   //     negate().   

            // box = new THREE.Box3().setFromObject(mesh);   
            // bbMin = box.min;
            // bbMax = box.max;  
            // BBGlobal = new THREE.Box3(box.min,box.max); 
            scene.add(mesh);


            //local bounding box
            // var bbb = new THREE.BoundingBoxHelper( mesh, 0xffffff );
            // bbb.customInfo= "mesh_loaded";
            // bbb.update();
            // scene.add( bbb );
            

            // computeGlobalBBox();
            // mesh.visible = true;
            // scale = 20.0 / scenebbox.box.min.distanceTo(scenebbox.box.max);
            // scale = 7.0/ box.min.distanceTo(box.max);
            mesh.customInfo = "mesh_loaded";
            // scene.position.set (500,0,0);
            // mesh.scale.set(scale,scale,scale);
            // scene.updateMatrix();
            // mesh.scale.set(scale,scale,scale);
            // mesh.updateMatrix();
            // mesh.matrixAutoUpdate = false;

            // mesh.translateX(offset.x);
            // mesh.translateY(offset.y);
            // mesh.translateZ(offset.z);

            // mesh.position += offset;


            


            // console.log("min box "+BBGlobal.min.x+" "+BBGlobal.min.y+" "+BBGlobal.min.z+" max box "+BBGlobal.max.x+" "+BBGlobal.max.y+" "+BBGlobal.max.z);
            // scale = 7.0 / bbox.box.min.distanceTo(bbox.box.max);
            // mesh.position = box.center();//.multiplyScalar(scale);   //     negate().   
            // mesh.scale.set(scale,scale,scale); //= new THREE.Vector3(scale,scale,scale);
            // THREE.GeometryUtils.center( geometry );
            // mesh.updateMatrix();
            // mesh.matrixAutoUpdate = false;
            arrVNFNMeshOut[name] = "Vertices: "+VN+"\nFaces: "+FN;


            computeGlobalBBox();
            // fitAll();
            // camera.lookAt(box.center());  

            return mesh;
        }
        window.addEventListener('resize', onWindowResize, false );

        function showMeshByName(name){
            var mesh = arrThreeJsMeshObj[name];
            // scene.add(mesh);
            mesh.visible = true;
            isCurrentMeshVisible = true;
            // cnt++;
        }

        function hideMeshByName(name){
            var mesh = arrThreeJsMeshObj[name];
            // scene.remove(mesh);
            mesh.visible = false;
            isCurrentMeshVisible = false;
            // cnt--;
        }

        function addMeshByName(name){
            var mesh = arrThreeJsMeshObj[name];
            scene.add(mesh);
            // mesh.visible = true;
            isCurrentMeshVisible = true;
            // cnt++;
        }

        function removeMeshByName(name){
            var mesh = arrThreeJsMeshObj[name];
            scene.remove(mesh);
            // mesh.visible = false;
            isCurrentMeshVisible = false;
            // cnt--;
        }

        function onWindowResize(){
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }       

        function refactScene(){
            for (var i = 0; i < scene.children.length; i++){
                if(scene.children[i].customInfo == "mesh_loaded"){
                    if(scene.children[i].scaleFactor){
                        scene.children[i].position.x -= -BBGlobal.center().x;
                        scene.children[i].position.y -= -BBGlobal.center().y;
                        scene.children[i].position.z -= -BBGlobal.center().z;
                        var scaling = scene.children[i].scaleFactor;
                        scene.children[i].scale.set(1/scaling,1/scaling,1/scaling);
                    }
                }
            }
        }

        function computeGlobalBBox(){
            refactScene();


            BBGlobal = new THREE.Box3();
            for (var i = 0; i < scene.children.length; i++){
                if(scene.children[i].customInfo == "mesh_loaded"){
                console.log(scene.children[i].name);
                var mesh = scene.children[i];
                var bbox = new THREE.Box3().setFromObject(mesh);
                BBGlobal.union(bbox);
                // bbMin.x = Math.min(bbMin.x,bbox.min.x);
                // bbMin.y = Math.min(bbMin.y,bbox.min.y);
                // bbMin.z = Math.min(bbMin.z,bbox.min.z);
                // bbMax.x = Math.max(bbMax.x,bbox.max.x);
                // bbMax.y = Math.max(bbMax.y,bbox.max.y);
                // bbMax.z = Math.max(bbMax.z,bbox.max.z);
                }
            }
            console.log(lastBB);
            console.log(BBGlobal);
            console.log(lastBB.equals(BBGlobal));
            if(!lastBB.equals(BBGlobal)){
            for (var i = 0; i < scene.children.length; i++){
                if(scene.children[i].customInfo == "mesh_loaded"){
                    console.log("original position of mesh "+scene.children[i].name+": "+scene.children[i].position.x+","+scene.children[i].position.y+","+scene.children[i].position.z);
                    // scene.children[i].position.set(-bbCenter.x,-bbCenter.y,-bbCenter.z);
                    var scale = 5.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
                    scene.children[i].scale.set(scale,scale, scale);                  
                    scene.children[i].scaleFactor = scale;
                    console.log("mesh "+scene.children[i].name+" in position "+scene.children[i].position.x+","+scene.children[i].position.y+","+scene.children[i].position.z);
                }
            }
            BBGlobal = new THREE.Box3();

            for (var i = 0; i < scene.children.length; i++){
                if(scene.children[i].customInfo == "mesh_loaded"){
                var mesh = scene.children[i];
                var bbox = new THREE.Box3().setFromObject(mesh);
                BBGlobal.union(bbox);
                // bbMin.x = Math.min(bbMin.x,bbox.min.x);
                // bbMin.y = Math.min(bbMin.y,bbox.min.y);
                // bbMin.z = Math.min(bbMin.z,bbox.min.z);
                // bbMax.x = Math.max(bbMax.x,bbox.max.x);
                // bbMax.y = Math.max(bbMax.y,bbox.max.y);
                // bbMax.z = Math.max(bbMax.z,bbox.max.z);
                }
            }
            // BBGlobal = new THREE.Box3(bbMin,bbMax);
            // bbCenter = new THREE.Vector3();
            // // bbCenter.x = (bbMax.x + bbMin.x) * 0.5;
            // // bbCenter.y = (bbMax.y + bbMin.y) * 0.5;
            // // bbCenter.z = (bbMax.z + bbMin.z) * 0.5;
            // bbCenter.x = (BBGlobal.max.x + BBGlobal.min.x) * 0.5;
            // bbCenter.y = (BBGlobal.max.y + BBGlobal.min.y) * 0.5;
            // bbCenter.z = (BBGlobal.max.z + BBGlobal.min.z) * 0.5;


            // offset = new THREE.Vector3();
            // //scenebbox.box.center is assumed (0,0,0) by default
            // // scenebbox.box.center().x
            // offset.x = - bbCenter.x;
            // offset.y = - bbCenter.y;
            // offset.z = - bbCenter.z;

            // bbMin.x += offset.x;
            // bbMin.y += offset.y;
            // bbMin.z += offset.z;

            // bbMax.x += offset.x;
            // bbMax.y += offset.y;
            // bbMax.z += offset.z;

            // BBGlobal = new THREE.Box3(bbMin,bbMax);

            console.log("is centered BBGlobal? ");
            console.log(BBGlobal.center().x+","+BBGlobal.center().y+","+BBGlobal.center().z);

            console.log("Global BBOX");
            console.log("Min is ("+BBGlobal.min.x+","+BBGlobal.min.y+","+BBGlobal.min.z+")");
            console.log("Max is ("+BBGlobal.max.x+","+BBGlobal.max.y+","+BBGlobal.max.z+")");
            console.log("Center is ("+BBGlobal.center().x+","+BBGlobal.center().y+","+BBGlobal.center().z+")");
            console.log("diagonal is "+ BBGlobal.min.distanceTo(BBGlobal.max));

            // console.log("offset is "+offset.x+","+offset.y+","+offset.z);
            for (var i = 0; i < scene.children.length; i++){
                if(scene.children[i].customInfo == "mesh_loaded"){
                    console.log("original position of mesh "+scene.children[i].name+": "+scene.children[i].position.x+","+scene.children[i].position.y+","+scene.children[i].position.z);
                    // scene.children[i].position.set(-bbCenter.x,-bbCenter.y,-bbCenter.z);
                    scene.children[i].position.x += -BBGlobal.center().x;
                    scene.children[i].position.y += -BBGlobal.center().y;
                    scene.children[i].position.z += -BBGlobal.center().z;

                    // var scale = 5.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
                    // scene.children[i].scale.set(scale,scale, scale);
                    

                    console.log("mesh "+scene.children[i].name+" in position "+scene.children[i].position.x+","+scene.children[i].position.y+","+scene.children[i].position.z);
                }
            }
            // BBGlobal = new THREE.Box3();

            // for (var i = 0; i < scene.children.length; i++){
            //     if(scene.children[i].customInfo == "mesh_loaded"){
            //     var mesh = scene.children[i];
            //     var bbox = new THREE.Box3().setFromObject(mesh);
            //     BBGlobal.union(bbox);
            //     // bbMin.x = Math.min(bbMin.x,bbox.min.x);
            //     // bbMin.y = Math.min(bbMin.y,bbox.min.y);
            //     // bbMin.z = Math.min(bbMin.z,bbox.min.z);
            //     // bbMax.x = Math.max(bbMax.x,bbox.max.x);
            //     // bbMax.y = Math.max(bbMax.y,bbox.max.y);
            //     // bbMax.z = Math.max(bbMax.z,bbox.max.z);
            //     }
            // }
            // lastBB = BBGlobal;
            // var offset = -BBGlobal.center();
            // BBGlobal.translate(offset);
        }
        }


function addAxes() {
    axes = buildAxes( 300 );
    scene.add( axes );
}   
function buildAxes( length ) {
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

    }

function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat; 

        if(dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

    }

function addBboxScene () {
    scenebbox = new THREE.BoundingBoxHelper( scene, 0xffffff );
    scenebbox.update();
    scene.add( scenebbox );
}
