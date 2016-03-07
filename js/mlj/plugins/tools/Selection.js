

(function (plugin, core, scene) {

    var SELECTION_VERTEX=0;
    var SELECTION_FACES=1;
    var DEFAULTS = {
       selectionMode : 0
    };

    var plug = new plugin.Tool({
        name: "Selection Tool",
        tooltip: "Selection Tooltip",
        icon: "img/icons/color.png",
        toggle: true,
        on: false,
        updateOnLayerAdded: false
    }, DEFAULTS);

    var mode;
    plug._init = function (guiBuilder) {
        mode = guiBuilder.Choice({
            label: "Selection Mode",
            tooltip: "Choose one of the possible ways to select the current layer.",
            options: [
                {content: "Per Vertex", value: SELECTION_VERTEX, selected : true},
                {content: "Per Face", value: SELECTION_FACES}
            ],
            bindTo: (function() {
                var bindToFun = function (color) {
                    //enableSelection(true, DEFAULTS.selectionMode);
                };
                bindToFun.toString = function () {};
                return bindToFun;
            }())
        });
    };
    
    var enableSelection = function (enabled,  meshFile){
        var x1, x2, y1, y2;
        var selection = false;
        var gMOUSEUP = false;
        var gMOUSEDOWN = false;
        var selectionAdd; //true if the CTRL key is pressed
        var selectionSub; //true if the SHIFT hey is pressed
        /*
         * this function is used to initialize all the tool needed to active the selection and to remove them when 
         * selection mode will be disabled
         */
        var bindSelectionEvents=function(active){
            if(active){
                scene.getControls().enabled=false;
                $('#_3D').css('cursor','crosshair');
                $('#_3D').append('<div id="selection" class="tooldiv"></div>');
                $('#_3D').attr('onmousedown','return false');
                $('#_3D').bind('mouseup.selection',canMouseUp);
                $('#_3D').bind('mouseenter.selection',canMouseEnter);
                $('#_3D').bind('mouseleave.selection',canMouseLeave);
                $(document).bind('mouseup.selection',docMouseUp);
                $(document).bind('mousedown.selection',docMouseDown);
                $('#_3D').bind('mousedown.selection',canMouseDown);
                $('#_3D').bind('mousemove.selection',canMouseMove);
            }
            else{
                $('#_3D').unbind('mouseup.selection');
                $('#_3D').unbind('mouseenter.selection');
                $('#_3D').unbind('mouseleave.selection');
                $(document).unbind('mouseup.selection');
                $(document).unbind('mousedown.selection');
                $('#_3D').unbind('mousedown.selection');
                $('#_3D').unbind('mousemove.selection');
                $('#_3D').css('cursor','default');
                $('#selection').remove();
                $('#_3D').removeAttr('onmousedown');
                scene.getControls().enabled=true;
                scene.render();
            }
        }
        /*
         * set of fuctions used to properly display the bounding box used for the selection
         */
        function docMouseUp(event) {
            gMOUSEUP = true;
            gMOUSEDOWN = false;
        }
        function docMouseDown(event) {
            gMOUSEUP = false;
            gMOUSEDOWN = true;
        }
        /*
         * when mouseup event occor a bounding box has been created so we can move all the parameters needed to select
         * vertexes or faces in that bounding box to the c++ function
         */
        function canMouseUp(event) {
            if(!selectionAdd&&!selectionSub){ //if no key is pressed before select another box will be deselect all
                Module.SelectionNone(meshFile.ptrMesh(),true,true);
                scene.updateLayer(scene.getSelectedLayer());
            }
            //collection of parameters used to initialize the camera in the c++ function
            var near=scene.getCamera().near;
            var far=scene.getCamera().far;
            var width=$("#_3D").width();
            var height=$("#_3D").height();
            var bBox=new Float32Array([x1,y1,x2,y2]);
            var position=new Float32Array(scene.getCamera().position.toArray());
            var projectionMatrix=new Float32Array(scene.getCamera().projectionMatrix.toArray());
            var viewMatrix=new Float32Array(scene.getCamera().matrixWorldInverse.toArray());
            var modelMatrix=new Float32Array(MLJ.core.Scene.getScene().children[0].matrixWorld.toArray());
            //let's save the arrays on memory
            var npositionBytes=position.length*position.BYTES_PER_ELEMENT;
            var nprojMatrixBytes=projectionMatrix.length*projectionMatrix.BYTES_PER_ELEMENT;
            var nviewMatrixBytes=viewMatrix.length*viewMatrix.BYTES_PER_ELEMENT;
            var nmodelMatrixBytes=modelMatrix.length*modelMatrix.BYTES_PER_ELEMENT;
            var nbBoxBytes=bBox.length*bBox.BYTES_PER_ELEMENT;
            var positionPtr=Module._malloc(npositionBytes);
            var projMatrixPtr=Module._malloc(nprojMatrixBytes);
            var viewMatrixPtr=Module._malloc(nviewMatrixBytes);
            var modelMatrixPtr=Module._malloc(nmodelMatrixBytes);
            var bBoxPtr=Module._malloc(nbBoxBytes);
            //copy on heap
            for(var i=0;i<3;i++){
                setValue(positionPtr+(i*position.BYTES_PER_ELEMENT),position[i],"float");
            }
            for(var i=0;i<16;i++){
                setValue(projMatrixPtr+(i*projectionMatrix.BYTES_PER_ELEMENT),projectionMatrix[i],"float");
            }
            for(var i=0;i<16;i++){
                setValue(viewMatrixPtr+(i*viewMatrix.BYTES_PER_ELEMENT),viewMatrix[i],"float");
            }
            for(var i=0;i<16;i++){
                setValue(modelMatrixPtr+(i*modelMatrix.BYTES_PER_ELEMENT),modelMatrix[i],"float");
            }
            for(var i=0;i<4;i++){
                setValue(bBoxPtr+(i*bBox.BYTES_PER_ELEMENT),bBox[i],"float");
            }
            //defining the selection mode according with the avaiable kind of selection
            var smode;
            if(mode.getValue()==0){
                if(selectionAdd) smode=Module.SelectionMode.vertexOn;
                else if(selectionSub) smode=Module.SelectionMode.vertexOff;
                else smode=Module.SelectionMode.vertexOn;
            }
            else{
                if(selectionAdd) smode=Module.SelectionMode.faceOn;
                else if(selectionSub) smode=Module.SelectionMode.faceOff;
                else smode=Module.SelectionMode.faceOn;
            }
            Module.initSelection(meshFile.ptrMesh(), near, far, width, height, positionPtr, projMatrixPtr, viewMatrixPtr, modelMatrixPtr, bBoxPtr, smode );
            //let's free the memory
            Module._free(positionPtr);
            Module._free(projMatrixPtr);
            Module._free(viewMatrixPtr);
            Module._free(modelMatrixPtr);
            Module._free(bBoxPtr);
            scene.updateLayer(scene.getSelectedLayer());
            selection = false;
            $("#selection").hide();
        }
        function canMouseEnter(event) {
            (gMOUSEDOWN) ? selection = true : selection = false;
        }
        function canMouseLeave(event) {
            selection = false;
        }
        function canMouseDown(event) {
            selection = true;
            x1 = event.pageX - this.offsetLeft;
            y1 = event.pageY - this.offsetTop;
        }
        function canMouseMove(event) {
            if (selection) {
                x2 = event.pageX - this.offsetLeft;
                y2 = event.pageY - this.offsetTop;
                // Prevent the selection div to get outside of your frame
                (x2 < 0) ? selection = false : ($('#_3D').width() < x2) ? selection = false : (y2 < 0) ? selection = false : ($('#_3D').height() < y2) ? selection = false : selection = true;
                // If the mouse is inside your frame resize the selection div
                if (selection) {
                    // Calculate the div selection rectancle for positive and negative values
                    var TOP = (y1 < y2) ? y1 : y2;
                    var LEFT = (x1 < x2) ? x1 : x2;
                    var WIDTH = (x1 < x2) ? x2 - x1 : x1 - x2;
                    var HEIGHT = (y1 < y2) ? y2 - y1 : y1 - y2;
                    // Use CSS to place your selection div
                    $('#selection').css({
                        position: 'absolute',
                        zIndex: 5000,
                        left: LEFT,
                        top: TOP,
                        width: WIDTH,
                        height: HEIGHT
                    });
                    $('#selection').show();
                }
            }
        }
        function checkKeyPressed(event){
            if(event.altKey){
                bindSelectionEvents(false);
                event.preventDefault(); 
            }
            else if(event.shiftKey){
                selectionSub=true;
            }
            else if( event.ctrlKey){
                selectionAdd=true;
            }
        }
        function checkKeyReleased(e){
            var KeyID = (window.event) ? event.keyCode : e.keyCode;
            switch(KeyID)
            {
               case 18://alt
                    bindSelectionEvents(true);
               break; 

               case 17://CTRL
                   selectionAdd=false;
               break;
               
               case 16://SHIFT
                   selectionSub=false;
               break;
            }
        }
        if(enabled){
            bindSelectionEvents(enabled);
            $(document).bind('keydown.selection',checkKeyPressed);
            $(document).bind('keyup.selection',checkKeyReleased);
        }
        else{
            bindSelectionEvents(enabled);
            $(document).unbind('keydown.selection');
            $(document).unbind('keyup.selection');
        }
    }
    
    plug._applyTo = function (meshFile, on) {
        if(on){
            enableSelection(true, meshFile);
        }
        else{
            enableSelection(false,meshFile);    
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
