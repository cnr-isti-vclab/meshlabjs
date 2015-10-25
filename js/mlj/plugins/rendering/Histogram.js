
(function (plugin, core, scene) {

    var DEFAULTS = {
        histogramQualitySelection: "V",
        histogramBins: 256,
        histogramAreaWeighted: false,
        histogramFixedWidth: false,
        histogramRangeMin: 0,
        histogramRangeMax: 0,
        histogramWidth: 0
    };
    
    var plug = new plugin.Rendering({
        name: "Histogram",        
        tooltip: "Histogram Tooltip",
        icon: "img/icons/histogram.png",
        toggle: true,
        on: false
    }, DEFAULTS);

    // TODO this is the same as 'reapply' defined in Rendering.js, maybe refactor it
    plug._onHistogramParamChange = function () { 
        var currentLayer = MLJ.core.Scene.getSelectedLayer();
        if (currentLayer.properties.getByKey("Histogram") === true) {
            this._applyTo(currentLayer, false);
            this._applyTo(currentLayer, true);
        }
    };

    var qualitySelection, nBins, areaWeighted, fixedWidth, histogramWidth, rangeMin, rangeMax;

    plug._init = function (guiBuilder) {

        qualitySelection = guiBuilder.Choice({
            label: "Quality",
            tooltip: "The quality attribute used to compute the histogram",
            options: [
                { content: "Vertex", value: "V", selected: true },
                { content: "Face", value: "F" }
            ],
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramQualitySelection"; };
                return bindToFun;
            })()
        });

        nBins = guiBuilder.Integer({
            label: "Histogram Bins",
            tooltip: "",
            defval: "256",
            min: 2,
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramBins"; };
                return bindToFun;
            })()
        });

        areaWeighted = guiBuilder.Bool({
            label: "Area Weighted",
            tooltip: "If checked, the quality values are weighted according to the surface area of the involved component. \
                      Face qualities are weighted with the face surface area, while vertex qualities are weighted with the \
                      sum of 1/3 of the surface area of each face incident to the vertex.",
            defval: false,
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramAreaWeighted"; };
                return bindToFun;
            })()
        });

        fixedWidth = guiBuilder.Bool({
            label: "Use Fixed Width",
            tooltip: "If checked, the histogram height is scaled with the <b><i>Histogram Width</i></b> parameter instead of \
                    using the element count of the largest bin.",
            defval: false,
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramFixedWidth"; };
                return bindToFun;
            })()
        });

        rangeMin = guiBuilder.Float({
            label: "Range Min",
            tooltip: "",
            step: 0.5, defval: "0.0",
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramRangeMin"; };
                return bindToFun;
            })()
        });

        rangeMax = guiBuilder.Float({
            label: "Range Max",
            tooltip: "",
            step: 0.5, defval: "0.0",
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramRangeMax"; };
                return bindToFun;
            })()
        });

        histogramWidth = guiBuilder.Float({
            label: "Histogram Width",
            tooltip: "If non-zero, the height of the histogram is scaled as if this was the element count \
                      of the largest bin.",
            step: 0.5, defval: "0.0",
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); MLJ.core.Scene.render(); };
                bindToFun.toString = function () { return "histogramWidth"; };
                return bindToFun;
            })()
        });
    };

    var _escapeId = function (name) {
        return name.replace(/(:|\.)/g, "\\$1");
    };

    plug._applyTo = function(meshFile, on) {
        if (on) {
            var sz = scene.get3DSize();

            var ch = Module.ComputeColorHistogram(
                meshFile.ptrMesh(),
                qualitySelection.getValue() == "V",
                nBins.getValue(),
                areaWeighted.getValue(),
                fixedWidth.getValue(),
                rangeMin.getValue(),
                rangeMax.getValue()
            );

            var len = ch.maxV() - ch.minV();
            var maxCount = fixedWidth.getValue() ? histogramWidth.getValue() : ch.maxCount();
            if (maxCount === 0) maxCount = ch.maxCount();
            var bn = ch.binNum();

            var borderX = 0.05;
            var borderY = 0.15;
            var histH = 1.0 - 2.0*borderY;
            var histW = 0.18;

            var histGeometry = new THREE.Geometry();

            // histogram columns are drawn as horizontal rectangles using orthographic projection
            for (var i = 0; i < bn; ++i) {
                var value = ch.minV() + ((len/bn) * i)
                var width =  histW * (ch.binCount(value) / maxCount);

                if (width === 0) continue;
                
                var y1 = (i / bn) * histH;
                var y2 = ((i+1) / bn) * histH;
                var height = y2 - y1;
                var color = ch.binColorAvg(value);

                var rectShape = new THREE.Shape();
                rectShape.moveTo(borderX, borderY + y1);
                rectShape.lineTo(borderX, borderY + y2);
                rectShape.lineTo(borderX + width, borderY + y2);
                rectShape.lineTo(borderX + width, borderY + y1);
                rectShape.lineTo(borderX, borderY + y1);

                var histLine = new THREE.ShapeGeometry(rectShape);
                histLine.faces.forEach(function (face) {
                    face.color = new THREE.Color(color.r/255, color.g/255, color.b/255);
                });

                histGeometry.merge(histLine);
            }

            var mesh = new THREE.Mesh(
                histGeometry,
                new THREE.MeshBasicMaterial({
                    vertexColors: THREE.FaceColors,
                    depthTest: false
                })
            );

            mesh.material.uniforms = {};
            scene.addOverlayLayer(meshFile, plug.getName(), mesh, true);

            // labels are rendered as html divs on top of the 3D area
            var idname = meshFile.name.replace(/ /g, "");

            // handle to html-related data
            meshFile.histogram = {
                $tl: null,
                $bl: null,
                listener: null
            };

            meshFile.histogram.$tl = $("<div id=\"" + idname + "-hist-label-top" + "\"></div>")
                .css({ position: "absolute" })
                .addClass("mlj-hist-label")
                .append("<p>" + ch.maxV() + "</p>");

            meshFile.histogram.$bl = $("<div id=\"" + idname + "-hist-label-bottom" + "\"></div>")
                .css({ position: "absolute" })
                .addClass("mlj-hist-label")
                .append("<p>" + ch.minV() + "</p>");

            $("#_3D").append(meshFile.histogram.$tl).append(meshFile.histogram.$bl);

            var onResize = function() {
                var sz = scene.get3DSize();
                var pad = 8; // top and bottom padding for mlj-hist-label class (see style.css)
                var bump = 0.02;
                meshFile.histogram.$tl.css({
                    "margin-top": (-((meshFile.histogram.$tl.height()+pad)/2)) + "px",
                    "top": ((borderY-bump)*sz.height) + "px",
                    "left": (0.6*borderX*sz.width) + "px"
                });
                meshFile.histogram.$bl.css({
                    "margin-top": (-((meshFile.histogram.$bl.height()+pad)/2)) + "px",
                    "top": ((1-borderY+bump)*sz.height) + "px",
                    "left": (0.6*borderX*sz.width) + "px"
                });
            };

            onResize();
            $(window).on("resize", onResize);
            meshFile.histogram.listener = onResize;

            if (!meshFile.getThreeMesh().visible) {
                meshFile.histogram.$tl.hide();
                meshFile.histogram.$bl.hide();
            }

            ch.delete();
        } else {
            scene.removeOverlayLayer(meshFile, plug.getName());
            if (meshFile.histogram !== undefined) {
                $(window).off("resize", meshFile.histogram.listener);
                meshFile.histogram.$tl.remove();
                meshFile.histogram.$bl.remove();
            }
            delete meshFile.histogram;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);