
(function (plugin, core, scene) {

    const BOTH_SELECTED_FACES_AND_VERTICES = 0,
        ONLY_SELECTED_VERTICES = 2,
        ONLY_SELECTED_FACES = 1;

    var DEFAULTS = {
        selection : BOTH_SELECTED_FACES_AND_VERTICES,
        pointColor : new THREE.Color('#FF0000'),
        pointSize : 1,
        faceColor : new THREE.Color('#FF0000'),
        //PRELOADING NEEDED ...
        texture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png")
    };

    var plug = new plugin.Rendering({
        name: "Selection",
        tooltip: "Show Selected Face and vertices",
        icon: "img/icons/selected.png",
        toggle: true,
        on: false,
        loadShader: ["PointsFragment.glsl", "PointsVertex.glsl"]
    }, DEFAULTS);

    plug._init = function (guiBuilder) {

        selectionWidget = guiBuilder.Choice({
            label: "Selected Elements",
            tooltip: "Select which selected elements to visualize",
            options: [
                {content: "Both", value: BOTH_SELECTED_FACES_AND_VERTICES, selected: true},
                {content: "F", value: ONLY_SELECTED_FACES},
                {content: "V", value: ONLY_SELECTED_VERTICES}
            ],
            bindTo: (function() {
                var bindToFun = function (selection, overlay) {

                    switch (selection) {
                        case BOTH_SELECTED_FACES_AND_VERTICES:
                            overlay.selectedPoints.visible = true;
                            overlay.selectedFaces.visible = true;
                            break;
                        case ONLY_SELECTED_VERTICES:
                            overlay.selectedPoints.visible = true;
                            overlay.selectedFaces.visible = false;
                            break;
                        case ONLY_SELECTED_FACES:
                            overlay.selectedPoints.visible = false;
                            overlay.selectedFaces.visible = true;
                            break;
                    }

                    scene.render();
                };
                bindToFun.toString = function () { return 'selection'; };
                return bindToFun;
            }())
        });

        guiBuilder.Color({
            label: "Point Color",
            tooltip: "The color of selected points",
            color: "#" + DEFAULTS.pointColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    overlay.selectedPoints.material.uniforms['color'].value = color;
                    scene.render();
                };
                bindToFun.toString = function () { return 'pointColor'; };
                return bindToFun;
            }())
        });

        guiBuilder.RangedFloat({
            label: "Point Size",
            tooltip: "The size of selected points",
            min: 0.5, max: 16, step: 0.5,
            defval: DEFAULTS.pointSize,
            bindTo: (function() {
                var bindToFun = function (size, overlay) {
                    overlay.selectedPoints.material.uniforms['size'].value = size;
                    scene.render();
                };
                bindToFun.toString = function () { return 'pointSize'; };
                return bindToFun;
            }())
        });

        guiBuilder.Color({
            label: "Face Color",
            tooltip: "The color of selected faces",
            color: "#" + DEFAULTS.faceColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    overlay.selectedFaces.material.color = color;
                    scene.render();
                };
                bindToFun.toString = function () { return 'faceColor'; };
                return bindToFun;
            }())
        });

    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            // free memory used for this plugin.
            // Note: when free is invoked with undefined,it does nothing
            Module._free(meshFile.facesCoordsPtr);
            Module._free(meshFile.pointsCoordsPtr);
            return;
        }

        var params = meshFile.overlaysParams.getByKey(plug.getName());

        // Build two meshes for current selected faces and selected points respectively
        // and insert them in a single mesh

        // this mesh will contain the two meshes
        var selectionsMesh = new THREE.Mesh();

        //var timeStart = performance.now();

        debugger;

        var renderer = scene.getRenderer();
        scene.render();

        selectionsMesh.add(createSelectedFacesMesh.call(this));
        selectionsMesh.add(createSelectedPointsMesh.call(this));

        //var timeEnd = performance.now();
        //Module.print('It took ' + (timeEnd - timeStart) + ' ms.\n');

        scene.addOverlayLayer(meshFile, plug.getName(), selectionsMesh);

        function createSelectedFacesMesh() {

            const SIZEOF_FLOAT = 4;
            const NUM_VERTICES_PER_FACE = 3;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;

            // compute the length of the face coords buffer (+ 1 float for array size) in bytes
            var numBytes = meshFile.FN * NUM_VERTICES_PER_FACE * NUM_BYTES_PER_VERTEX + SIZEOF_FLOAT;

            // malloc enough space for the face coords buffer
            var facesCoordsPtr = Module._malloc(numBytes);

            // and store its reference in mesh object for deallocation when the user deactivate this plugin
            meshFile.facesCoordsPtr = facesCoordsPtr;

            // call the c++ function which should fill the face coords array from mesh data
            Module.buildSelectedFacesCoordsVec(meshFile.ptrMesh(), facesCoordsPtr);

            // read first float as the effective number of selected faces
            var numSelectedFaces = Module.getValue(facesCoordsPtr, 'float');

            // compute correct number of bytes of useful data
            var numBytesUsefulData = numSelectedFaces * NUM_VERTICES_PER_FACE * NUM_BYTES_PER_VERTEX;

            // get a float-wise view on the faces coords byte array
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, facesCoordsPtr + SIZEOF_FLOAT, numBytesUsefulData / SIZEOF_FLOAT);

            // now create a geometry with the data
            var selectedFacesGeometry = new THREE.BufferGeometry();

            selectedFacesGeometry.addAttribute( 'position', new THREE.BufferAttribute( facesCoordsVec, 3 ) );

            // create a material for selected faces
            var facesMaterial = new THREE.MeshLambertMaterial({});

            facesMaterial.color = new THREE.Color(params.faceColor);
            facesMaterial.shading = THREE.FlatShading;
            facesMaterial.side = THREE.DoubleSide;

            // for transparency: Note: 3js will use depth sorting to render the mesh
            //facesMaterial.transparent = true;
            //facesMaterial.opacity = params.faceOpacity;

            //facesMaterial.depthWrite = false;
            //facesMaterial.blending = THREE.AdditiveBlending;

            // use polygonOffset to obtain correct faces visualization on top of solid color base layer
            facesMaterial.polygonOffset = true;
            facesMaterial.polygonOffsetFactor = -1.0;
            facesMaterial.polygonOffsetUnits = -1.0;

            // now create the mesh
            var facesMesh = new THREE.Mesh( selectedFacesGeometry, facesMaterial );

            // compute normals for correct lighting
            facesMesh.geometry.computeFaceNormals();
            facesMesh.geometry.computeVertexNormals();

            // check current visibility option
            if (selectionWidget.getValue() == ONLY_SELECTED_VERTICES) {
                facesMesh.visible = false;
            }

            Module.print(numSelectedFaces + ' faces selected');

            selectionsMesh.selectedFaces = facesMesh;

            return facesMesh;
        }

        function createSelectedPointsMesh() {

            const SIZEOF_FLOAT = 4;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;

            // compute the length of the points coords buffer (+ 1 float for array size) in bytes
            var numBytes = meshFile.VN * NUM_BYTES_PER_VERTEX + SIZEOF_FLOAT;

            // malloc enough space for the points coords buffer
            var pointsCoordsPtr = Module._malloc(numBytes);

            // and store its reference in mesh object for deallocation when the user deactivate this plugin
            meshFile.pointsCoordsPtr = pointsCoordsPtr;

            // call the c++ function which should fill the points coords array from mesh data
            Module.buildSelectedPointsCoordsVec(meshFile.ptrMesh(), pointsCoordsPtr);

            // read first float as the effective number of selected points
            var numSelectedPoints = Module.getValue(pointsCoordsPtr, 'float');

            // compute correct number of bytes of useful data
            var numBytesUsefulData = numSelectedPoints * NUM_BYTES_PER_VERTEX;

            // get a float-wise view on the points coords byte array
            var pointsCoordsVec = new Float32Array(Module.HEAPU8.buffer, pointsCoordsPtr + SIZEOF_FLOAT, numBytesUsefulData / SIZEOF_FLOAT);

            // now create a buffer geometry with the data
            var selectedPointsGeometry = new THREE.BufferGeometry();

            selectedPointsGeometry.addAttribute('position', new THREE.BufferAttribute( pointsCoordsVec, 3 ) );

            /* with buffer geometry:
             var selectedPointsGeometry = new THREE.Geometry();

             for (var i = 0, numCoords = pointsCoordsVec.length; i != numCoords; i+=3) {
                var v0 = new THREE.Vector3( pointsCoordsVec[i+0],  pointsCoordsVec[i+1], pointsCoordsVec[i+2] );
                selectedPointsGeometry.vertices.push(v0);
             }

             Module._free(pointsCoordsPtr);
             */

            var minSizes = new Float32Array(numSelectedPoints);

            for (var v = 0, vl = minSizes.length; v != vl; v++) {
                minSizes[v] = 10;
            }

            selectedPointsGeometry.addAttribute('minSize',new THREE.BufferAttribute( minSizes, 1 ) );

            // create a material for selected points

            var attributes = { minSize: {type: 'f', value: null} };

            var uniforms = {
                color: {type: "c", value: params.pointColor},
                size: {type: "f", value: params.pointSize},
                texture: {type: "t", value: DEFAULTS.texture}
            };

            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                attributes: attributes,
                vertexShader: this.shaders.getByKey("PointsVertex.glsl"),
                fragmentShader: this.shaders.getByKey("PointsFragment.glsl"),
                alphaTest: 0.9
            });

            /*
            var values_minSize = attributes.minSize.value;

            for (var v = 0, vl = selectedPointsGeometry.vertices.length; v < vl; v++) {
                values_minSize[ v ] = 10;
            }
            */

            var pointCloud = new THREE.PointCloud(selectedPointsGeometry, shaderMaterial);

            if (selectionWidget.getValue() == ONLY_SELECTED_FACES) {
                pointCloud.visible = false;
            }

            Module.print(numSelectedPoints + ' points selected');

            selectionsMesh.selectedPoints = pointCloud;

            return pointCloud;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);