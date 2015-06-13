
MLJ.core.PluginTypes = {
    FILTER: 0,
    RENDERING: 1
};


MLJ.core.Plugin = function (type, name) {
    this.type = type;
    this.name = name;
};

MLJ.core.Plugin.prototype = {
    getName: function () {
        return this.name;
    },
    //Function to extends
    _main: function () {
    }
};

MLJ.core.Plugin.Filter = function () {
    MLJ.core.Plugin.call(MLJ.core.Plugin.FILTER);
};

MLJ.core.Plugin.Rendering = function () {
    MLJ.core.Plugin.call(MLJ.core.Plugin.RENDERING, name);
};

//Pseudo inheritance
MLJ.extend(MLJ.core.Plugin, MLJ.core.Plugin.Filter);
MLJ.extend(MLJ.core.Plugin, MLJ.core.Plugin.Rendering);


(function () {

    var _plugins = new MLJ.util.AssociativeArray();

    this.install = function () {
        var plugin;
        for (var i = 0; i < arguments.length; i++) {
            plugin = arguments[i];
            if (plugin instanceof MLJ.core.Plugin) {
                _plugins.set(plugin.getName(), plugin);
            } else {
                console.error("The parameter must be an instance of MLJ.core.Plugin");
            }
        }
    };

    this.run = function () {
        var ptr = _plugins.pointer();

        var plugin;
        while (ptr.hasNext()) {
            plugin = ptr.next();
            if (plugin instanceof MLJ.core.Plugin.Filter) {
                plugin._main(MLJ.gui.TabbedPane.filtersAccordion());
            } else if (plugin instanceof MLJ.core.Plugin.Rendering) {
                plugin._main(MLJ.gui.TabbedPane.renderingToolbar(),
                        MLJ.gui.TabbedPane.renderingAccordion());
            }//else nothing to do

        }
    };

}).call(MLJ.core.Plugin);