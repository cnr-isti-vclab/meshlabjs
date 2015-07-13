
(function (plugin, gui) {

    //TODO Check if plugin is defined ...
    var plug = new plugin.Rendering("Ambient Light");

    plug._main = function (toolbar, accordion) {
        var light = new gui.Button("save", "Save mesh file", "",
                "../icons/light.png");

        toolbar.addButton(light);

        var ent = new gui.AccordionEntry("ciccio", "CICCIONE");
        accordion.addItem(ent);
    };

    plugin.install(plug);

})(MLJ.core.Plugin, MLJ.gui);