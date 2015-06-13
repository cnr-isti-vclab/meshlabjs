MLJ.core.plugin = {
    types: {
        FILTER: 0,
        RENDERING: 1
    }
};

MLJ.core.plugin.Plugin = function (type, name) {
    this.type = type;
    this.name = name;
};

MLJ.core.plugin.Plugin.prototype = {
    getName: function () {
        return this.name;
    },
    //Function to extends
    _main: function () {
    }
};

MLJ.core.plugin.Filter = function (name) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.FILTER, name);
};

MLJ.core.plugin.Rendering = function (name) {
    MLJ.core.plugin.Plugin.call(this, MLJ.core.plugin.types.RENDERING, name);
};

//Pseudo inheritance
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Filter);
MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Rendering);

(function (widget) {

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

        var plugin, entry;
        while (ptr.hasNext()) {
            plugin = ptr.next();
            entry = new MLJ.gui.build.accordion.Entry(plugin.getName());
            if (plugin instanceof MLJ.core.plugin.Filter) {
                widget.TabbedPane.getFiltersAccord().addEntry(entry);
                plugin._main(entry);
            } else if (plugin instanceof MLJ.core.plugin.Rendering) {
                widget.TabbedPane.getRendAccord().addEntry(entry);
                plugin._main(widget.TabbedPane.getRendToolBar(), entry);
            }//else nothing to do
        }
    };

}).call(MLJ.core.plugin, MLJ.widget);//MLJ.widget contains GUI running widgets