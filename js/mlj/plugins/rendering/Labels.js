
(function (plugin, core, scene) {


    var DEFAULTS = {
        textColor : new THREE.Color('#000000'),
        textSize : 1,
        bgColor : new THREE.Color('#FFFFFF'),
        bgOpacity : 1,
        showOn : 0,
        maxLabelsCount: 20
    };

    var plug = new plugin.Rendering({
        name: "Labels",
        tooltip: "Show labels on vertices",
        icon: "img/icons/labels.png",
        toggle: true,
        on: false,
    }, DEFAULTS);

    var labels = [];
    var meshFiles = [];
    //var updateLabels = false;
    var my3D = null;
    var myCanvas = null;
    var myBody = null;
    var layersWithLabels = 0;

    plug._init = function (guiBuilder) {

        labelWidget =  guiBuilder.Color({
            label: "Text Color",
            tooltip: "The color of text",
            color: "#" + DEFAULTS.textColor.getHexString(),
            bindTo: (function() {
                    var bindToFun = function (color, overlay) 
                        {
                            var key = overlay.name;
                            for(var i = 0; i < labels[key].length; i++)
                                labels[key][i].style.color = '#' + color.getHexString();
                        };
                        bindToFun.toString = function () { return 'textColor'; }
                        return bindToFun;
                }())
        });

        guiBuilder.Choice({
            label: "Labels on:",
            tooltip: "Show labels on all vertices or only on selected ones",
            options: [
                {content: "All", value: 0, selected: true },
                {content: "Selected", value: 1}
            ],
            bindTo: (function() {
                    var bindToFun = function (selection, overlay) 
                        {
                            var key = overlay.name;
                            var params = meshFiles[key].overlaysParams.getByKey(plug.getName());
                            params.showOn = selection;
                            plug._applyTo(meshFiles[key], false);
                            plug._applyTo(meshFiles[key], true);    
                        };

                        bindToFun.toString = function () { return '"showOn"'; }
                        return bindToFun;
                }())
        });

        guiBuilder.RangedFloat({
            label: "Text Size",
            tooltip: "The size of text",
            min: 0.5, max: 1.4, step: 0.1,
            defval: DEFAULTS.textSize,
            bindTo: (function() {
                    var bindToFun = function (size, overlay) 
                        {
                            var key = overlay.name;
                            for(var i = 0; i < labels[key].length; i++)
                                labels[key][i].style.fontSize = size + 'em';
                        };
                        bindToFun.toString = function () { return 'textSize'; }
                        return bindToFun;
                }())
        });
        /*
        guiBuilder.RangedFloat({
            label: "Label Opacity",
            tooltip: "The opacity of selected points",
            min: 0.0, max: 1, step: 0.01,
            defval: DEFAULTS.bgOpacity,
            bindTo: "bgOpacity"
        });
        */
        guiBuilder.Color({
            label: "Label Color",
            tooltip: "The color of labels",
            color: "#" + DEFAULTS.bgColor.getHexString(),
            bindTo: (function() {
                    var bindToFun = function (color, overlay) 
                        {
                            //var rgba = color.toArray();
                            //rgba[3] = params.bgOpacity;
                            var key = overlay.name;
                            for(var i = 0; i < labels[key].length; i++)
                                labels[key][i].style.backgroundColor = '#' + color.getHexString();
                                //'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
                        };

                        bindToFun.toString = function () { return 'bgColor'; }
                        return bindToFun;
                }())
        });

        guiBuilder.RangedFloat({
            label: "Max # of Labels",
            tooltip: "The max numeber of visualized labels",
            min: 1, max: 60, step: 1,
            defval: DEFAULTS.maxLabelsCount,
            bindTo: (function() {
                    var bindToFun = function (size, overlay) 
                        {
                            var key = overlay.name;
                            var asize = labels[key].length;
                            if(asize > size)
                            {
                                //remove some
                                for(var i = size; i < asize; i++)
                                {
                                    labels[key][i].remove();
                                }
                            }
                            else if(asize < size)
                            {
                                //add some
                                plug._applyTo(meshFiles[key], false);
                                plug._applyTo(meshFiles[key], true); 
                            }
                        };
                        bindToFun.toString = function () { return 'maxLabelsCount'; }
                        return bindToFun;
                }())
        });

    };

    

    plug._applyTo = function (meshFile, on) {

        if (on) 
        {
            var params = meshFile.overlaysParams.getByKey(plug.getName());

            //Getting the mesh vertices
            var vv = {};
            if(params.showOn == 0)
                vv = meshFile.threeMesh.geometry.getAttribute('position');
            else
            {
                
                const SIZEOF_FLOAT = 4;
                const NUM_BYTES_PER_VERTEX = 3 * SIZEOF_FLOAT;

                // call the c++ function which should fill the points coords array from mesh data
                var pointsCoordsPtr = Module.buildSelectedPointsCoordsVec(meshFile.ptrMesh());

                // store a reference in mesh object for deallocation when the user deactivate this plugin
                meshFile.pointsCoordsPtr = pointsCoordsPtr;

                // read first float as the effective number of selected points
                var numSelectedPoints = Module.getValue(pointsCoordsPtr, 'float');

                if (numSelectedPoints === 0) {
                    vv.length = 0;
                }
                else
                {
                    // compute correct number of bytes of useful data
                    var numBytesUsefulData = numSelectedPoints * NUM_BYTES_PER_VERTEX;

                    // get a float-wise view on the points coords byte array
                    vv.length = numBytesUsefulData / SIZEOF_FLOAT;
                    vv.array = new Float32Array(Module.HEAPU8.buffer, pointsCoordsPtr + SIZEOF_FLOAT, numBytesUsefulData / SIZEOF_FLOAT);
                }

            }


            my3D = $('#_3D');
            myCanvas = $('canvas');
            myBody = document.getElementsByTagName('body')[0];

            //var labels = [];
            var name = meshFile.name.replace(/ /g, '') + "_label";
            var myMeshFile = meshFile;
            meshFiles[name] = myMeshFile;
            //Creating label, one for vertex   
            labels[name] = [];     
            for(var ii = 0; ii < vv.length && ii/3 <= params.maxLabelsCount; ii+=3)
            {
                var pos = toScreenPosition(vv.array[ii],vv.array[ii+1],vv.array[ii+2]);
                labels[name].push(addLabel(ii/3 + "", name, my3D.position().left + pos.x, pos.y));
            }
            updateLabels();

            //Using an empty mesh to create a blank overlay to get the name of the labels to be changed in the widgets functions
            var foo = new THREE.Mesh();
            foo.name = name;
            scene.addOverlayLayer(meshFile, plug.getName(), foo); 
            
            //Binding the update function to the mouse events
            myCanvas.bind("mousewheel", updateLabels);
            myCanvas.bind("mousedown", startUpdating);
            myCanvas.bind("mouseup", stopUpdating);
            $(window).bind("resize", updateLabels);
            //$(document).bind("SceneLayerRemoved", removeLabels);
            $('#mlj-tools-pane').bind("mouseup", hideLabels)

            layersWithLabels++;
            
            /*
            function removeLabels(event, mesh)
            {
                console.log(mesh.name + '_label removing...');
                
                $('.' + mesh.name + '_label').remove();
                labels[mesh.name + '_label'] = [];    

                if(--layersWithLabels <= 0)
                {
                    myCanvas.unbind("mousemove mousewheel", updateLabels);
                    myCanvas.unbind("mousedown", startUpdating);
                    myCanvas.unbind("mouseup", stopUpdating);
                    $(window).unbind("resize", updateLabels);
                    $('#mlj-tools-pane').unbind("mouseup", hideLabels)
                    $(document).unbind("SceneLayerRemoved", removeLabels);
                }

                scene.removeOverlayLayer(meshFile, plug.getName());
                return;
            }
            */
            
            function startUpdating(){myCanvas.bind("mousemove", updateLabels);}
            function stopUpdating(){myCanvas.unbind("mousemove", updateLabels);}

            function hideLabels()
            {
                //Timer used to allows other functions to set the visibility parameter of the mesh before using it
                if(myMeshFile.getThreeMesh())
                    setTimeout( function(){
                        var visibility = myMeshFile.getThreeMesh().visible ? 'visible' : 'hidden';
                        for(var i = 0; i < labels[name].length; i++)
                            labels[name][i].style.visibility = visibility;
                        
                        updateLabels();
                    }, 5);
                
            }

            function updateLabels()
            {
                if(labels[name] == undefined || labels[name].length <= 0 || !myMeshFile.getThreeMesh().visible)
                    return;
                
                var ii=0; var jj = 0;
                while(ii < vv.length && jj < labels[name].length)
                {
                    var pos = toScreenPosition(vv.array[ii],vv.array[ii+1],vv.array[ii+2]);
                    
                    labels[name][jj].style.top = pos.y + 'px';
                    labels[name][jj].style.left = my3D.position().left + pos.x + 'px';

                    //hide labels if outside the 3D canvas
                    if(pos.x < 0 || pos.x > myCanvas.attr('width') || pos.y < 0 || pos.y > myCanvas.attr('height'))
                        labels[name][jj].style.visibility = 'hidden';
                    else
                        labels[name][jj].style.visibility = 'visible';
                    
                    jj++;
                    ii += 3;
                }
            }

            //Convert 3D world position to canvas position
            function toScreenPosition(x, y, z)
            {

                var vector = new THREE.Vector3(x, y, z);
                var camera = MLJ.core.Scene.getCamera();
                camera.updateProjectionMatrix();

                // map to normalized device coordinate (NDC) space
                vector.project(camera);

                // map to 2D screen space
                vector.x = Math.round( (   vector.x + 1 ) * myCanvas.attr('width')  / 2 );
                vector.y = Math.round( ( - vector.y + 1 ) * myCanvas.attr('height') / 2 );
                vector.z = 0;
                                                
                return { 
                    x: Math.round(vector.x),
                    y: Math.round(vector.y)
                };

            }

            function addLabel(txt, layerName, left, top)
            {
                var text = document.createElement('div');
                
                text.style.position = 'absolute';
                text.style.zIndex = 1; 
                text.style.width = 'auto';
                text.style.height = 'auto';
                text.style.color = '#' + params.textColor.getHexString();
                text.style.fontSize = params.textSize + 'em';
                text.style.backgroundColor = '#' + params.bgColor.getHexString();
                text.style.borderRadius = "3px";
                text.style.padding =  "2px"; 
                text.innerHTML = txt;
                text.className = layerName;   
                text.style.top = top + 'px';
                text.style.left = left + 'px';
                text.style.pointerEvents = 'none'; 

                myBody.appendChild(text);            

                return text;
            }
        }
        else
        {
            name = meshFile.name.replace(/ /g, '') + '_label';
            //$('.' + meshFile.name.replace(/ /g, '') + '_label').remove();
            $('.' + name).remove();
            labels[name] = []; 
            if(--layersWithLabels <= 0)
            {   
                myCanvas.unbind("mousemove mousewheel", updateLabels);
                myCanvas.unbind("mousedown", startUpdating);
                myCanvas.unbind("mouseup", stopUpdating);
                $(window).unbind("resize", updateLabels);
                $('#mlj-tools-pane').unbind("mouseup", hideLabels)
            }
            scene.removeOverlayLayer(meshFile, plug.getName());
            return;
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);