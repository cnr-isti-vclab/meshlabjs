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

        var open = new gui.Button("open", "Open mesh file", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0049-folder-open.png");

        var save = new gui.Button("save", "Save mesh file", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0099-floppy-disk.png");

        var reload = new gui.Button("reload", "Reload mesh file", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0133-spinner11.png");

        var snapshot = new gui.Button("snapshot", "Take snapshot", "",
                "../icons/IcoMoon-Free-master/PNG/48px/0016-camera.png");

        gui.SceneBar.addButton(open, save, reload, snapshot);

// SCENE BAR EVENT HANDLER _____________________________________________________

        open.jQueryButton().click(function () {
            console.log("Open button clicked");
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

//    function initLogo() {
//        var pip = new gui.PiP(600, 100);
//        var logo = '<img id="logo" src="../../../img/vcglogo200609_1024px.png">';        
//        pip.appendContent(logo);
//        $(document).ready(function () {
//            $('body').append(pip.jQuery());
//        });
//    }

    initSceneBar();
    initSearchTool();
    initTabbedPane();

})(MLJ, MLJ.gui);