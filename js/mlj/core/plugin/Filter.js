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
 * to create filter plugin<br>
 * <code> parameters = {<br>
 * &nbsp; name: //the name of filter<br> 
 * &nbsp; tooltip: //the filter description shown if mouse pointer is 
 * over its name<br>
 * &nbsp; arity: //An integer:<br>
 * &nbsp;&nbsp;&nbsp;&nbsp; //0 for a creation filter<br>
 * &nbsp;&nbsp;&nbsp;&nbsp; //1 for a generic filter <br>
 * &nbsp;&nbsp;&nbsp;&nbsp; //>1 if the filter doesn't use the current mesh but 
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
 *      filter._applyTo = function (meshFile) {
 *          Module.RefineMesh(meshFile.ptrMesh,iterWdg.getValue());
 *          scene.updateLayer(meshFile);
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

        MLJ.widget.TabbedPane.getFiltersAccord().refresh();
    });

    this._main = function () {
        MLJ.widget.TabbedPane.getFiltersAccord().addEntry(entry);

        var apply = new MLJ.gui.component.Button({
            tooltip: "Apply to selected layer",
            icon: "img/icons/apply.png",
        });

        entry.addHeaderButton(apply);

        apply.onClick(function () {
            var meshFile = MLJ.core.Scene.getSelectedLayer();
            var t0 = performance.now();
            _this._applyTo(meshFile);
            var t1 = performance.now();
            MLJ.widget.Log.append(_this.name + " execution time " + Math.round(t1 - t0) + " ms");
        });

        if (parameters.arity > 0) {
            MLJ.gui.disabledOnSceneEmpty(apply);
        }

        if (parameters.arity === 1) {
            var applyAll = new MLJ.gui.component.Button({
                tooltip: "Apply to all visible layers",
                icon: "img/icons/apply_all.png",
            });
            entry.addHeaderButton(applyAll);

            MLJ.gui.disabledOnSceneEmpty(applyAll);

            applyAll.onClick(function () {
                var ptr = MLJ.core.Scene.getLayers().iterator();
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

MLJ.extend(MLJ.core.plugin.Plugin, MLJ.core.plugin.Filter);