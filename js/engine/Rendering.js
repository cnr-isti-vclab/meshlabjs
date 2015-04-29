        var BBGlobal;

        function init() {
        var div_WIDTH = document.body.offsetWidth,
            div_HEIGHT = document.body.offsetHeight;
        // sezione di set-up di progetto, di iniziazione
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(  45, div_WIDTH/div_HEIGHT, 0.1, 1000  );
        camera.position.z = 25;
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
            box = new THREE.Box3().setFromObject(mesh);
            var bbox = new THREE.BoundingBoxHelper( mesh, 0xaaaaaa );
            bbox.update();
            scene.add( bbox );


            arrThreeJsMeshObj[name] = mesh;
            computeGlobalBBox();


            // console.log("min box "+BBGlobal.min.x+" "+BBGlobal.min.y+" "+BBGlobal.min.z+" max box "+BBGlobal.max.x+" "+BBGlobal.max.y+" "+BBGlobal.max.z);
            scale = 7.0 / bbox.box.min.distanceTo(bbox.box.max);
            mesh.position = box.center();//.multiplyScalar(scale);   //     negate().   
            // mesh.scale.set(scale,scale,scale); //= new THREE.Vector3(scale,scale,scale);
            THREE.GeometryUtils.center( geometry );
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;
            arrVNFNMeshOut[name] = "Vertices: "+VN+"\nFaces: "+FN;

            // fitAll();
            // camera.lookAt(box.center());  

            return mesh;
        }
        window.addEventListener('resize', onWindowResize, false );

        function addMeshByName(name){
            var mesh = arrThreeJsMeshObj[name];
            scene.add(mesh);
            isCurrentMeshVisible = true;
        }

        function removeMeshByName(name){
            var mesh = arrThreeJsMeshObj[name];
            scene.remove(mesh);
            isCurrentMeshVisible = false;
        }

        function onWindowResize(){
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }       

        function computeGlobalBBox(){
            var bbMin = new THREE.Vector3();
            var bbMax = new THREE.Vector3();
            for(var i in arrThreeJsMeshObj){
                var bbox = new THREE.Box3().setFromObject(arrThreeJsMeshObj[i]);
                // if (arrThreeJsMeshObj.length < 2) {
                //     bbMin = bbox.min;
                //     bbMax = bbox.max;
                // } else {
                bbMin.x = Math.min(bbMin.x,bbox.min.x);
                bbMin.y = Math.min(bbMin.y,bbox.min.y);
                bbMin.z = Math.min(bbMin.z,bbox.min.z);
                bbMax.x = Math.max(bbMax.x,bbox.max.x);
                bbMax.y = Math.max(bbMax.y,bbox.max.y);
                bbMax.z = Math.max(bbMax.z,bbox.max.z);
                // }
            }


            var bbCenter = new THREE.Vector3();
            bbCenter.x = (bbMax.x + bbMin.x) * 0.5;
            bbCenter.y = (bbMax.y + bbMin.y) * 0.5;
            bbCenter.z = (bbMax.z + bbMin.z) * 0.5;
            // console.log(bbCenter.x);

            camera.lookAt(bbCenter);

            BBGlobal = new THREE.Box3(bbMin,bbMax);
            // controls.target = bbCenter;

            for(var i in arrThreeJsMeshObj){
                // scene.getObjectByName(i).scale.set()

            }
            // console.log(arrThreeJsMeshObj.length);
            // if(arrThreeJsMeshObj.length>0){
            //     console.log(arrThreeJsMeshObj.length);
            //     scene.remove(scenebbox);
            // }
            // var scenebbox = new THREE.BoundingBoxHelper( scene, 0xaaaaaa );
            // scenebbox.update();
            // scene.add( scenebbox );



            // console.log(BBGlobal.center().x);

            var diag = new THREE.Vector3();
            diag = diag.subVectors(bbMax, bbMin);
            var radius = diag.length() * 0.5;

            // Compute offset needed to move the camera back that much needed to center AABB (approx: better if from BB front face)
            var offset = radius / Math.tan(Math.PI / 180.0 * camera.fov * 0.5);

            // Compute new camera position
            var dir = camera.matrix.z;
            dir*=offset; 
            var newPos = new THREE.Vector3();
            newPos.add(bbCenter);


            // camera.rotationAutoUpdate = false;
            // scene.remove(camera);
            // camera.position.x = newPos.x;
            // camera.position.y = newPos.y;
            // camera.position.z = ;
            // camera.lookAt(bbCenter);  
            // camera.rotationAutoUpdate = true;        
            // var container = document.getElementsByTagName('canvas')[0];
            // controls = new THREE.TrackballControls( camera, container );
            // controls.target = bbCenter;
            // scene.add(camera);

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
    var scenebbox = new THREE.BoundingBoxHelper( scene, 0xffffff );
    scenebbox.update();
    scene.add( scenebbox );
}
