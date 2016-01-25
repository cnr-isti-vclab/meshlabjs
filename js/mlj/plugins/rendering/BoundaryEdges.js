
(function (plugin, core, scene) {

    var DEFAULTS = {
        color : new THREE.Color('#00FF00'), // boundary edges color
        width : 1,  // boundary edges width
        faceOpacity : 0.1,
        showBoundary: 1,
        colorNonManifVert: new THREE.Color('#FF0000'),
        showNonManifVert: 0,
        sizeNonManifVert: 1,
        colorNonManifEdge: new THREE.Color('#FF00FF'),
        showNonManifEdge: 0
        //texture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png")
    };

    var plug = new plugin.Rendering({
        name: "Boundary Edges",        
        tooltip: "Show Boundary Edges",
        icon: "img/icons/boundary.png",
        toggle:true,    
        on: false,
        loadShader: ["PointsFragment.glsl", "PointsVertex.glsl"]
    }, DEFAULTS);

    plug._init = function (guiBuilder) {

        guiBuilder.Choice({
            label: "Show Boundary",
            tooltip: "",
            options: [
                {content: "Off", value: 0},
                {content: "On", value: 1, selected: true }
            ],
            bindTo: (function() {
                var bindToFun = function(choice, overlay) {

                    if (overlay.boundaryMesh) {
                        if (choice === 1) {
                            overlay.add(overlay.boundaryMesh);
                        } else {
                            overlay.remove(overlay.boundaryMesh);
                        }
                    }
                };
                bindToFun.toString = function() { return 'showBoundary'; }
                return bindToFun;
            }())
        });

        guiBuilder.Color({
            label: "Color Boundary",
            tooltip: "The color of boundary edges",
            color: "#" + DEFAULTS.color.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    if (overlay.boundaryMesh) {
                        overlay.boundaryMesh.edges.material.color = color;
                        overlay.boundaryMesh.faces.material.color = color;
                    }
                };
                bindToFun.toString = function () { return 'color'; };
                return bindToFun;
            }())
        });

        guiBuilder.RangedFloat({
            label: "Edges Width Boundary",
            tooltip: "The width of boundary edges",
            min: 1, max: 5, step: 0.5,
            defval: DEFAULTS.width,
            bindTo: (function() {
                var bindToFun = function (width, overlay) {
                    if (overlay.boundaryMesh) {
                        overlay.boundaryMesh.edges.material.linewidth = width;
                    }
                };
                bindToFun.toString = function () { return 'width'; };
                return bindToFun;
            }())
        });

        guiBuilder.RangedFloat({
            label: "Faces Opacity",
            tooltip: "The opacity of faces",
            min: 0, max: 1, step: 0.01,
            defval: DEFAULTS.faceOpacity,
            bindTo: (function() {
                var bindToFun = function (opacity, overlay) {
                    if (overlay.boundaryMesh) {
                        overlay.boundaryMesh.faces.material.opacity = opacity;
                    }
                    if (overlay.nonManifVertMesh) {
                        overlay.nonManifVertMesh.faces.material.opacity = opacity;
                    }
                    if (overlay.nonManifEdgeMesh) {
                        overlay.nonManifEdgeMesh.faces.material.opacity = opacity;
                    }
                };
                bindToFun.toString = function () { return 'faceOpacity'; };
                return bindToFun;
            }())
        });

        guiBuilder.Choice({
            label: "Show non manifold vertices",
            tooltip: "",
            options: [
                {content: "Off", value: 0, selected: true},
                {content: "On", value: 1 }
            ],
            bindTo: (function() {
                var bindToFun = function(choice, overlay) {

                    if (overlay.nonManifVertMesh) {
                        if (choice === 1) {
                            overlay.add(overlay.nonManifVertMesh);
                        } else {
                            overlay.remove(overlay.nonManifVertMesh);
                        }
                    }
                };
                bindToFun.toString = function() { return 'showNonManifVert'; }
                return bindToFun;
            }())
        });

        guiBuilder.Color({
            label: "Color non manifold vertices",
            tooltip: "The color of non manifold vertices and adjacent faces",
            color: "#" + DEFAULTS.colorNonManifVert.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    if (overlay.nonManifVertMesh) {
                        overlay.nonManifVertMesh.verts.material.uniforms.color.value = color;
                        overlay.nonManifVertMesh.faces.material.color = color;
                    }
                };
                bindToFun.toString = function () { return 'colorNonManifVert'; };
                return bindToFun;
            }())
        });



        guiBuilder.RangedFloat({
            label: "Non manifold vertex size",
            tooltip: "The size of non manifold vertices in pixels",
            min: 1, max: 50, step: 1,
            defval: DEFAULTS.sizeNonManifVert,
            bindTo : (function() {
                    var bindToFun = function (size, overlay) {
                        if (overlay.nonManifVertMesh) {
                            overlay.nonManifVertMesh.verts.material.uniforms.size.value = size;
                        }
                    };
                    bindToFun.toString = function () { return 'sizeNonManifVert'; };
                    return bindToFun;
                }())
        });

        guiBuilder.Choice({
            label: "Show non manifold edges",
            tooltip: "",
            options: [
                {content: "Off", value: 0, selected: true},
                {content: "On", value: 1 }
            ],
            bindTo: (function() {
                var bindToFun = function(choice, overlay) {
                    if (overlay.nonManifEdgeMesh) {
                        if (choice === 1) {
                            overlay.add(overlay.nonManifEdgeMesh);
                        } else {
                            overlay.remove(overlay.nonManifEdgeMesh);
                        }
                    }
                };
                bindToFun.toString = function() { return 'showNonManifEdge'; }
                return bindToFun;
            }())
        });

        guiBuilder.Color({
            label: "Color non manifold edges",
            tooltip: "The color of non manifold edges and adjacent faces",
            color: "#" + DEFAULTS.colorNonManifEdge.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    if (overlay.nonManifEdgeMesh) {
                        overlay.nonManifEdgeMesh.edges.material.color = color;
                        overlay.nonManifEdgeMesh.faces.material.color = color;
                    }
                };
                bindToFun.toString = function () { return 'colorNonManifEdge'; };
                return bindToFun;
            }())
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            Module._free(meshFile.boundaryBufferPtr);
            Module._free(meshFile.nonManifVertBufferPtr);
            Module._free(meshFile.nonManifEdgeBufferPtr);
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        var params = meshFile.overlaysParams.getByKey(plug.getName());

        var overlayMesh = new THREE.Mesh();

        var boundaryMesh = createBoundaryMesh();

        if (boundaryMesh) {
            if (params.showBoundary === 1) {
                overlayMesh.add(boundaryMesh);
            }
            overlayMesh.boundaryMesh = boundaryMesh;
        }

        var nonManifVertMesh = createNonManifVertMesh();

        if (nonManifVertMesh) {
            if (params.showNonManifVert === 1) {
                overlayMesh.add(nonManifVertMesh);
            }
            overlayMesh.nonManifVertMesh = nonManifVertMesh;
        }

        var nonManifEdgeMesh = createNonManifEdgeMesh();

        if (nonManifEdgeMesh) {
            if (params.showNonManifEdge === 1) {
                overlayMesh.add(nonManifEdgeMesh);
            }
            overlayMesh.nonManifEdgeMesh = nonManifEdgeMesh;
        }

        scene.addOverlayLayer(meshFile, plug.getName(), overlayMesh);

        function createNonManifEdgeMesh() {
            const SIZEOF_FLOAT = 4;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;
            const NUM_BYTES_PER_EDGES = 2 * NUM_BYTES_PER_VERTEX;
            const NUM_BYTES_PER_FACE = 3 * NUM_BYTES_PER_VERTEX;

            var startBufferPtr = Module.buildNonManifoldEdgeCoordsVec(meshFile.ptrMesh());

            meshFile.nonManifEdgeBufferPtr = startBufferPtr;

            // read first float as the effective number of non manif edges
            var numNonManifEdges = Module.getValue(startBufferPtr, 'float');
            var numFaces = Module.getValue(startBufferPtr + SIZEOF_FLOAT, 'float');

            var edgesCoordsPtr = startBufferPtr + 2 * SIZEOF_FLOAT;
            var facesCoordsPtr = edgesCoordsPtr + numNonManifEdges * NUM_BYTES_PER_EDGES;

            Module.print(numNonManifEdges + ' non manifold edges');
            Module.print(numFaces + ' faces over non manifold edges');

            if (numNonManifEdges === 0) return null;

            var numFloatsEdgesCoordsVec = (numNonManifEdges * NUM_BYTES_PER_EDGES) / SIZEOF_FLOAT;
            var numFloatsFacesVec = (numFaces * NUM_BYTES_PER_FACE) / SIZEOF_FLOAT;

            var edgesCoordsVec = new Float32Array(Module.HEAPU8.buffer, edgesCoordsPtr, numFloatsEdgesCoordsVec);
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, facesCoordsPtr, numFloatsFacesVec);

            // now create a buffer geometry for the edges
            var nonManifEdgesGeometry = new THREE.BufferGeometry();
            nonManifEdgesGeometry.addAttribute('position', new THREE.BufferAttribute( edgesCoordsVec, 3 ) );

            var edgesMaterial = new THREE.LineBasicMaterial();
            edgesMaterial.color = params.colorNonManifEdge;
            edgesMaterial.linewidth = params.width;
            edgesMaterial.transparent = true;

            var edgesMesh = new THREE.Line(nonManifEdgesGeometry, edgesMaterial, THREE.LinePieces);

            // now create a buffer geometry for the faces
            var facesGeometry = new THREE.BufferGeometry();
            facesGeometry.addAttribute( 'position', new THREE.BufferAttribute( facesCoordsVec, 3 ) );

            var facesMaterial = new THREE.MeshBasicMaterial();
            facesMaterial.transparent = true;
            facesMaterial.color = params.colorNonManifEdge;
            facesMaterial.opacity = params.faceOpacity;
            facesMaterial.shading = THREE.FlatShading;
            facesMaterial.side = THREE.DoubleSide;

            var facesMesh = new THREE.Mesh( facesGeometry, facesMaterial );

            // now create the mesh
            var nonManifEdgeMesh = new THREE.Mesh();
            nonManifEdgeMesh.add(edgesMesh);
            nonManifEdgeMesh.add(facesMesh);

            nonManifEdgeMesh.edges = edgesMesh;
            nonManifEdgeMesh.faces = facesMesh;

            return nonManifEdgeMesh;
        }

        function createNonManifVertMesh() {

            const SIZEOF_FLOAT = 4;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;
            const NUM_BYTES_PER_FACE = 3 * NUM_BYTES_PER_VERTEX;

            var startBufferPtr = Module.buildNonManifoldVertexCoordsVec(meshFile.ptrMesh());

            meshFile.nonManifVertBufferPtr = startBufferPtr;

            // read first float as the effective number of non manif vertices
            var numNonManifVertices = Module.getValue(startBufferPtr, 'float');
            var numFaces = Module.getValue(startBufferPtr + SIZEOF_FLOAT, 'float');

            var vertCoordsPtr = startBufferPtr + 2 * SIZEOF_FLOAT;
            var facesCoordsPtr = vertCoordsPtr + numNonManifVertices * NUM_BYTES_PER_VERTEX;

            Module.print(numNonManifVertices + ' non manifold vertices');
            Module.print(numFaces + ' faces over non manifold vertices');

            if (numNonManifVertices === 0) return null;

            var numFloatsVertsCoordsVec = (numNonManifVertices * NUM_BYTES_PER_VERTEX) / SIZEOF_FLOAT;
            var numFloatsFacesVec = (numFaces * NUM_BYTES_PER_FACE) / SIZEOF_FLOAT;

            var vertsCoordsVec = new Float32Array(Module.HEAPU8.buffer, vertCoordsPtr, numFloatsVertsCoordsVec);
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, facesCoordsPtr, numFloatsFacesVec);

            // now create a buffer geometry for the vertices
            var nonManifVerticesGeometry = new THREE.BufferGeometry();
            nonManifVerticesGeometry.addAttribute('position', new THREE.BufferAttribute( vertsCoordsVec, 3 ) );

