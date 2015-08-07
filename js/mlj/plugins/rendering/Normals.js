
(function (plugin, core, scene) {

    const BOTH_NORMALS = 0,
          FACE_NORMALS = 1,
          VERTEX_NORMALS = 2;

    const NORMAL_SIZE_MIN = 0.01,
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
        on: false
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
                            overlay.faceNormals.material.color = color;
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
                    overlay.faceNormals.size = size;
                    overlay.faceNormals.update();
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
                    overlay.vertexNormals.material.color = color;
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
                    overlay.vertexNormals.size = size;
                    overlay.vertexNormals.update();
                    scene.render();
                };
                bindToFun.toString = function () { return 'normalVertexSize'; }
                return bindToFun;
            }())
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }
        
        var params = meshFile.overlaysParams.getByKey(plug.getName());
        var mesh = meshFile.getThreeMesh();

        mesh.geometry.computeFaceNormals();
        mesh.geometry.computeVertexNormals();

        var normals = new THREE.Mesh();

        var faceNormals = new THREE.FaceNormalsHelper(mesh,
                                            params.normalFaceSize,
                                            params.normalFaceColor,
                                            1);


        var vertexNormals = new THREE.VertexNormalsHelper(mesh,
                                            params.normalVertexSize,
                                            params.normalVertexColor,
                                            1);

        normals.add(faceNormals);
        normals.add(vertexNormals);
        normals.faceNormals = faceNormals;
        normals.vertexNormals = vertexNormals;

        switch (normalTypeWidget.getValue()) {
            case BOTH_NORMALS:
                break;

            case FACE_NORMALS:
                normals.vertexNormals.visible = false;
                break;

            case VERTEX_NORMALS:
                normals.faceNormals.visible = false;
                break;
        }

        scene.addOverlayLayer(meshFile, plug.getName(), normals);

    };


    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);