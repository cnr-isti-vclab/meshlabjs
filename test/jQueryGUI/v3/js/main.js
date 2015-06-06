/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (mlj, gui) {

    if (typeof mlj === 'undefined') {
        console.error("MLJ module needed.");
    }

    if (typeof gui === 'undefined') {
        console.error("MLJ.gui module needed.");
    }

    function initSceneBar() {

        var open = new gui.FileButton("open", "Open mesh file", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0049-folder-open.png");

        open.multiple();

        var save = new gui.Button("save", "Save mesh file", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0099-floppy-disk.png");

        var reload = new gui.Button("reload", "Reload mesh file", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0133-spinner11.png");

        var snapshot = new gui.Button("snapshot", "Take snapshot", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0016-camera.png");

        gui.SceneBar.addButton(open, save, reload, snapshot);

// SCENE BAR EVENT HANDLER _____________________________________________________

        open.jQueryFile().change(function () {
            var files = $(this)[0].files;

            $(files).each(function (key, value) {
                var mesh = MLJ.core.File.openMeshFile(value);

                if (mesh === false) {
                    console.log(MLJ.getLastError().message);
                }

            });
        });

        save.jQueryButton().click(function () {
            console.log("Save button clicked");
        });

        reload.jQueryButton().click(function () {
            console.log("Reload button clicked");
        });

        snapshot.jQueryButton().click(function () {
            console.log("Snapshot button clicked");
        });

    }

    function initSearchTool() {
        //INIZIALIZZARE CON PLUGINS INFO ...
        var tags = [new gui.SearchElement("c++", function () {
                console.log("c++ handler");
            }), new gui.SearchElement("c", function () {
                console.log("c handler");
            }), new gui.SearchElement("java", function () {
                console.log("java handler");
            })];

        gui.SearchTool.addTag.apply(null, tags);
    }

    function initTabbedPane() {
        var filterTab = new gui.Tab("Filters",
                "<p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br><p>Contenuto filtri</p><br>");
        var renderingTab = new gui.Tab("Rendering", "<p>Contenuto Rendering</p>");

        gui.TabbedPane.addTab(filterTab, renderingTab);
    }

    function initEventHandlers() {
        //On new mesh added
        $(document).on(MLJ.events.Scene.LAYER_ADDED,
                function (event, mesh) {
                    //Add item to layers pane widget
                    MLJ.gui.LayersPane.addLayer(mesh.name);

                    //Clear info area
                    MLJ.gui.Info.clear();

                    //Add mesh info to info widget
                    MLJ.gui.Info.append("Current Mesh: " + mesh.name);
                    MLJ.gui.Info.append("Vertices: " + mesh.VN);
                    MLJ.gui.Info.append("Faces: " + mesh.FN);
                });

        $(document).on(MLJ.events.Scene.LAYER_SELECTED,
                function (event, mesh) {
                    
                    //Clear info area
                    MLJ.gui.Info.clear();
                    
                    //Add mesh info to info widget
                    MLJ.gui.Info.append("Current Mesh: " + mesh.name);
                    MLJ.gui.Info.append("Vertices: " + mesh.VN);
                    MLJ.gui.Info.append("Faces: " + mesh.FN);

                });
    }

    initSceneBar();
    initSearchTool();
    initTabbedPane();

    initEventHandlers();

})(MLJ, MLJ.gui);