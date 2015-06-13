
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
        }
    },
    accordion: {
        Accordion: function (flags) {
            return new MLJ.gui.component.Accordion(flags);
        },
        Entry: function (title) {
            return new MLJ.gui.component.AccordionEntry(title);
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
    Label: function (text) {
        return new MLJ.gui.component.Label(text);
    }
};


