
(function (plugin, core, scene) {


    var DEFAULTS = {
        textColor : new THREE.Color('#000000'),
        textSize : 1,
        bgColor : new THREE.Color('#FFFFFF'),
        bgOpacity : 1,
    };

    var plug = new plugin.Rendering({
        name: "Labels",
        tooltip: "Show labels on vertices",
        icon: "img/icons/labels.png",
        toggle: true,
        on: false,
    }, DEFAULTS);

    var labels = [];
    var updateLabels = false;

    plug._init = function (guiBuilder) {

        labelWidget =  guiBuilder.Color({
            label: "Text Color",
            tooltip: "The color of text",
            color: "#" + DEFAULTS.textColor.getHexString(),
            bindTo: (function() {
                    var bindToFun = function (color) 
                        {

                            for(var i = 0; i < labels.length; i++)
                                labels[i].style.color = '#' + color.getHexString();
                        };
                        bindToFun.toString = function () { return 'textColor'; }
                        return bindToFun;
                }())
        });

        guiBuilder.RangedFloat({
            label: "Text Size",
            tooltip: "The size of text",
            min: 0.5, max: 1.4, step: 0.1,
            defval: DEFAULTS.textSize,
            bindTo: (function() {
                    var bindToFun = function (size) 
                        {
                            for(var i = 0; i < labels.length; i++)
                                labels[i].style.fontSize = size + 'em';
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
                    var bindToFun = function (color) 
                        {
                            //var rgba = color.toArray();
                            //rgba[3] = params.bgOpacity;

                            for(var i = 0; i < labels.length; i++)
                                labels[i].style.backgroundColor = '#' + color.getHexString();
                                //'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
                        };

                        bindToFun.toString = function () { return 'bgColor'; }
                        return bindToFun;
                }())
        });

    };

    

    plug._applyTo = function (meshFile, on) {

        if (on === false) {
            $('.label').remove();
            labels = [];    
            $("canvas").unbind("mousedown mousemove", updateLabels);
            return;
        }

        var params = meshFile.overlaysParams.getByKey(plug.getName());

        //Getting the mesh vertices
        var vv = meshFile.threeMesh.geometry.getAttribute('position');
        
        //Creating label, one for vertex        
        for(var ii = 0; ii < vv.length; ii+=3)
        {
            var pos = toScreenPosition(vv.array[ii],vv.array[ii+1],vv.array[ii+2]);
            labels.push(addLabel(Math.round(ii/3) + "", 'body', $('#_3D').position().left + pos.x, pos.y));
        }
        
        //Binding the update function to the mouse events
        $('canvas').bind("mousedown mousemove mousewheel", updateLabels);

        function updateLabels()
        {
            for(var ii = 0; labels.length > 0 && ii < vv.length; ii+=3)
            {
                var pos = toScreenPosition(vv.array[ii],vv.array[ii+1],vv.array[ii+2]);
                var lIndex = Math.round(ii/3);
                labels[lIndex].style.top = pos.y + 'px';
                labels[lIndex].style.left = $('#_3D').position().left + pos.x + 'px';
            }
        }

        //Convert 3D world position to canvas position
        function toScreenPosition(x, y, z)
        {

            var vector = new THREE.Vector3(x, y, z);
            var canvas = $('canvas');
            var camera = MLJ.core.Scene.getCamera();
            camera.updateProjectionMatrix();

            // map to normalized device coordinate (NDC) space
            vector.project(camera);

            // map to 2D screen space
            vector.x = Math.round( (   vector.x + 1 ) * canvas.attr('width')  / 2 );
            vector.y = Math.round( ( - vector.y + 1 ) * canvas.attr('height') / 2 );
            vector.z = 0;
                                            
            return { 
                x: Math.round(vector.x),
                y: Math.round(vector.y)
            };

        }

        function addLabel(txt, target, left, top)
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
            text.className = "label";   
            text.style.top = top + 'px';
            text.style.left = left + 'px';

            $(target).append(text);            

            return text;
        }

    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);