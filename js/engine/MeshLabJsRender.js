/**
 * @class MeshLabJsRender
 * @name MeshLabJsRender
 * @description Represent Render Class with methods for rendering
 * @author maurizio.idini@gmail.com
 */
function MeshLabJsRender() {
}
MeshLabJsRender.prototype = {
    /**
     *	Call methods for inizialization rendering and eventlistener required
     */
    loadRender: function () {
        this.init();
        window.addEventListener('resize', this.onWindowResize, false);
        document.getElementsByTagName('canvas')[0].addEventListener('mousemove', controls.update.bind(controls), false);
        document.getElementsByTagName('canvas')[0].addEventListener('mousewheel', function () {
            controls.update();
            return false;
        }, false);
        document.getElementsByTagName('canvas')[0].addEventListener('touchmove', controls.update.bind(controls), false);
        controls.addEventListener('change', this.render);
    },
    /**
     * Inizialize objects for threeJs such as scene, camera and controls
     */
    init: function () {
        var div_WIDTH = document.body.offsetWidth,
                div_HEIGHT = document.body.offsetHeight;
        // sezione di set-up di progetto, di iniziazione
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, div_WIDTH / div_HEIGHT, 0.1, 1800);
        camera.position.z = 15;
        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.shadowMapEnabled = true;
        // renderer.setClearColor(0x00000f, 1); //colore di sfondo del render
        renderer.setSize(div_WIDTH, div_HEIGHT);
        document.body.appendChild(renderer.domElement);
        scene.add(camera);
        var container = document.getElementsByTagName('canvas')[0];
        controls = new THREE.TrackballControls(camera, container);
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 2.0;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', this.render);
        // addAxes();
        // addBboxScene();

        //RENDER: MATERIAL AND LIGHTS
        function _AmbientLight(color) {
            var _DEF_COLOR = 0x111111;
            var _color = !color ? _DEF_COLOR : color;
            var _on = false;

            var _light = new THREE.AmbientLight(_color);

            this.setColor = function (color) {
                _color = !color ? _DEF_COLOR : color;

                scene.remove(_light);

                if (_on) {
                    _light = new THREE.AmbientLight(color);
                    scene.add(_light);
                    renderer.render(scene, camera);
                }
            };

            this.isOn = function () {
                return _on;
            };

            this.setOn = function (on) {
                if (on) {
                    scene.add(_light);
                    _on = true;
                } else {
                    scene.remove(_light);
                    _on = false;
                }

                renderer.render(scene, camera);
            };

        }

        function _Headlight(color) {
            var flags = {
                color: "#ffffff",
                on: false,
                intensity: 10,
                distance: 100
            };
           
            var _light = new THREE.PointLight(flags.color, flags.intensity, flags.distance);
            
                //_light.position.set( 50, 50, 50 );
                
            this.setColor = function (color) {
//                _color = !color ? _DEF_COLOR : color;
//
//                scene.remove(_light);
//
//                if (_on) {
//                    _light = new THREE.AmbientLight(color);
//                    scene.add(_light);
//                    renderer.render(scene, camera);
//                }
            };

            this.isOn = function () {
                return _on;
            };

            this.setOn = function (on) {
                flags.on = on;
                if (on) {                    
                    scene.add(_light);
                } else {
                    scene.remove(_light);
                }

                renderer.render(scene, camera);
            };

        }

        function _DirectionalLight(color, intensity) {
            this.DEF_COLOR = 0xffffff;
            this.DEF_POS_X = 100;
            this.DEF_POS_Y = 100;
            this.DEF_POS_Z = 100;
            this.DEF_INTENSITY = 1;

            var _color = !color ? this.DEF_COLOR : color;
            var _intensity = !intensity ? this.DEF_INTESITY : intensity;
            var _on = false;

            var _light = new THREE.DirectionalLight(_color, _intensity);
            _light.position.set(this.DEF_POS_X, this.DEF_POS_Y, this.DEF_POS_Z);//.normalize();

            this.setPosX = function (value) {
                _light.position.x = value;
                renderer.render(scene, camera);
            };

            this.setPosY = function (value) {
                _light.position.y = value;
                renderer.render(scene, camera);
            };

            this.setPosZ = function (value) {
                _light.position.z = value;
                renderer.render(scene, camera);
            };


            this.setColor = function (color) {
                _color = !color ? this.DEF_COLOR : color;
                scene.remove(_light);

                if (_on) {
                    var x = _light.position.x;
                    var y = _light.position.y;
                    var z = _light.position.z;
                    _light = new THREE.DirectionalLight(_color, _intensity);
                    _light.position.set(x, y, z);
                    scene.add(_light);
                    renderer.render(scene, camera);
                }
            };

            this.isOn = function () {
                return _on;
            };

            this.setOn = function (on) {
                if (on) {

                    scene.add(_light);
                    scene.remove(mesh);
                    new MeshLabJsRender().createMesh(mesh.pointer, mesh.name);
                    _on = true;

                } else {
                    scene.remove(_light);
                    _on = false;
                }

                renderer.render(scene, camera);
            };

        }

        function _Material() {

            var flags = {
                specular: '#ffffff',
                color: '#a0a0a0',
                emissive: '#7c7b7b',
                shading: THREE.FlatShading,
                shininess: 100,
                wireframe: false, //make mesh transparent
                wireframeLinewidth: 1
            };

            var _material;

            this.build = function () {
                _material = new THREE.MeshPhongMaterial(flags);
                return _material;
            };

            this.setColor = function (value) {
                flags.color = value;
                _material.color.setHex(value);

                if (directionalLight.isOn()) {
                    directionalLight.setOn(false);
                    directionalLight.setOn(true);
                } //else
                //Affect mesh material only if light is on
            };

            this.setEmissive = function (value) {
                flags.emissive = value;
                _material.emissive.setHex(value);
                if (directionalLight.isOn()) {
                    directionalLight.setOn(false);
                    directionalLight.setOn(true);
                } else {
                    mjr = new MeshLabJsRender();
                    scene.remove(mesh);
                    mjr.createMesh(mesh.pointer, mesh.name);
                    mjr.render();
                }

            };

            this.setSpecular = function (value) {
                flags.specular = value;
                _material.specular.setHex(value);
                if (directionalLight.isOn()) {
                    directionalLight.setOn(false);
                    directionalLight.setOn(true);
                } //else
                //Affect mesh material only if light is on
            };

            this.setShading = function (value) {
                var mlRender = new MeshLabJsRender();

                scene.remove(mesh);

                switch (value) {
                    case '1': //Flat
                        flags.shading = THREE.FlatShading;
                        break;
                    case '2': //Smouth
                        flags.shading = THREE.SmoothShading;
                        break;
                    default:
                        flags.shading = THREE.NoShading;
                }

                _material.shading = flags.shading;
                mlRender.createMesh(mesh.pointer, mesh.name);
                mlRender.render();
            };

            this.setShininess = function (value) {
                _material.shininess = flags.shininess = value;
                renderer.render(scene, camera);
            };

        }

        function _VertexDots() {

            var obj3D;

            var flags = {
                on: false,
                color: '#fc1b1b',
                size: 3.0
            };

            var build = function () {
                var geometry = new THREE.BufferGeometry();
                var numPoints = mesh.geometry.vertices.length;

                var positions = new Float32Array(numPoints * 3);
                var colors = new Float32Array(numPoints * 3);

                var color = new THREE.Color(flags.color);
                var x, y, z, k = 0;
                for (var i = 0; i < numPoints; i++) {
                    x = mesh.geometry.vertices[i].x;
                    y = mesh.geometry.vertices[i].y;
                    z = mesh.geometry.vertices[i].z;

                    positions[ 3 * k ] = x;
                    positions[ 3 * k + 1 ] = y;
                    positions[ 3 * k + 2 ] = z;

                    //var intensity = (y + 0.1) * 5;
                    colors[ 3 * k ] = color.r;// * intensity;
                    colors[ 3 * k + 1 ] = color.g;// * intensity;
                    colors[ 3 * k + 2 ] = color.b;// * intensity;
                    k++;
                }

                geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

                var material = new THREE.PointCloudMaterial({size: flags.size, vertexColors: THREE.VertexColors, sizeAttenuation: false});
                obj3D = new THREE.PointCloud(geometry, material);
                obj3D.customInfo = "mesh_loaded";

            };

            this.setColor = function (color) {
                flags.color = color;
                scene.remove(obj3D);
                obj3D = null;
                if (flags.on) {
                    this.setOn(false);
                    this.setOn(true);
                } else {
                    build();
                }
            };

            this.setOn = function (on) {
                flags.on = on;
                var mlRender = new MeshLabJsRender();

                if (on) {

                    if (!obj3D) {
                        build();
                    }

                    scene.add(obj3D);
                    mlRender.computeGlobalBBox();
                } else {
                    scene.remove(obj3D);
                }
                mlRender.render();
            };

            this.setSize = function (size) {
                flags.size = size;
                obj3D.material.size = size;
                new MeshLabJsRender().render();
            };

        }

        function _Wireframe() {
            var obj3D;

            var flags = {
                on: false,
                lineWidth: 1.0,
                color: '#fc1b1b'
            };

            function build() {
                var r = new MeshLabJsRender();
                var geom = mesh.geometry.clone();
                var mat = new THREE.MeshBasicMaterial({color: flags.color, wireframe: true});

//                for(var i=0; i<geom.faces.length; i++) {
//                    //geom.vertices[i].multiplyScalar(1.01);
//                    var face = geom.faces[i];                    
//                    geom.vertices[face.a].add(face.normal.multiplyScalar(0.1));
//                    geom.vertices[face.b].add(face.normal.multiplyScalar(0.1));
//                    geom.vertices[face.c].add(face.normal.multiplyScalar(0.1));
//                }

                obj3D = new THREE.Mesh(geom, mat);
                obj3D.customInfo = "mesh_loaded";
            }

            this.setWireframe = function (on) {
                flags.on = on;
                var r = new MeshLabJsRender();
                if (on) {

                    if (!obj3D) {
                        build();
                    }

                    scene.add(obj3D);
                    r.computeGlobalBBox();
                } else {
                    scene.remove(obj3D);
                }
                r.render();
                //renderer.render(scene, camera);
            };

            this.setColor = function (value) {
                flags.color = value;
                scene.remove(obj3D);
                obj3D = null;
                if (flags.on) {
                    this.setWireframe(false);
                    this.setWireframe(true);
                } else {
                    build();
                }
            };

            this.setWireframeLineWidth = function (value) {
                flags.lineWidth = value;
                if (obj3D) {
                    obj3D.material.wireframeLinewidth = value;
                    renderer.render(scene, camera);
                }
            };
        }

        //Init material and lights to default values
        ambientLight = new _AmbientLight();
        headlight = new _Headlight();
        directionalLight = new _DirectionalLight();
        material = new _Material();
        vertexDots = new _VertexDots();
        wireframe = new _Wireframe();        
    },
    /**
     * Function for render scene
     */
    render: function () {
        renderer.render(scene, camera);
    },
    /**
     * Create THREE.Mesh object
     * @param {number} ptrMesh - Pointer of mesh file in memory
     * @param {string} name - Mesh name
     * @return {THREE.Mesh} THREE.Mesh object
     */
    createMesh: function (ptrMesh, name) {
        console.time("Getting Mesh Properties Time");
        var MeshProperties = new Module.MeshLabJs(ptrMesh);
        var VN = MeshProperties.getVertexNumber();
        var vert = MeshProperties.getVertexVector();
        var face = MeshProperties.getFaceVector();
        var FN = MeshProperties.getFaceNumber();
        console.timeEnd("Getting Mesh Properties Time");
        var geometry = new THREE.Geometry();
        console.time("Time to create mesh: ");
        for (var i = 0; i < VN * 3; i++) {
            var v1 = Module.getValue(vert + parseInt(i * 4), 'float');
            i++;
            var v2 = Module.getValue(vert + parseInt(i * 4), 'float');
            i++;
            var v3 = Module.getValue(vert + parseInt(i * 4), 'float');
            geometry.vertices.push(new THREE.Vector3(v1, v2, v3));
        }
        for (var i = 0; i < FN * 3; i++) {
            var a = Module.getValue(face + parseInt(i * 4), '*');
            i++;
            var b = Module.getValue(face + parseInt(i * 4), '*');
            i++;
            var c = Module.getValue(face + parseInt(i * 4), '*');
            geometry.faces.push(new THREE.Face3(a, b, c));
        }
        console.timeEnd("Time to create mesh: ");

        geometry.dynamic = true;
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        mesh = new THREE.Mesh(geometry, material.build());
        mesh.name = name;
        mesh.pointer = ptrMesh;
        box = new THREE.Box3().setFromObject(mesh);
        mesh.position = box.center();
        scene.add(mesh);
        mesh.customInfo = "mesh_loaded";
        mesh.infoMesh = "Current Mesh: " + name + "\n";
        mesh.VNFN = "Vertices: " + VN + "\nFaces: " + FN;
        var infoArea = document.getElementById('infoMesh');
        infoArea.value = mesh.infoMesh + mesh.VNFN;
        this.computeGlobalBBox();
        return mesh;
    },
    /**
     * Get mesh from scene by name parameter, set mesh visible property true and add it on scene
     * @param {string} name - Mesh name
     */
    showMeshByName: function (name) {
        for (var i = 1; i < scene.children.length; i++) {
            if (scene.children[i].name == name) {
                scene.children[i].visible = true;
                break;
            }
        }
        this.render();
    },
    /**
     * Get mesh from scene by name parameter, set mesh visible property false and remove it on scene
     * @param {string} name - Mesh name
     */
    hideMeshByName: function (name) {
        for (var i = 1; i < scene.children.length; i++) {
            if (scene.children[i].name == name) {
                scene.children[i].visible = false;
                break;
            }
        }
        this.render();
    },
    /** Set camera properties when window resize
     */
    onWindowResize: function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    /** Compute global bounding box and translate and scale every object in proportion of global bounding box
     * First translate every object into original position, then scale all by reciprocal value of scale factor
     * (Note that scale factor and original position are stored into mesh object).
     * Then it computes global bbox, scale every object, recalculate global bbox and finally
     * translate every object in a right position.
     */
    computeGlobalBBox: function () {
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].customInfo == "mesh_loaded") {
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
            if (scene.children[i].customInfo == "mesh_loaded") {
                var mesh = scene.children[i];
                var bbox = new THREE.Box3().setFromObject(mesh);
                BBGlobal.union(bbox);
            }
        }
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].customInfo == "mesh_loaded") {
                var scaleFac = 15.0 / (BBGlobal.min.distanceTo(BBGlobal.max));
                scene.children[i].scale.multiplyScalar(scaleFac);
                scene.children[i].scaleFactor = scaleFac;
            }
        }
        BBGlobal = new THREE.Box3();
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].customInfo == "mesh_loaded") {
                var mesh = scene.children[i];
                var bbox = new THREE.Box3().setFromObject(mesh);
                BBGlobal.union(bbox);
            }
        }
        for (var i = 0; i < scene.children.length; i++) {
            if (scene.children[i].customInfo == "mesh_loaded") {
                var offset = new THREE.Vector3();
                offset = BBGlobal.center().negate();
                scene.children[i].position.x += offset.x;
                scene.children[i].position.y += offset.y;
                scene.children[i].position.z += offset.z;
                scene.children[i].offsetVec = offset;
            }
        }
    },
    /** Create axes from buildAxes function
     */
    addAxes: function () {
        axes = buildAxes(300);
        scene.add(axes);
    },
    buildAxes: function (length) {
        var axes = new THREE.Object3D();
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // +X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xFF0000, true)); // -X
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00FF00, false)); // +Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00FF00, true)); // -Y
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000FF, false)); // +Z
        axes.add(buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000FF, true)); // -Z
        return axes;
    },
    buildAxis: function (src, dst, colorHex, dashed) {
        var geom = new THREE.Geometry(), mat;
        if (dashed) {
            mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3});
        } else {
            mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
        }
        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
        var axis = new THREE.Line(geom, mat, THREE.LinePieces);
        return axis;
    },
    addBboxScene: function () {
        var scenebbox = new THREE.BoundingBoxHelper(scene, 0xffffff);
        scenebbox.update();
        scene.add(scenebbox);
    }

};