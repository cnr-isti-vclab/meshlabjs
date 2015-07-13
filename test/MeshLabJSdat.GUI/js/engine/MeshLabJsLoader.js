/**
 * @class MeshLabJsLoader
 * @name MeshLabJsLoader
 * @description Represent Loader Class with methods for inizialization of Gui and Render
 * @author maurizio.idini@gmail.com
 */
 function MeshLabJsLoader() {
	this._viewer = new MeshLabJsGui();
	this._viewer.loadGui();
	this._render = new MeshLabJsRender();
	this._render.loadRender();
	this._Module = Module;
}

/**
* Module is a global JavaScript object with attributes that 
* Emscripten-generated code calls at various points in its execution.
* Developers can provide an implementation of Module to control 
* the execution of code. For example, to define how notification 
* messages from Emscripten are displayed, developers implement the 
* Module.print attribute.
* Note that parameter 'memoryInitializerPrefixURL' indicates path of file.js.mem
*/
var Module = {
        memoryInitializerPrefixURL : "js/generated/",
        preRun: [],
        postRun: [],
        print: (function () {
            var element = document.getElementById('log');
            if (element) { element.value = ''; }// clear browser cache
            return function (text) {
                text = Array.prototype.slice.call(arguments).join(' ');
                console.log(text);
                if (element) {
                    element.value += text + "\n";
                    element.scrollTop = element.scrollHeight; // focus on bottom
                }
            };
        })()
    };