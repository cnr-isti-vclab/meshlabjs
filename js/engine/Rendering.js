/*
* Function Init
* function init inizialize objects for threeJs
* such as scene, camera and controls.
* There is a possibility of added axes and boundindBox of the scene
* simply uncomment both function "addAxes()" and function "addBboxScene"
*/
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
// addAxes();
// addBboxScene();
} //end init

/*
* Function animate
* function for animate Rendering
*/
function animate() {
    requestAnimationFrame( animate );//create a loop
    controls.update();
    render();
}

/*
* Function render
* function for render scene
*/
function render() {
    renderer.render(scene, camera);
}

/*
* Function createMesh
* function for create THREE.Mesh object which takes a pointer of a mesh and a name of a mesh
* and return this THREE.Mesh
*
* This function is called by "handleFileSelect" in Engine.js and by plugin functions
*
* Note that the created mesh is saved into a dictionary "arrThreeJsMeshObj", it's positioned
* at the center of its bounding box, calculate position and scale by "computeGlobalBBox()" function
* and added on scene
*/
function createMesh(ptrMesh,name) {
    console.time("Getting Mesh Properties Time");
    var MeshProperties = new Module.MeshLabJs(ptrMesh);
    var VN = MeshProperties.getVertexNumber();
    var vert = MeshProperties.getVertexVector();
    var face = MeshProperties.getFaceVector();
    var FN = MeshProperties.getFaceNumber();
    console.timeEnd("Getting Mesh Properties Time");
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
    //wireframe parameter makes mesh transparent
    var material = new THREE.MeshBasicMaterial( { color: 0xa0a0a0, wireframe: true }); //green : 00ff00
    mesh = new THREE.Mesh( geometry, material );
    mesh.name = name;
    mesh.visible = false;
    arrThreeJsMeshObj[name] = mesh;
    box = new THREE.Box3().setFromObject(mesh);    
    mesh.position = box.center();
    scene.add(mesh);
    mesh.customInfo = "mesh_loaded";
    arrVNFNMeshOut[name] = "Vertices: "+VN+"\nFaces: "+FN;
    computeGlobalBBox();
    return mesh;
}

/*
* Function addMeshByName
* get mesh by dictionary arrThreeJsMeshObj, set mesh visible property true and add it on scene
*/
function addMeshByName(name){
    var mesh = arrThreeJsMeshObj[name];
    scene.add(mesh);
    mesh.visible = true;
    isCurrentMeshVisible = true;
}

/* Function removeMeshByName
* get mesh by dictionary arrThreeJsMeshObj, set mesh visible property false and remove it from scene
*/
function removeMeshByName(name){
    var mesh = arrThreeJsMeshObj[name];
    scene.remove(mesh);
    mesh.visible = false;
    isCurrentMeshVisible = false;
}

/* Function onWindowResize
* set camera properties when window resize
*/
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}       
window.addEventListener('resize', onWindowResize, false );

/* Function computeGlobalBBox
* this function compute global bounding box and translate and scale every object
* in proportion of global bounding box
*
* First translate every object into original position, then scale all by reciprocal value of scale factor
* (Note that scale factor and original position are stored into mesh object).
* Then it computes global bbox, scale every object, recalculate global bbox and finally
* translate every object in a right position.
*/
function computeGlobalBBox(){
    for (var i = 0; i < scene.children.length; i++){
        if(scene.children[i].customInfo == "mesh_loaded"){
            if(scene.children[i].scaleFactor){
                scene.children[i].position.x -= scene.children[i].offsetVec.x;
                scene.children[i].position.y -= scene.children[i].offsetVec.y;
                scene.children[i].position.z -= scene.children[i].offsetVec.z;
                var scaling = scene.children[i].scaleFactor;
                scene.children[i].scale.multiplyScalar(1/scaling);
            }
        }
    }
    BBGlobal = new THREE.Box3();
    for (var i = 0; i < scene.children.length; i++){
        if(scene.children[i].customInfo == "mesh_loaded"){
        console.log(scene.children[i].name);
        var mesh = scene.children[i];
        var bbox = new THREE.Box3().setFromObject(mesh);
        BBGlobal.union(bbox);
        }
    }
    for (var i = 0; i < scene.children.length; i++){
        if(scene.children[i].customInfo == "mesh_loaded"){
            var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
            scene.children[i].scale.multiplyScalar(scaleFac);          
            scene.children[i].scaleFactor = scaleFac;
        }
    }
    BBGlobal = new THREE.Box3();
    for (var i = 0; i < scene.children.length; i++){
        if(scene.children[i].customInfo == "mesh_loaded"){
        var mesh = scene.children[i];
        var bbox = new THREE.Box3().setFromObject(mesh);
        BBGlobal.union(bbox);
        }
    }
    for (var i = 0; i < scene.children.length; i++){
        if(scene.children[i].customInfo == "mesh_loaded"){
            var offset = new THREE.Vector3();
            offset = BBGlobal.center().negate();
            scene.children[i].position.x += offset.x;
            scene.children[i].position.y += offset.y;
            scene.children[i].position.z += offset.z;
            scene.children[i].offsetVec = offset;
        }
    }
}

/* Function add axes
* create axes from buildAxes function
*/
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
    var geom = new THREE.Geometry(), mat; 
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


/* Function addBboxScene
* create and add on scene bounding box of the scene itself
*/
function addBboxScene () {
    var scenebbox = new THREE.BoundingBoxHelper( scene, 0xffffff );
    scenebbox.update();
    scene.add( scenebbox );
}