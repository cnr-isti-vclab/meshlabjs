/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.Log = {};

//Console output redirecting ...
//(function () {
//
//    var _log = console.log, _warn = console.warn, _error = console.error;
//
//    console.log = function (message, args) {
//        var m = args ? message + " " + args : message;
//        MLJ.gui.Log.append(m);
//        _log.apply(console, arguments);
//    };
//
//    console.warn = function (message, args) {
//        var m = args ? message + " " + args : message;
//        MLJ.gui.Log.append(m);
//        _warn.apply(console, arguments);
//    };
//
//    console.error = function (message, args) {
//        var m = args ? message + " " + args : message;
//        MLJ.gui.Log.append(m);
//        _error.apply(console, arguments);
//    };
//
//})();

(function (gui) {
    var _$logPane;
    var _$log = $('<div id="log" class="df-content"></div>');

    var _widget = new MLJ.gui.Widget(
            function () {//build function 

                _$logPane = $('<div class="display-field"></div>')
                        .append('<div class="df-title"><h3>Log</h3></div>')
                        .append(_$log);

                return _$logPane;

            });

    this.append = function (message) {
        _$log.append("<p>" + message + "</p>");
    };

    gui.addWidget(_widget);

}).call(MLJ.gui.Log, MLJ.gui);
