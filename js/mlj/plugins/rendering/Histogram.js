
(function (plugin, core, scene) {

    var DEFAULTS = {
        MLJ_HIST_QualitySelection: "V",
        MLJ_HIST_Bins: 256,
        MLJ_HIST_AreaWeighted: false,
        MLJ_HIST_FixedWidth: false,
        MLJ_HIST_RangeMin: 0,
        MLJ_HIST_RangeMax: 0,
        MLJ_HIST_Width: 0
    };
    
    var plug = new plugin.Rendering({
        name: "Histogram",        
        tooltip: "Histogram Tooltip",
        icon: "img/icons/histogram.png",
        toggle: true,
        on: false,
        loadShader: ["HistogramVertex.glsl", "HistogramFragment.glsl"]
    }, DEFAULTS);

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
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_QualitySelection"; };
                return bindToFun;
            })()
        });

        nBins = guiBuilder.Integer({
            label: "Histogram Bins",
            tooltip: "",
            defval: "256",
            min: 2,
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_Bins"; };
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
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_AreaWeighted"; };
                return bindToFun;
            })()
        });

        fixedWidth = guiBuilder.Bool({
            label: "Use Fixed Width",
            tooltip: "If checked, the histogram height is scaled with the <b>Histogram Width</b> parameter instead of \
                    using the element count of the largest bin.",
            defval: false,
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_FixedWidth"; };
                return bindToFun;
            })()
        });

        rangeMin = guiBuilder.Float({
            label: "Range Min",
            tooltip: "",
            step: 0.5, defval: "0.0",
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_RangeMin"; };
                return bindToFun;
            })()
        });

        rangeMax = guiBuilder.Float({
            label: "Range Max",
            tooltip: "",
            step: 0.5, defval: "0.0",
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_RangeMax"; };
                return bindToFun;
            })()
        });

        histogramWidth = guiBuilder.Float({
            label: "Histogram Width",
            tooltip: "If non-zero, the height of the histogram is scaled as if this was the element count \
                      of the largest bin.",
            step: 0.5, defval: "0.0",
            bindTo: (function () {
                var bindToFun = function () { plug._onHistogramParamChange(); };
                bindToFun.toString = function () { return "MLJ_HIST_Width"; };
                return bindToFun;
            })()
        });
    };

    var _escapeId = function (name) {
        return name.replace(/(:|\.)/g, "\\$1");
    };

    function buildDottedLine(a, b, aVal, bVal, nticks) {
        var v = new THREE.Vector3().subVectors(b, a).multiplyScalar(1/(nticks-1));

        var points = [];
        var sizes = [];
        var labelref = [];

        var i = 0;
        var val = aVal;
        var step = (bVal - aVal) / (nticks-1);

        while (i < nticks) {
            var tick = v.clone().multiplyScalar(i++).add(a);
            points.push(tick.x, tick.y, tick.z);
            sizes.push(2.0);
            labelref.push({
                x: tick.x,
                y: tick.y,
                value: val.toFixed(2),
            });
            val += step;
        }
        sizes[0] = sizes[nticks-1] = 4.0;

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
    
        return { line: dl, ref: labelref };
    }

    function HistogramContext(idname, lref) {
        var _this = this;

        var _labels = [];
        for (var i = 0; i < lref.length; ++i) {
            var $l = $("<div id=\"" + idname + "-hist-label-" + i + "\"></div>")
                .css({ position: "absolute" })
                .addClass("mlj-hist-label")
                .append("<p>" + lref[i].value + "</p>");
            _labels.push({$label: $l, x: lref[i].x, y: lref[i].y});
            $("#_3D").append($l);
        }

        var _onResize = function() {
            var sz = MLJ.core.Scene.get3DSize();
            _labels.forEach(function (element) {
                element.$label.css({
                    "bottom": ((element.y-0.005)*sz.height),
                    "right": ((1.0-element.x+0.005)*sz.width)
                });
            });
        };

        _onResize();
        $(window).on("resize", _onResize);

        this.hide = function () {
            _labels.forEach(function (element) { element.$label.hide(); });
        }

        this.show = function () {
            _labels.forEach(function (element) { element.$label.show(); });
        }

        this.dispose = function () {
            $(window).off("resize", _onResize);
            _labels.forEach(function (element) { element.$label.remove(); });   
        }
    }

    plug._applyTo = function(layer, on) {
        if (on) {
            var sz = scene.get3DSize();

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
            if (maxCount === 0) maxCount = ch.maxCount();
            var bn = ch.binNum();

            var borderX = 0.05;
            var borderY = 0.15;
            var histH = 1.0 - 2.0*borderY;
            var histW = 0.18;

            var histGeometry = new THREE.Geometry();
            var bars = [];
            var colors = [];

            // histogram columns are drawn as horizontal rectangles using orthographic projection
            for (var i = 0; i < bn; ++i) {
                var value = ch.minV() + ((len/bn) * i);
                var width =  histW * (ch.binCount(value) / maxCount);

                if (width === 0) continue;
                
                var y1 = (i / bn) * histH;
                var y2 = ((i+1) / bn) * histH;
                var height = y2 - y1;
                var color = ch.binColorAvg(value);

                bars.push(
                    borderX      , borderY+y1, 0,
                    borderX+width, borderY+y1, 0,
                    borderX+width, borderY+y2, 0,
                    borderX      , borderY+y1, 0,
                    borderX+width, borderY+y2, 0,
                    borderX      , borderY+y2, 0
                );

                colors.push(
                    color.r/255, color.g/255, color.b/255,
                    color.r/255, color.g/255, color.b/255,
                    color.r/255, color.g/255, color.b/255,
                    color.r/255, color.g/255, color.b/255,
                    color.r/255, color.g/255, color.b/255,
                    color.r/255, color.g/255, color.b/255
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

            var nticks = 15;

            var lineData = buildDottedLine(new THREE.Vector3(0.035, borderY, 0), new THREE.Vector3(0.035, borderY+histH, 0),
                ch.minV(), ch.maxV(), nticks);

            var node = new THREE.Object3D();
            node.add(mesh);
            node.add(lineData.line);

            scene.addOverlayLayer(layer, plug.getName(), node, true);

            // labels are rendered as html divs on top of the 3D area
            var idname = layer.name.replace(/ /g, "");

            layer.__mlj_histogram = new HistogramContext(idname, lineData.ref);

            if (!layer.getThreeMesh().visible) layer.__mlj_histogram.hide();

            ch.delete();
        } else {
            scene.removeOverlayLayer(layer, plug.getName(), true);
            if (layer.__mlj_histogram) {
                layer.__mlj_histogram.dispose();
                delete layer.__mlj_histogram;
            }
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
