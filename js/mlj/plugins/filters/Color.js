(function(plugin, scene) {

	var ColorFromVertexQualityFilter = new plugin.Filter({
		name: "Generate Color from Vertex Quality",
		tooltip: "Assign color to each vertex according to the scalar value stored in quality. <br>"
                        +"Three colormaps are available: a standard rainbow (red-green-blue) colormap (similar to Jet), "
                        +"a gray scale, and a Blue-Yellow shade (similar to Parula).",
		arity: 1
	});

	var qMin, qMax, percentile, zeroSym, colorBarWdg;

	ColorFromVertexQualityFilter._init = function (builder) {
                colorBarWdg = builder.Choice({
                        label: "ColorMap",
                        tooltip: "Choose one of the possible color mapping",
                        options: [
                            {content: "Blue-Green-Red (Jet)", value: 0, selected: true},
                            {content: "Gray Shade", value: 1},
                            {content: "Blue-Yellow (Parula)", value: 2},
                        ]
                });   
		qMin = new builder.Float({
			step: 0.5, defval: "0.0",
			label: "Quality min",
			tooltip: "The quality value that will be mapped to the lower end of the scale (blue)."
		});
		qMax = new builder.Float({
			step: 0.5, defval: "0.0",
			label: "Quality max",
			tooltip: "The quality value that will be mapped to the upper end of the scale (red)."
		});
		percentile = new builder.RangedFloat({
			max: 100, min: 0, step: 1, defval: 0,
			label: "Percentile crop",
			tooltip: ""
		});
		zeroSym = new builder.Bool({
			defval: false,
			label: "Zero symmetric",
			tooltip: "If true, the quality range will be enlarged to be symmetric (so that green is always zero)"
		});                         
	};

	ColorFromVertexQualityFilter._applyTo = function(meshFile) {
		Module.ColorizeByVertexQuality(meshFile.ptrMesh(), qMin.getValue(), qMax.getValue(), 
                    percentile.getValue(), zeroSym.getValue(),colorBarWdg.getValue());
		meshFile.cppMesh.addPerVertexColor();
		meshFile.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
	};

	plugin.Manager.install(ColorFromVertexQualityFilter);


	/*** Colorize by border distance ***/

	var ColorFromBorderDistFilter = new plugin.Filter({
		name: "Generate Color from Border Distance",
		tooltip: "Store in the Quality attribute of each vertex the geodesic distance from borders and generate a vertex color from it.",
		arity: 1
	});

	ColorFromBorderDistFilter._init = function (builder) {};

	ColorFromBorderDistFilter._applyTo = function (meshFile) {
		Module.ColorizeByBorderDistance(meshFile.ptrMesh());
		meshFile.cppMesh.addPerVertexColor();
        meshFile.overlaysParams.getByKey("ColorWheel").mljColorMode = MLJ.ColorMode.Vertex;
	};

	plugin.Manager.install(ColorFromBorderDistFilter)

})(MLJ.core.plugin, MLJ.core.Scene);
