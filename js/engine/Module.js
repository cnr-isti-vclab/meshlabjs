/*
Module is a global JavaScript object with attributes that 
Emscripten-generated code calls at various points in its execution.

Developers can provide an implementation of Module to control 
the execution of code. For example, to define how notification 
messages from Emscripten are displayed, developers implement the 
Module.print attribute.
*/
var Module = {
        memoryInitializerPrefixURL : "js/generated/",
        preRun: [],
        postRun: [],
        print: (function () {
            var element = document.getElementById('info');
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