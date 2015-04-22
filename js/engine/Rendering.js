        function init() {
        var div_WIDTH = document.body.offsetWidth,
            div_HEIGHT = document.body.offsetHeight;
        // sezione di set-up di progetto, di iniziazione
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(  45, div_WIDTH/div_HEIGHT, 0.1, 1000  );
        camera.position.z = 15;
        camera.position.x = 0;
        camera.position.y = 0;
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
            scale = 7.0/box.min.distanceTo(box.max);
            mesh.position = box.center().multiplyScalar(scale);             
            mesh.scale = new THREE.Vector3(scale,scale,scale);
            THREE.GeometryUtils.center( geometry );
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = true;
            arrVNFNMeshOut[name] = "Vertices: "+VN+"\nFaces: "+FN;
            arrThreeJsMeshObj[name] = mesh;
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
