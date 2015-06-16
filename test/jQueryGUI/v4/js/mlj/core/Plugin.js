MLJ.core.plugin = {
    types: {
        FILTER: 0,
        RENDERING: 1
    }
};

MLJ.core.plugin.Plugin = function (type, name, singleArity) {
    this.type = type;
    this.name = name;
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

MLJ.core.plugin.Filter = function (name, singleArity) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.FILTER, name, singleArity);
    var _this = this;

    this._main = function () {
        var entry = new MLJ.gui.build.accordion.Entry(_this.getName());
        MLJ.widget.TabbedPane.getFiltersAccord().addEntry(entry);

        var apply = MLJ.gui.build.button.Button("Apply", "Apply ");
        entry.addHeaderButton(apply);

        apply.onClick(function () {
            var meshFile = MLJ.core.Scene.getSelectedLayer();
            _this._applyTo(meshFile);
        });

        if (_this.singleArity === false) {
            var applyAll = MLJ.gui.build.button.Button("Apply all", "Apply to");
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

        _this._init(entry);
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

//Pseudo inheritance
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Filter);
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Rendering);

(function (widget, gui) {

    var _plugins = new MLJ.util.AssociativeArray();

    this.install = function () {
        var plugin;
        for (var i = 0; i < arguments.length; i++) {
            plugin = arguments[i];
            if (plugin instanceof MLJ.core.plugin.Plugin) {
                _plugins.set(plugin.getName(), plugin);
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