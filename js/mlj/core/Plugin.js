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

MLJ.core.plugin.Filter = function (name, tooltip, singleArity) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.FILTER, name, tooltip, singleArity);
    var _this = this;

    var entry = new MLJ.gui.build.accordion.Entry(
            {
                label: name,
                tooltip: tooltip
            });

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

    var filterBuilder = {
        Float: function (flags) {
            var float = new MLJ.gui.MLWidget.Float(flags);
            entry.appendContent(float._make());
            return float;
        },
        Integer: function (flags) {
            var integer = new MLJ.gui.MLWidget.Integer(flags);
            entry.appendContent(integer._make());
            return integer;
        },
        Bool: function (flags) {
            var bool = new MLJ.gui.MLWidget.Bool(flags);
            entry.appendContent(bool._make());
            return bool;
        }
    };

    this._main = function () {
        MLJ.widget.TabbedPane.getFiltersAccord().addEntry(entry);

        var apply = MLJ.gui.build.button.Button("", "Apply to selected layer"
                , "img/icons/IcoMoon-Free-master/PNG/48px/0285-play3.png");
        entry.addHeaderButton(apply);

        apply.onClick(function () {
            var meshFile = MLJ.core.Scene.getSelectedLayer();
            _this._applyTo(meshFile);
        });

        if (_this.singleArity === false) {
            var applyAll = MLJ.gui.build.button.Button("", "Apply to all visible layers",
                    "img/icons/IcoMoon-Free-master/PNG/48px/0289-forward3.png");
            entry.addHeaderButton(applyAll);

            applyAll.onClick(function () {
                var ptr = MLJ.core.Scene.getLayers().pointer();
                var layer;
                while (ptr.hasNext()) {
                    layer = ptr.next();
                    if (layer.getThreeMesh().visible) {
                        _this._applyTo(layer);
                    }
                }
            });
        }

        _this._init(filterBuilder);
    };
};

MLJ.core.plugin.Rendering = function (name, singleArity) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.RENDERING, name, singleArity);
    var _this = this;

    this._main = function () {
        var entry = new MLJ.gui.build.accordion.Entry(_this.getName());
        MLJ.widget.TabbedPane.getRendAccord().addEntry(entry);
        _this._init(MLJ.widget.TabbedPane.getRendToolBar(), entry);
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