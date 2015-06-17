MLJ.gui.MLWidget = function () {
};
MLJ.gui.MLWidget.prototype = {
    _make: function () {
    }
};

MLJ.gui.MLWidget.Number = function (flags) {
    this.spinner = MLJ.gui.build.Spinner(flags);
    this.label = MLJ.gui.build.Label(flags);

    this._make = function () {
        return MLJ.gui.component.Grid(this.label, this.spinner);
    };

    MLJ.gui.MLWidget.call(this);
};

MLJ.extend(MLJ.gui.MLWidget, MLJ.gui.MLWidget.Number);

MLJ.gui.MLWidget.Float = function (flags) {
    MLJ.gui.MLWidget.Number.call(this, flags);
    this.getValue = function () {
        return parseFloat(this.spinner.getValue());
    };

};

MLJ.extend(MLJ.gui.MLWidget.Number, MLJ.gui.MLWidget.Float);

MLJ.gui.MLWidget.Integer = function (flags) {
    MLJ.gui.MLWidget.Number.call(this, flags);
    this.getValue = function () {
        return parseInt(this.spinner.getValue());
    };

};

MLJ.extend(MLJ.gui.MLWidget.Number, MLJ.gui.MLWidget.Integer);