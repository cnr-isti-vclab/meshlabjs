
MLJ.gui = {};

//Contains all installed and running widget
MLJ.widget = {};

MLJ.gui.installWidget = function (name, widget) {
    if (widget instanceof MLJ.gui.widget.Widget) {
        MLJ.widget[name] = widget;
    } else {
        console.error("The parameter must be an instance of MLJ.gui.widget.Widget");
    }
};

MLJ.gui.getWidget = function (name) {
    if (MLJ.widget[name]) {
        return MLJ.widget[name];
    } else {
        console.warn("The widget '" + name + "' is not installed. Check includes.");
        //Dummy widget
        return new MLJ.gui.widget.Widget();
    }
};

MLJ.gui.makeResponsiveToScene = function (widget) {

    $(window).ready(function () {
        widget.disabled(true);
    });

    $(document).on(MLJ.events.Scene.LAYER_ADDED, function (ev, layer, layersNum) {
        if (layersNum > 0) {
            widget.disabled(false);
        } else {
            widget.disabled(true);
        }
    });
};


MLJ.gui.build = {
    button: {
        Button: function (flags) {
            return new MLJ.gui.component.Button(flags);
        },
        File: function (flags) {
            return new MLJ.gui.component.FileButton(flags);
        },
        Toggle: function (flags) {
            return new MLJ.gui.component.ToggleButton(flags);
        }
    },
    accordion: {
        Accordion: function (flags) {
            return new MLJ.gui.component.Accordion(flags);
        },
        Entry: function (flags) {
            return new MLJ.gui.component.AccordionEntry(flags);
        }
    },
    Spinner: function (flags) {
        return new MLJ.gui.component.Spinner(flags);
    },
    Slider: function (flags) {
        return new MLJ.gui.component.Slider(flags);
    },
    ToolBar: function () {
        return new MLJ.gui.component.ToolBar();
    },
    PiP: function () {
        return new MLJ.gui.component.PiP();
    },
    Pane: function () {
        return new MLJ.gui.component.Pane();
    },
    Label: function (flags) {
        return new MLJ.gui.component.Label(flags);
    },
    TextField: function (text) {
        return new MLJ.gui.component.TextField(text);
    },
    ColorPicker: function (flags) {
        return new MLJ.gui.component.ColorPicker(flags);
    },
    CheckBox: function (checked) {
        return new MLJ.gui.component.CheckBox(checked);
    },
    ComboBox: function (flags) {
        return new MLJ.gui.component.ComboBox(flags);
    },
    ButtonSet: function (flags) {
        return new MLJ.gui.component.ButtonSet(flags);
    }

};

(function () {

    var _counter = 0;

    this.generateUID = function () {
        return "mlj-uid-" + _counter++;
    };

}).call(MLJ.gui);