
(function (plugin, core, scene) {

    var plug = new plugin.GlobalRendering({
        name: "Axes",
        tooltip: "Show world space axes",
        icon: "img/icons/axis.png",
        toggle: true,
        on: false
    });
    
    var DEFAULTS = {
        planeSize: 10,
        gridSpacing: 10,
        gridColor: new THREE.Color(0x000066),
        ticksSpacing: 3
    };
    
    
    // Label parameters
    var lblParameters = {
        fontSize: 24,
        borderColor : {r:0, g:0, b:0, a:0},
        bgColor : {r:255, g:255, b:255, a:0}

    };
    
    var planeWidget, planeOrientationWidget, gridColorWidget, planeSizeWidget, gridSpacingWidget, ticksSpacingWidget;

    plug._init = function (guiBuilder) {
        planeWidget = guiBuilder.Choice({
            label: "Grid Plane",
            tooltip: "If on, a grid plane will be drawn",
            options: [
                {content: "Off", value: "0", selected: true},
                {content: "On", value: "1"}
            ],
            bindTo: (function() {
                var bindToFun = function() {
                    plug._onAxesParamChange();
                };
                bindToFun.toString = function() {
                    return 'planeWidget';
                }
                return bindToFun;
            }())
        });
        
        planeOrientationWidget = guiBuilder.Choice({
            label: "Grid Plane Orientation",
            tooltip: "Choose which plane to draw",
            options: [
                {content: "XZ", value: "0", selected: true},
                {content: "XY", value: "1"},
                {content: "YZ", value: "2"},
            ],
            bindTo: (function() {
                var bindToFun = function() {
                    if(parseInt(planeWidget.getValue()))
                        plug._onAxesParamChange();
                };
                bindToFun.toString = function() {
                    return 'planeOrientationWidget';
                }
                return bindToFun;
            }())
        });
        
        gridColorWidget = guiBuilder.Color({
            label: "Grid Color",
            tooltip: "",
            color: "#" + DEFAULTS.gridColor.getHexString(),
            bindTo: (function() {
                var bindToFun = function() {
                    if(parseInt(planeWidget.getValue()))
                        plug._onAxesParamChange();
                };
                bindToFun.toString = function() {
                    return 'gridColorWidget';
                }
                return bindToFun;
            }())
        });
        
        planeSizeWidget = guiBuilder.Integer({
            label: "Plane Size",
            tooltip: "Defines the size of the plane",
            step: 1, 
            defval: DEFAULTS.planeSize,
            min: 0,
            bindTo: (function() {
                var bindToFun = function() {
                    if(planeSizeWidget.getValue() > 0 && parseInt(planeWidget.getValue()))
                        plug._onAxesParamChange();
                };
                bindToFun.toString = function() {
                    return "planeSizeWidget";
                };
                return bindToFun;
            })()
        });
        
        gridSpacingWidget = guiBuilder.Integer({
            label: "Grid Spacing",
            tooltip: "Defines the spacing of the grid",
            step: 1, 
            defval: DEFAULTS.planeSize,
            min: 0,
            bindTo: (function() {
                var bindToFun = function() {
                    if(gridSpacingWidget.getValue() > 0 && parseInt(planeWidget.getValue()))
                        plug._onAxesParamChange();
                };
                bindToFun.toString = function() {
                    return "gridSpacingWidget";
                };
                return bindToFun;
            })()
        });
        
        ticksSpacingWidget = guiBuilder.Float({
            label: "Ticks Spacing",
            tooltip: "Defines the spacing between the ticks",
            step: 0.5, 
            defval: DEFAULTS.ticksSpacing,
            min: 0,
            bindTo: (function() {
                var bindToFun = function() {
                    if(ticksSpacingWidget.getValue() > 0)
                        plug._onAxesParamChange();
                };
                bindToFun.toString = function() {
                    return "ticksSpacingWidget";
                };
                return bindToFun;
            })()
        });
    };
    
    plug._onAxesParamChange = function() {
//        var currentLayer = MLJ.core.Scene.getSelectedLayer();
//        if (currentLayer.properties.getByKey(plug.getName()) === true) {
        if(scene._axes)
        {
            this._applyTo(false);
            this._applyTo(true);
        }
    };
   
    plug._applyTo = function (on) {
        if (on) {
            scene._axes = true;
            
            var bbox = scene.getBBox();
            var axisLength =  bbox.min.distanceTo(bbox.max)/2;
                        
            // Creating the Object3D of the axes. The other parts (arrows, labels, ticks) will be added to this object
            var axes = new THREE.AxisHelper(axisLength);
            
            // Parameters needed to define the size of the arrows on the axes
            var arrowLength = 1;
            var headLength = 0.2 * arrowLength;
            var headWidth = 0.5 * headLength;
            
            // Array that will contain the colors of each axis
            var colors = [];

            // X arrow parameters
            var arrowDirectionX = new THREE.Vector3(1, 0, 0);
            var arrowOriginAxisX = new THREE.Vector3(axisLength, 0, 0);
            colors.push(0xff9900);
            
            // Y arrow parameters
            var arrowDirectionY = new THREE.Vector3(0, 1, 0);
            var arrowOriginAxisY = new THREE.Vector3(0, axisLength, 0);
            colors.push(0x99ff00);
            
            // Z arrow parameters
            var arrowDirectionZ = new THREE.Vector3(0, 0, 1);
            var arrowOriginAxisZ = new THREE.Vector3(0, 0, axisLength);
            colors.push(0x0099ff);

            var arrowAxisX = new THREE.ArrowHelper(arrowDirectionX, arrowOriginAxisX, arrowLength, colors[0], headLength, headWidth);
            var arrowAxisY = new THREE.ArrowHelper(arrowDirectionY, arrowOriginAxisY, arrowLength, colors[1], headLength, headWidth);
            var arrowAxisZ = new THREE.ArrowHelper(arrowDirectionZ, arrowOriginAxisZ, arrowLength, colors[2], headLength, headWidth);
            
            axes.add(arrowAxisX);
            axes.add(arrowAxisY);
            axes.add(arrowAxisZ);
            
            // Now we draw the labels as sprite; first, we compute the distance
            var labelDistanceFromOrigin = axisLength + arrowLength + 0.1;
            
            // Creating the sprite with the helper function
            var spriteX = makeTextSprite("X", { 'x' : labelDistanceFromOrigin, 'y' : 0, 'z': 0}, lblParameters);
            var spriteY = makeTextSprite("Y", { 'x' : 0, 'y' : labelDistanceFromOrigin, 'z': 0}, lblParameters);
            var spriteZ = makeTextSprite("Z", { 'x' : 0, 'y' : 0, 'z': labelDistanceFromOrigin}, lblParameters);
            
            axes.add(spriteX);
            axes.add(spriteY);
            axes.add(spriteZ);
            
            // Now we draw the white ticks on the axes
            var origin = new THREE.Vector3(0, 0, 0);
            
            // Computing the distance between the ticks for each axis. Ticks will be displayed between the origin of the axis and the origin of the arrow
            var tickDistanceX = ticksSpacingWidget.getValue();
            var tickDistanceY = ticksSpacingWidget.getValue();
            var tickDistanceZ = ticksSpacingWidget.getValue();
                        
            // Total length to consider when drawing the ticks
            var totalLength = axisLength + headLength;
               
            // Creating the ticks mesh only if the distance is below the total length (meaning that there is at least 1 tick)
            if(tickDistanceX < totalLength)
            {
                var ticksMeshX = createTicksMesh(origin, arrowOriginAxisX, totalLength, tickDistanceX);
                axes.add(ticksMeshX);
            }
            if(tickDistanceY < totalLength)
            {
                var ticksMeshY = createTicksMesh(origin, arrowOriginAxisY, totalLength, tickDistanceY);
                axes.add(ticksMeshY);
            }
            if(tickDistanceZ < totalLength)
            {
                var ticksMeshZ = createTicksMesh(origin, arrowOriginAxisZ, totalLength, tickDistanceZ);
                axes.add(ticksMeshZ);
            }
            
            // If the grid is enabled, it needs to be created
            if(parseInt(planeWidget.getValue()))
            {
                // Grid size and spacing
                var gridSize = planeSizeWidget.getValue();
                var gridSpacing = gridSpacingWidget.getValue();
                var planeOrientation = parseInt(planeOrientationWidget.getValue());
                
                var grid = createGrid(gridSize, gridSpacing, planeOrientation, colors);
                axes.add(grid);
            }

            scene.addSceneDecorator(plug.getName(), axes);

        } else {
            scene.removeSceneDecorator(plug.getName());
            scene._axes = false;
        }
    };
    
    /**
     * Creates a grid rotated according to the plane orientation
     * 
     * @param {integer} gridSize size of the grid
     * @param {integer} gridSpacing spacing in the grid
     * @param {integer} plane the orientation of the plane (0 == XZ, 1 == XY, 2 == YZ)
     * @param {THREE.Color} colors
     * @returns {THREE.GridHelper}
     */
    function createGrid(gridSize, gridSpacing, plane, colors)
    {
        // Gird mesh and color
        var grid = new THREE.GridHelper(gridSize, gridSize/gridSpacing);
        grid.setColors(gridColorWidget.getColor(), gridColorWidget.getColor());

        // Coordinate vectors and colors for the line to be drawn across the plane axes
        var negativeVec1 = new THREE.Vector3(-gridSize, 0, 0);
        var positiveVec1 = new THREE.Vector3(gridSize, 0, 0);
        var negativeVec2 = new THREE.Vector3(0, 0, -gridSize);
        var positiveVec2 = new THREE.Vector3(0, 0, gridSize);
        var color1 = colors[0];
        var color2 = colors[2];
            
        // Depending on the plane orientation, the grid needs to be rotated around an axis
        switch(plane)
        {
            case 1:
                color2 = colors[1];
                grid.rotation.x = Math.PI/2;
                break;
            case 2:
                color1 = colors[1];
                color2 = colors[2];
                grid.rotation.z = Math.PI/2;
                break;
        }
        
        // Creating the line along the first axis of the plane (for example if the plane is XY it will be the line 
        // across the X axis; if it's the YZ plane it will be the line across Y)
        var geometry1 = new THREE.Geometry();
        var material1 = new THREE.LineBasicMaterial({color: color1});
        geometry1.vertices.push(negativeVec1, positiveVec1);
        var line1 = new THREE.Line(geometry1, material1);
        grid.add(line1);
        
        // Second line along the second axis
        var geometry2 = new THREE.Geometry();
        var material2 = new THREE.LineBasicMaterial({color: color2});
        geometry2.vertices.push(negativeVec2, positiveVec2);
        var line2 = new THREE.Line(geometry2, material2);
        grid.add(line2)
        
        return grid;
    }

    
    /**
     * Function that creates "ticks" from one point to another under a given dimension and with a fixed distance between the points
     * 
     * @param {type} startPoint starting point
     * @param {type} endPoint ending point
     * @param {type} dim total size to consider
     * @param {type} tickDistance distance between a tick and the next one
     * @returns {THREE.Object3D|THREE.PointCloud}
     */
    function createTicksMesh(startPoint, endPoint, dim, tickDistance)
    {
        // Considering the difference between the starting and ending point
        var v = new THREE.Vector3();
        v.subVectors(endPoint, startPoint);
        
        // Normalizing without computing square roots and powers
        v.divideScalar(dim); 

        var ticksMesh = new THREE.Object3D();
        var ticksGeometry = new THREE.Geometry();
        var i;        

        // Creating the points. Each point is separated by "tickDistance" pixels. Since the
        for(i = tickDistance; i < dim; i += tickDistance)
            ticksGeometry.vertices.push(new THREE.Vector3(startPoint.x + i*v.x, startPoint.y + i*v.y, startPoint.z + i*v.z));
        
        var ticksMaterial = new THREE.PointCloudMaterial({
                size: 3,
                sizeAttenuation: false
            });

        // Creating the ticks as a cloud of points
        ticksMesh = new THREE.PointCloud(ticksGeometry, ticksMaterial);
        
        return ticksMesh;
    }


    /**
      * Make a text texture <code>message</code> with HTML approach
      * @param {String} message Message to be applied to texture
      * @param {Vector3} position The position of the texture sprite
      * @param {Object} parameters The sprite's parameters
      * @memberOf MLJ.plugins.rendering.Box
      * @author Stefano Giammori
    */
    function makeTextSprite(message, position, parameters)
    {
    	if ( parameters === undefined ) parameters = {};

    	//extract label params
    	var fontface = parameters.hasOwnProperty("fontFace") ?
    	    parameters["fontFace"] : "Arial";
    	var fontsize = parameters.hasOwnProperty("fontSize") ?
    		parameters["fontSize"] : 10;
        var fontweight = parameters.hasOwnProperty("fontWeight") ?
            parameters["fontWeight"] : "normal" //white, visible
    	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
    		parameters["borderThickness"] : 4;
    	var borderColor = parameters.hasOwnProperty("borderColor") ?
    		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 }; //black, visible
    	var backgroundColor = parameters.hasOwnProperty("bgColor") ?
    		parameters["bgColor"] : {r:255, g:255, b:255, a:1.0} //white, visible

        //prepare label
    	var canvas = document.createElement('canvas');
    	var context = canvas.getContext('2d');
    	context.font = fontweight + " " + fontsize + "px " + fontface;

    	// get size data (height depends only on font size)
    	var textWidth = context.measureText(message).width;

    	canvas.width = textWidth + borderThickness * 2;
        canvas.height = fontsize + borderThickness * 2;

        //set the param font into context
        context.font = fontweight + " " + fontsize + "px " + fontface;
    	//set context background color
    	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    								  + backgroundColor.b + "," + backgroundColor.a + ")";
    	//set context border color
    	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
    								  + borderColor.b + "," + borderColor.a + ")";
    	//set border thickness
    	context.lineWidth = borderThickness;
    	/** //MEMO : (add +x) ~~ go right; (add +y) ~~ go down) ]
    	   Set the rectangular frame (ctx, top-left, top, width, height, radius of the 4 corners)
    	*/
    	context.fillStyle = "rgba(255, 255, 255, 1.0)";
    	/** Set starting point of text, in which pt(borderThickness, fontsize+borderThickness/2) represent the
    	top left of the top-left corner of the texture text in the canvas. */
    	context.fillText(message, borderThickness, fontsize + borderThickness/2);
    	//canvas contents will be used for create a texture
    	var texture = new THREE.Texture(canvas)
    	texture.needsUpdate = true;
    	texture.minFilter = THREE.LinearFilter;
    	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xffffff, fog: true } );
    	var sprite = new THREE.Sprite(spriteMaterial);
    	sprite.scale.set( textWidth/100, fontsize/100, 1 );
    	sprite.position.set( position.x , position.y, position.z);
    	return sprite;
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);