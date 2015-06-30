
(function (plugin, core, scene) {

    var plug = new plugin.Rendering({
        name: "Normals",
        tooltip: "Normals Tooltip",
        icon: "img/icons/normal.png",
        toggle: true,
        on: false
    });



    plugin.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);