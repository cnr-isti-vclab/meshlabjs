
(function (plugin, gui, scene, file) {

    //TODO Check if plugin is defined ...
    var filter = new plugin.Filter("Smooth");

    function smooth() {
        var meshFile = scene.getSelectedLayer();
        scene.removeLayerByName(meshFile.name);
        console.time("Smooth time ");
        Module.Smooth(meshFile.ptrMesh, 1);
        console.timeEnd("Smooth time ");
        console.time("Update mesh ");
        meshFile.updateThreeMesh();        
//        if (!statusVisible)
//            mlRender.hideMeshByName(fileNameGlobal);
        console.timeEnd("Update mesh ");
        scene.addLayer(meshFile);

    }

    filter._main = function (accordion) {

        var $label = $('<label for="smooth-spinner">Smooth step:</label>');
        $label.css({marginRight: "10px"});
        var $spinner = $('<input id="smooth-spinner">');
        $spinner.css({width: "25px"});

        var $btn = (new gui.Button("smooth-btn", "Smooth mesh", "Apply")).jQueryButton();
        $btn.css({marginLeft: "5px"});

        var ent = new gui.AccordionEntry("Smooth");
        ent.add($label).add($spinner).add($btn);

        accordion.addItem(ent);

        $btn.click(function () {
            smooth();
        });
    };

    $(window).load(function () {
        $('#smooth-spinner').spinner({
            max: 5,
            min: 1
        });

        $('#smooth-spinner').spinner("value", 1);

        $("#smooth-btn").button();

    });

    plugin.install(filter);

})(MLJ.core.Plugin, MLJ.gui, MLJ.core.Scene, MLJ.core.File);