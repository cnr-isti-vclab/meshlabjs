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
        MLJ.gui.Log.append(text);
    },
    printErr: function (text) {
        MLJ.gui.Log.append(text);
    }
};

MLJ.core = {};

MLJ.core.Events = {
    MESH_FILE_OPENED: "meshFileOpened",
    MESH_FILE_CLOSED: "meshFileClosed"
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

MLJ.core.MeshFile = function (name, VN, vert, FN, face) {
    this.name = name;
    this.VN = VN;
    this.vert = vert;
    this.FN = FN;
    this.face = face;
    this.material = new MLJ.core.PhongMaterial();
    var _threeMesh;

    function buildThreeMesh(material) {
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

        _threeMesh = new THREE.Mesh(geometry, material);
    }

    this.getThreeMesh = function () {
        if (!_threeMesh) {
            buildThreeMesh(this.material.build());
        }

        return _threeMesh;
    };
};

//(function (gui) {
//}).call(MLJ.core, MLJ.gui);