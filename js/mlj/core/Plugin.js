MLJ.core.plugin = {
    types: {
        FILTER: 0,
        RENDERING: 1
    }
};

MLJ.core.plugin.Plugin = function (type, name, tooltip, singleArity) {
    this.type = type;
    this.name = name;
    this.tooltip = tooltip;
    this.singleArity = singleArity;
};

MLJ.core.plugin.Plugin.prototype = {
    getName: function () {
        return this.name;
    },
    _init: function () {
    },
    _applyTo: function (meshFile) {
    },
    _main: function () {
    }
};

MLJ.core.plugin.GUIBuilder = function (entry) {
    this.Float = function (flags) {
        var float = new MLJ.gui.MLWidget.Float(flags);
        entry.appendContent(float._make());
        return float;
    };
    this.Integer = function (flags) {
        var integer = new MLJ.gui.MLWidget.Integer(flags);
        entry.appendContent(integer._make());
        return integer;
    };
    this.Bool = function (flags) {
        var bool = new MLJ.gui.MLWidget.Bool(flags);
        entry.appendContent(bool._make());
        return bool;
    };
    this.Choice = function (flags) {
        var choice = new MLJ.gui.MLWidget.Choice(flags);
        entry.appendContent(choice._make());
        return choice;
    };
    this.Color = function (flags) {
        var color = new MLJ.gui.MLWidget.Color(flags);
        entry.appendContent(color._make());
        return color;
    };
};

MLJ.core.plugin.ToolBarBuilder = function (tb) {
    this.Toggle = function (flags) {
        var toggle = MLJ.gui.build.button.Toggle(flags);
        tb.addButton(toggle);
        return toggle;
    };
};

MLJ.core.plugin.Filter = function (name, tooltip, singleArity, responsive) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.FILTER, name, tooltip, singleArity);
    var _this = this;

    var entry = new MLJ.gui.build.accordion.Entry(
            {label: name, tooltip: tooltip});

    var filterBuilder = new MLJ.core.plugin.GUIBuilder(entry);

    $(document).on("mljSearchSelect", function (ev, select) {
        var found = false;

        for (var i = 0, m = select.length; i < m; i++) {

            if (name.includes(select[i])) {
                entry.show();
                found = true;
                //exit from for cycle
                i = select.length;
            }
        }

        if (!found) {
            entry.hide();
        }

        MLJ.widget.TabbedPane.getFiltersAccord().refresh();
    });

    this._main = function () {
        MLJ.widget.TabbedPane.getFiltersAccord().addEntry(entry);

        var apply = MLJ.gui.build.button.Button({
            tooltip: "Apply to selected layer",
            icon: "img/icons/IcoMoon-Free-master/PNG/48px/0285-play3.png",            
        });

        entry.addHeaderButton(apply);

        apply.onClick(function () {
            var meshFile = MLJ.core.Scene.getSelectedLayer();
            var t0 = performance.now();
            _this._applyTo(meshFile);
            var t1 = performance.now();
            MLJ.widget.Log.append(name + " exectution time " + Math.round(t1 - t0) + " ms");
        });

        if (responsive !== false) {
            MLJ.gui.makeResponsiveToScene(apply);
        }

        if (_this.singleArity === false) {
            var applyAll = MLJ.gui.build.button.Button({
                tooltip: "Apply to all visible layers",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0289-forward3.png",                
            });
            entry.addHeaderButton(applyAll);

            if (responsive !== false) {
                MLJ.gui.makeResponsiveToScene(applyAll);
            }

            applyAll.onClick(function () {
                var ptr = MLJ.core.Scene.getLayers().pointer();
                var layer;
                var t0 = performance.now();
                while (ptr.hasNext()) {
                    layer = ptr.next();
                    if (layer.getThreeMesh().visible) {
                        _this._applyTo(layer);
                    }
                }
                var t1 = performance.now();
                MLJ.widget.Log.append(name + " exectution time " + Math.round(t1 - t0) + " ms");
            });
        }

        _this._init(filterBuilder);
    };
};

MLJ.core.plugin.Rendering = function (name, tooltip) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.RENDERING, name);
    var _this = this;
    var entry = new MLJ.gui.build.accordion.Entry(
            {label: name, tooltip: tooltip});

    var guiBuilder = new MLJ.core.plugin.GUIBuilder(entry);
    var tbBuilder = new MLJ.core.plugin.ToolBarBuilder(
            MLJ.widget.TabbedPane.getRendToolBar()
            );

    this._main = function () {
        MLJ.widget.TabbedPane.getRendAccord().addEntry(entry);
        _this._init(tbBuilder, guiBuilder);
    };
};

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Filter);
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Rendering);

(function (widget, gui) {

    var _plugins = new MLJ.util.AssociativeArray();

    this.install = function () {
        var plugin;
        var search = MLJ.gui.getWidget("SearchTool");
        for (var i = 0; i < arguments.length; i++) {
            plugin = arguments[i];
            if (plugin instanceof MLJ.core.plugin.Plugin) {
                _plugins.set(plugin.getName(), plugin);
                search.addItem(plugin.getName());
            } else {
                console.error("The parameter must be an instance of MLJ.core.Plugin");
            }
        }
    };

    this.run = function () {
        var ptr = _plugins.pointer();
        while (ptr.hasNext()) {
            ptr.next()._main();
        }
    };

}).call(MLJ.core.plugin, MLJ.widget, MLJ.gui);//MLJ.widget contains GUI running widgets