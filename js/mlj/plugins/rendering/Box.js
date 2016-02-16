
(function (plugin, core, scene) {

    var DEFAULTS = {
            //next values are code blocked values
            minPointSize : 0.1,
            medPointSize : 0.25,
            majPointSize : 0.5,
            minSize : 1.5,
            pntTexture: THREE.ImageUtils.loadTexture("js/mlj/plugins/rendering/textures/sprites/square.png"),
            epsilonPercentage : 1.5/100.0,
            spriteOffset : 2.5,
            //next are GUI settable values
            minorFactor : 0.2,
            majorFactor : 0.5,
            pntSize : 3,
            pntColor : new THREE.Color('#FF0000')
        };

    var plug = new plugin.Rendering({
        name: "Box",
        tooltip: "Enable the rendering of the bbox for the current layer",
        icon: "img/icons/box.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: true,
        loadShader: ["BoxFragment.glsl", "BoxVertex.glsl"],
        applyOnEvent: "onControlsChange"
    },DEFAULTS);

    var boxEnablerQuotes, boxMinorFactorWidget, boxMajorFactorWidget, boxPntSizeWidget, boxPntColorWidgets, boxFontFaceChoiceWidget, boxFontSizeChoiceWidget, boxFontBorderThickChoiceWidget;
    plug._init = function (guiBuilder) {

        boxEnablerQuotes = guiBuilder.Choice({
            label: "Quotes",
            tooltip: "Enable/disable quotes",
            options: [
                {content: "enable", value: true},
                {content: "disable", value: false, selected: true}
            ],
            bindTo: function(enabled){
                boxEnablerQuotes._changeValue(enabled);
                $(document).trigger("SceneLayerUpdated", [scene.getSelectedLayer()]);
            }
        });

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
        });

        boxPntColorWidget = guiBuilder.Color({
            label: "Thicks color",
            tooltip: "Color of the material related to a point in non quoted axis",
            color: "#"+DEFAULTS.pntColor.getHexString(),
            bindTo: "pntColor"
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
            min: 10, step: 1, defval: 10,
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
            pntMinSize: {type: 'f', value: []},
            pntType: {type: "f", value: []}
        };

        var uniforms = {
            pntEnable: {},
            pntColor: {type: "c", value: params.pntColor},
            pntSize: {type: "f", value: params.pntSize},
            pntTexture: {type: "t", value: DEFAULTS.pntTexture}
        };

        var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                attributes: attributes,
                vertexShader: this.shaders.getByKey("BoxVertex.glsl"),
                fragmentShader: this.shaders.getByKey("BoxFragment.glsl"),
                alphaTest: 0.5,
                depthTest: true,
                depthWrite: false,
                transparent: true
            });

        //label parameters
        var lblParameters = {
            fontFace : boxFontFaceChoiceWidget.getContent(),
            fontSize : boxFontSizeChoiceWidget.getValue(),
            borderThickness : boxFontBorderThickChoiceWidget.getValue(),
            borderColor : {r:0, g:0, b:0, a:0},
            bgColor : {r:255, g:255, b:255, a:0}

        };

        //var needed to group all (pseudo) "subclasses" of THREE.Mesh
        var meshesGroup = new THREE.Mesh( undefined, shaderMaterial);

        /* Overlay bounding box (a THREE.BoxHelper overlay) */

        
        var bbox = new THREE.BoxHelper(meshFile.getThreeMesh());
        meshesGroup.add(bbox);

        /* Overlays related to quotes (a THREE.PointCloud overlay) and overlay labels (a groups of
           THREE.Sprite overlay) */

        if(boxEnablerQuotes.getValue()){
            var camera = scene.getCamera();
            var geometry = meshFile.getThreeMesh().geometry;

            var screencenter = camera.position;
            var centroid = getcentroid(geometry.boundingBox, meshFile.getThreeMesh().position);
            var bboxmax = geometry.boundingBox.max;
            var bboxmin = geometry.boundingBox.min;

    /*                      0: bboxmax.x, bboxmax.y, bboxmax.z
                            1: bboxmin.x, bboxmax.y, bboxmax.z
                  5____4    2: bboxmin.x, bboxmin.y, bboxmax.z
                1/___0/|    3: bboxmax.x, bboxmin.y, bboxmax.z
     LEGENDA:   | 6__|_7    4: bboxmax.x, bboxmax.y, bboxmin.z
                2/___3/     5: bboxmin.x, bboxmax.y, bboxmin.z
                            6: bboxmin.x, bboxmin.y, bboxmin.z
                            7: bboxmax.x, bboxmin.y, bboxmin.z */

            var x = chooseX(camera, centroid.clone(), bboxmax, bboxmin);
            var y = chooseY(camera, centroid.clone(), bboxmax, bboxmin);
            var z = chooseZ(camera, centroid.clone(), bboxmax, bboxmin);

            //var needed to group labels
            var labelsGroup = new THREE.Mesh();

            //adding internal quotes and labels
            geometry = generatePointCloudGeometry(bboxmax, bboxmin, x, y, z, boxMinorFactorWidget.getValue(), boxMajorFactorWidget.getValue(), lblParameters, labelsGroup);
            var pcBuffer = new THREE.PointCloud( geometry, shaderMaterial);

            meshesGroup.add(pcBuffer);
            meshesGroup.add(labelsGroup);
            scene.addOverlayLayer(meshFile, plug.getName(), meshesGroup);
        }

        scene.addOverlayLayer(meshFile, plug.getName(), meshesGroup);
    };

    function getcentroid(boundingBox, position){
        var xmin = boundingBox.min.x;
        var xmax = boundingBox.max.x;
        var ymin = boundingBox.min.y;
        var ymax = boundingBox.max.y;
        var zmin = boundingBox.min.z;
        var zmax = boundingBox.max.z;

        var bWidth = ( xmin > xmax ) ? xmin - xmax : xmax - xmin;
        var bHeight = ( ymin > ymax ) ? ymin - ymax : ymax - ymin;
        var bDepth = ( zmin > zmax ) ? zmin - zmax : zmax - zmin;

        var centroidX = xmin + ( bWidth / 2 ) + position.x;
        var centroidY = ymin + ( bHeight / 2 )+ position.y;
        var centroidZ = zmin + ( bDepth / 2 ) + position.z;

        return new THREE.Vector3(centroidX, centroidY, centroidZ);
    }

    function sqr(x) { return x * x }
    function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) + sqr(v.z - w.z) }
    function distToSegment(p, v, w) {
        var a1 = p.x*v.y + v.x*w.y + w.x*p.y - (p.y*v.x + v.y*w.x + w.y*p.x);
        var a2 = p.y*v.z + v.y*w.z + w.y*p.z - (p.z*v.y + v.z*w.y + w.z*p.y);
        var a3 = p.x*v.z + v.x*w.z + w.x*p.z - (p.z*v.x + v.z*w.x + w.z*p.x);
        var A = 1.0/2.0 * Math.sqrt( sqr(a1) + sqr(a2) + sqr(a3) );
        var r = Math.sqrt(dist2(w,v));
        return 2 * A / r;
    }

    function chooseX(camera, centroid, bboxmax, bboxmin){
        //axis 1-0
        var p0 = new THREE.Vector3(bboxmax.x, bboxmax.y, bboxmax.z);
        var p1 = new THREE.Vector3(bboxmin.x, bboxmax.y, bboxmax.z);
        //axis 2-3
        var p2 = new THREE.Vector3(bboxmin.x, bboxmin.y, bboxmax.z);
        var p3 = new THREE.Vector3(bboxmax.x, bboxmin.y, bboxmax.z);
        //axis 5-4
        var p4 = new THREE.Vector3(bboxmax.x, bboxmax.y, bboxmin.z);
        var p5 = new THREE.Vector3(bboxmin.x, bboxmax.y, bboxmin.z);
        //axis 6-7
        var p6 = new THREE.Vector3(bboxmin.x, bboxmin.y, bboxmin.z);
        var p7 = new THREE.Vector3(bboxmax.x, bboxmin.y, bboxmin.z);

        var pts = getVerticesIn2dScreenCoord(
                                             camera,
                                             centroid,
                                             p0.clone(), p1.clone(), p2.clone(), p3.clone(),
                                             p4.clone(), p5.clone(), p6.clone(), p7.clone()
                                            );

        var x0 = distToSegment(centroid, pts[0], pts[1]);
        var x1 = distToSegment(centroid, pts[3], pts[2]);
        var x2 = distToSegment(centroid, pts[4], pts[5]);
        var x3 = distToSegment(centroid, pts[7], pts[6]);

        var max = Math.max(x0,x1,x2,x3);

        switch(max){
            case x0: return { max:p0, min:p1 };
                     break;
            case x1: return { max:p3, min:p2 };
                     break;
            case x2: return { max:p4, min:p5 };
                     break;
            default: return { max:p7, min:p6 };
        }
    }

    function chooseY(camera, centroid, bboxmax, bboxmin){
        //axis 1-2
        var p1 = new THREE.Vector3(bboxmin.x, bboxmax.y, bboxmax.z);
        var p2 = new THREE.Vector3(bboxmin.x, bboxmin.y, bboxmax.z);
        //axis 0-3
        var p0 = new THREE.Vector3(bboxmax.x, bboxmax.y, bboxmax.z);
        var p3 = new THREE.Vector3(bboxmax.x, bboxmin.y, bboxmax.z);
        //axis 4-7
        var p4 = new THREE.Vector3(bboxmax.x, bboxmax.y, bboxmin.z);
        var p7 = new THREE.Vector3(bboxmax.x, bboxmin.y, bboxmin.z);
        //axis 5-6
        var p5 = new THREE.Vector3(bboxmin.x, bboxmax.y, bboxmin.z);
        var p6 = new THREE.Vector3(bboxmin.x, bboxmin.y, bboxmin.z);

        var pts = getVerticesIn2dScreenCoord(
                                             camera,
                                             centroid,
                                             p0.clone(), p1.clone(), p2.clone(), p3.clone(),
                                             p4.clone(), p5.clone(), p6.clone(), p7.clone()
                                            );

        var x0 = distToSegment(centroid, pts[1], pts[2]);
        var x1 = distToSegment(centroid, pts[0], pts[3]);
        var x2 = distToSegment(centroid, pts[4], pts[7]);
        var x3 = distToSegment(centroid, pts[5], pts[6]);

        var max = Math.max(x0,x1,x2,x3);

        switch(max){
            case x0: return { max:p1, min:p2 };
                     break;
            case x1: return { max:p0, min:p3 };
                     break;
            case x2: return { max:p4, min:p7 };
                     break;
            default: return { max:p5, min:p6 };
        }
    }

    function chooseZ(camera, centroid, bboxmax, bboxmin){
        //axis 0-4
        var p0 = new THREE.Vector3(bboxmax.x, bboxmax.y, bboxmax.z);
        var p4 = new THREE.Vector3(bboxmax.x, bboxmax.y, bboxmin.z);
        //axis 1-5
        var p1 = new THREE.Vector3(bboxmin.x, bboxmax.y, bboxmax.z);
        var p5 = new THREE.Vector3(bboxmin.x, bboxmax.y, bboxmin.z);
        //axis 3-7
        var p3 = new THREE.Vector3(bboxmax.x, bboxmin.y, bboxmax.z);
        var p7 = new THREE.Vector3(bboxmax.x, bboxmin.y, bboxmin.z);
        //axis 2-6
        var p2 = new THREE.Vector3(bboxmin.x, bboxmin.y, bboxmax.z);
        var p6 = new THREE.Vector3(bboxmin.x, bboxmin.y, bboxmin.z);

        var pts = getVerticesIn2dScreenCoord(
                                             camera,
                                             centroid,
                                             p0.clone(), p1.clone(), p2.clone(), p3.clone(),
                                             p4.clone(), p5.clone(), p6.clone(), p7.clone()
                                            );

        var x0 = distToSegment(centroid, pts[0], pts[4]);
        var x1 = distToSegment(centroid, pts[1], pts[5]);
        var x2 = distToSegment(centroid, pts[3], pts[7]);
        var x3 = distToSegment(centroid, pts[2], pts[6]);

        var max = Math.max(x0,x1,x2,x3);

        switch(max){
            case x3: return { max:p2, min:p6 };
                     break;
            case x2: return { max:p3, min:p7 };
                     break;
            case x1: return { max:p1, min:p5 };
                     break;
            default: return { max:p0, min:p4 };
        }
    }

    function getVerticesIn2dScreenCoord(camera, centroid, pts){
        var screenCoordPts = new Array();
        var $canvas = $('canvas')[0];
        var widthHalf = 0.5*$canvas.width;
        var heightHalf = 0.5*$canvas.height;

        centroid.project(camera);
        centroid.x = ( centroid.x * widthHalf ) + widthHalf;
        centroid.y = - ( centroid.y * heightHalf ) + heightHalf;

        var start = 2;
        for(var i=start; i<arguments.length; ++i){
            arguments[i].project(camera);
            arguments[i].x = ( arguments[i].x * widthHalf ) + widthHalf;
            arguments[i].y = - ( arguments[i].y * heightHalf ) + heightHalf;
            screenCoordPts[i-start] = arguments[i];
        }
        return screenCoordPts;
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
    function generatePointCloudGeometry(bboxmax, bboxmin, q, w, e, minorFactor, majorFactor, lblParameters, labelsgroup){
        var x, y, z, k, xCenter=0, yCenter=0, zCenter=0;

        var geometry = new THREE.BufferGeometry();
        var positions = new Array();
        var pntTypes = new Array();
        var pntMinSizes = new Array();

        //x axis
        var max=q.max;
        var min=q.min;
        var epsilon = (max.x - min.x) * DEFAULTS.epsilonPercentage;
        var quoteOffset = epsilon/0.2;
        var labelOffset = epsilon*DEFAULTS.spriteOffset*3.0/2.0;
        var id = 0;
        var i = 0;
        k = 0;
        x = max.x;
        y = min.y + (min.y==bboxmin.y ? -quoteOffset : +quoteOffset );
        z = max.z + (min.z==bboxmin.z ? -quoteOffset : +quoteOffset );

        var start = true;
        var x,x0 = max.x, x1 = max.x,xsupp = undefined;

        var startingPoint = Math.floor( max.x / majorFactor);
        if(startingPoint == 0) startingPoint = -1;
        else if(startingPoint*majorFactor == max.x) start = false;

        while(x0>=min.x || x1>=min.x){

            //first minor quotes
            if(x0>=min.x){
                x = x0;
                x0 -=minorFactor;

                pntMinSizes[i] = DEFAULTS.minSize;
                pntTypes[i++] = DEFAULTS.minPointSize;

                positions[(3 * k) + id] = x;
                positions[(3 * k + 1) + id] = y;
                positions[(3 * k + 2) + id] = z;

                k++;
            }

            //then major quotes
            if(x1 >= min.x){
                x = x1;
                x1 = (start ? startingPoint*majorFactor : (xsupp==undefined? x1 - majorFactor : (xsupp==x1?x1-majorFactor:xsupp)) );
                if(start) start=false;
                xsupp = undefined;

                //calculate the neighborhood between x and rispectively max.x, 0, min.x values
                var maxdistance = ( x-max.x>=0 ? x-max.x : (x-max.x)*-1 ) / 2;
                var middistance = ( x>=0 ? x : -x ) / 2;
                var mindistance = ( x-min.x>=0 ? x-min.x : (x-min.x)*-1 ) / 2;

                if( maxdistance<epsilon || middistance<epsilon || mindistance<epsilon ){

                    if(maxdistance<epsilon) x = max.x;
                    else if(middistance<epsilon) x = 0;
                    else x = min.x;

                    pntMinSizes[i] = DEFAULTS.minSize;
                    pntTypes[i++] = DEFAULTS.majPointSize;
                    lblParameters.fontWeight = "bold";
                    var sprite = makeTextSprite(
                                                (x<0?(x*-1).toFixed(2):x.toFixed(2)),
                                                { 'x' : x + (max.x==bboxmax.x ? +labelOffset : -labelOffset), 'y' : y, 'z': z },
                                                lblParameters
                                               );
                    labelsgroup.add( sprite );

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    k++;

                    if(xsupp==undefined){
                        if(x>0 && x1<0){
                            xsupp = x1;
                            x1 = 0;
                        }else if(x>min.x && x1<min.x){
                            xsupp = x1;
                            x1 = min.x;
                        }
                    }else
                        x1=xsupp;
                }else{
                    if(xsupp==undefined){
                        if(x>0 && x1<0){
                            xsupp = x1;
                            x1 = 0;
                        }else if(x>min.x && x1<min.x){
                            xsupp = x1;
                            x1 = min.x;
                        }

                        pntMinSizes[i] = DEFAULTS.minSize;
                        pntTypes[i++] = DEFAULTS.medPointSize;
                        lblParameters.fontWeight = "normal";
                        var sprite = makeTextSprite(
                                                    (x<0?(x*-1).toFixed(2):x.toFixed(2)),
                                                    { 'x' : x + (max.x==bboxmax.x ? +labelOffset : -labelOffset), 'y' : y, 'z': z },
                                                    lblParameters
                                                   );
                        labelsgroup.add( sprite );

                        positions[(3 * k) + id] = x;
                        positions[(3 * k + 1) + id] = y;
                        positions[(3 * k + 2) + id] = z;

                        k++;
                    }else
                        x1=xsupp;
                }
            }
        }

        //y axis
        max=w.max;
        min=w.min;
        id = k * 3;
        k = 0;
        x = max.x + (max.x==bboxmax.x ? +quoteOffset : -quoteOffset );
        y = max.y;
        z = max.z + (min.z==bboxmin.z ? -quoteOffset : +quoteOffset );

        start=true;
        var y,y0 = max.y, y1 = max.y,ysupp = undefined;

        startingPoint = Math.floor( max.y / majorFactor);
        if(startingPoint == 0) startingPoint = -1;
        else if(startingPoint*majorFactor == max.y) start = false;

        while(y0>=min.y || y1>=min.y){

            //first minor quotes
            if(y0>=min.y){
                y = y0;
                y0 -=minorFactor;

                pntMinSizes[i] = DEFAULTS.minSize;
                pntTypes[i++] = DEFAULTS.minPointSize;

                positions[(3 * k) + id] = x;
                positions[(3 * k + 1) + id] = y;
                positions[(3 * k + 2) + id] = z;

                k++;
            }

            //then major quotes
            if(y1 >= min.y){
                y = y1;
                y1 = (start ? startingPoint*majorFactor:(ysupp==undefined? y1 - majorFactor : (ysupp==y1?y1-majorFactor:ysupp)) );
                if(start) start=false;
                ysupp = undefined;

                var maxdistance = ( y-max.y>=0 ? y-max.y : (y-max.y)*-1 ) / 2;
                var middistance = ( y>=0 ? y : -y ) / 2;
                var mindistance = ( y-min.y>=0 ? y-min.y : (y-min.y)*-1 ) / 2;

                if( maxdistance<epsilon || middistance<epsilon || mindistance<epsilon ){

                    if(maxdistance<epsilon) y = max.y;
                    else if(middistance<epsilon) y = 0;
                    else y = min.y;

                    pntMinSizes[i] = DEFAULTS.minSize;
                    pntTypes[i++] = DEFAULTS.majPointSize;
                    lblParameters.fontWeight = "bold";
                    var sprite = makeTextSprite(
                                                (y<0?(y*-1).toFixed(2):y.toFixed(2)),
                                                { 'x' : x + (max.x==bboxmax.x ? +labelOffset : -labelOffset), 'y' : y, 'z': z },
                                                lblParameters
                                               );
                    labelsgroup.add( sprite );

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    k++;
                    if(ysupp==undefined){
                        if(y>0 && y1<0){
                            ysupp = y1;
                            y1 = 0;
                        }else if(y>min.y && y1<min.y){
                            ysupp = y1;
                            y1 = min.y;
                        }
                    }else
                        y1=ysupp;
                }else{
                    if(ysupp==undefined){
                        if(y>0 && y1<0){
                            ysupp = y1;
                            y1 = 0;
                        }else if(y>min.y && y1<min.y){
                            ysupp = y1;
                            y1 = min.y;
                        }

                        pntMinSizes[i] = DEFAULTS.minSize;
                        pntTypes[i++] = DEFAULTS.medPointSize;
                        lblParameters.fontWeight = "normal";
                        var sprite = makeTextSprite(
                                                    (y<0?(y*-1).toFixed(2):y.toFixed(2)),
                                                    { 'x' : x + (max.x==bboxmax.x ? +labelOffset : -labelOffset), 'y' : y, 'z': z },
                                                    lblParameters
                                                   );
                        labelsgroup.add( sprite );

                        positions[(3 * k) + id] = x;
                        positions[(3 * k + 1) + id] = y;
                        positions[(3 * k + 2) + id] = z;

                        k++;
                    }else
                        y1=ysupp;
                }
            }
        }

        //z axis
        max=e.max;
        min=e.min;
        id += k * 3;
        k = 0;
        x = max.x + (max.x==bboxmax.x ? +quoteOffset : -quoteOffset );
        y = max.y + (max.y==bboxmax.y ? +quoteOffset : -quoteOffset );
        z = max.z;

        start=true;
        var z,z0 = max.z, z1 = max.z,zsupp = undefined;

        startingPoint = Math.floor( max.z / majorFactor);
        if(startingPoint == 0) startingPoint = -1;
        else if(startingPoint*majorFactor == max.z) start = false;

        while(z0>=min.z || z1>=min.z){

            //first minor quotes
            if(z0>=min.z){
                z = z0;
                z0 -=minorFactor;

                pntMinSizes[i] = DEFAULTS.minSize;
                pntTypes[i++] = DEFAULTS.minPointSize;

                positions[(3 * k) + id] = x;
                positions[(3 * k + 1) + id] = y;
                positions[(3 * k + 2) + id] = z;

                k++;
            }

            //then major quotes
            if(z1 >= min.z){
                z = z1;
                z1 = (start ? startingPoint*majorFactor : (zsupp==undefined? z1 - majorFactor : (zsupp==z1?z1-majorFactor:zsupp)) );
                if(start) start=false;
                zsupp = undefined;

                var maxdistance = ( z-max.z>=0 ? z-max.z : (z-max.z)*-1 ) / 2;
                var middistance = ( z>=0 ? z : -z ) / 2;
                var mindistance = ( z-min.z>=0 ? z-min.z : (z-min.z)*-1 ) / 2;

                if( maxdistance<epsilon || middistance<epsilon || mindistance<epsilon ){

                    if(maxdistance<epsilon) z = max.z;
                    else if(middistance<epsilon) z = 0;
                    else z = min.z;

                    pntMinSizes[i] = DEFAULTS.minSize;
                    pntTypes[i++] = DEFAULTS.majPointSize;
                    lblParameters.fontWeight = "bold";
                    var sprite = makeTextSprite(
                                                (z<0?(z*-1).toFixed(2):z.toFixed(2)),
                                                { 'x' : x + (max.x==bboxmax.x ? +labelOffset : -labelOffset), 'y' : y, 'z': z },
                                                lblParameters
                                               );
                    labelsgroup.add( sprite );

                    positions[(3 * k) + id] = x;
                    positions[(3 * k + 1) + id] = y;
                    positions[(3 * k + 2) + id] = z;

                    k++;

                    if(zsupp==undefined){
                        if(z>0 && z1<0){
                            zsupp = z1;
                            z1 = 0;
                        }else if(z>min.z && z1<min.z){
                            zsupp = z1;
                            z1 = min.z;
                        }
                    }else
                        z1=zsupp;
                }else{
                    if(zsupp==undefined){
                        if(z>0 && z1<0){
                            zsupp = z1;
                            z1 = 0;
                        }else if(z>min.z && z1<min.z){
                            zsupp = z1;
                            z1 = min.z;
                        }

                        pntMinSizes[i] = DEFAULTS.minSize;
                        pntTypes[i++] = DEFAULTS.medPointSize;
                        lblParameters.fontWeight = "normal";
                        var sprite = makeTextSprite(
                                                    (z<0?(z*-1).toFixed(2):z.toFixed(2)),
                                                    { 'x' : x + (max.x==bboxmax.x ? +labelOffset : -labelOffset), 'y' : y, 'z': z },
                                                    lblParameters
                                                   );
                        labelsgroup.add( sprite );

                        positions[(3 * k) + id] = x;
                        positions[(3 * k + 1) + id] = y;
                        positions[(3 * k + 2) + id] = z;

                        k++;
                    }else
                        z1=zsupp;
                }
            }
        }

        positions = arrayToF32Array(positions.length, positions);
        pntMinSizes = arrayToF32Array(pntMinSizes.length, pntMinSizes);
        pntTypes = arrayToF32Array(pntTypes.length, pntTypes);

        geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute('pntMinSize', new THREE.BufferAttribute( pntMinSizes, 1 ) );
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
    	roundRect(context,
    	          borderThickness/2,
    	          borderThickness/2,
    	          textWidth + borderThickness,
    	          fontsize + borderThickness,
    	          6);
    	context.fillStyle = "rgba(255, 255, 255, 1.0)";
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
    	sprite.position.set( position.x , position.y, position.z);
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

        //MeshSizes dependent value! (0.1 is not always correct)
        textGeo.position.x = max.x + 0.1;
        textGeo.position.y = max.y;
        textGeo.position.z = max.z;

        return textGeo;
    }

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);