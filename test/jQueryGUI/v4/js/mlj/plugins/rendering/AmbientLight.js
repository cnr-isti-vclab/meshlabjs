
(function (plugin, gui, scene) {

    var plug = new plugin.Rendering("Ambient Light");

    plug._main = function (toolbar, accordEntry) {
        var light = gui.build.button.Toggle("", "on/off", "../icons/light.png");
        toolbar.addButton(light);
        
        console.log(scene._AmbientLight);
        
        var color = gui.build.ColorPicker({
            onChange: function (hsb, hex) {
                scene._AmbientLight.setColor('#' + hex);
            }            
        });        

        accordEntry.appendContent(
                gui.component.Grid(
                        gui.build.Label("Color"),
                        color));


        light.onToggle(function (on) {
            scene._AmbientLight.setOn(on);
        });

    };

    plugin.install(plug);

})(MLJ.core.plugin, MLJ.gui, MLJ.core.Scene);