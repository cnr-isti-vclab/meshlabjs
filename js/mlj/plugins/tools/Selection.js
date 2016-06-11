

(function (plugin, core, scene) {

    var SELECTION_VERTEX=0; //used to perform vertex selection
    var SELECTION_FACES=1; // used to perform face selection
    var fireKeyEvent; // this will be the function that will manage the key down and key up events
    var clearButton; // this is a button on the tool's toolbar that allow us to select non on the current mesh
    var invertButton; // this is a button on the tool's toolbar that allow us to invert a previous selection on the mesh per faces or vertices
    var removeButton;// this one instead removes all the vertices or faces selected previously
    
    var DEFAULTS = {
       selectionMode : 0
    };

    var plug = new plugin.Tool({
        name: "Selection Tool",
        tooltip: "Selection Tooltip",
        icon: "img/icons/selectTool.png",
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
                {content: "Per Face", value: SELECTION_FACES}]
        });
    };
    /**
     * This function encloses all the methods needed to initialize the selection tool, the boolean paramater <code> enabled </code> 
     * specify when it should be activated and what are the operations to perform
     * @param {boolean} enabled - boolean value used to distinguish between the activation or the deactivation of the selection tool
     * 
     */
    var enableSelection = function (enabled){
        var x1, x2, y1, y2; //these are the vertices of the selection bounding box the user will paint on the screen
        var selection = false; // true while the selection bounding box is displayed
        var gMOUSEUP = false; // true when the mouse isn't clicked
        var gMOUSEDOWN = false; // true while the user is clicking the mouse 
        var selectionAdd; //true if the CTRL key is pressed
        var selectionSub; //true if the SHIFT key is pressed
        
        /**** AUXILIARY FUNCTION - BEGIN ****/
        
        /**
         * This function is used to initialize all the tool needed to active the selection and to remove them when 
         * selection mode will be disabled
         * @param {boolean} active - true to change the cursor, to bind a set of events listeners and so on, false to restore the original 
         * shape of the cursor and to unbind all the listeners because the selection tool is been disabled
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
        };
        /**
         * Triggered when a mouseup event occurs in the whole web page
         */
        function docMouseUp(event) {
            gMOUSEUP = true;
            gMOUSEDOWN = false;
        }
        /*
         * Triggered when a mousedown event occurs in the whole web page
         */
        function docMouseDown(event) {
            gMOUSEUP = false;
            gMOUSEDOWN = true;
        }
        /*
         * Triggered when a mouseup event occurs in the render pane. At this moment the selection bounding box is fixed thanks to
         * canMouseDown and canMouseMove methods. So this function get all the informations, from the render enviroment, needed to turn 
         * the bounding box vertices, expressed in screen coordinates, into local coordinates about the actual mesh; so that a c++ function can 
         * select all vertices or faces included in the selected bounding box on the mesh itself.
         * 
        */
        function canMouseUp(event) {
            var meshFile=scene.getSelectedLayer();
            if(!selectionAdd&&!selectionSub){ //if no key is pressed before select another box will be deselect all
                MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection None")._applyTo(meshFile);
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
            var modelMatrix=new Float32Array(meshFile.getThreeMesh().matrixWorld.toArray());
            
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
            
            //coping the arrays on heap
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
            
            //defining the selection mode according with the available kind of selections
            var smode;
            if(mode.getValue()==0){//vertex selection mode
                if(selectionAdd) smode=Module.SelectionMode.vertexOn; //the previous selected vertices are preserved
                else if(selectionSub) smode=Module.SelectionMode.vertexOff; //the previous selected vertices that are included in the actual bounding box are deselected
                else smode=Module.SelectionMode.vertexOn; //a new vertex selection is performed
            }
            else{//face selection mode
                if(selectionAdd) smode=Module.SelectionMode.faceOn;
                else if(selectionSub) smode=Module.SelectionMode.faceOff;
                else smode=Module.SelectionMode.faceOn;
            }
            
            /**
             * This function receives a set of parameters by which it is able to turn the screen bounding box into a local one about a specific mesh,
             * in that way a simple VCG function will be able to manipulate the meshFile object and select the vertices or faces
             * included in the bounding box on the mesh itself.
             * @param {Object} meshFile - this is the actual mesh to be selected, it is turned into a form a c++ function is able to understand
             * @param {int} near - this is the camera's near parameter
             * @param {int} far - this is the camera's far parameter
             * @param {int} width - width of the render pane
             * @param {int} height - height of the render pane
             * @param {Object} positionPtr - link to a location where is stored the position of the camera in the actual render enviroment
             * @param {Object} projMatrixPtr - link to a location where is stored the projection matrix of the camera
             * @param {Object} viewMatrixPtr - link to a location where is stored the view matrix of the camera
             * @param {Object} modelMatrixPtr - link to a location where is stored the model matrix that is the matrixWorld of the selected mesh
             * @param {Object} bBoxPtr - link to the location where is stored the vertices of the screen bounding box
             * @param {Object} smode - this variable specifies the kind of selection will be performed; we can distinguish several kinds of
             * selection mode: 1) vertexSelection; 2) additional vertex selection where the previous selection is preserved and a new one is added
             * on the mesh; 3) subtraction vertex selection, where all the previous selected vertices, which are in the actual bounding box, are deleted
             * 4) same for the face selection mode
             */
            Module.initSelection(meshFile.ptrMesh(), near, far, width, height, positionPtr, projMatrixPtr, viewMatrixPtr, modelMatrixPtr, bBoxPtr, smode );
            
            //let's free the memory
            Module._free(positionPtr);
            Module._free(projMatrixPtr);
            Module._free(viewMatrixPtr);
            Module._free(modelMatrixPtr);
            Module._free(bBoxPtr);
            //this event reloads the selected layer by the rendering point of view
            $(document).trigger("SceneLayerUpdatedRendering",[meshFile]);
            scene.render();
            selection = false;
            $("#selection").hide(); //end of selection
            //enable or disable the tool buttons (clear, remove and invert) according with if some vertex or face is selected on the mesh or not
            var pointsCoordsPtr = Module.buildSelectedPointsCoordsVec(meshFile.ptrMesh());
            var numSelectedPoints = Module.getValue(pointsCoordsPtr, 'float');
            if(numSelectedPoints>0){
               plug._disableButtons(false,clearButton,removeButton,invertButton);//all tool buttons are enabled
            }
            else{
               plug._disableButtons(true,clearButton,removeButton,invertButton);//all tool buttons are disabled
            }
        }
        /*
         * Triggered when a mouseEnter event occurs in the render pane
         */
        function canMouseEnter(event) {
            (gMOUSEDOWN) ? selection = true : selection = false;
        }
        /*
         * Triggered when a mouseLeave event occurs in the render pane
         */
        function canMouseLeave(event) {
            selection = false;
        }
        /*
         * Triggered when a mouseDown event occurs in the render pane. This function saves the point clicked, in screen coordinates,
         * in the variables x1, y1. It takes into account that the render pane is smaller than the whole web page so we have
         * to discard a specific offset when we calculate both coordinates.
         */
        function canMouseDown(event) {
            selection = true;
            x1 = event.pageX - this.offsetLeft;
            y1 = event.pageY - this.offsetTop;
        }
        /*
         * Triggered when a mouseMove events occurs while the selection varaiable is true, it means that a previous mouseDown event occured.
         * This function sets properly the second vertex of the selection bounding box, expressed in screen coordinates, every time the mouse 
         * is moved somewhere: the screen point, the mouse will reach, will become the new second vertex. 
         */
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
        /**
         * This function manages the key pressed and released events in the actual tool plugin
         * @param {Object} keyParam - this parameter comes from Tool.js where the listeners about these kind of events are built;
         * it conatins the event triggered and two boolean fields that specify if the event is a keydown or a keyup one.
         */
        plug.fireKeyEvent= function(keyParam){
            if(keyParam.keyPressed===true){//key down event triggered
               if(keyParam.event.altKey){//if ALT is pressed it means that the tool will pause by restoring the original trackball control so we are able to zoom and move the camera
                   bindSelectionEvents(false);
                   keyParam.event.preventDefault(); 
               }
               else if(keyParam.event.shiftKey){//if SHIFT key is pressed the subtractional selection mode is activated
                   selectionSub=true;
               }
               else if( keyParam.event.ctrlKey){//if CTRL key is pressed the additional selection mode is activated
                   selectionAdd=true;
               }
           }
           if(keyParam.keyReleased===true){//keyup event triggered
               var KeyID = (window.event) ? event.keyCode : keyParam.event.keyCode;
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
        };
       /**** AUXILIARY FUNCTION - END ****/
        if(enabled){
            bindSelectionEvents(enabled);
        }
        else{
            bindSelectionEvents(enabled);
        }
    };
    
    plug._applyTo = function (meshFile, on) {
        var mesh=scene.getSelectedLayer();
        
        if(on&&mesh.getThreeMesh().visible===true){//activating the selection tool
            enableSelection(true);
            clearButton= new MLJ.gui.component.Button({//instantiating the clear, invert and remove tool buttons
                tooltip: "Select none",
                icon: "img/icons/github.png",
                right:true
            });
            invertButton=new MLJ.gui.component.Button({
                tooltip: "Invert selection",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0133-spinner11.png",
                right:true
            });
            removeButton = new MLJ.gui.component.Button({
                tooltip: "Delete selected items",
                icon: "img/icons/IcoMoon-Free-master/PNG/48px/0173-bin.png",
                right:true
            });
            clearButton.onClick(function (){//appending a specific function on "clear" button
                MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection None")._applyTo(meshFile);
                MLJ.core.Scene.updateLayer(scene.getSelectedLayer());
                plug._disableButtons(true,clearButton,removeButton,invertButton);
            });
            MLJ.widget.TabbedPane.getToolsToolBar().add(clearButton);//adding the clear button to the TOOL toolbar
            
            invertButton.onClick(function (){
                if(mode.getValue()===SELECTION_VERTEX){
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection Invert").getParam().selectByValue(2);
                }
                else{
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection Invert").getParam().selectByValue(1);
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection None").getParam().selectByValue(2);
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection None")._applyTo(meshFile);
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection None").getParam().selectByValue(0);
                }
                MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Selection Invert")._applyTo(meshFile);
                MLJ.core.Scene.updateLayer(scene.getSelectedLayer());
            });
            MLJ.widget.TabbedPane.getToolsToolBar().add(invertButton);
            
            removeButton.onClick(function (){
                if(mode.getValue()===SELECTION_VERTEX){
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Delete Selected Vertices")._applyTo(meshFile);
                }
                else{
                    MLJ.core.plugin.Manager.getFilterPlugins().getByKey("Delete Selected Faces")._applyTo(meshFile);
                }
                MLJ.core.Scene.updateLayer(scene.getSelectedLayer());
                plug._disableButtons(true,clearButton,removeButton,invertButton);
            });
            MLJ.widget.TabbedPane.getToolsToolBar().add(removeButton);
            //enable or disable the tool buttons (clear, remove and invert) according with if some vertex or face is selected on the mesh or not
            var pointsCoordsPtr = Module.buildSelectedPointsCoordsVec(meshFile.ptrMesh());
            var numSelectedPoints = Module.getValue(pointsCoordsPtr, 'float');
            if(numSelectedPoints>0){
                plug._disableButtons(false,clearButton,removeButton,invertButton);
            }
            else{
                plug._disableButtons(true,clearButton,removeButton,invertButton);
            }
        }
        else{//deactivating the selection tool
            enableSelection(false);  
            if(mesh.getThreeMesh().visible===false){//if the selected layer is not visible the selection tool button is untoogled
                var tool=MLJ.core.plugin.Manager.getToolPlugins().getByKey("Selection Tool");
                var btn=tool.getButton();
                btn.toggle("off");
            }
            if (clearButton instanceof MLJ.gui.component.Component) {
                MLJ.widget.TabbedPane.getToolsToolBar().remove(clearButton);
                MLJ.widget.TabbedPane.getToolsToolBar().remove(removeButton);
                MLJ.widget.TabbedPane.getToolsToolBar().remove(invertButton);
            }
        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
