
(function(plugin, core, scene) {

    var DEFAULTS = {
        MLJ_HIST_QualitySelection: "V",
        MLJ_HIST_Bins: 256,
        MLJ_HIST_AreaWeighted: false,
        MLJ_HIST_FixedWidth: false,
        MLJ_HIST_RangeMin: 0,
        MLJ_HIST_RangeMax: 0,
        MLJ_HIST_Width: 0,
        MLJ_HIST_QualityBarBins: 256,
        quality_min: 0,
        quality_max: 1,
        stripe_num: 10,
        stripe_width: 0.5,
        stripe_alpha: 0.5,
        stripe_ramp: 1
    };

    // Name of the layer that contains the Quality Contour. Needed to differentiate it from the histogram
    var qualityContourLayerName = "QualityContour";
    var qualityBarLayerName = "QualityBarLayerContour";   
    
    // Variables that decide the shape and position of the quality bar
    var qualityBarBorderX = 0.05;
    var qualityBarBorderY = 0.15;
    var qualityBarH = 1.0 - 2.0 * qualityBarBorderY;
    var qualityBarW = 0.015;
    
    // Variables that decide the shape and position of the histogram in respect of the quality bar position
    var histogramBorderX = qualityBarBorderX + 0.025;
    var histogramBorderY = 0.15;
    var histogramH = 1.0 - 2.0 * histogramBorderY;
    var histogramW = 0.18;

    // Shading for the quality shader
    var SHADING = {
        uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "common" ],
            THREE.UniformsLib[ "lights" ],
            {
                "quality_min": {type: "f", value: DEFAULTS.quality_min},
                "quality_max": {type: "f", value: DEFAULTS.quality_max},
                "stripe_num": {type: "f", value: DEFAULTS.stripe_num},
                "stripe_width": {type: "f", value: DEFAULTS.stripe_width},
                "stripe_alpha": {type: "f", value: DEFAULTS.stripe_alpha},
                "stripe_ramp": {type: "i", value: DEFAULTS.stripe_ramp}
            }
        ])
    };

    var plug = new plugin.Rendering({
        name: "Histogram",
        tooltip: "Show an histogram with the distribution of  per-vertex/per-face scalar values stored in the current layer. <br>"
                + "The histogram is colored with with the average color that corresponds to each value.",
        icon: "img/icons/histogram.png",
        toggle: true,
        on: false,
        loadShader: ["HistogramVertex.glsl", "HistogramFragment.glsl", "QualityContourFragment.glsl", "QualityContourVertex.glsl"]
    }, DEFAULTS);

    plug._onHistogramParamChange = function() {
        var currentLayer = MLJ.core.Scene.getSelectedLayer();
        if (currentLayer.properties.getByKey("Histogram") === true) {
            this._applyTo(currentLayer, false);
            this._applyTo(currentLayer, true);
        }
    };
    
    // Function that is called when any of the Quality Contour shader parameters are modified
    plug._onQualityContourParamChange = function() {
        var currentLayer = MLJ.core.Scene.getSelectedLayer();

        // Only proceed if the histogram is active and the Quality Contour option is "On"
        if (currentLayer.properties.getByKey("Histogram") === true && qualityContourChoice.getValue()) {
            // Removing the previous layer and re-creating it
            removeQualityContour(currentLayer);
            showQualityContour(currentLayer);
        }
    };

    var qualityContourChoice, qualitySelection, nBins, areaWeighted, fixedWidth, histogramWidth, rangeMin, rangeMax, digitW;
    var stripe_num, stripe_width, stripe_alpha, stripe_ramp;

    plug._init = function(guiBuilder) {

        qualityContourChoice = guiBuilder.Choice({
            label: "Quality Contours",
            tooltip: "Enable the visualization of the quality contour of the mesh for the current layer",
            options: [
                {content: "Off", value: 0, selected: true},
                {content: "On", value: 1}
            ],
            bindTo: (function() {
                var bindToFun = function(choice, meshFile) {
                    plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return 'showContour';
                }
                return bindToFun;
            }())
        });

        qualitySelection = guiBuilder.Choice({
            label: "Quality",
            tooltip: "The quality attribute used to compute the histogram",
            options: [
                {content: "Vertex", value: "V", selected: true},
                {content: "Face", value: "F"}
            ],
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_QualitySelection";
                };
                return bindToFun;
            })()
        });

        nBins = guiBuilder.Integer({
            label: "Histogram Bins",
            tooltip: "The number of bins on which the histogram is computed. ",
            defval: "256",
            min: 2,
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_Bins";
                };
                return bindToFun;
            })()
        });

        digitW = guiBuilder.Integer({
            label: "Digits",
            tooltip: "Number of decimal digits shown on the side of the histogram",
            defval: "2",
            min: 0,
            bindTo: (function() {
                var bindToFun = function() {
                    if (digitW.getValue() >= 0)
                        plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return 2;
                };
                return bindToFun;
            })()
        });
        areaWeighted = guiBuilder.Bool({
            label: "Area Weighted",
            tooltip: "If checked, the quality values are weighted according to the surface area of the involved component. \
                      Face qualities are weighted with the face surface area, while vertex qualities are weighted with the \
                      sum of 1/3 of the surface area of each face incident to the vertex.",
            defval: false,
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_AreaWeighted";
                };
                return bindToFun;
            })()
        });

        fixedWidth = guiBuilder.Bool({
            label: "Use Fixed Width",
            tooltip: "If checked, the histogram height is scaled with the <b>Histogram Width</b> parameter instead of \
                    using the element count of the largest bin.",
            defval: false,
            bindTo: (function() {
                var bindToFun = function() {

                    if (!fixedWidth.getValue())
                        plug._onHistogramParamChange();
                    else
                    {
                        var rangeNotZero = !(rangeMin.getValue() === 0 && rangeMax.getValue() === 0);
                        var rangeValid = rangeMin.getValue() <= rangeMax.getValue();
                        if (fixedWidth.getValue() && rangeNotZero && rangeValid)
                            plug._onHistogramParamChange();
                    }
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_FixedWidth";
                };
                return bindToFun;
            })()
        });

        rangeMin = guiBuilder.Float({
            label: "Range Min",
            tooltip: "",
            step: 0.5, defval: "0.0",
            bindTo: (function() {
                var bindToFun = function() {
                    if (fixedWidth.getValue() && rangeMin.getValue() <= rangeMax.getValue())
                        plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_RangeMin";
                };
                return bindToFun;
            })()
        });

        rangeMax = guiBuilder.Float({
            label: "Range Max",
            tooltip: "",
            step: 0.5, defval: "0.0",
            bindTo: (function() {
                var bindToFun = function() {
                    if (fixedWidth.getValue() && rangeMin.getValue() <= rangeMax.getValue())
                        plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_RangeMax";
                };
                return bindToFun;
            })()
        });

        histogramWidth = guiBuilder.Float({
            label: "Histogram Width",
            tooltip: "If non-zero, the height of the histogram is scaled as if this was the element count \
                      of the largest bin.",
            step: 0.5, defval: "0.0",
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HIST_Width";
                };
                return bindToFun;
            })()
        });

        stripe_num = guiBuilder.Integer({
            label: "Number of Labels",
            tooltip: "The number of contours that are drawn between min and max of the quality values.",
            min: 2,
            max: 100,
            defval: DEFAULTS.stripe_num,
//            bindTo: "stripe_num"
            bindTo: (function() {
                var bindToFun = function() {
                    if (stripe_num.getValue() >= 2 && stripe_num.getValue() <= 100)
                        plug._onHistogramParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HST_StripeNum";
                };
                return bindToFun;
            })()
        });

        stripe_width = guiBuilder.RangedFloat({
            label: "Width",
            tooltip: "The width of the contours.",
            min: 0, max: 1, step: 0.01,
            defval: DEFAULTS.stripe_width,
//            bindTo: "stripe_width"
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onQualityContourParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HST_StripeWidth";
                };
                return bindToFun;
            })()
        });

        stripe_alpha = guiBuilder.RangedFloat({
            label: "Alpha of Contours",
            tooltip: "The alpha of the contours.",
            min: 0, max: 1, step: 0.01,
            defval: DEFAULTS.stripe_alpha,
//            bindTo: "stripe_alpha"
            bindTo: (function() {
                var bindToFun = function() {
                      plug._onQualityContourParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HST_StripeAlpha";
                };
                return bindToFun;
            })()
        });

        stripe_ramp = guiBuilder.Bool({
            label: "Ramp Contour",
            tooltip: "If enabled shows a ramp that gives you info about the gradient of the quality field (transparent to opaque means increasing values)",
            defval: DEFAULTS.stripe_ramp === 1,
//            bindTo: "stripe_ramp"
            bindTo: (function() {
                var bindToFun = function() {
//                    plug._onQualityContourParamChange();
                    plug._onQualityContourParamChange();
                };
                bindToFun.toString = function() {
                    return "MLJ_HST_StripeRamp";
                };
                return bindToFun;
            })()
        });
    };

    var _escapeId = function(name) {
        return name.replace(/(:|\.)/g, "\\$1");
    };

    function buildDottedLine(a, b, aVal, bVal, nticks, digitNum) {
        var v = new THREE.Vector3().subVectors(b, a).multiplyScalar(1 / (nticks - 1));

        var points = [];
        var sizes = [];
        var labelref = [];

        var i = 0;
        var val = aVal;
        var step = (bVal - aVal) / (nticks - 1);

        while (i < nticks) {
            var tick = v.clone().multiplyScalar(i++).add(a);
            points.push(tick.x, tick.y, tick.z);
            sizes.push(2.0);
            labelref.push({
                x: tick.x,
                y: tick.y,
                value: val.toFixed(digitNum),
            });
            val += step;
        }
        sizes[0] = sizes[nticks - 1] = 4.0;

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
        geometry.addAttribute('pointSize', new THREE.BufferAttribute(new Float32Array(sizes), 1));


        var dl = new THREE.PointCloud(geometry, new THREE.ShaderMaterial({
            uniforms: {},
            attributes: geometry.attributes,
            vertexShader: "attribute float pointSize; \
                           void main() { \
                               gl_PointSize = pointSize; \
                               gl_Position = vec4(2.0*position-vec3(1.0, 1.0, 0.0), 1.0); \
                           }",
            fragmentShader: "void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 ); }"
        }));

        return {line: dl, ref: labelref};
    }

    function HistogramContext(idname, lref) {
        var _this = this;

        var _labels = [];
        for (var i = 0; i < lref.length; ++i) {
            var $l = $("<div id=\"" + idname + "-hist-label-" + i + "\"></div>")
                    .css({position: "absolute"})
                    .addClass("mlj-hist-label")
                    .append("<p>" + lref[i].value + "</p>");
            _labels.push({$label: $l, x: lref[i].x, y: lref[i].y});
            $("#_3D").append($l);
        }

        var _onResize = function() {
            var sz = MLJ.core.Scene.get3DSize();
            _labels.forEach(function(element) {
                element.$label.css({
                    "bottom": ((element.y - 0.005) * sz.height),
                    "right": ((1.0 - element.x + 0.005) * sz.width)
                });
            });
        };

        _onResize();
        $(window).on("resize", _onResize);

        this.hide = function() {
            _labels.forEach(function(element) {
                element.$label.hide();
            });
        }

        this.show = function() {
            _labels.forEach(function(element) {
                element.$label.show();
            });
        }

        this.dispose = function() {
            $(window).off("resize", _onResize);
            _labels.forEach(function(element) {
                element.$label.remove();
            });
        }
    }

    // Adds the quality contour to the mesh and to the quality bar
    function showQualityContour(meshFile) {
        // Creating the array that contains the quality for each vertex of the mesh
        var qualityVecSize = meshFile.VN;
        var qualityVecStart = Module.buildVertexQualityVec(meshFile.ptrMesh());
        var vert_quality = new Float32Array(Module.HEAPU8.buffer, qualityVecStart, qualityVecSize);

        // Saving the pointer to the quality values in order to dealloc the array when the quality contours are removed
        meshFile.__mlj_attributesVecQualityPtr = qualityVecStart;

        // Adding the vertex quality attribute to the geometry of the mesh
        var geometry = meshFile.getThreeMesh().geometry;
        geometry.addAttribute('vert_quality', new THREE.BufferAttribute(vert_quality, 1));

        var uniforms = THREE.UniformsUtils.clone(SHADING.uniforms);
        
        var minQuality, maxQuality;

        // Updating the uniforms values that the shader will use. The quality min and max used depend on the histogram range
        if(fixedWidth.getValue())
        {
            minQuality = rangeMin.getValue();
            maxQuality = rangeMax.getValue();
        }
        else
        {
            minQuality = Module.qualityMin(meshFile.ptrMesh());
            maxQuality = Module.qualityMax(meshFile.ptrMesh());
        }
        
        uniforms.quality_min.value = minQuality;
        uniforms.quality_max.value = maxQuality;
        uniforms.stripe_num.value = stripe_num.getValue() - 1;
        uniforms.stripe_width.value = stripe_width.getValue();
        uniforms.stripe_alpha.value = stripe_alpha.getValue();
        uniforms.stripe_ramp.value = stripe_ramp.getValue();

        // Parameters for the shader
        var parameters = {
            vertexShader: plug.shaders.getByKey("QualityContourVertex.glsl"),
            fragmentShader: plug.shaders.getByKey("QualityContourFragment.glsl"),
            uniforms: uniforms,
            attributes: geometry.attributes,
            transparent: true,
            lights: true
        };
        
        var mat = new THREE.RawShaderMaterial(parameters);
        var qualityContour = new THREE.Mesh(geometry, mat);

        // Adding the quality contour over the original mesh
        scene.addOverlayLayer(meshFile, qualityContourLayerName, qualityContour);
        
        
        // Now we draw the quality contours on the quality bar on the left side of the view
        var geometryBar = meshFile.__mlj_qualityBarMesh.geometry;
        var vert_quality = [];
        
        // For each vertex of each bin on the bar we need a quality value; every vertex in a bin have the same quality value
        for(var i = 0; i < DEFAULTS.MLJ_HIST_QualityBarBins; i++)
        {
            var value = minQuality + (((maxQuality - minQuality) / DEFAULTS.MLJ_HIST_QualityBarBins) * i);
            
            // 6 vertices for 1 bin; all share the same quality value
            vert_quality.push(value, value, value,
                              value, value, value);
        }
       
        geometryBar.addAttribute('vert_quality', new THREE.BufferAttribute(new Float32Array(vert_quality), 1));
                
        // Parameters for the shader. The vertex shader is a bit different from the QualityContourVertex.glsl, because this mesh is actually 2D and needs
        // to be drawn over the quality bar; in order to do that, the vertex shader needs to change the position of the vertex as the HistogramVertex.glsl does
        var parametersBar = {
            vertexShader: "precision highp float; \
                           uniform float quality_min; \
                           uniform float quality_max; \
                           uniform float stripe_num; \
                           uniform float stripe_width; \
                           attribute float vert_quality; \
                           attribute vec3 position; \
                           varying float scaled_quality; \
                           void main() { \
                               gl_Position = vec4(2.0 * position - vec3(1.0, 1.0, 0.0), 1.0); \
                               scaled_quality = ((vert_quality - quality_min)/(quality_max - quality_min)) * stripe_num; \
                           }",
            fragmentShader: plug.shaders.getByKey("QualityContourFragment.glsl"),
            uniforms: uniforms,
            attributes: geometryBar.attributes,
            transparent: true,
            lights: true
        };
        
        var material = new THREE.RawShaderMaterial(parametersBar);
        var qualityContourBar = new THREE.Mesh(geometryBar, material);

        // Adding the new mesh to the layer as a 2D overlay
        scene.addOverlayLayer(meshFile, qualityBarLayerName, qualityContourBar, true);
    }

    // Removes the quality contour from the mesh and from the quality bar
    function removeQualityContour(meshFile) {
        // Only proceed if the Quality Contour are actually there
        if (meshFile.__mlj_attributesVecQualityPtr)
        {
            Module._free(meshFile.__mlj_attributesVecQualityPtr);
            scene.removeOverlayLayer(meshFile, qualityContourLayerName);
            scene.removeOverlayLayer(meshFile, qualityBarLayerName, true);
            meshFile.__mlj_attributesVecQualityPtr = undefined;
        }
    }
    
    // This function creates and returns the quality bar mesh (which is put next to the histogram's labels)
    function createQualityBarMesh(layer)
    {
        var bn = DEFAULTS.MLJ_HIST_QualityBarBins;

        var ch = Module.ComputeColorHistogram(
                    layer.ptrMesh(),
                    qualitySelection.getValue() == "V",
                    bn,
                    areaWeighted.getValue(),
                    fixedWidth.getValue(),
                    rangeMin.getValue(),
                    rangeMax.getValue()
                    );

        var len = ch.maxV() - ch.minV();
        var histGeometry = new THREE.Geometry();
        var bars = [];
        var colors = [];

        // The procedure to create the bar is very similar to the way the histogram is created; only difference 
        // is that the width of the bar is fixed
        for (var i = 0; i < bn; ++i) {
            var value = ch.minV() + ((len / bn) * i);

            var y1 = (i / bn) * qualityBarH;
            var y2 = ((i + 1) / bn) * qualityBarH;
            var color = ch.binColorAvg(value);

            bars.push(
                    qualityBarBorderX, qualityBarBorderY + y1, 0,
                    qualityBarBorderX + qualityBarW, qualityBarBorderY + y1, 0,
                    qualityBarBorderX + qualityBarW, qualityBarBorderY + y2, 0,
                    qualityBarBorderX, qualityBarBorderY + y1, 0,
                    qualityBarBorderX + qualityBarW, qualityBarBorderY + y2, 0,
                    qualityBarBorderX, qualityBarBorderY + y2, 0
                    );

            colors.push(
                    color.r / 255, color.g / 255, color.b / 255,
                    color.r / 255, color.g / 255, color.b / 255,
                    color.r / 255, color.g / 255, color.b / 255,
                    color.r / 255, color.g / 255, color.b / 255,
                    color.r / 255, color.g / 255, color.b / 255,
                    color.r / 255, color.g / 255, color.b / 255
                    );
        }


        var histGeometry = new THREE.BufferGeometry();
        histGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(bars), 3));
        histGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        var mesh = new THREE.Mesh(
                histGeometry,
                new THREE.RawShaderMaterial({
                    uniforms: {},
                    attributes: histGeometry.attributes,
                    vertexShader: plug.shaders.getByKey("HistogramVertex.glsl"),
                    fragmentShader: plug.shaders.getByKey("HistogramFragment.glsl"),
                    depthTest: false
                })
        );

        ch.delete();

        return mesh;
    }

    plug._applyTo = function(layer, on) {
        if (on) {
            var ch = Module.ComputeColorHistogram(
                    layer.ptrMesh(),
                    qualitySelection.getValue() == "V",
                    nBins.getValue(),
                    areaWeighted.getValue(),
                    fixedWidth.getValue(),
                    rangeMin.getValue(),
                    rangeMax.getValue()
                    );

            var len = ch.maxV() - ch.minV();
            var maxCount = fixedWidth.getValue() ? histogramWidth.getValue() : ch.maxCount();
            if (maxCount === 0)
                maxCount = ch.maxCount();
            var bn = ch.binNum();

            var histGeometry = new THREE.Geometry();
            var bars = [];
            var colors = [];

            // histogram columns are drawn as horizontal rectangles using orthographic projection
            for (var i = 0; i < bn; ++i) {
                var value = ch.minV() + ((len / bn) * i);
                var width = histogramW * (ch.binCount(value) / maxCount);
                
                if (width === 0)
                    continue;

                var y1 = (i / bn) * histogramH;
                var y2 = ((i + 1) / bn) * histogramH;
                var color = ch.binColorAvg(value);

                bars.push(
                        histogramBorderX, histogramBorderY + y1, 0,
                        histogramBorderX + width, histogramBorderY + y1, 0,
                        histogramBorderX + width, histogramBorderY + y2, 0,
                        histogramBorderX, histogramBorderY + y1, 0,
                        histogramBorderX + width, histogramBorderY + y2, 0,
                        histogramBorderX, histogramBorderY + y2, 0
                        );

                colors.push(
                        color.r / 255, color.g / 255, color.b / 255,
                        color.r / 255, color.g / 255, color.b / 255,
                        color.r / 255, color.g / 255, color.b / 255,
                        color.r / 255, color.g / 255, color.b / 255,
                        color.r / 255, color.g / 255, color.b / 255,
                        color.r / 255, color.g / 255, color.b / 255
                        );
            }

            var histGeometry = new THREE.BufferGeometry();
            histGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(bars), 3));
            histGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

            var mesh = new THREE.Mesh(
                    histGeometry,
                    new THREE.RawShaderMaterial({
                        uniforms: {},
                        attributes: histGeometry.attributes,
                        vertexShader: plug.shaders.getByKey("HistogramVertex.glsl"),
                        fragmentShader: plug.shaders.getByKey("HistogramFragment.glsl"),
                        depthTest: false
                    })
            );

            // Getting the number of labels of the histogram from the parameter that is linked to the number of lines of the Quality Contour
            var nticks = stripe_num.getValue();
            var digitNum = digitW.getValue();

            var lineData = buildDottedLine(new THREE.Vector3(0.035, histogramBorderY, 0), new THREE.Vector3(0.035, histogramBorderY + histogramH, 0),
                    ch.minV(), ch.maxV(), nticks, digitNum);

            var node = new THREE.Object3D();
            node.add(mesh);
            node.add(lineData.line);

            // labels are rendered as html divs on top of the 3D area
            var idname = layer.name.replace(/ /g, "");

            layer.__mlj_histogram = new HistogramContext(idname, lineData.ref);

            if (!layer.getThreeMesh().visible)
                layer.__mlj_histogram.hide();
            
            
            // Creating the quality bar mesh which is put next to the labels
            var qualityBarMesh = createQualityBarMesh(layer);
            node.add(qualityBarMesh);
            layer.__mlj_qualityBarMesh = qualityBarMesh;
            
            scene.addOverlayLayer(layer, plug.getName(), node, true);

            // Checking if the quality contour should be added or removed from the layer (if it was already off nothing will happen)
            if (qualityContourChoice.getValue())
                showQualityContour(layer);
            else
                removeQualityContour(layer);

            ch.delete();
        } else {
            // Removing also the Quality Contour. If it isn't present, the call to this function does nothing
            removeQualityContour(layer);

            scene.removeOverlayLayer(layer, plug.getName(), true);

            if (layer.__mlj_histogram) {
                layer.__mlj_histogram.dispose();
                delete layer.__mlj_histogram;
            }
        }

    };
    
    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
