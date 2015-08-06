
(function (plugin, core, scene) {

    var DEFAULTS = {
            minorFactor : 0.2,
            majorFactor : 0.5,
            pntSize : 0.10,
            pntColor : new THREE.Color('#FF0000'),
            pntTexture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/disc.png")
        };

    var plug = new plugin.Rendering({
        name: "Box",
        tooltip: "Box Tooltip",
        icon: "img/icons/box.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: true,
        loadShader: ["BoxFragment.glsl", "BoxVertex.glsl"]
    },DEFAULTS);

    var boxMinorFactorWidget, boxMajorFactorWidget, boxPntSizeWidget, boxPntColorWidgets, boxFontFaceChoiceWidget, boxFontSizeChoiceWidget, boxFontBorderThickChoiceWidget;
    plug._init = function (guiBuilder) {
        boxMinorFactorWidget = guiBuilder.RangedFloat({
            label: "Minor Factor",
            tooltip: "Distance between two consecutive misurations in non quoted axis",
            min: 0.1, step: 0.1, max:100,
            defval: DEFAULTS.minorFactor,
            bindTo: function(newFactor){
                boxMinorFactorWidget.setValue(newFactor);
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
        boxMajorFactorWidget = guiBuilder.RangedFloat({
            label: "Major Factor",
            tooltip: "Distance between two consecutive misurations in quoted axis",
            min: 0.5, step: 0.1, max:250,
            defval: DEFAULTS.majorFactor,
            bindTo: function(newFactor){
                boxMajorFactorWidget.setValue(newFactor);
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
        boxPntSizeWidget = guiBuilder.RangedFloat({
            label: "Point Size",
            tooltip: "Size of a point in the 3 axis",
            min: 0.05, step: 0.05, max:100,
            defval: DEFAULTS.pntSize,
            bindTo: "pntSize"
            /*bindTo: function(newPointSize){
                boxPntSizeWidget.setValue(newPointSize);
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }*/
        });
        boxPntColorWidget = guiBuilder.Color({
            label: "Thicks color",
            tooltip: "Color of the material related to a point in non quoted axis",
            color: "#"+DEFAULTS.pntColor.getHexString(),
            bindTo: "pntColor"
            /*bindTo: function(newPointColor){
                boxPntColorWidget.setColor('#'+newPointColor.getHexString());
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }*/
        });

        boxFontFaceChoiceWidget = guiBuilder.Choice({
            label: "Font Face",
            tooltip: "Choose the labels font face",
            options: [
                {content: "Arial", value: "0", selected: true},
                {content: "Georgia", value: "1"},
                {content: "Droid Sans", value: "2"},
                {content: "Droid Serif", value: "3"}
            ],
            bindTo: function(newFontface){
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });

        boxFontSizeChoiceWidget = guiBuilder.Integer({
            min: 5, step: 1, defval: 10,
            label: "Font Size",
            tooltip: "Choose the labels font size",
            bindTo: function(newFontsize){
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });

        boxFontBorderThickChoiceWidget = guiBuilder.Integer({
            min: 0, step: 1, defval: 4,
            label: "Font Border Thickness",
            tooltip: "Choose the labels font border thickness",
            bindTo: function(newFontsize){
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });
    };

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }

        var params = meshFile.overlaysParams.getByKey(plug.getName());

        var attributes = {
            pntType: {type: "f", value: []}
        };

        var uniforms = {
            pntColor: {type: "c", value: params.pntColor},
            pntSize: {type: "f", value: params.pntSize},
            pntTexture: {type: "t", value: DEFAULTS.pntTexture}
        };

        var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                attributes: attributes,
                vertexShader: this.shaders.getByKey("BoxVertex.glsl"),
                fragmentShader: this.shaders.getByKey("BoxFragment.glsl"),
                alphaTest: 0.9
            });

        //var needed to group all (pseudo) "subclasses" of THREE.Mesh
        var meshesGroup = new THREE.Mesh( undefined, shaderMaterial);

        //label parameters
        var lblParameters = {
            fontFace : boxFontFaceChoiceWidget.getContent(),
            fontSize : boxFontSizeChoiceWidget.getValue(),
            borderThickness : boxFontBorderThickChoiceWidget.getValue(),
            borderColor : {r:0, g:0, b:0, a:0},
            bgColor : {r:255, g:255, b:255, a:0}
        };

        /* Overlay bounding box (a THREE.BoxHelper overlay) */

        var bbHelper = new THREE.BoundingBoxHelper(meshFile.getThreeMesh(), 0xffffff);
        bbHelper.update();
        var bbox = new THREE.BoxHelper(bbHelper);
        bbox.update(meshFile.getThreeMesh());
        meshesGroup.add(bbox);

        /* Overlays related to quotes (3 THREE.PointCloud overlay) and overlay labels (2 groups of
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
         LEGENDA:   | 6__|_7    4: bboxmax.x, bboxmax.y, bboxmin.z
                    2/___3/     5: bboxmin.x, bboxmax.y, bboxmin.z
                                6: bboxmin.x, bboxmin.y, bboxmin.z
                                7: bboxmax.x, bboxmin.y, bboxmin.z */

        //var needed to group labels
        var labelsGroup = new THREE.Mesh();

        //adding internal quotes and labels
        var geometry = generatePointCloudGeometry(bboxMax, bboxMin, boxMinorFactorWidget.getValue(), boxMajorFactorWidget.getValue(), lblParameters, labelsGroup);
        var pcBuffer = new THREE.PointCloud( geometry, shaderMaterial);
        meshesGroup.add(labelsGroup);
        meshesGroup.add(pcBuffer);

        scene.addOverlayLayer(meshFile, plug.getName(), meshesGroup);
    };

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
    function generatePointCloudGeometry(max, min, minorFactor, majorFactor, lblParameters, labelsgroup){
        var geometry, div, x, y, z, j, k, xCenter=0, yCenter=0, zCenter=0;

        geometry = new THREE.BufferGeometry();
        var positions = new Array();
        var pntTypes = new Array();

        //segment 0 - 3
        var id = 0;
        var i = 0;
        k = 0;
        //MeshSizes dependent value ?
        x = max.x + 0.1;
        y = max.y;
        z = max.z;

        var epsilon = (max.y - min.y)/15;
        //var steps = boxMinorFactorWidget.getStep();

        var y,y0 = max.y, y1 = max.y,ysupp = undefined;

        while(y0>=min.y || y1>=min.y){

            //first minore quotes
            if(y0>=min.y){
                y = y0;
                y0 -=minorFactor;

                pntTypes[i++] = 1.0;

                positions[(3 * k) + id] = x;
                positions[(3 * k + 1) + id] = y;
                positions[(3 * k + 2) + id] = z;

                k++;
            }

            //then minore quotes
            if(y1 >= min.y){
                y = y1;
                y1 = (ysupp==undefined? y1 - majorFactor : (ysupp==y1?y1-majorFactor:ysupp) );
                ysupp = undefined;

                var eqmax = ( y-max.y>=0 ? y-max.y : (y-max.y)*-1 );
                eqmax /= 2;
                var eqmid = ( y-0>=0 ? +y : -y );
                eqmid /= 2;
                var eqmin = ( y-min.y>=0 ? y-min.y : (y-min.y)*-1 );
                eqmin /= 2;
                if( eqmax<epsilon || eqmid<epsilon || eqmin<epsilon ){
                    pntTypes[i++] = 3.0;
                    var sprite = makeTextSprite(
                                                y.toFixed(2),
                                                { 'x' : x+0.1, 'y' : y, 'z': z },
                                                lblParameters
                                               );
                    labelsgroup.add( sprite );

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    k++;

                    var segm = ( y-y1<0 ? (y-y1)*-1 : y-y1 );
                    segm = segm/2;
                    if(ysupp==undefined){
                        if(y>0 && y1<0 && segm>=epsilon){
                            ysupp = y1;
                            y1 = 0;
                        }else if(y>min.y && y1<min.y){
                            ysupp = y1;
                            y1 = min.y;
                        }
                    }else
                        y1=ysupp;
                }else{
                    var segm = ( y-y1<0 ? (y-y1)*-1 : y-y1 );
                    segm = segm/2;
                    if(ysupp==undefined){
                        if(y>0 && y1<0 && segm>=epsilon){
                            ysupp = y1;
                            y1 = 0;
                        }else if(y>min.y && y1<min.y && segm<epsilon){
                            ysupp = y1;
                            y1 = min.y;
                        }else{
                            pntTypes[i++] = 2.0;

                            var sprite = makeTextSprite(
                                                        y.toFixed(2),
                                                        { 'x' : x+0.1, 'y' : y, 'z': z },
                                                        lblParameters
                                                       );
                            labelsgroup.add( sprite );

                            positions[(3 * k) + id] = x;
                            positions[(3 * k + 1) + id] = y;
                            positions[(3 * k + 2) + id] = z;

                            k++;
                            if(ysupp==undefined){
                                if(y>0 && y1<0 && segm>=epsilon){
                                    ysupp = y1;
                                    y1 = 0;
                                }else if(y>min.y && y1<min.y){
                                    ysupp = y1;
                                    y1 = min.y;
                                }
                            }else
                                y1=ysupp;
                        }
                    }else
                        y1=ysupp;
                }
            }
        }

        //segment 2 - 3
        id = k * 3;
        k = 0;
        x = max.x;
        y = min.y-0.1;
        z = max.z;

        var x,x0 = max.x, x1 = max.x,xsupp = undefined;

        while(x0>=min.x || x1>=min.x){

            //first minore quotes
            if(x0>=min.x){
                x = x0;
                x0 -=minorFactor;

                pntTypes[i++] = 1.0;

                positions[(3 * k) + id] = x;
                positions[(3 * k + 1) + id] = y;
                positions[(3 * k + 2) + id] = z;

                k++;
            }

            //then minore quotes
            if(x1 >= min.x){
                x = x1;
                x1 = (xsupp==undefined? x1 - majorFactor : (xsupp==x1?x1-majorFactor:xsupp) );
                xsupp = undefined;

                var eqmax = ( x-max.x>=0 ? x-max.x : (x-max.x)*-1 );
                eqmax /= 2;
                var eqmid = ( x-0>=0 ? +x : -x );
                eqmid /= 2;
                var eqmin = ( x-min.x>=0 ? x-min.x : (x-min.x)*-1 );
                eqmin /= 2;
                if( eqmax<epsilon || eqmid<epsilon || eqmin<epsilon ){
                    pntTypes[i++] = 3.0;
                    var sprite = makeTextSprite(
                                                x.toFixed(2),
                                                { 'x' : x, 'y' : y-0.1, 'z': z },
                                                lblParameters
                                               );
                    labelsgroup.add( sprite );

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    k++;

                    var segm = ( x-x1<0 ? (x-x1)*-1 : x-x1 );
                    segm = segm/2;
                    if(xsupp==undefined){
                        if(x>0 && x1<0 && segm>=epsilon){
                            xsupp = x1;
                            x1 = 0;
                        }else if(x>min.x && x1<min.x){
                            xsupp = x1;
                            x1 = min.x;
                        }
                    }else
                        x1=xsupp;
                }else{
                    var segm = ( x-x1<0 ? (x-x1)*-1 : x-x1 );
                    segm = segm/2;
                    if(xsupp==undefined){
                        if(x>0 && x1<0 && segm>=epsilon){
                            xsupp = x1;
                            x1 = 0;
                        }else if(x>min.x && x1<min.x && segm<epsilon){
                            xsupp = x1;
                            x1 = min.x;
                        }else{
                            pntTypes[i++] = 2.0;

                            var sprite = makeTextSprite(
                                                        x.toFixed(2),
                                                        { 'x' : x, 'y' : y-0.1, 'z': z },
                                                        lblParameters
                                                       );
                            labelsgroup.add( sprite );

                            positions[(3 * k) + id] = x;
                            positions[(3 * k + 1) + id] = y;
                            positions[(3 * k + 2) + id] = z;

                            k++;
                            if(xsupp==undefined){
                                if(x>0 && x1<0 && segm>=epsilon){
                                    xsupp = x1;
                                    x1 = 0;
                                }else if(x>min.x && x1<min.x){
                                    xsupp = x1;
                                    x1 = min.x;
                                }
                            }else
                                x1=xsupp;
                        }
                    }else
                        x1=xsupp;
                }
            }
        }

        //segment 0 - 4
        id += k * 3;
        k = 0;
        x = max.x;
        y = max.y+0.1;
        z = max.z;

        var z,z0 = max.z, z1 = max.z,zsupp = undefined;

        while(z0>=min.z || z1>=min.z){

            //first minore quotes
            if(z0>=min.z){
                z = z0;
                z0 -=minorFactor;

                pntTypes[i++] = 1.0;

                positions[(3 * k) + id] = x;
                positions[(3 * k + 1) + id] = y;
                positions[(3 * k + 2) + id] = z;

                k++;
            }

            //then minore quotes
            if(z1 >= min.z){
                z = z1;
                z1 = (zsupp==undefined? z1 - majorFactor : (zsupp==z1?z1-majorFactor:zsupp) );
                zsupp = undefined;

                var eqmax = ( z-max.z>=0 ? z-max.z : (z-max.z)*-1 );
                eqmax /= 2;
                var eqmid = ( z-0>=0 ? +z : -z );
                eqmid /= 2;
                var eqmin = ( z-min.z>=0 ? z-min.z : (z-min.z)*-1 );
                eqmin /= 2;
                if( eqmax<epsilon || eqmid<epsilon || eqmin<epsilon ){
                    pntTypes[i++] = 3.0;
                    var sprite = makeTextSprite(
                                                z.toFixed(2),
                                                { 'x' : x, 'y' : y+0.1, 'z': z },
                                                lblParameters
                                               );
                    labelsgroup.add( sprite );

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    k++;

                    var segm = ( z-z1<0 ? (z-z1)*-1 : z-z1 );
                    segm = segm/2;
                    if(zsupp==undefined){
                        if(z>0 && z1<0 && segm>=epsilon){
                            zsupp = z1;
                            z1 = 0;
                        }else if(z>min.z && z1<min.z){
                            zsupp = z1;
                            z1 = min.z;
                        }
                    }else
                        z1=zsupp;
                }else{
                    var segm = ( z-z1<0 ? (z-z1)*-1 : z-z1 );
                    segm = segm/2;
                    if(zsupp==undefined){
                    if(z>0 && z1<0 && segm>=epsilon){
                            zsupp = z1;
                            z1 = 0;
                        }else if(z>min.z && z1<min.z && segm<epsilon){
                            zsupp = z1;
                            z1 = min.z;
                        }else{
                            pntTypes[i++] = 2.0;

                            var sprite = makeTextSprite(
                                                        z.toFixed(2),
                                                        { 'x' : x, 'y' : y+0.1, 'z': z },
                                                        lblParameters
                                                       );
                            labelsgroup.add( sprite );

                            positions[(3 * k) + id] = x;
                            positions[(3 * k + 1) + id] = y;
                            positions[(3 * k + 2) + id] = z;

                            k++;
                            if(zsupp==undefined){
                                if(z>0 && z1<0 && segm>=epsilon){
                                    zsupp = z1;
                                    z1 = 0;
                                }else if(z>min.z && z1<min.z){
                                    zsupp = z1;
                                    z1 = min.z;
                                }
                            }else
                                z1=zsupp;
                        }
                    }else
                        z1=zsupp;
                }
            }
        }

        positions = arrayToF32Array(positions.length, positions);
        pntTypes = arrayToF32Array(pntTypes.length, pntTypes);

        geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute('pntType', new THREE.BufferAttribute( pntTypes, 1 ) );

    	return geometry;
    }

    /**
      * Make and return a Float32Array from an Array of len indexes
      * @param {Number} len length of the array
      * @param {Object} array array to transform
      * @memberOf MLJ.plugins.rendering.Box
      * @author Stefano Giammori
    */
    function arrayToF32Array(len, array){
        var f32array = new Float32Array(len);
        for (i = 0; i < len; i++) {
            f32array[i] = array[i];
        }
        return f32array;
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
    	    parameters["fontFace"] : "Arial";
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
    	/** //MEMO : (add +x) ~~ go right; (add +y) ~~ go down) ]
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

        //MeshSizes dependent value?
        textGeo.position.x = max.x + 0.1;
        textGeo.position.y = max.y;
        textGeo.position.z = max.z;

        return textGeo;
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);