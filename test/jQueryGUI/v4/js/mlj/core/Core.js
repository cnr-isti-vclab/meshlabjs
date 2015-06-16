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

MLJ.core = {};

MLJ.core.AmbientLight = function (scene, camera, renderer) {
    this.DEFAULT_COLOR = "#ffffff";
    
    var _on = false;
    var _light = new THREE.AmbientLight(this.DEFAULT_COLOR);    

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

};

MLJ.core.Headlight = function (scene, camera, renderer) {
    var flags = {
        color: "#ffffff",
        on: true,
        intensity: 0.5,
        distance: 0
    };

    var _light = new THREE.PointLight(flags.color, flags.intensity, flags.distance);
    camera.add(_light);

    this.setIntensity = function (value) {
        flags.intensity = _light.intensity = value;
        renderer.render(scene, camera);
    };

    this.setColor = function (color) {
        flags.intensity = color;
        _light.color = new THREE.Color(color);
        renderer.render(scene, camera);
    };

    this.setOn = function (on) {
        _light.intensity = on ? flags.intensity : 0;
        renderer.render(scene, camera);
    };

};

MLJ.core.PhongMaterial = function () {

    this.flags = {
        specular: '#ffffff',
        color: '#a0a0a0',
        emissive: '#7c7b7b',
        shading: THREE.FlatShading,
        shininess: 50,
        wireframe: true, //make mesh transparent
        wireframeLinewidth: 1
    };

    var _material;

    this.build = function () {
        _material = new THREE.MeshPhongMaterial(this.flags);
        return _material;
    };

    this.setColor = function (value) {
        this.flags.color = value;
        _material.color = new THREE.Color(value);
    };

    this.setEmissive = function (value) {
        this.flags.emissive = value;
        _material.emissive = new THREE.Color(value);
    };

    this.setSpecular = function (value) {
        this.flags.specular = value;
        _material.specular = new THREE.Color(value);
    };

    this.setShading = function (value) {

        switch (value) {
            case '1': //Flat
                this.flags.shading = THREE.FlatShading;
                break;
            case '2': //Smouth
                this.flags.shading = THREE.SmoothShading;
                break;
            default:
                this.flags.shading = THREE.NoShading;
        }

        _material.shading = this.flags.shading;
    };

    this.setShininess = function (value) {
        _material.shininess = this.flags.shininess = value;
    };

};

MLJ.core.MeshFile = function (name, ptrMesh) {
    this.name = name;
    this.ptrMesh = ptrMesh;
    this.VN = this.vert = this.FN = this.face = null;
    this.material = new MLJ.core.PhongMaterial();
    var _threeMesh;
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
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        return geometry;
    }

    function buildThreeMesh(material) {
        console.time("Time to create mesh: ");
        _threeMesh = new THREE.Mesh(buildMeshGeometry(), material);
        console.timeEnd("Time to create mesh: ");
    }

    this.getThreeMesh = function () {
        return _threeMesh;
    };

    this.u2 = function () {
        buildThreeMesh(this.material.build());
        $(document).trigger(
                MLJ.events.File.MESH_FILE_UPDATED,
                [_this]);
    };

    this.updateThreeMesh = function () {
        buildThreeMesh(this.material.build());

//        var geometry = buildMeshGeometry();
//        _threeMesh.geometry.vertices = geometry.vertices;
//        _threeMesh.geometry.faces = geometry.faces;
//        _threeMesh.geometry.verticesNeedUpdate = true;
//        _threeMesh.geometry.elementsNeedUpdate = true;
//        _threeMesh.geometry.normalsNeedUpdate = true;
//
    };

    buildThreeMesh(this.material.build());
};
