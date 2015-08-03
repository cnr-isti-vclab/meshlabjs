
(function (plugin, core, scene) {

    var DEFAULTS = {
            //uniforms
            minorFactor : 0.2,
            majorFactor : 0.5,
            minorPointSize : 0.10,
            pntColor : new THREE.Color('#FF0000'),

            //label parameters
            lblParameters : {
                fontFace : "Arial",
                fontSize : 10,
                borderThickness : 4,
                borderColor : {r:0, g:0, b:0, a:0},
                bgColor : {r:255, g:255, b:255, a:0}
            }

        };

    var plug = new plugin.Rendering({
        name: "Box",
        tooltip: "Box Tooltip",
        icon: "img/icons/box.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: true
    }, DEFAULTS );

    var boxMinorFactorWidget;
    plug._init = function (guiBuilder) {
        boxMinorFactorWidget = guiBuilder.RangedFloat({
            label: "Minor Factor",
            tooltip: "Distance between two consecutive misurations in non quoted axis",
            min: 0.1, step: 0.1, max:0.5,
            defval: DEFAULTS.minorFactor,
            bindTo: function(newFactor){
                DEFAULTS.minorFactor = newFactor;
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
        boxMajorFactorWidget = guiBuilder.RangedFloat({
            label: "Major Factor",
            tooltip: "Distance between two consecutive misurations in quoted axis",
            min: 0.5, step: 0.1, max:1.5,
            defval: DEFAULTS.majorFactor,
            bindTo: function(newFactor){
                DEFAULTS.majorFactor = newFactor;
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
        boxMinorPntSizeWidget = guiBuilder.RangedFloat({
            label: "Minor Point Size",
            tooltip: "Size of a point in non quoted axis; Medium and Major point sizes will be related to it",
            min: 0.05, step: 0.05, max:0.25,
            defval: DEFAULTS.minorPointSize,
            bindTo: function(newPointSize){
                DEFAULTS.minorPointSize = newPointSize;
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
        boxPntColorWidget = guiBuilder.Color({
            label: "Thicks color",
            tooltip: "Color of the material related to a point in non quoted axis",
            color: "#"+DEFAULTS.pntColor.getHexString(),
            bindTo: function(newPointColor){
                var d = DEFAULTS;
                DEFAULTS.pntColor = new THREE.Color(newPointColor);
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
    };

    plug._applyTo = function (meshFile, on) {
        if (on === false) {
            scene.removeOverlayLayer(meshFile, "majLabels");
            scene.removeOverlayLayer(meshFile, "majQuotes");
            scene.removeOverlayLayer(meshFile, "medLabels");
            scene.removeOverlayLayer(meshFile, "medQuotes");
            scene.removeOverlayLayer(meshFile, "minQuotes");
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        /* postponed (for uniforms spec)
        var params = meshFile.overlaysParams.getByKey(plug.getName());
        var uniforms = {
            minorFactor: {type: "f", value: params.minorFactor},
        };
        */

        /* Overlay bounding box (a THREE.BoxHelper overlay) */

        var bbHelper = new THREE.BoundingBoxHelper(meshFile.getThreeMesh(), 0xffffff);
        bbHelper.update();
        var bbox = new THREE.BoxHelper(bbHelper);
        bbox.update(meshFile.getThreeMesh());
        scene.addOverlayLayer(meshFile, plug.getName(), bbox);

        /* Overlays related to quotes (3 THREE.PointCloud overlay) and overlay labels (2 group of
           THREE.Sprite overlays) */

        //calculate bbox
        var geometry = meshFile.getThreeMesh().geometry.clone();
        if ( geometry.boundingBox === null ) geometry.computeBoundingBox();
        var bboxMax = geometry.boundingBox.max;
        var bboxMin = geometry.boundingBox.min;

        /*                      0: bboxmax.x, bboxmax.y, bboxmax.z
                                1: bboxmin.x, bboxmax.y, bboxmax.z
                      5____4    2: bboxmin.x, bboxmin.y, bboxmax.z
                    1/___0/|    3: bboxmax.x, bboxmin.y, bboxmax.z
         LEJENDA:   | 6__|_7    4: bboxmax.x, bboxmax.y, bboxmin.z
                    2/___3/     5: bboxmin.x, bboxmax.y, bboxmin.z
                                6: bboxmin.x, bboxmin.y, bboxmin.z
                                7: bboxmax.x, bboxmin.y, bboxmin.z */

        //adding minor quotes
        var pcBuffer = generatePointcloud (
                    bboxMax,
                    bboxMin,
                    DEFAULTS.minorFactor,
                    DEFAULTS.minorPointSize,
                    DEFAULTS.pntColor,
                    DEFAULTS.lblParameters,
                    undefined
                );
        scene.addOverlayLayer(meshFile, "minQuotes", pcBuffer);

        //var needed to group labels
        var labelsGroup = new THREE.Mesh();

        //adding medium quotes and labels
        pcBuffer = generatePointcloud (
                        bboxMax,
                        bboxMin,
                        DEFAULTS.majorFactor,
                        DEFAULTS.minorPointSize*2,
                        DEFAULTS.pntColor,
                        DEFAULTS.lblParameters,
                        labelsGroup
                    );
        scene.addOverlayLayer(meshFile, "medQuotes", pcBuffer);
        scene.addOverlayLayer(meshFile, "medLabels", labelsGroup);

        labelsGroup = new THREE.Mesh();

        //adding major quotes and labels
        var pcBuffer = generateExtremesPointcloud (
                        bboxMax,
                        bboxMin,
                        DEFAULTS.minorPointSize*3,
                        DEFAULTS.pntColor,
                        DEFAULTS.lblParameters,
                        labelsGroup
                    );
        scene.addOverlayLayer(meshFile, "majQuotes", pcBuffer);
        scene.addOverlayLayer(meshFile, "majLabels", labelsGroup);
    };

    /**
     * Method to generate a point cloud inside a segment
     * @param {Vector3} bboxMax The max of the bbox
     * @param {Vector3} bboxMin The min of the bbox
     * @param {Number} pointFactor The distance between 2 consecutive points
     * @param {Number} pointSize The size of a generic point
     * @param {Color} pointColor The color of a generic point
     * @param {Object} lblParameters The parameters needed for a label
     * @param {THREE.Group} labelsgroup The group wich usage is to add labels in
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generatePointcloud( bboxMax, bboxMin, pointFactor, pointSize, pointColor, lblParameters, labelsgroup) {

        //calculate lengths of the 3 segments taken in exam, respectively segm. 0-3, segm. 2-3 and segm. 0-4
        var len0 = bboxMax.y - bboxMin.y;
        var len1 = bboxMax.x - bboxMin.x;
        var len2 = bboxMax.z - bboxMin.z;
        var lengths = { 'len03' : len0, 'len23' : len1, 'len04' : len2};

        //calculate pointcloud geometry and material
        var geometry = generatePointCloudGeometry(bboxMax, bboxMin, lengths, pointFactor, pointColor, lblParameters, labelsgroup);
        var material = new THREE.PointCloudMaterial({ size: pointSize, vertexColors: THREE.VertexColors } );
        /* postponed shader material to substitute material
            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                attributes: attributes,
                vertexShader: this.shaders.getByKey("PointsVertex.glsl"),
                fragmentShader: this.shaders.getByKey("PointsFragment.glsl"),
                alphaTest: 0.9
            });
        */

        return new THREE.PointCloud(geometry, material );
    }

    /**
     * Method to generate a point cloud inside a segment but only in 3 points : the extremes of the segment
     * and in (0,0) if included between extremes.
     * @param {Vector3} bboxMax The max of the bbox
     * @param {Vector3} bboxMin The min of the bbox
     * @param {Number} pointSize The size of a generic point
     * @param {Color} pointColor The color of a generic point
     * @param {Object} lblParameters The parameters needed for a label
     * @param {THREE.Group} labelsgroup The group wich usage is to add labels in
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generateExtremesPointcloud( bboxMax, bboxMin, pointSize, pointColor, lblParameters, labelsgroup){
        //calculate pointcloud geometry and material
        var geometry = generateExtremesPointcloudGeometry(bboxMax, bboxMin, pointColor, lblParameters, labelsgroup);
        var material = new THREE.PointCloudMaterial({ size: pointSize, vertexColors: THREE.VertexColors } );
        return new THREE.PointCloud(geometry, material );
    }

    /**
     * Method to generate the point cloud geometry in-segment
     * @param {Vector3} max The max of the bbox
     * @param {Vector3} min The min of the bbox
     * @param {Object} lengths The lengths of the 3 singol edges will be quoted
     * @param {Number} pointfactor The edge subdivisions number
     * @param {Color} pointcolor The color of a generic point
     * @param {Object} lblParameters The parameters needed for a label
     * @param {THREE.Group} labelsgroup The group witch usage is to add labels in
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generatePointCloudGeometry(max, min, lengths, pointfactor, pointcolor, lblParameters, labelsgroup){
        var geometry, div, x, y, z, j, k, xCenter=0, yCenter=0, zCenter=0;

        //estimate the number of points (op segment dependent)
        var pointsnum0 = Math.trunc(lengths.len03/pointfactor);
        var pointsnum1 = Math.trunc(lengths.len23/pointfactor);
        var pointsnum2 = Math.trunc(lengths.len04/pointfactor);

        //estimate the size of the 2 array ({positions, color} : each row represent a point)
        var arraySize =(
                         (pointsnum0 !== 0 ? (pointsnum0+1) : 0) +
                         (pointsnum1 !== 0 ? (pointsnum1+1) : 0) +
                         (pointsnum2 !== 0 ? (pointsnum2+1) : 0)
                       ) * 3;
        if(arraySize > 0){
            geometry = new THREE.BufferGeometry();
            var positions = new Float32Array( arraySize );
            var colors = new Float32Array( arraySize );

            //segment 0 - 3
            var id = 0;
            var i = 0;
            k = 0;
            x = max.x + 0.1; //TODO : MeshSizes dependent value ?
            y = max.y;
            z = max.z;
            div = pointfactor;

            while( y >= min.y ) {

                if(labelsgroup !== undefined && y!==max.y && y!==0 && y!==min.y){
                    var sprite = makeTextSprite(
                                                 y.toFixed(2),
                                                 { 'x' : x+0.1, 'y' : y, 'z': z },
                                                 lblParameters
                                               );
                    labelsgroup.add( sprite );
                };

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    colors[(3 * k) + id] = pointcolor.r * 5;
                    colors[(3 * k + 1) + id] = pointcolor.g * 5;
                    colors[(3 * k + 2) + id] = pointcolor.b * 5;
                k++;
                y = max.y - k * div;
            }

            //segment 2 - 3
            id = k * 3;
            k = 0;
            x = max.x;
            y = min.y-0.1;
            z = max.z;
            div = pointfactor;

            while( x >= min.x ) {

                if(labelsgroup!=undefined && x!==max.x && x!==0 && x!==min.x){
                    var sprite = makeTextSprite(
                                             x.toFixed(2),
                                             { 'x' : x, 'y' : y-0.1, 'z': z },
                                             lblParameters
                                       );
                    labelsgroup.add( sprite );
                }


                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    colors[(3 * k) + id] = pointcolor.r * 5;
                    colors[(3 * k + 1) + id] = pointcolor.g * 5;
                    colors[(3 * k + 2) + id] = pointcolor.b * 5;
                k++;
                x = max.x - k * div;
            }

            //segment 0 - 4
            id += k * 3;
            k = 0;
            x = max.x;
            y = max.y+0.1;
            z = max.z;
            div = pointfactor;

            while( z >= min.z ) {

                if(labelsgroup !== undefined  && z!==max.z && z!==0 && z!==min.z){
                    var sprite = makeTextSprite(
                                                 z.toFixed(2),
                                                 { 'x' : x, 'y' : y+0.1, 'z': z },
                                                 lblParameters
                                               );
                    labelsgroup.add( sprite );
                }

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    colors[(3 * k) + id] = pointcolor.r * 5;
                    colors[(3 * k + 1) + id] = pointcolor.g * 5;
                    colors[(3 * k + 2) + id] = pointcolor.b * 5;
                k++;
                z = max.z - k * div;
            }

            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
        }

    	return geometry;
    }

    /**
     * Method to generate the point cloud geometry in-segment extremes and (0,0)
     * @param {Vector3} max The max of the bbox
     * @param {Vector3} min The min of the bbox
     * @param {Color} pointcolor The color of a generic point
     * @param {Object} lblParameters The parameters needed for a label
     * @param {THREE.Group} labelsgroup The group witch usage is to add labels in
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generateExtremesPointcloudGeometry(max, min, pointcolor, lblParameters, labelsgroup){
        var geometry, div, x, y, z, j, k, xCenter=0, yCenter=0, zCenter=0;

        //estimate the number of points (only the extreme points)
        var pointsnum0 = 2, pointsnum1 = 2, pointsnum2 = 2;
        var xdiv = (max.x - min.x) / 2, ydiv = (max.y - min.y) / 2, zdiv = (max.z - min.z) / 2;
        var xCenter = max.x - xdiv, yCenter = max.y - ydiv, zCenter = max.z - zdiv;

        //estimate the size of the 2 array ({positions, color} : each row represent a point)
        var arraySize =(
                         pointsnum0 + (xCenter === 0 ? 1 : 0) +
                         pointsnum1 + (yCenter === 0 ? 1 : 0) +
                         pointsnum2 + (zCenter === 0 ? 1 : 0)
                       ) * 3;

        if(arraySize > 0){
            geometry = new THREE.BufferGeometry();
            var positions = new Float32Array( arraySize );
            var colors = new Float32Array( arraySize );

            //segment 0 - 3
            var id = 0;
            var i = 0;
            k = 0;
            x = max.x + 0.1; //TODO : MeshSizes dependent value ?
            y = max.y;
            z = max.z;
            div = ydiv;

            while( y >= min.y ) {
                if(y===max.y || y===0 || y===min.y){
                    var sprite = makeTextSprite(
                                                 y.toFixed(2),
                                                 { 'x' : x+0.1, 'y' : y, 'z': z },
                                                 lblParameters
                                               );
                    labelsgroup.add( sprite );
                };

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    colors[(3 * k) + id] = pointcolor.r * 5;
                    colors[(3 * k + 1) + id] = pointcolor.g * 5;
                    colors[(3 * k + 2) + id] = pointcolor.b * 5;
                k++;
                y = max.y - k * div;
            }

            //segment 2 - 3
            id = k * 3;
            k = 0;
            x = max.x;
            y = min.y-0.1;
            z = max.z;
            div = xdiv;

            while( x >= min.x ) {

                if(x===max.x || x===0 || x===min.x){
                    var sprite = makeTextSprite(
                                             x.toFixed(2),
                                             { 'x' : x, 'y' : y-0.1, 'z': z },
                                             lblParameters
                                       );
                    labelsgroup.add( sprite );
                }


                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    colors[(3 * k) + id] = pointcolor.r * 5;
                    colors[(3 * k + 1) + id] = pointcolor.g * 5;
                    colors[(3 * k + 2) + id] = pointcolor.b * 5;
                k++;
                x = max.x - k * div;
            }

            //segment 0 - 4
            id += k * 3;
            k = 0;
            x = max.x;
            y = max.y+0.1;
            z = max.z;
            div = zdiv;

            while( z >= min.z ) {

                if(z===max.z || z===0 || z===min.z){
                    var sprite = makeTextSprite(
                                                 z.toFixed(2),
                                                 { 'x' : x, 'y' : y+0.1, 'z': z },
                                                 lblParameters
                                               );
                    labelsgroup.add( sprite );
                }

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    colors[(3 * k) + id] = pointcolor.r * 5;
                    colors[(3 * k + 1) + id] = pointcolor.g * 5;
                    colors[(3 * k + 2) + id] = pointcolor.b * 5;
                k++;
                z = max.z - k * div;
            }

            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions,3) );
            geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3) );
        }

        return geometry;
    }

    /**
      * Make a text texture <code>message</code> with HTML approach
      * @param {String} message Message to be applied to texture
      * @param {Vector3} position The position of the texture sprite
      * @param {Object} parameters The sprite's parameters
      * @memberOf MLJ.plugins.rendering.Box
      * @author Stefano Giammori
    */
    function makeTextSprite( message, position, parameters )
    {
    	if ( parameters === undefined ) parameters = {};

    	//extract label params
    	var fontface = parameters.hasOwnProperty("fontFace") ?
    	    parameters["fontFace"] : "Arial"; //alternatives = "helvetiker" or "Georgia"...;
    	var fontsize = parameters.hasOwnProperty("fontSize") ?
    		parameters["fontSize"] : 10;
    	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
    		parameters["borderThickness"] : 4;
    	var borderColor = parameters.hasOwnProperty("borderColor") ?
    		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 }; //black, visible
    	var backgroundColor = parameters.hasOwnProperty("bgColor") ?
    		parameters["bgColor"] : {r:255, g:255, b:255, a:1.0} //white, visible

        //prepare label
    	var canvas = document.createElement('canvas');
    	var context = canvas.getContext('2d');
    	context.font = "normal " + fontsize + "px " + fontface;

    	// get size data (height depends only on font size)
    	var textWidth = context.measureText(message).width;

    	canvas.width = textWidth + borderThickness * 2;
        canvas.height = fontsize + borderThickness * 2;

        //set the param font into context
        context.font = "normal " + fontsize + "px " + fontface;
    	//set context background color
    	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    								  + backgroundColor.b + "," + backgroundColor.a + ")";
    	//set context border color
    	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
    								  + borderColor.b + "," + borderColor.a + ")";
    	//set border thickness
    	context.lineWidth = borderThickness;
    	/** //TODO MEMO : (add +x) ~~ go right; (add +y) ~~ go down) ]
    	   Set the rectangular frame (ctx, top-left, top, width, height, radius of the 4 corners)
    	*/
    	roundRect(context,
    	          borderThickness/2,
    	          borderThickness/2,
    	          textWidth + borderThickness,
    	          fontsize + borderThickness,
    	          6);
    	context.fillStyle = "rgba(0, 0, 0, 1.0)";
    	/** Set starting point of text, in which pt(borderThickness, fontsize+borderThickness/2) represent the
    	top left of the top-left corner of the texture text in the canvas. */
    	context.fillText( message, borderThickness, fontsize + borderThickness/2);
    	//canvas contents will be used for create a texture
    	var texture = new THREE.Texture(canvas)
    	texture.needsUpdate = true;
    	texture.minFilter = THREE.LinearFilter;
    	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xffffff, fog: true } );
    	var sprite = new THREE.Sprite( spriteMaterial );
    	sprite.scale.set( textWidth/100, fontsize/100, 1 );
    	sprite.position.set( position.x, position.y, position.z);
    	return sprite;
    }

    //function for drawing rounded rectangles
    function roundRect(ctx, x, y, w, h, r)
    {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.fill();
    	ctx.stroke();
    }

    /**
     * Make a text texture <code>message</code> with TextGeometry approach
     * @param {Vector3} max The max of the bbox
     * @param {Vector3} min The min of the bbox
     * @param {Number} pointfactor The edge subdivisions number
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generateLabels(max, min, pointfactor) {
        var textGeo = new THREE.TextGeometry(
            'C',
            {
                size: 20,
                height: 2,
                curveSegments: 4,
                font: 'helvetiker',
                weight: 'normal',
                style: 'normal',
                bevelThickness: 2,
                bevelSize : 1.5,
                bevelSegments : 3,
                bevelEnabled: true
            }
        );

        materialArray = [
            new THREE.MeshBasicMaterial( { color: 0xFFFFFF  } ),
            new THREE.MeshBasicMaterial( { color: 0x666666, shading: THREE.SmoothShading } )
        ]

        textMaterial = new THREE.MeshFaceMaterial(materialArray)
        textGeo = new THREE.Mesh(textGeo, textMaterial)

        textGeo.position.x = max.x + 0.1; //TODO : MeshSizes dependent
        textGeo.position.y = max.y;
        textGeo.position.z = max.z;

        return textGeo;
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);