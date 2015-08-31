
(function (plugin, core, scene) {

    var DEFAULTS = {
        color : new THREE.Color('#00FF00'), // edges color
        width : 1,  // edges width
        faceOpacity : 0.1
    };

    var plug = new plugin.Rendering({
        name: "Boundary Edges",        
        tooltip: "Show Boundary Edges",
        icon: "img/icons/boundary.png",
        toggle:true,    
        on: false        
    }, DEFAULTS);

    plug._init = function (guiBuilder) {

        guiBuilder.Color({
            label: "Color",
            tooltip: "The color of boundary edges",
            color: "#" + DEFAULTS.color.getHexString(),
            bindTo: (function() {
                var bindToFun = function (color, overlay) {
                    overlay.edges.material.color = color;
                    overlay.faces.material.color = color;
                    scene.render();
                };
                bindToFun.toString = function () { return 'color'; };
                return bindToFun;
            }())
        });

        guiBuilder.RangedFloat({
            label: "Edges Width",
            tooltip: "The width of boundary edges",
            min: 1, max: 5, step: 0.5,
            defval: DEFAULTS.width,
            bindTo: (function() {
                var bindToFun = function (width, overlay) {
                    overlay.edges.material.linewidth = width;
                    scene.render();
                };
                bindToFun.toString = function () { return 'width'; };
                return bindToFun;
            }())
        });

        guiBuilder.RangedFloat({
            label: "Faces Opacity",
            tooltip: "The opacity of faces adjacent to boundary edges",
            min: 0, max: 1, step: 0.01,
            defval: DEFAULTS.faceOpacity,
            bindTo: (function() {
                var bindToFun = function (opacity, overlay) {
                    overlay.faces.material.opacity = opacity;
                    scene.render();
                };
                bindToFun.toString = function () { return 'faceOpacity'; };
                return bindToFun;
            }())
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            Module._free(meshFile.boundaryBufferPtr);
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        var params = meshFile.overlaysParams.getByKey(plug.getName());

        var boundaryMesh = createBoundaryMesh();

        if (boundaryMesh) {
            scene.addOverlayLayer(meshFile, plug.getName(), boundaryMesh);
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