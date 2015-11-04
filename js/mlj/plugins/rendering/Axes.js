
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "Axes",
        tooltip: "Show world space axes",
        //icon: "",
        on: false,
        //loadShader: []
    });


    // TODO parameters
    var paramTest;
    plug._init = function (guiBuilder) {
        paramTest = guiBuilder.RangedFloat({
            label: "Test parameter",
            tooltip: "",
            min: 0, max: 10, step: 1,
            defval: 5,
            bindTo: "__test"
        });
    };

    // TODO custom mesh
    plug._applyTo = function (on) {
        if (on) {
            var bbox = scene.getBBox();
            scene.addSceneDecorator(plug.name, new THREE.AxisHelper(bbox.min.distanceTo(bbox.max)/2));
        } else {
            scene.removeSceneDecorator(plug.name);
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);