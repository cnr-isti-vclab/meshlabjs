
(function (plugin, gui, scene) {

    var plug = new plugin.Rendering("Ambient Light");

    plug._init = function (toolbar, accordEntry) {
        var light = gui.build.button.Toggle("", "on/off", "img/icons/light.png");
        toolbar.addButton(light);

        $(document).on(MLJ.events.Scene.SCENE_READY, function () {

            var color = gui.build.ColorPicker({
                onChange: function (hsb, hex) {
                    scene.lights.AmbientLight.setColor('#' + hex);
                },
                color: scene.lights.AmbientLight.DEFAULT_COLOR
            });

            accordEntry.appendContent(
                    gui.component.Grid(
                            gui.build.Label("Color"),
                            color));

            light.onToggle(function (on) {
                scene.lights.AmbientLight.setOn(on);
            });
        });

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);