
(function (plugin, core, scene) {

    var plug = new plugin.Rendering({
        name: "Box",
        tooltip: "Box Tooltip",
        icon: "img/icons/box.png",
        toggle: true,
        on: false
    });

	plug._init = function (guiBuilder) {

        };

    plug._applyTo = function (meshFile, on) {
        if (on == false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        var geom = meshFile.getThreeMesh().geometry.clone();

        var bbox = new THREE.BoxHelper(meshFile.getThreeMesh());

        scene.addOverlayLayer(meshFile, plug.getName(), bbox);
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);