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
            title: "Save mesh", modal: true, draggable: false, resizable: false
        });

        var _html = "<div id='mlj-save-dialog'><label for='filename'>Name:</label><br/>";
        _html += "<input id='filename' type='text'/>";
        _html += "<label for='extension'>Extension:</label><br/>";
        _html += "<select id='extension'>";

        var ext;
        for (var key in MLJ.core.File.SupportedExtensions) {
            ext = MLJ.core.File.SupportedExtensions[key];
            _html += "<option name='" + ext + "'>" + ext + "</option>";
        }

        _html += "</select>";
        _html += "Compress? <input name='zip' id='zipCheck' type='checkbox' value='1'>"
        _html += "<div id='button-wrapper'><button id='mlj-save-dialog-button'>Save</button></div></div>";
        _dialog.appendContent(_html);


        var _dialogUpload = new component.Dialog({
            title: "Upload mesh", modal: true, draggable: false, resizable: false
        });

        var _html = "<div id='mlj-upload-dialog'>";
        _html += "<br/><label for='website'>Website:</label> ";
        _html += "<select id='website' style='width: 150px; margin-left: 10px;'>";

        var ext;
        for (var key in MLJ.core.File.SupportedWebsites) {
            ext = MLJ.core.File.SupportedWebsites[key];
            _html += "<option name='" + ext + "'>" + ext + "</option>";
        }

        _html += "</select>";
        _html += "<div id='button-wrapper'><button id='mlj-upload-dialog-button'>Upload</button></div></div>";
        _dialogUpload.appendContent(_html);


        var _dialogCameraPosition = new component.Dialog({
            title: "Camera position", modal: true, draggable: false, resizable: false, width: 400
        });

        // This HTML basically contains a div for the dialog, a div with a label, a textarea, 
        // a div with an invisible error label, a div with a button
        var _html = "<div id='mlj-cameraPosition-dialog'>";
        _html += "<br/><div style='width: 70%; margin: 0 auto; '><div style='text-align: left; margin-left: 15px;> <label for='website'>Shift + C: copy current viewpoint</label></div> ";
        _html += "<br/><div style='text-align: left; margin-left: 15px; margin-top: -15px; margin-bottom: 5px;> <label for='website'>Shift + V: load saved viewpoint</label></div></div> ";
        _html += "<br/><div style='text-align: center;> <label for='website'>Camera Position as JSON</label></div> ";
        _html += "<textarea id='cameraJSON' style='width: 350px; height: 335px; margin-left: 10px; margin-top: 5px'>";
        _html += "</textarea>";
        _html += "<div id='errorMessageDiv' style='text-align: center;  margin-bottom: 5px; color: red; display:none>";
        _html += "<br/><label id='errorMessage' style='font-size: 60%; color: red;'>Wrong values or JSON not well formed</label>";
        _html += "</div>";
        _html += "<div id='button-wrapper' style='text-align: center; margin-top: 5px;'><button id='mlj-cameraPosition-dialog-button'>Confirm</button></div></div>";
        _dialogCameraPosition.appendContent(_html);


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
            MLJ.gui.disabledOnCreationFilterMesh(reload);

            var snapshot = new component.Button({
                tooltip: "Take snapshot",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0016-camera.png"
            });

            MLJ.gui.disabledOnSceneEmpty(snapshot);

            var deleteLayer = new component.Button({
                tooltip: "Delete current layer",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0173-bin.png"
            });

            var cameraPosition = new component.Button({
                tooltip: "Camera position",
                icon: "img/icons/viewpoint.png"
            });

            var resetTrackball = new component.Button({
                tooltip: "Reset trackball",
                icon: "img/icons/home.png"
            });

            var uploadToWebsite = new component.Button({
                tooltip: "Upload to website",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0199-upload2.png"
//                icon: "img/icons/upload-arrow.png"
            });
            //undo redo buttons
            var unDo = new component.Button({
                tooltip: "undo changes",
                icon: "img/icons/undo.png"
            });

            var reDo = new component.Button({
                tooltip: "redo changes",
                icon: "img/icons/redo.png"
            });
            var doc = new component.Button({
                tooltip: "Go to the documentation page",
                icon: "img/icons/question.png",
                right: true
            });

            var git = new component.Button({
                tooltip: "Go to the Github page",
                icon: "img/icons/github.png",
                right: true
            });

            MLJ.gui.disabledOnSceneEmpty(deleteLayer);
            MLJ.gui.disabledOnSceneEmpty(resetTrackball);
            MLJ.gui.disabledOnSceneEmpty(uploadToWebsite);
            MLJ.gui.disabledOnSceneEmpty(unDo);
            MLJ.gui.disabledOnSceneEmpty(reDo);
            MLJ.gui.disableOnNoHistory(unDo);

            /********** QUI DISABILITARE QUANDO NON C'è HISTORY / CREARE EVENTO *****************/

            _toolBar.add(open, save, uploadToWebsite, reload, cameraPosition, resetTrackball, snapshot, deleteLayer);
            _toolBar.add(doc, git);
            _toolBar.add(unDo, reDo);
            // SCENE BAR EVENT HANDLERS
            open.onChange(function (input) {
                MLJ.core.File.openMeshFile(input.files);
                
            });
            
            doc.onClick(function () {
                var win = window.open("./doc/html/", '_blank');
                win.focus();
            });
            git.onClick(function () {
                var win = window.open("https://github.com/cnr-isti-vclab/meshlabjs", '_blank');
                win.focus();
            });
            unDo.onClick(function ()
            {
                if (MLJ.core.Scene.timeStamp > 0) {
                    
                    var toUndo = MLJ.core.Scene.changeLayerList.pop();
                    
                    var layer=toUndo.getLayer();
                    var type=toUndo.getType();
                    if(type==MLJ.core.ChangeType.Creation)
                    {
                        MLJ.core.Scene.removeLayerByName(layer.name);
                    }
                    else if(type==MLJ.core.ChangeType.Deletion)
                    {
                        //da revisionare: trovare un modo per ripristinare il livello con la mesh
                        //idea: fare un pushstate sul livello prima e dopo la delete
                    }
                    else
                    {
                        MLJ.widget.Log.append("\n\nUndo in progress at time " + (MLJ.core.Scene.timeStamp) + " on layer " + layer.name);
                        layer.meshH.restoreState(MLJ.core.Scene.timeStamp, layer.ptrMesh());
                        MLJ.core.Scene.updateLayer(layer);
                    }
                    MLJ.core.Scene.timeStamp--;
                    $(document).trigger("Undo", MLJ.core.Scene.timeStamp);
                }
            });
            reDo.onClick(function ()
            {

            });
            save.onClick(function () {
                var layer = MLJ.core.Scene.getSelectedLayer();
                //Name = meshInfo[0], extension = meshInfo[meshInfo.length-1]
                var meshInfo = layer.name.split(".");
                _dialog.show();
                $('#mlj-save-dialog > #filename').val(meshInfo[0]);

                $('#mlj-save-dialog > #extension option[name=".' + meshInfo[meshInfo.length - 1] + '"]')
                        .attr('selected', 'selected');

                $('#mlj-save-dialog-button').click(function () {
                    var name = $('#mlj-save-dialog > #filename').val();
                    var extension = $('#mlj-save-dialog > #extension').val();
                    if ($('#mlj-save-dialog > #zipCheck').is(':checked')) {
//                        console.log("COMPRESS");
                        MLJ.core.File.saveMeshFileZip(layer, name + extension, name + ".zip");
                    } else {
//                        console.log("DO NOT COMPRESS");
                        MLJ.core.File.saveMeshFile(layer, name + extension);
                    }
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

            deleteLayer.onClick(function () {
                MLJ.core.plugin.Manager.executeLayerFilter("Layer Delete", MLJ.core.Scene.getSelectedLayer())
            })

            cameraPosition.onClick(function () {
                // Takes the camera position as JSON
                var cameraJSON = MLJ.core.Scene.takeCameraPositionJSON();

                // Shows the dialog
                _dialogCameraPosition.show();

                // Hides the error message
                $('#errorMessageDiv').hide();

                // Fills the text area with the JSON
                $('#cameraJSON').val(cameraJSON);

                // If button is clicked...
                $('#mlj-cameraPosition-dialog-button').click(function () {
                    // Takes the JSON as string
                    var cameraJSON = $('#cameraJSON').val();

                    // Sets the new camera position
                    var success = MLJ.core.Scene.setCameraPositionJSON(cameraJSON);

                    // If everything goes ok, close the dialog
                    if (success)
                    {
                        _dialogCameraPosition.destroy();
                        $(this).off();
                    }
                    // Otherwise, show the error message
                    else
                        $('#errorMessageDiv').show();
                });
            });


            resetTrackball.onClick(function () {
                MLJ.core.Scene.resetTrackball();
            })

            uploadToWebsite.onClick(function () {
                //TODO
                var layer = MLJ.core.Scene.getSelectedLayer();
                //Name = meshInfo[0], extension = meshInfo[meshInfo.length-1]
                var meshInfo = layer.name.split(".");
                _dialogUpload.show();
                $('#mlj-upload-dialog-button').click(function () {
                    var website = $('#mlj-upload-dialog > #website').val();

                    if (website === MLJ.core.File.SupportedWebsites["SKF"]) {

                        var sketchFabDialog = new component.Dialog({
                            title: "Upload to Sketchfab", modal: true, draggable: false, resizable: false
                        });

//                        sketchFabDialog.appendContent("<div id=prova> YOLO </div>");
                        var _html = "<div id='sketchfabUpload'>";
                        _html += "Extension: <select id='extension'>";

                        var ext;
                        for (var key in MLJ.core.File.SupportedSketchfabExtensions) {
                            ext = MLJ.core.File.SupportedSketchfabExtensions[key];
                            _html += "<option name='" + ext + "'>" + ext + "</option>";
                        }

                        _html += "</select>";
                        _html += " Compress? <input name='zip' id='zipCheck' type='checkbox' value='1'>"
                        _html += "<form id='the-form' action='https://api.sketchfab.com/v2/models' enctype='multipart/form-data'>";
//                        _html += "Upload your model file: <br> <input name='modelFile' type='file'> <br><br>";
                        _html += "<br> API Token: <input name='token' id='token' type='text'>";
                        _html += "<br><br> Model name: <p id='nameCounter'> 48 </p> <input name='name' id='name' type='text' maxlength='48'>";
                        _html += "<br><br> Model description: <p id='descriptionCounter'> 810 </p> <textarea name='description' id='description' rows='3' maxlength='810'></textarea>";
                        _html += "<br><br> Tags (space separated): <input name='tags' type='text'>";
                        _html += "<br><br> Private? (Pro only) <input name='private' id='private' type='checkbox' value='0'>";
                        _html += "<br><br> Password (Pro only): <p id='passwordCounter'> 64 </p> <input name='password' id='password' type='password' maxlength='64'>";
                        _html += "<br><br> <p> Max file size: Free 50 MB; Pro 200 MB; Business 500 MB</p>";
                        _html += "<input name='Submit' id='uploadButton' type='submit' value='Upload'></form>";
                        sketchFabDialog.appendContent(_html);
                        sketchFabDialog.show();

                        $('#sketchfabUpload #name').val(meshInfo[0]);
                        $('#sketchfabUpload #extension option[name=".' + meshInfo[meshInfo.length - 1] + '"]').attr('selected', 'selected');
                        $("#private").prop('checked', false);
                        $("#password").prop('disabled', false);
                        $("#private").change(function () {
                            if (this.checked) {
                                $("#password").prop('disabled', false);
                            } else {
                                $("#password").prop('disabled', true);
                            }
                        });

                        var characterCounter = function () {
                            var text_remaining = $(this).attr('maxLength') - $(this).val().length;
                            var counterId = $(this).attr('id') + "Counter";
                            if (text_remaining <= 10) {
                                $('#' + counterId).addClass("overflow");
                                $('#' + counterId).text(text_remaining);
                            } else {
                                $('#' + counterId).text(text_remaining);
                                $('#' + counterId).removeClass("overflow");
                            }
                        };

                        $('#name').keyup(characterCounter);
                        $('#nameCounter').text($('#name').attr('maxLength') - $('#name').val().length);
                        $('#description').keyup(characterCounter);
                        $('#password').keyup(characterCounter);

                        $('#uploadButton').prop('disabled', true);
                        $('#token').keyup(function () {
                            if ($(this).val().length <= 0) {
                                $('#uploadButton').prop('disabled', true);
                            } else {
                                $('#uploadButton').prop('disabled', false);
                            }
                        });

                        $('#the-form').submit(function (event) {
                            event.preventDefault();
                            var extension = $('#sketchfabUpload > #extension').val();
                            var zipBool = $('#sketchfabUpload > #zipCheck').is(':checked');
                            var statusUpdateDialog = new component.Dialog({title: "Upload to Sketchfab", modal: true, draggable: false, resizable: false});
                            _html = "<p style='display:inline'>Status:</p> <p id='status' style='display:inline'> </p>";
                            _html += "<div id='sketchfabProgressBar'> <div id='progressBar'> <div id='pBarLabel'>0%</div> </div> </div>"
                            _html += "<button id='exitUpdateButton' type='button'> Cancel </button>";
                            statusUpdateDialog.appendContent(_html);
                            statusUpdateDialog.show();

                            MLJ.core.File.uploadToSketchfab(layer, extension, zipBool, statusUpdateDialog);
                            sketchFabDialog.destroy();
                        });
                    }
                    _dialogUpload.destroy();
                    $(this).off();
                });
            })
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
