
(function (plugin, core, scene) {

    var plug = new plugin.Rendering({
        name: "Box",
        tooltip: "Box Tooltip",
        icon: "img/icons/box.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: true
    });

    plug._init = function (guiBuilder) {

    };

    plug._applyTo = function (meshFile, on) {
        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }       

        // bounding box helper
        var bbHelper = new THREE.BoundingBoxHelper(meshFile.getThreeMesh(), 0xffffff);
        bbHelper.update();

        var bbox = new THREE.BoxHelper(bbHelper);
        bbox.update(meshFile.getThreeMesh());

        scene.addOverlayLayer(meshFile, plug.getName(), bbox);
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);