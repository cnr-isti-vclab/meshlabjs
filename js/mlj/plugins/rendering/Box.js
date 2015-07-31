
(function (plugin, core, scene) {

    //point DEFAULT parameters
    var pntParameters = {
            'ptsFactor' : 10,    //the minorFactor value will be 10
            'majorFactor' : 2.5, //the majorFactor value will be (minorFactor*2.5),
            'pntSize' : 0.05,
            'pntColor' : new THREE.Color(1,0,0)
        };

    //label DEFAULT parameters
    var lblParameters = {
            //'fontFace' : "Arial",
            'fontSize' : 10,
            //'borderThickness' : 4,
            'borderColor' : {r:0, g:0, b:0, a:0},
            'bgColor' : {r:255, g:255, b:255, a:0}
        };

    var plug = new plugin.Rendering({
        name: "Box",
        tooltip: "Box Tooltip",
        icon: "img/icons/box.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: true
    });

    plug._init = function (guiBuilder) {
    };

    plug._applyTo = function (meshFile, on) {
        if (on === false) {
            scene.removeOverlayLayer(meshFile, "majorQuotes");
            for(var i=0; i<(pntParameters.minorFactor+1)*3; i++)
                scene.removeOverlayLayer(meshFile, "labels"+i);
            scene.removeOverlayLayer(meshFile, "minorQuotes");
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        //bounding box helper

        var bbHelper = new THREE.BoundingBoxHelper(meshFile.getThreeMesh(), 0xffffff);
        bbHelper.update();
        var bbox = new THREE.BoxHelper(bbHelper);
        bbox.update(meshFile.getThreeMesh());
        scene.addOverlayLayer(meshFile, plug.getName(), bbox);

        //bounding box quotes with labels

        //calculate bbox
        var geometry = meshFile.getThreeMesh().geometry;
        if ( geometry.boundingBox === null ) geometry.computeBoundingBox();
        var bboxMax = geometry.boundingBox.max;
        var bboxMin = geometry.boundingBox.min;

        /*        5____4
                1/___0/|
                | 6__|_7
                2/___3/
        0: bboxmax.x, bboxmax.y, bboxmax.z
        1: bboxmin.x, bboxmax.y, bboxmax.z
        2: bboxmin.x, bboxmin.y, bboxmax.z
        3: bboxmax.x, bboxmin.y, bboxmax.z
        4: bboxmax.x, bboxmax.y, bboxmin.z
        5: bboxmin.x, bboxmax.y, bboxmin.z
        6: bboxmin.x, bboxmin.y, bboxmin.z
        7: bboxmax.x, bboxmin.y, bboxmin.z */

        var labelsGroup = new THREE.Group(); //var needed to group labels

        //adding minor quotes
        var pcBuffer = generatePointcloud (
                    bboxMax,
                    bboxMin,
                    pntParameters, //point params
                    lblParameters, //label params
                    labelsGroup //at the end will contains a group of labels
                );
        scene.addOverlayLayer(meshFile, "minorQuotes", pcBuffer); //add layer of minor quotes

        //adding layers of texture sprite
        for(var i=0; i<(pntParameters.ptsFactor+1)*3; i++)
            scene.addOverlayLayer(meshFile, "labels"+i, labelsGroup.children[0]);

        //adding major quotes
        pntParameters.pntSize *= 2.5;
        pcBuffer = generatePointcloud (
                        bboxMax,
                        bboxMin,
                        pntParameters, //point params
                        lblParameters, //label params
                        labelsGroup //at the end will contains a group of labels
                    );
        //add a layer of major quotes
        scene.addOverlayLayer(meshFile, "majorQuotes", pcBuffer);
    };

    /**
     * Method to generate a point cloud
     * @param {Color} color The color of a generic point
     * @param {Vector3} max The max of the bbox
     * @param {Vector3} min The min of the bbox
     * @param {Number} pointSize The size of a generic point
     * @param {Number} pointsfactor The edge subdivisions number
     * @param {THREE.Group} labelsgroup The group witch usage is to add labels in
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generatePointcloud( bboxMax, bboxMin, pntParameters, lblParameters, labelsgroup) {

        if ( pntParameters === undefined ) pntParameters = {};

        //extract point params
        var pointsfactor = pntParameters.hasOwnProperty("ptsFactor") ? pntParameters["ptsFactor"] : 15;
        var pointsize = pntParameters.hasOwnProperty("pntSize") ? pntParameters["pntSize"] : 0.10;
        var pointcolor = pntParameters.hasOwnProperty("pntColor") ? pntParameters["pntColor"] : new THREE.Color( 1,0,0 );

        var len0 = bboxMax.y - bboxMin.y; //segm. 0 - 3
        var len1 = bboxMax.x - bboxMin.x; //segm. 2 - 3
        var len2 = bboxMax.z - bboxMin.z; //segm. 0 - 4

        var lengths = { 'len03' : len0, 'len23' : len1, 'len04' : len2}; //3 segments length

        var geometry = generatePointCloudGeometry(bboxMax, bboxMin, lengths, pointsfactor, pointcolor, lblParameters, labelsgroup);

        var material = new THREE.PointCloudMaterial({ size: pointsize, vertexColors: THREE.VertexColors } );

        return new THREE.PointCloud(geometry, material );
    }

    /**
     * Method to generate the point cloud geometry
     * @param {Color} color The color of a generic point
     * @param {Vector3} max The max of the bbox
     * @param {Vector3} min The min of the bbox
     * @param {Object} lengths The lengths of the 3 singol edges will be quoted
     * @param {Number} pointsfactor The edge subdivisions number
     * @param {THREE.Group} labelsgroup The group witch usage is to add labels in
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generatePointCloudGeometry(max, min, lengths, pointsfactor, pointcolor, lblParameters, labelsgroup){
        var geometry = new THREE.BufferGeometry();
        var div, x, y, z, j, k;

        //estimate the number of points (op segment dependent)
        var pointsnum0 = lengths.len03/pointsfactor;
        var pointsnum1 = lengths.len23/pointsfactor;
        var pointsnum2 = lengths.len04/pointsfactor;

        //estimate the size of the 2 array ({positions, color} : each row represent a point)
        var arraySize = Math.trunc(
                                   (
                                    (lengths.len03 / pointsnum0 + 1) +
                                    (lengths.len23 / pointsnum1 + 1) +
                                    (lengths.len04 / pointsnum2 + 1)
                                   ) * 3
                                  );
        var positions = new Float32Array( arraySize );
        var colors = new Float32Array( arraySize );

        //segment 0 - 3
        var id = 0;
        var i = 0;
        k = 0;
        x = max.x + 0.1; //TODO : MeshSizes dependent
        y = max.y;
        z = max.z;
        div = pointsnum0;

        while( y > min.y ) {
            y = max.y - k * div;

            var sprite = makeTextSprite( y.toFixed(2), //sprite text
                                         { 'x' : x+0.1, 'y' : y, 'z': z }, //sprite position
                                         lblParameters
                                       );
            labelsgroup.add( sprite );

            positions[(3 * k) + id] = x;
            positions[(3 * k + 1) + id] = y;
            positions[(3 * k + 2) + id] = z;

            colors[(3 * k) + id] = pointcolor.r * 5;
            colors[(3 * k + 1) + id] = pointcolor.g * 0;
            colors[(3 * k + 2) + id] = pointcolor.b * 0;

            k++;
        }

        //segment 2 - 3
        id = (lengths.len03 / pointsnum0 + 1) * 3;
        k = 0;
        x = max.x;
        y = min.y-0.1; //TODO : MeshSizes dependent
        z = max.z;
        div = pointsnum1;

        while( x > min.x ) {
            x = max.x - k * div;

            var sprite = makeTextSprite(
                                         x.toFixed(2), //sprite text
                                         { 'x' : x, 'y' : y-0.1, 'z': z }, //sprite position
                                         lblParameters
                                       );
            labelsgroup.add( sprite );

            positions[(3 * k) + id] = x;
            positions[(3 * k + 1) + id] = y;
            positions[(3 * k + 2) + id] = z;

            colors[(3 * k) + id] = pointcolor.r * 5;
            colors[(3 * k + 1) + id] = pointcolor.g * 0;
            colors[(3 * k + 2) + id] = pointcolor.b * 0;

            k++;
        }

        //segment 0 - 4
        id = ((lengths.len03 / pointsnum0 + 1) + (lengths.len23 / pointsnum1 + 1))*3;
        k = 0;
        x = max.x+0.1; //TODO : MeshSizes dependent
        y = max.y+0.1;
        z = max.z;
        div = pointsnum2;

        while( z > min.z ) {
            z = max.z - k * div;

            var sprite = makeTextSprite(
                                         z.toFixed(2), //sprite text
                                         { 'x' : x+0.1, 'y' : y+0.1, 'z': z }, //sprite position
                                         lblParameters
                                       );
            labelsgroup.add( sprite );

            positions[(3 * k) + id] = x;
            positions[(3 * k + 1) + id] = y;
            positions[(3 * k + 2) + id] = z;

            colors[(3 * k) + id] = pointcolor.r * 5;
            colors[(3 * k + 1) + id] = pointcolor.g * 0;
            colors[(3 * k + 2) + id] = pointcolor.b * 0;

            k++;
        }

    	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

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
        context.font = "normal " + fontsize + "px " + fontface;

    	//background color
    	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    								  + backgroundColor.b + "," + backgroundColor.a + ")";
    	//border color
    	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
    								  + borderColor.b + "," + borderColor.a + ")";

    	//write the message in the canvas
    	context.lineWidth = borderThickness;
    	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize + borderThickness, 6);
    	// 1.4 is extra height factor for text below baseline: g,j,p,q.
    	/*context.fillRect(
                    canvas.width / 2 - textWidth / 2 - borderThickness / 2,
                    canvas.height / 2 - fontsize / 2 - borderThickness / 2,
                    textWidth + borderThickness,
                    fontsize + borderThickness, 6
                );
                */
    	//context.fillRect(, textWidth + backgroundMargin, size + backgroundMargin);
    	/*roundRect(context,
                    canvas.width / 2 - textWidth / 2 - borderThickness / 2,
                    canvas.height / 2 - fontsize / 2 - borderThickness / 2,
                    textWidth + borderThickness,
                    fontsize + borderThickness, 6
                );*/
    	//text options
    	context.fillStyle = "rgba(0, 0, 0, 1.0)";
    	//set starting point [in which (0,0):top left of the canvas;(+x):right;(+y):down;]
    	context.fillText( message, borderThickness, fontsize + borderThickness/2);
    	//context.fillText(message, canvas.width/2, canvas.height/2);
    	//context.fillText(message, canvas.width, canvas.height);
    	//context.fillText( message, borderThickness + canvas.width, borderThickness + fontsize * 1.4);

    	// canvas contents will be used for a texture
    	var texture = new THREE.Texture(canvas)
    	texture.needsUpdate = true;
    	texture.minFilter = THREE.LinearFilter;
    	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xffffff, fog: true } );
    	var sprite = new THREE.Sprite( spriteMaterial );
    	sprite.scale.set( textWidth/100, fontsize/100, 1 );
    	sprite.position.set( position.x, position.y, position.z);
    	//sprite.position.normalize();
        //sprite.position.multiplyScalar( 500 );
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
     * @param {Number} pointsfactor The edge subdivisions number
     * @memberOf MLJ.plugins.rendering.Box
     * @author Stefano Giammori
    */
    function generateLabels(max, min, pointsfactor) {
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