/*
            var vertMaterial = new THREE.PointCloudMaterial(
                {   color: params.colorNonManifVert,
                    size: params.sizeNonManifVert,
                    sizeAttenuation: true,
                    transparent: true
                });
*/

            var pointsUniforms ={
                color: {type: "c", value: params.colorNonManifVert},
                size: {type: "f", value: params.sizeNonManifVert},
                pointOpacity : { type: "f", value: 1.0 }
                //texture: {type: "t", value: DEFAULTS.texture}
            };

            var vertMaterial = new THREE.RawShaderMaterial({
                uniforms: pointsUniforms,
                attributes: nonManifVerticesGeometry.attributes,
                vertexShader: plug.shaders.getByKey("PointsVertex.glsl"),
                fragmentShader: plug.shaders.getByKey("PointsFragment.glsl"),
                transparent: true
                //alphaTest: 0.9
            });

            var nonManifVertices = new THREE.PointCloud(nonManifVerticesGeometry, vertMaterial);

            // now create a buffer geometry for the faces
            var facesGeometry = new THREE.BufferGeometry();
            facesGeometry.addAttribute( 'position', new THREE.BufferAttribute( facesCoordsVec, 3 ) );

            var facesMaterial = new THREE.MeshBasicMaterial();
            facesMaterial.transparent = true;
            facesMaterial.color = params.colorNonManifVert;
            facesMaterial.opacity = params.faceOpacity;
            facesMaterial.shading = THREE.FlatShading;
            facesMaterial.side = THREE.DoubleSide;

            var facesMesh = new THREE.Mesh( facesGeometry, facesMaterial );

            // now create the mesh
            var nonManifVertMesh = new THREE.Mesh();
            nonManifVertMesh.add(nonManifVertices);
            nonManifVertMesh.add(facesMesh);

            nonManifVertMesh.verts = nonManifVertices;
            nonManifVertMesh.faces = facesMesh;

            return nonManifVertMesh;
        }


        function createBoundaryMesh() {

            const SIZEOF_FLOAT = 4;
            const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;
            const NUM_BYTES_PER_EDGES = 2 * NUM_BYTES_PER_VERTEX;
            const NUM_BYTES_PER_FACE = 3 * NUM_BYTES_PER_VERTEX;

            var startBufferPtr = Module.buildBoundaryEdgesCoordsVec(meshFile.ptrMesh());

            meshFile.boundaryBufferPtr = startBufferPtr;

            // read first float as the effective number of boundary edges
            var numBoundaryEdges = Module.getValue(startBufferPtr, 'float');
            var numFaces = Module.getValue(startBufferPtr + SIZEOF_FLOAT, 'float');

            var edgesCoordsPtr = startBufferPtr + 2 * SIZEOF_FLOAT;
            var facesCoordsPtr = edgesCoordsPtr + numBoundaryEdges * NUM_BYTES_PER_EDGES;

            Module.print(numBoundaryEdges + ' boundary edges');
            Module.print(numFaces + ' adjacent faces');

            if (numBoundaryEdges === 0) return null;

            // get a float-wise view on buffer segments
            var numFloatsEgdesVec = (numBoundaryEdges * NUM_BYTES_PER_EDGES) / SIZEOF_FLOAT;
            var numFloatsFacesVec = (numFaces * NUM_BYTES_PER_FACE) / SIZEOF_FLOAT;

            var edgesCoordsVec = new Float32Array(Module.HEAPU8.buffer, edgesCoordsPtr, numFloatsEgdesVec);
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, facesCoordsPtr, numFloatsFacesVec);

            // now create a buffer geometry for the edges
            var boundaryEdgesGeometry = new THREE.BufferGeometry();

            boundaryEdgesGeometry.addAttribute('position', new THREE.BufferAttribute( edgesCoordsVec, 3 ) );

            var material = new THREE.LineBasicMaterial();
            material.color = params.color;
            material.linewidth = params.width;

            var edgesMesh = new THREE.Line( boundaryEdgesGeometry, material, THREE.LinePieces);

            // now create a buffer geometry for the faces
            var boundaryFacesGeometry = new THREE.BufferGeometry();
            boundaryFacesGeometry.addAttribute( 'position', new THREE.BufferAttribute( facesCoordsVec, 3 ) );

            var facesMaterial = new THREE.MeshBasicMaterial();

            facesMaterial.transparent = true;
            facesMaterial.color = params.color;
            facesMaterial.opacity = params.faceOpacity;
            facesMaterial.shading = THREE.FlatShading;
            facesMaterial.side = THREE.DoubleSide;

            // now create the mesh
            var facesMesh = new THREE.Mesh( boundaryFacesGeometry, facesMaterial );

            var boundaryMesh = new THREE.Mesh();
            boundaryMesh.add(edgesMesh);
            boundaryMesh.add(facesMesh);

            boundaryMesh.edges = edgesMesh;
            boundaryMesh.faces = facesMesh;

            return boundaryMesh;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);