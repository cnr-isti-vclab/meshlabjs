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
 * @file Defines the basic class to create a filter plugin
 * @author Stefano Gabriele
 */


/**         
 * @class Creates a new filter
 * @description
 * This class provides the basic method for adding new processing functionalities
 * to meshlabjs. The main idea is that a filter is a kind of blackbox processing 
 * function that take in input meshes (eventually none) parameters and give back 
 * processed meshes. When you add a filter to meshlab it will end up in the filter 
 * list tab.
 * You have to redefine three functions:
 *  * the constructor
 *  * the {@link _init} where you define the parameters  
 *  * the {@link _applyTo} where you define the behaviour of the function 
 * @param {Object} parameters The object contains the initialization parameters 
 * to create filter plugin
 * 
 * <code> parameters = {<br>
 * &nbsp; name: //the name of filter<br> 
 * &nbsp; tooltip: //the filter description shown if mouse pointer is 
 * over its name<br>
 * &nbsp; arity: //An integer:<br>
 * &nbsp;&nbsp;&nbsp;&nbsp; //0 for a creation filter<br>
 * &nbsp;&nbsp;&nbsp;&nbsp; //-1 special value for the deletion filter, doesn't trigger 
 * &nbsp;&nbsp;&nbsp;&nbsp;      a layer update event
 * &nbsp;&nbsp;&nbsp;&nbsp; //1 for a generic single mesh filter, e.g. a filter 
 * &nbsp;&nbsp;&nbsp;&nbsp;     that takes a mesh, some parameters and modify just that single mesh. <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; //2 for a filter that take one or more mesh and/or create other layers.
 * &nbsp;&nbsp;&nbsp;&nbsp; //3 for a filter that works on all visible layers. 
 * 
 * defines its own meshes<br>
 * }
 * </code>
 * @memberOf MLJ.core.plugin 
 * @author Stefano Gabriele 
 * @example
 * <caption>Refine Filter</caption>
 * (function (plugin, scene) {
 *
 *      var filter = new plugin.Filter({
 *          name: "Refine",
 *          tooltip: "Apply a subdvision surface refinement step, using various approach (midpoint/loop)",
 *          arity: 1
 *      });
 *
 *      var iterWdg;
 *      filter._init = function (builder) {
 *
 *          iterWdg = builder.Integer({
 *              max: 5, min: 1, step: 1, defval: 1,
 *              label: "Step",
 *              tooltip: "How many refinement iterations are applied to the mesh"
 *          });
 *
 *      };
 *
 *      filter._applyTo = function (layer) {
 *          Module.RefineMesh(layer.ptrMesh,iterWdg.getValue());
 *      };
 *
 *      plugin.install(filter);
 *
 * })(MLJ.core.plugin, MLJ.core.Scene);
 */

MLJ.core.plugin.Filter = function (parameters) {

    MLJ.core.plugin.Plugin.call(this, parameters.name, parameters);
    var _this = this;

    var entry = new MLJ.gui.component.AccordionEntry(
            {label: parameters.name, tooltip: parameters.tooltip});

    //Test if arity is number and is integer
    if (!(Math.floor(parameters.arity) === parameters.arity &&
            jQuery.isNumeric(parameters.arity))) {
        parameters.arity = 1;
    }

    var filterBuilder = new MLJ.core.plugin.GUIBuilder(entry);

    $(document).on("mljSearchSelect", function (ev, select) {
        var found = false;
        var tooltipMatch, nameMatch;
        for (var i = 0, m = select.length; i < m; i++) {

            tooltipMatch = parameters.tooltip
                    ? parameters.tooltip.indexOf(select[i]) != -1 : false;

            nameMatch = parameters.name.indexOf(select[i]) != -1;

            if (nameMatch || tooltipMatch) {
                entry.show();
                found = true;
                //exit from for cycle
                i = select.length;
            }
        }

        if (!found) {
            entry.hide();
        }

        //MLJ.widget.TabbedPane.getFiltersAccord().refresh();
    });

    this._main = function () {
        MLJ.widget.TabbedPane.getFiltersAccord().addEntry(entry);

        var apply = new MLJ.gui.component.Button({
            tooltip: "Apply to selected layer",
            icon: "img/icons/apply.png",
        });

        entry.addHeaderButton(apply);
        apply.onClick(function () {
            //reset of all the boolean CalledPtrMesh and clear of the mesh history after the current time
            var layersIt = MLJ.core.Scene.getLayers().iterator();
            while (layersIt.hasNext())
            {
                var layerTmp = layersIt.next();
                layerTmp.resetCalledPtrMesh();
                layerTmp.cppMesh.Clear(MLJ.core.Scene.timeStamp);
            }
            //clear of the history of changes after current time
            for (var i = MLJ.core.Scene.timeStamp+1; i < MLJ.core.Scene.layerSetHistory.length; i++)
                MLJ.core.Scene.layerSetHistory.pop();
            var t0 = performance.now();
            switch (_this.parameters.arity)
            {
                case 0:
                case 3:
                    _this._applyTo();
                    break;
                case -1:
                case 1:
                case 2:
                    _this._applyTo(MLJ.core.Scene.getSelectedLayer());
                    break;
                default:
                    alert("Error filter");
            }
            var t1 = performance.now();
            MLJ.core.Scene.updateLayer(MLJ.core.Scene.getSelectedLayer());
            //if the scene was empty, we add an empty layerset to the history of the scene to make it possible to go back at the initial state
            if(MLJ.core.Scene.layerSetHistory.length==0)
                MLJ.core.Scene.layerSetHistory[MLJ.core.Scene.timeStamp++]=new MLJ.util.AssociativeArray();
            //push of the actual state at the current time, duplicating the current layer list
            MLJ.core.Scene.layerSetHistory[MLJ.core.Scene.timeStamp]=new Array(MLJ.core.Scene.getLayers().duplicate(),MLJ.core.Scene.getSelectedLayer());
            layersIt = MLJ.core.Scene.layerSetHistory[MLJ.core.Scene.layerSetHistory.length - 1][0].iterator(); //we iterate on all the actual layers
            //and push the state of all the modified layers
            while (layersIt.hasNext())
            {
                var layerTmp = layersIt.next();
                if (layerTmp.getCalledPtrMesh())
                    layerTmp.cppMesh.pushState(MLJ.core.Scene.timeStamp);
            }
            MLJ.core.Scene.timeStamp++;
            //trigger button events
            $(document).trigger("Redo", MLJ.core.Scene.timeStamp);
            $(document).trigger("Undo", MLJ.core.Scene.timeStamp-1);
            MLJ.widget.Log.append(_this.name + " execution time " + Math.round(t1 - t0) + " ms");
        });

        if (parameters.arity !== 0) {
            MLJ.gui.disabledOnSceneEmpty(apply);
        }


        _this._init(filterBuilder);

    };
};

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Filter);
