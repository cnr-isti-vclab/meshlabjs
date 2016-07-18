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
 * @file Defines the functions to manage and install plugins
 * @author Stefano Gabriele
 */

/**
 * MLJ.core.plugin.Manager
 * @author Stefano Gabriele
 */
MLJ.core.plugin.Manager = {
};

(function (widget, gui) {

    var _filters = new MLJ.util.AssociativeArray();
    var _rendering = new MLJ.util.AssociativeArray();
    var _texture = new MLJ.util.AssociativeArray();

    /**
     * Installs a new plugin in MeshLabJS
     * @memberOf MLJ.core.plugin
     * @author Stefano Gabriele
     * It performs two tasks:
     *  * add the filter/rendering plugin in the corresponding
     *    list of plugins. 
     *  * add the name and the tooltip string to the set of string to be searched
     */
    this.install = function () {
        var plugin;
        var search = MLJ.gui.getWidget("SearchTool");
        for (var i = 0; i < arguments.length; i++) {
            plugin = arguments[i];
            if (plugin instanceof MLJ.core.plugin.Plugin) {
                if (plugin instanceof MLJ.core.plugin.Filter) {
                    _filters.set(plugin.getName(), plugin);
                    search.addItem(plugin.getName());
                    if(plugin.parameters.tooltip) {
                        search.addItem(plugin.parameters.tooltip);
                    }
                } else if (plugin instanceof MLJ.core.plugin.BaseRendering) {
                    _rendering.set(plugin.getName(), plugin);
                } else if (plugin instanceof MLJ.core.plugin.Texturing){
                    _texture.set(plugin.getName(), plugin);                    
                }
            } else {
                console.error("The parameter must be an instance of MLJ.core.Plugin");
            }
        }
    };

    /**
     * Executes the main entry point function for all installed plugins
     * It is called only in the index.html after loading all the js plugins
     * to perform all the proper initialization and GUI setup 
     * (e.g. it will call for each plugin the _init())
     * @memberOf MLJ.core.plugin
     * @author Stefano Gabriele
     */
    this.run = function () {
        
        //sort filters in alphabetical order
        _filters.sortByKey();
        
        var ptr = _filters.iterator();        
        while (ptr.hasNext()) {
            ptr.next()._main();
        }

        ptr = _rendering.iterator();
        while (ptr.hasNext()) {
            ptr.next()._main();
        }
        
        ptr = _texture.iterator();
        while (ptr.hasNext()) {
            ptr.next()._main();
        }

    };

    this.getRenderingPlugins = function () {    
        return _rendering;
    };

    this.getFilterPlugins = function () {
        return _filters;
    };
    
     /**
     * Executes a Creation Filter. 
     * 
     * It is used only at startup to start a creation filter. 
     * @memberOf MLJ.core.plugin
     */
    this.executeCreateFilter = function (filterName) {
        filterHandle = _filters.getByKey(filterName);
        if(filterHandle === undefined )
        {
            console.log("Filter is not defined: "+filterName+"\n");
        }
        else
        {
            console.log("Executing filter "+filterName+"\n");  
            filterHandle._applyTo();
        }
    };

     /**
     * Executes a Layer Filter. 
     * 
     * It is used only at startup to start a filter and currently works and, 
     * currently, it is meaningful only for creation filters. 
     * To be extended in the future to a more reasonable 
     * minimal script-like approach...
     * @memberOf MLJ.core.plugin
     */
    this.executeLayerFilter = function (filterName, currentLayer) {
        filterHandle = _filters.getByKey(filterName);
        if(filterHandle === undefined )
        {
            console.log("Filter is not defined: "+filterName+"\n");
        }
        else
        {
            console.log("Executing filter "+filterName+" on layer " + currentLayer.name + "\n");  
            filterHandle._applyTo(currentLayer);
        }
    };


}).call(MLJ.core.plugin.Manager, MLJ.widget, MLJ.gui);//MLJ.widget contains GUI running widgets