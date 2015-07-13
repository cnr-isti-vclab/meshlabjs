/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {
    MLJ.gui.widget.SceneBar = function () {

        var _toolBar = new component.ToolBar();

        function init() {

            var open = new component.FileButton("", "Open mesh file",
                    "../icons/IcoMoon-Free-master/PNG/48px/0049-folder-open.png");

            open.multiple();

            var save = new component.Button("", "Save mesh file",
                    "../icons/IcoMoon-Free-master/PNG/48px/0099-floppy-disk.png");

            var reload = new component.Button("", "Reload mesh file",
                    "../icons/IcoMoon-Free-master/PNG/48px/0133-spinner11.png");

            var snapshot = new component.Button("", "Take snapshot",
                    "../icons/IcoMoon-Free-master/PNG/48px/0016-camera.png");

            _toolBar.addButton(open, save, reload, snapshot);

            // SCENE BAR EVENT HANDLERS
            open.onChange(function (input) {
                $(input.files).each(function (key, value) {
                    var mesh = MLJ.core.File.openMeshFile(value);

                    if (mesh === false) {
                        console.log(MLJ.getLastError().message);
                    }

                });
            });

            save.onClick(function () {
                console.log("Save button clicked");
            });

            reload.onClick(function () {
                console.log("Reload button clicked");
            });

            snapshot.onClick(function () {
                console.log("Snapshot button clicked");
            });

        }

        this._make = function () {
            _toolBar.$.attr("id", "mlj-scenebar-widget");
            return _toolBar.$;
        };

        init();

        MLJ.gui.widget.Widget.call(this);
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.SceneBar);

    //Install widget
    MLJ.gui.installWidget("SceneBar", new MLJ.gui.widget.SceneBar());

})(MLJ.gui.component);
