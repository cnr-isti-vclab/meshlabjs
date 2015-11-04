(function(plugin, scene) {

	/*** TEST generates per vertex and per face colors ***/

	var ColorFilter = new plugin.Filter({
		name: "ColorFilter",
		tooltip: "TEST",
		arity: 1
	});

	ColorFilter._init = function (builder) {};

	ColorFilter._applyTo = function (meshFile) {
		Module.ColorizeByVertexQualityTEST(meshFile.ptrMesh());
	};

	plugin.Manager.install(ColorFilter);


	/*** Colorize by vertex quality ***/

	var ColorFromVertexQualityFilter = new plugin.Filter({
		name: "Generate Color from Vertex Quality",
		tooltip: "Generate a color for each vertex according to its Quality attribute value.",
		arity: 1
	});

	var qMin, qMax, percentile, zeroSym;

	ColorFromVertexQualityFilter._init = function (builder) {
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
		Module.ColorizeByVertexQuality(meshFile.ptrMesh(), qMin.getValue(), qMax.getValue(), percentile.getValue(), zeroSym.getValue());
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
	};

	plugin.Manager.install(ColorFromBorderDistFilter)

})(MLJ.core.plugin, MLJ.core.Scene);