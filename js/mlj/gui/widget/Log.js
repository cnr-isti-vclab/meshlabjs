/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {

    MLJ.gui.widget.Log = function () {

        var _this = this;

        //Console output redirecting ...
        var _log = console.log, _warn = console.warn, _error = console.error;

        console.log = function (message, args) {
            var m = args ? message + " " + args : message;
            _this.append(m);
            _log.apply(console, arguments);
        };

        console.warn = function (message, args) {
            var m = args ? message + " " + args : message;
            _this.append(m);
            _warn.apply(console, arguments);
        };

        console.error = function (message, args) {
            var m = args ? message + " " + args : message;
            _this.append(m);
            _error.apply(console, arguments);
        };

        var _$log = $('<textarea/>')
                .attr("spellcheck", false)
                .attr("readonly", "readonly");

        this._make = function () {
            var $wrap = $('<div/>').attr("id", "mlj-log-widget");
            $wrap.append(_$log);
            return $wrap;
        };

        this.append = function (message) {
            _$log.append(message + "\n");
            _$log.scrollTop(_$log[0].scrollHeight - _$log.height());
        };
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.Log);

    //Install widget
    MLJ.gui.installWidget("Log", new MLJ.gui.widget.Log());

})(MLJ.gui.component);