
(function (plugin, core, scene) {

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
        var edgeDivisionMajorPointsFactor = 2;
        var edgeDivisionMinorPointsFactor = 20;
        var totalEdgeDivision = (edgeDivisionMinorPointsFactor+1) * 3;
        if (on === false) {
            scene.removeOverlayLayer(meshFile, "majorQuotes");
            for(var i=0;i<totalEdgeDivision;i++)
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

        //bounding box quotes
        var geometry = meshFile.getThreeMesh().geometry;
        if ( geometry.boundingBox === null ) {
            geometry.computeBoundingBox();
        }
        var max = geometry.boundingBox.max;
        var min = geometry.boundingBox.min;

        /*        5____4
                1/___0/|
                | 6__|_7
                2/___3/
        0: max.x, max.y, max.z
        1: min.x, max.y, max.z
        2: min.x, min.y, max.z
        3: max.x, min.y, max.z
        4: max.x, max.y, min.z
        5: min.x, max.y, min.z
        6: min.x, min.y, min.z
        7: max.x, min.y, min.z */

        var labelsgroup = new THREE.Group();

        //adding minor quotes layer
        var pointSize = 0.10;
        var pointcloudBuffer = generatePointcloud ( new THREE.Color( 1,0,0 ), max, min, pointSize, edgeDivisionMinorPointsFactor, labelsgroup);
        scene.addOverlayLayer(meshFile, "minorQuotes", pointcloudBuffer); //add a layer of minor quotes

        //adding layers of texture sprite
        for(var i=0;i<(edgeDivisionMinorPointsFactor+1)*3;i++)
            scene.addOverlayLayer(meshFile, "labels"+i, labelsgroup.children[0]);

        //adding major quotes layer
        pointSize = 0.25;
        pointcloudBuffer = generatePointcloud ( new THREE.Color( 1,0,0 ), max, min, pointSize, edgeDivisionMajorPointsFactor, labelsgroup);
        scene.addOverlayLayer(meshFile, "majorQuotes", pointcloudBuffer);
    };

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

    	var fontface = parameters.hasOwnProperty("fontface") ?
    		parameters["fontface"] : "helvetiker";

    	var fontsize = parameters.hasOwnProperty("fontsize") ?
    		parameters["fontsize"] : 10;

    	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
    		parameters["borderThickness"] : 4;

    	var borderColor = parameters.hasOwnProperty("borderColor") ?
    		parameters["borderColor"] :  {r:255, g:255, b:255, a:0} //white but invisible

    	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
    		parameters["backgroundColor"] : {r:255, g:255, b:255, a:1} //white

    	var canvas = document.createElement('canvas');
    	var context = canvas.getContext('2d');
    	context.font = "Bold " + fontsize + "px " + fontface;

    	// get size data (height depends only on font size)
    	var metrics = context.measureText( message );
    	var textWidth = metrics.width;

    	canvas.width = textWidth * 2;
        canvas.height = fontsize * 2;

    	// background color
    	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    								  + backgroundColor.b + "," + backgroundColor.a + ")";
    	// border color
    	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
    								  + borderColor.b + "," + borderColor.a + ")";
    	context.lineWidth = borderThickness;
    	roundRect(context,
                    borderThickness/2,
                    borderThickness/2,
                    textWidth + borderThickness,
                    fontsize * 1.4 + borderThickness, 6
                );
    	// 1.4 is extra height factor for text below baseline: g,j,p,q.

    	// text color
    	context.fillStyle = "rgba(0, 0, 0, 1.0)";
    	context.fillText( message, borderThickness, fontsize + borderThickness);

    	// canvas contents will be used for a texture
    	var texture = new THREE.Texture(canvas)
    	texture.needsUpdate = true;
    	texture.minFilter = THREE.LinearFilter;
    	var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xffffff, fog: true } );
    	var sprite = new THREE.Sprite( spriteMaterial );
    	sprite.position.set( position.x, position.y, position.z);
    	sprite.scale.set( textWidth/100, fontsize/100, 1 );
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
    function generatePointcloud( color, max, min, pointSize, pointsfactor, labelsgroup) {
        var len0 = max.y - min.y; //segm. 0 - 3
        var len1 = max.x - min.x; //segm. 2 - 3
        var len2 = max.z - min.z; //segm. 0 - 4

        var lengths = { 'len03' : len0, 'len23' : len1, 'len04' : len2};

        var geometry = generatePointCloudGeometry(color, max, min, lengths, pointsfactor, labelsgroup);

        var material = new THREE.PointCloudMaterial({ size: pointSize, vertexColors: THREE.VertexColors } );

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
    function generatePointCloudGeometry(color, max, min, lengths, pointsfactor, labelsgroup){
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
        k = 0;
        x = max.x + 0.1; //TODO : MeshSizes dependent
        y = max.y;
        z = max.z;
        div = pointsnum0;

        while( y > min.y ) {
            y = max.y - k * div;

            var sprite = makeTextSprite(" "+y.toFixed(2)+" ", { 'x' : x+0.1, 'y' : y, 'z': z }, { fontsize: 10, backgroundColor: {r:255, g:255, b:255, a:0} } );
            labelsgroup.add( sprite );

            positions[(3 * k) + id] = x;
            positions[(3 * k + 1) + id] = y;
            positions[(3 * k + 2) + id] = z;

            colors[(3 * k) + id] = color.r * 5;
            colors[(3 * k + 1) + id] = color.g * 0;
            colors[(3 * k + 2) + id] = color.b * 0;

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

            var sprite = makeTextSprite(" "+x.toFixed(2)+" ", { 'x' : x, 'y' : y - 0.1, 'z': z }, { fontsize: 10, backgroundColor: {r:255, g:255, b:255, a:0} } );
            labelsgroup.add( sprite );

            positions[(3 * k) + id] = x;
            positions[(3 * k + 1) + id] = y;
            positions[(3 * k + 2) + id] = z;

            colors[(3 * k) + id] = color.r * 5;
            colors[(3 * k + 1) + id] = color.g * 0;
            colors[(3 * k + 2) + id] = color.b * 0;

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

            var sprite = makeTextSprite( " "+z.toFixed(2)+" ", { 'x' : x + 0.1, 'y' : y + 0.1, 'z': z }, { fontsize: 10, backgroundColor: {r:255, g:255, b:255, a:0} } );
            labelsgroup.add( sprite );

            positions[(3 * k) + id] = x;
            positions[(3 * k + 1) + id] = y;
            positions[(3 * k + 2) + id] = z;

            colors[(3 * k) + id] = color.r * 5;
            colors[(3 * k + 1) + id] = color.g * 0;
            colors[(3 * k + 2) + id] = color.b * 0;

            k++;
        }

    	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    	return geometry;
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);