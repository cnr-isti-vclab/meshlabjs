
(function (plugin, core, scene) {
    
    var plug = new plugin.Rendering({
        name: "Histogram",        
        tooltip: "Histogram Tooltip",
        icon: "img/icons/histogram.png",
        toggle: true,
        on: false
    });

    var listeners = new MLJ.util.AssociativeArray();

    var _escapeId = function (name) {
        return name.replace(/(:|\.)/g, "\\$1");
    }

    plug._applyTo = function(meshFile, on) {
        if (on) {
            var sz = scene.get3DSize();

            var ch = Module.ComputeColorHistogram(meshFile.ptrMesh());
            var len = ch.maxV() - ch.minV();
            var maxCount = ch.maxCount();
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