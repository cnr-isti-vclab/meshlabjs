/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.core.Scene = {};

(function () {

    //Contains all mesh in the scene
    var layers = new MLJ.util.AssociativeArray();

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
            MLJ.core.Scene.update();
        });

        $(window).resize(function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            MLJ.core.Scene.update();
        });

        $(document).on(MLJ.core.Events.MESH_FILE_OPENED,
                function (event, mesh) {
                    MLJ.core.Scene.addMesh(mesh);
                });
    }

    function computeGlobalBBbox() {
        //MODIFICARE UTILIZZANDO L'ARRAY LAYERS_____________________________
        var ptr = layers.pointer();
        var threeMesh;
        while (ptr.hasNext()) {
            threeMesh = ptr.next().getThreeMesh();
            if (threeMesh.scaleFactor) {
                threeMesh.position.x -= threeMesh.offsetVec.x;
                threeMesh.position.y -= threeMesh.offsetVec.y;
                threeMesh.position.z -= threeMesh.offsetVec.z;
                var scaling = threeMesh.scaleFactor;
                threeMesh.scale.multiplyScalar(1 / scaling);
            }
        }

        var BBGlobal = new THREE.Box3();
        ptr = layers.pointer();
        while (ptr.hasNext()) {
            threeMesh = ptr.next().getThreeMesh();
            var bbox = new THREE.Box3().setFromObject(threeMesh);
            BBGlobal.union(bbox);
        }

        ptr = layers.pointer();
        while (ptr.hasNext()) {
            threeMesh = ptr.next().getThreeMesh();
            var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
            threeMesh.scale.multiplyScalar(scaleFac);
            threeMesh.scaleFactor = scaleFac;
        }

        BBGlobal = new THREE.Box3();
        ptr = layers.pointer();
        while (ptr.hasNext()) {
            threeMesh = ptr.next().getThreeMesh();
            var bbox = new THREE.Box3().setFromObject(threeMesh);
            BBGlobal.union(bbox);
        }

        ptr = layers.pointer();
        while (ptr.hasNext()) {
            threeMesh = ptr.next().getThreeMesh();
            var offset = new THREE.Vector3();
            offset = BBGlobal.center().negate();
            threeMesh.position.x += offset.x;
            threeMesh.position.y += offset.y;
            threeMesh.position.z += offset.z;
            threeMesh.offsetVec = offset;
        }

    }

    this.addMesh = function (meshFile) {
        if (meshFile instanceof MLJ.core.MeshFile) {

            //Add new mesh to associative array layers
            layers.set(meshFile.name, meshFile);

            var mesh = meshFile.getThreeMesh();
            var box = new THREE.Box3().setFromObject(mesh);
            mesh.position = box.center();
            scene.add(mesh);

            //Compute the global bounding box
            computeGlobalBBbox();

            //render the scene
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

}).call(MLJ.core.Scene);

