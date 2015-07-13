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

   
    initSceneBar();
    initSearchTool();    

})(MLJ, MLJ.gui);