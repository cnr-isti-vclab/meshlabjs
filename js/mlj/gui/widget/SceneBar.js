/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {
    MLJ.gui.widget.SceneBar = function () {

        var _toolBar = new component.ToolBar();

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

            var snapshot = new component.Button({
                tooltip: "Take snapshot",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0016-camera.png"
            });
            
            MLJ.gui.disabledOnSceneEmpty(snapshot);
            
            _toolBar.addButton(open, save, reload, snapshot);

            // SCENE BAR EVENT HANDLERS
            open.onChange(function (input) {
                MLJ.core.File.openMeshFile(input.files);
            });

            save.onClick(function () {
                console.log("Save button clicked");
            });

            reload.onClick(function () {
                var name = MLJ.gui.getWidget("LayersPane").getSelectedName();
                MLJ.core.File.reloadMeshFileByName(name);
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
