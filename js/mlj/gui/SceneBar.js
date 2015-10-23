/**
 * MLJLib
 * MeshLabJS Library
 * 
 * Copyright(C) 2015
 * Paolo Cignoni 
 * Visual Computing Lab
 * ISTI - CNR
 * 
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See theGNU General Public License 
 * (http://www.gnu.org/licenses/gpl.txt) for more details.
 * 
 */

/**
 * @file Defines and installs the SceneBar widget 
 * @author Stefano Gabriele
 */
(function (component) {
    /**         
     * @class Create a new SceneBar widget
     * @augments  MLJ.gui.Widget
     * @private
     * @memberOf MLJ.gui.widget
     * @author Stefano Gabriele 
     */
    var _SceneBar = function () {

        var _toolBar = new component.ToolBar();
        var _dialog = new component.Dialog({
            title:"Save mesh", modal:true, draggable: false, resizable:false
        });
        
        var _html =  "<div id='mlj-save-dialog'><label for='filename'>Name:</label><br/>";
            _html += "<input id='filename' type='text'/>";
            _html += "<label for='extension'>Extension:</label><br/>";
            _html += "<select id='extension'>";
        
        var ext;
        for(var key in MLJ.core.File.SupportedExtensions) {
            ext = MLJ.core.File.SupportedExtensions[key];
            _html +="<option name='"+ext+"'>"+ext+"</option>";
        }       
         
        _html += "</select>";
        _html += "<div id='button-wrapper'><button id='mlj-save-dialog-button'>Save</button></div></div>";
        _dialog.appendContent(_html);

        function init() {

            var open = new component.FileButton({
                tooltip: "Open mesh file",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0049-folder-open.png",
                multiple: true
            });
                        

            var save = new component.Button({
                tooltip: "Save mesh file",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0099-floppy-disk.png"
            });
            
            MLJ.gui.disabledOnSceneEmpty(save);
            
            var reload = new component.Button({
                tooltip: "Reload mesh file",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0133-spinner11.png"
            });
                                                          
            MLJ.gui.disabledOnSceneEmpty(reload);
            //The reload button must be disalbed if the layer is created by a
            //creation filter
            // TODO change this to reflect the fact that layers created by a filter
            // now simply do not have the fileName field defined   
            MLJ.gui.disabledOnCppMesh(reload);

            var snapshot = new component.Button({
                tooltip: "Take snapshot",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0016-camera.png"
            });
            
            MLJ.gui.disabledOnSceneEmpty(snapshot);
            
            _toolBar.add(open, save, reload, snapshot);

            // SCENE BAR EVENT HANDLERS
            open.onChange(function (input) {
                MLJ.core.File.openMeshFile(input.files);
            });

            save.onClick(function () {
                var meshFile = MLJ.core.Scene.getSelectedLayer();
                //Name = meshInfo[0], extension = meshInfo[meshInfo.length-1]
                var meshInfo = meshFile.name.split(".");                
                _dialog.show();
                $('#mlj-save-dialog > #filename').val(meshInfo[0]);
                
                $('#mlj-save-dialog > #extension option[name=".'+meshInfo[meshInfo.length-1]+'"]')
                        .attr('selected','selected');
               
                $('#mlj-save-dialog-button').click(function() {                    
                    var name = $('#mlj-save-dialog > #filename').val();
                    var extension = $('#mlj-save-dialog > #extension').val();
                    MLJ.core.File.saveMeshFile(meshFile, name+extension);
                    _dialog.destroy();
                    $(this).off();
                });
            });                        

            reload.onClick(function () {
                var mf = MLJ.core.Scene.getSelectedLayer();
                MLJ.core.File.reloadMeshFile(mf);
            });

            snapshot.onClick(function () {                
                MLJ.core.Scene.takeSnapshot();
            });
                                             
        }
        
        /**
         * @author Stefano Gabriele         
         */
        this._make = function () {
            _toolBar.$.attr("id", "mlj-scenebar-widget");
            return _toolBar.$;
        };

        init();

        MLJ.gui.Widget.call(this);
    };

    MLJ.extend(MLJ.gui.Widget, _SceneBar);

    //Install widget
    MLJ.gui.installWidget("SceneBar", new _SceneBar());

})(MLJ.gui.component);
