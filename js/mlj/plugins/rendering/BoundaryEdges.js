
(function (plugin, core, scene) {

    var DEFAULTS = {
        color : new THREE.Color('#00FF00'),
        width : 1
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
            label: "Width",
            tooltip: "The width of boundary edges",
            min: 1, max: 5, step: 0.5,
            defval: DEFAULTS.width,
            bindTo: (function() {
                var bindToFun = function (width, overlay) {
                    overlay.edges.material.linewidth = width;
                    scene.render();
                };
                bindToFun.toString = function () { return 'width'; }
                return bindToFun;
            }())
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            Module._free(meshFile.boundaryBufferPtr);
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

            debugger;

            var startBufferPtr = Module.buildBoundaryEdgesCoordsVec(meshFile.ptrMesh());

            meshFile.boundaryBufferPtr = startBufferPtr;

            // read first float as the effective number of boundary edges
            var numBoundaryEdges = Module.getValue(startBufferPtr, 'float');
            var numFaces = Module.getValue(startBufferPtr + SIZEOF_FLOAT, 'float');

            var edgesCoordsPtr = startBufferPtr + 2 * SIZEOF_FLOAT;
            var facesCoordsPtr = edgesCoordsPtr + numBoundaryEdges * NUM_BYTES_PER_EDGES;

            Module.print(numBoundaryEdges + ' boundary edges');

            if (numBoundaryEdges === 0) return null;

            // get a float-wise view on buffer segments
            var numFloatsEgdesVec = (numBoundaryEdges * NUM_BYTES_PER_EDGES) / SIZEOF_FLOAT;
            var numFloatsFacesVec = (numFaces * NUM_BYTES_PER_FACE) / SIZEOF_FLOAT;

            var edgesCoordsVec = new Float32Array(Module.HEAPU8.buffer, edgesCoordsPtr, numFloatsEgdesVec);
            var facesCoordsVec = new Float32Array(Module.HEAPU8.buffer, facesCoordsPtr, numFloatsFacesVec);

            // now create a buffer geometry for the edges

            var boundaryEdgesGeometry = new THREE.Geometry();

            for (var i = 0, numCoords = edgesCoordsVec.length; i != numCoords; i+=3) {
                var v0 = new THREE.Vector3( edgesCoordsVec[i+0],  edgesCoordsVec[i+1], edgesCoordsVec[i+2] );
                boundaryEdgesGeometry.vertices.push(v0);
            }


            var material = new THREE.LineBasicMaterial();
            material.color = params.color;
            material.linewidth = params.width;

            var edgesMesh = new THREE.Line( boundaryEdgesGeometry, material, THREE.LinePieces);

            // now create a buffer geometry for the faces

            var boundaryFacesGeometry = new THREE.BufferGeometry();
            boundaryFacesGeometry.addAttribute( 'position', new THREE.BufferAttribute( facesCoordsVec, 3 ) );

            /*
            var boundaryFacesGeometry = new THREE.Geometry();

            for (var i = 0, numCoords = facesCoordsVec.length; i != numCoords; i+=3) {
                var v0 = new THREE.Vector3( facesCoordsVec[i+0],  facesCoordsVec[i+1], facesCoordsVec[i+2] );
                boundaryFacesGeometry.vertices.push(v0);
            }
            */

            var facesMaterial = new THREE.MeshBasicMaterial();

            facesMaterial.transparent = true;
            facesMaterial.color = params.color;
            facesMaterial.opacity = 0.1;
            facesMaterial.shading = THREE.FlatShading;
            facesMaterial.side = THREE.DoubleSide;

            //facesMaterial.polygonOffset = true;
            //facesMaterial.polygonOffsetFactor = -1.0;
            //facesMaterial.polygonOffsetUnits = -1.0;

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