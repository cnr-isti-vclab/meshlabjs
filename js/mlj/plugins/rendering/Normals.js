
(function (plugin, core, scene) {

    const BOTH_NORMALS = 0,
          FACE_NORMALS = 1,
          VERTEX_NORMALS = 2;

    const NORMAL_SIZE_MIN = 0.0,
          NORMAL_SIZE_MAX = 5,
          NORMAL_SIZE_STEP = 0.1;

    var DEFAULTS = {
        normalType : BOTH_NORMALS,
        normalFaceColor: new THREE.Color('#FF0000'),
        normalVertexColor: new THREE.Color('#0000FF'),
        normalFaceSize: 1,
        normalVertexSize: 1
    };

    var plug = new plugin.Rendering({
        name: "Normals",
        tooltip: "Normals Tooltip",
        icon: "img/icons/normal.png",
        toggle: true,
        on: false,
        loadShader: ["NormalsFragment.glsl", "NormalsVertex.glsl"]
        // updateOnLayerAdded: true ?
    }, DEFAULTS);

    var normalTypeWidget;

    plug._init = function (guiBuilder) {

        normalTypeWidget = guiBuilder.Choice({
            label: "Normals",
            tooltip: "Select which normals to visualize",
            options: [
                {content: "Both", value: BOTH_NORMALS, selected: true},
                {content: "F", value: FACE_NORMALS},
                {content: "V", value: VERTEX_NORMALS}
            ],
            bindTo: (function() {
                        var bindToFun = function (normalType, overlay) {

                            switch (normalType) {
                                case BOTH_NORMALS:
                                    overlay.faceNormals.visible = true;
                                    overlay.vertexNormals.visible = true;
                                    break;
                                case FACE_NORMALS:
                                    overlay.faceNormals.visible = true;
                                    overlay.vertexNormals.visible = false;
                                    break;
                                case VERTEX_NORMALS:
                                    overlay.faceNormals.visible = false;
                                    overlay.vertexNormals.visible = true;
                                    break;
                            }

                            scene.render();
                        };
                        bindToFun.toString = function () { return 'normalType'; };
                        return bindToFun;
                    }())
        });

        guiBuilder.Color({
            label: "Normal Face Color",
            tooltip: "The color of face normals",
            color: "#" + DEFAULTS.normalFaceColor.getHexString(),
            bindTo: (function() {
                        var bindToFun = function (color, overlay) {
                            overlay.faceNormals.material.uniforms['color'].value = color;
                            scene.render();
                        };
                        bindToFun.toString = function () { return 'normalFaceColor'; };
                        return bindToFun;
                    }())
        });

        guiBuilder.RangedFloat({
            label: "Normal Face Size",
            tooltip: "The size of face normals",
            min: NORMAL_SIZE_MIN, max: NORMAL_SIZE_MAX, step: NORMAL_SIZE_STEP,
            defval: DEFAULTS.normalFaceSize,
            bindTo: (function() {
                var bindToFun = function (size, overlay) {
                    overlay.faceNormals.material.uniforms['size'].value = size;
                    scene.render();
                };
                bindToFun.toString = function () { return 'normalFaceSize'; }
                return bindToFun;
            }())
        });

        guiBuilder.Color({
            label: "Normal Vertex Color",
            tooltip: "The color of vertex normals",
            color: "#" + DEFAULTS.normalVertexColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    overlay.vertexNormals.material.uniforms['color'].value = color;
                    scene.render();
                };
                bindToFun.toString = function () { return 'normalVertexColor'; };
                return bindToFun;
            }())
        });

        guiBuilder.RangedFloat({
            label: "Normal Vertex Size",
            tooltip: "The size of vertex normals",
            min: NORMAL_SIZE_MIN, max: NORMAL_SIZE_MAX, step: NORMAL_SIZE_STEP,
            defval: DEFAULTS.normalVertexSize,
            bindTo: (function() {
                var bindToFun = function (size, overlay) {
                    overlay.vertexNormals.material.uniforms['size'].value = size;
                    scene.render();
                };
                bindToFun.toString = function () { return 'normalVertexSize'; }
                return bindToFun;
            }())
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            Module._free(meshFile.faceNormalsPtr);
            Module._free(meshFile.vertexNormalsPtr);
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }
        
        var params = meshFile.overlaysParams.getByKey(plug.getName());

        var normalsMesh = new THREE.Mesh();

        var faceNormals = buildFaceNormals.call(this);
        var vertexNormals = buildVertexNormals.call(this);

        normalsMesh.add(faceNormals);
        normalsMesh.add(vertexNormals);
        normalsMesh.faceNormals = faceNormals;
        normalsMesh.vertexNormals = vertexNormals;

        switch (normalTypeWidget.getValue()) {
            case BOTH_NORMALS:
                break;

            case FACE_NORMALS:
                normalsMesh.vertexNormals.visible = false;
                break;

            case VERTEX_NORMALS:
                normalsMesh.faceNormals.visible = false;
                break;
        }

        scene.addOverlayLayer(meshFile, plug.getName(), normalsMesh);

        function buildFaceNormals() {
            const SIZEOF_FLOAT = 4;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;

            var startBuffer = Module.buildFaceNormalsVec(meshFile.ptrMesh());
            meshFile.faceNormalsPtr = startBuffer;

            var centroidsCoordsPtr = startBuffer;
            var masksPtr = startBuffer + meshFile.FN * 2 * NUM_BYTES_PER_VERTEX;
            var normalsCoordsPtr = startBuffer + (meshFile.FN * 2 * NUM_BYTES_PER_VERTEX + meshFile.FN * 2 * SIZEOF_FLOAT);

            var centroids = new Float32Array(Module.HEAPU8.buffer, centroidsCoordsPtr, (meshFile.FN * 2 * NUM_BYTES_PER_VERTEX) / SIZEOF_FLOAT);
            var masks = new Float32Array(Module.HEAPU8.buffer, masksPtr, meshFile.FN * 2);
            var normals = new Float32Array(Module.HEAPU8.buffer, normalsCoordsPtr, (meshFile.FN * 2 * NUM_BYTES_PER_VERTEX) / SIZEOF_FLOAT);

            var faceNormalsGeometry = new THREE.BufferGeometry();

            faceNormalsGeometry.addAttribute('position', new THREE.BufferAttribute( centroids, 3 ) );
            faceNormalsGeometry.addAttribute('normal', new THREE.BufferAttribute( normals, 3 ) );
            faceNormalsGeometry.addAttribute('mask', new THREE.BufferAttribute( masks, 1 ) );

            var attributes = {
                mask: {type: 'f', value: []}
            };

            var uniforms = {
                size: {type: "f", value: params.normalFaceSize},
                color: {type: "c", value: params.normalFaceColor}
            };

            var parameters = {
                vertexShader: this.shaders.getByKey("NormalsVertex.glsl"),
                fragmentShader: this.shaders.getByKey("NormalsFragment.glsl"),
                attributes: attributes,
                uniforms: uniforms,
                wireframe : true,
                transparent: true,
                side: THREE.DoubleSide
            };

            var faceNormalsMat = new THREE.RawShaderMaterial(parameters);
            var faceNormals = new THREE.Mesh(faceNormalsGeometry, faceNormalsMat);


            return faceNormals;

        }

        function buildVertexNormals() {

            const SIZEOF_FLOAT = 4;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;

            var startBuffer = Module.buildVertexNormalsVec(meshFile.ptrMesh());
            meshFile.vertexNormalsPtr = startBuffer;

            var pointCoordsPtr = startBuffer;
            var masksPtr = startBuffer + meshFile.VN * 2 * NUM_BYTES_PER_VERTEX;
            var normalsCoordsPtr = startBuffer + (meshFile.VN * 2 * NUM_BYTES_PER_VERTEX + meshFile.VN * 2 * SIZEOF_FLOAT);

            var points = new Float32Array(Module.HEAPU8.buffer, pointCoordsPtr, (meshFile.VN * 2 * NUM_BYTES_PER_VERTEX) / SIZEOF_FLOAT);
            var masks = new Float32Array(Module.HEAPU8.buffer, masksPtr, meshFile.VN * 2);
            var normals = new Float32Array(Module.HEAPU8.buffer, normalsCoordsPtr, (meshFile.VN * 2 * NUM_BYTES_PER_VERTEX) / SIZEOF_FLOAT);

            var vertexNormalsGeometry = new THREE.BufferGeometry();

            vertexNormalsGeometry.addAttribute('position', new THREE.BufferAttribute( points, 3 ) );
            vertexNormalsGeometry.addAttribute('normal', new THREE.BufferAttribute( normals, 3 ) );
            vertexNormalsGeometry.addAttribute('mask', new THREE.BufferAttribute( masks, 1 ) );

            var attributes = {
                mask: {type: 'f', value: []}
            };

            var uniforms = {
                size: {type: "f", value: params.normalVertexSize},
                color: {type: "c", value: params.normalVertexColor}
            };

            var parameters = {
                vertexShader: this.shaders.getByKey("NormalsVertex.glsl"),
                fragmentShader: this.shaders.getByKey("NormalsFragment.glsl"),
                attributes: attributes,
                uniforms: uniforms,
                wireframe : true,
                transparent: true,
                side: THREE.DoubleSide
            };

            var vertexNormalsMat = new THREE.RawShaderMaterial(parameters);
            var vertexNormals = new THREE.Mesh(vertexNormalsGeometry, vertexNormalsMat);

            return vertexNormals;
        }
    };


    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);