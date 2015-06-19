
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

MLJ.gui.build = {
    button: {
        Button: function (txt, tooltip, img) {
            return new MLJ.gui.component.Button(txt, tooltip, img);
        },
        File: function (txt, tooltip, img) {
            return new MLJ.gui.component.FileButton(txt, tooltip, img);
        },
        Toggle: function (txt, tooltip, img, on) {
            return new MLJ.gui.component.ToggleButton(txt, tooltip, img, on);
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
    Pane: function (title, flags) {
        return new MLJ.gui.component.Pane(title, flags);
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
