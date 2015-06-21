/**
 * Module is a global JavaScript object with attributes that 
 * Emscripten-generated code calls at various points in its execution.
 * Developers can provide an implementation of Module to control 
 * the execution of code. For example, to define how notification 
 * messages from Emscripten are displayed, developers implement the 
 * Module.print attribute.
 * Note that parameter 'memoryInitializerPrefixURL' indicates path of file.js.mem
 */

var Module = {
    memoryInitializerPrefixURL: "js/generated/",
    preRun: [],
    postRun: [],
    print: function (text) {
        var w = MLJ.gui.getWidget("Log");
        w.append(text);
    },
    printErr: function (text) {
        var w = MLJ.gui.getWidget("Log");
        w.append(text);
    }
};

MLJ.core = {
    defaults: {
        AmbientLight: {
            color: "#ffffff",
            on: false
        },
        Headlight: {
            color: "#ffffff",
            on: true,
            intensity: 0.5,
            distance: 0
        },
        PhongMaterial: {
            specular: '#ffffff',
            color: '#a0a0a0',
            emissive: '#7c7b7b',
            shading: THREE.FlatShading,
            shininess: 50,
            wireframe: false //make mesh transparent            
        }
    }
};

MLJ.core.AmbientLight = function (scene, camera, renderer) {

    var _on = MLJ.core.defaults.AmbientLight.on;

    var _light = new THREE.AmbientLight(
            MLJ.core.defaults.AmbientLight.color);

    this.setColor = function (color) {
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
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

    //Init
    this.setOn(_on);
};

MLJ.core.Headlight = function (scene, camera, renderer) {
    var _on = MLJ.core.defaults.Headlight.on;

    var _light = new THREE.PointLight(
            MLJ.core.defaults.Headlight.color,
            MLJ.core.defaults.Headlight.intensity,
            MLJ.core.defaults.Headlight.distance);

    this.setIntensity = function (value) {
        _light.intensity = value;
        renderer.render(scene, camera);
    };

    this.setColor = function (color) {
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
    };

    this.setOn = function (on) {
        if (on) {
            camera.add(_light);
        } else {
            camera.remove(_light);
        }
        renderer.render(scene, camera);
    };

    //Init light
    this.setOn(_on);

};

MLJ.core.PhongMaterial = function (flags) {

    this.flags = flags === undefined
            ? $.extend(true, {}, MLJ.core.defaults.PhongMaterial)
            : flags;

    this.threeMaterial = null;

    var _this = this;

    this.build = function () {
        _this.threeMaterial = new THREE.MeshPhongMaterial(this.flags);
    };

    this.setColor = function (value) {
        this.flags.color = _this.threeMaterial.color = new THREE.Color(value);
        MLJ.core.Scene.render();
    };

    this.setEmissive = function (value) {
        this.flags.emissive = _this.threeMaterial.emissive = new THREE.Color(value);
        MLJ.core.Scene.render();
    };

    this.setSpecular = function (value) {
        this.flags.specular = _this.threeMaterial.specular = new THREE.Color(value);
        MLJ.core.Scene.render();
    };

    this.setShininess = function (value) {
        this.flags.shininess = _this.threeMaterial.shininess = value;
        MLJ.core.Scene.render();
    };

    this.needUpdate = function () {
        _this.threeMaterial.needUpdate = true;
    };

    this.dispose = function () {
        _this.threeMaterial.dispose();
        this.threeMaterial = this.flags = _this = null;
    };

    //Init
    this.build();
};


MLJ.core.MeshFile = function (name, ptrMesh) {
    this.name = name;
    this.ptrMesh = ptrMesh;
    this.VN = this.vert = this.FN = this.face = null;
    this.material = new MLJ.core.PhongMaterial();
    this.threeMesh = null;
    var _this = this;

    function buildMeshGeometry() {
        var meshProp = new Module.MeshLabJs(ptrMesh);
        _this.VN = meshProp.getVertexNumber();
        _this.vert = meshProp.getVertexVector();
        _this.FN = meshProp.getFaceNumber();
        _this.face = meshProp.getFaceVector();

        var geometry = new THREE.Geometry();
        for (var i = 0; i < _this.VN * 3; i++) {
            var v1 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            i++;
            var v2 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            i++;
            var v3 = Module.getValue(_this.vert + parseInt(i * 4), 'float');
            geometry.vertices.push(new THREE.Vector3(v1, v2, v3));
        }
        for (var i = 0; i < _this.FN * 3; i++) {
            var a = Module.getValue(_this.face + parseInt(i * 4), '*');
            i++;
            var b = Module.getValue(_this.face + parseInt(i * 4), '*');
            i++;
            var c = Module.getValue(_this.face + parseInt(i * 4), '*');
            geometry.faces.push(new THREE.Face3(a, b, c));
        }

        geometry.dynamic = true;

        return geometry;
    }

    function buildThreeMesh() {
        console.time("Time to create mesh: ");
        _this.threeMesh = new THREE.Mesh(buildMeshGeometry(),
                _this.material.threeMaterial);
        console.timeEnd("Time to create mesh: ");
    }

    function geometryNeedUpdate() {
        _this.threeMesh.geometry.computeFaceNormals();
        _this.threeMesh.geometry.computeVertexNormals();
        _this.threeMesh.geometry.verticesNeedUpdate = true;
        _this.threeMesh.geometry.elementsNeedUpdate = true;
        _this.threeMesh.geometry.normalsNeedUpdate = true;
    }

    this.setShading = function (value) {

        //Set material shading flag
        this.material.flags.shading = value;

        //Rebuild material
        this.material.build();

        //Change mesh old material with new one
        _this.threeMesh.material = this.material.threeMaterial;

        //Update geometry
        geometryNeedUpdate();

        MLJ.core.Scene.render();
    };

    this.getThreeMesh = function () {
        return this.threeMesh;
    };

    this.updateThreeMesh = function () {

        //Free memory
        _this.threeMesh.geometry.dispose();

        //Rebuild mesh geometry
        this.threeMesh.geometry = buildMeshGeometry();

        geometryNeedUpdate();
    };

    this.dispose = function () {
        _this.threeMesh.geometry.dispose();
        _this.material.dispose();

        if (_this.threeMesh.texture) {
            _this.threeMesh.texture.dispose();
        }

        _this.threeMesh = _this.name = _this.ptrMesh = _this.VN = _this.vert =
                _this.FN = _this.face = _this.material = _this = null;
    };

    buildThreeMesh();
};
