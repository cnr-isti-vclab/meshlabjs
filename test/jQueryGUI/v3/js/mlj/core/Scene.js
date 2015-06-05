/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.core.scene = {};

(function () {

    //Contains all mesh in the scene
    var layers = [];

    var scene, camera, renderer;


//SCENE INITIALIZATION  ________________________________________________________

    function initScene() {

        var WIDTH = $('body').width();
        var HEIGHT = $('body').height();

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1800);
        camera.position.z = 15;
        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.shadowMapEnabled = true;
        // renderer.setClearColor(0x00000f, 1); //colore di sfondo del render
        renderer.setSize(WIDTH, HEIGHT);
        $('body').append(renderer.domElement);
        scene.add(camera);

        //INIT CONTROLS  ___________________________________________________
        var container = document.getElementsByTagName('canvas')[0];
        var controls = new THREE.TrackballControls(camera, container);
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 2.0;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];        

        //EVENT LISTENERS ___________________________________________________
        $('canvas')[0].addEventListener('touchmove', controls.update.bind(controls), false);
        $('canvas')[0].addEventListener('mousemove', controls.update.bind(controls), false);
        $('canvas')[0].addEventListener('mousewheel', function () {
            controls.update();
            return false;
        }, false);

        controls.addEventListener('change', function () {
            MLJ.core.scene.update();
        });

        $(window).resize(function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            MLJ.core.scene.update();
        });        
        
        $(document).on(MLJ.core.Events.MESH_FILE_OPENED,
                function (event, mesh) {
                    MLJ.core.scene.addMesh(mesh);
                });
    }

    function computeGlobalBBbox() {
        //MODIFICARE UTILIZZANDO L'ARRAY LAYERS_____________________________
        for (var i = 0; i < scene.children.length; i++) {
//            if (scene.children[i].customInfo == "mesh_loaded") {
            if (scene.children[i] instanceof THREE.Mesh) {
                if (scene.children[i].scaleFactor) {
                    scene.children[i].position.x -= scene.children[i].offsetVec.x;
                    scene.children[i].position.y -= scene.children[i].offsetVec.y;
                    scene.children[i].position.z -= scene.children[i].offsetVec.z;
                    var scaling = scene.children[i].scaleFactor;
                    scene.children[i].scale.multiplyScalar(1 / scaling);
                }
            }
        }
        BBGlobal = new THREE.Box3();
        for (var i = 0; i < scene.children.length; i++) {
//            if (scene.children[i].customInfo == "mesh_loaded") {
            if (scene.children[i] instanceof THREE.Mesh) {
                var mesh = scene.children[i];
                var bbox = new THREE.Box3().setFromObject(mesh);
                BBGlobal.union(bbox);
            }
        }
        for (var i = 0; i < scene.children.length; i++) {
//            if (scene.children[i].customInfo == "mesh_loaded") {
            if (scene.children[i] instanceof THREE.Mesh) {
                var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
                scene.children[i].scale.multiplyScalar(scaleFac);
                scene.children[i].scaleFactor = scaleFac;
            }
        }
        BBGlobal = new THREE.Box3();
        for (var i = 0; i < scene.children.length; i++) {
//            if (scene.children[i].customInfo == "mesh_loaded") {
            if (scene.children[i] instanceof THREE.Mesh) {
                var mesh = scene.children[i];
                var bbox = new THREE.Box3().setFromObject(mesh);
                BBGlobal.union(bbox);
            }
        }
        for (var i = 0; i < scene.children.length; i++) {
//            if (scene.children[i].customInfo == "mesh_loaded") {
            if (scene.children[i] instanceof THREE.Mesh) {
                var offset = new THREE.Vector3();
                offset = BBGlobal.center().negate();
                scene.children[i].position.x += offset.x;
                scene.children[i].position.y += offset.y;
                scene.children[i].position.z += offset.z;
                scene.children[i].offsetVec = offset;
            }
        }
    }

    this.addMesh = function (meshFile) {
        if (meshFile instanceof MLJ.core.MeshFile) {
            //Add new mesh to layers array
            layers[meshFile.name] = meshFile;
            var mesh = meshFile.getThreeMesh();

            var box = new THREE.Box3().setFromObject(mesh);
            mesh.position = box.center();
            scene.add(mesh);

            computeGlobalBBbox();

            this.update();

        } else {
            console.error("The parameter must be an instance of MLJ.core.MeshFile");
        }
    };

    this.update = function () {
        renderer.render(scene, camera);
    };

    $(document).ready(function () {
        initScene();
    });

}).call(MLJ.core.scene);

