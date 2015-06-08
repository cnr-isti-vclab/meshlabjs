/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

MLJ.gui.TabbedPane = {};

(function (gui) {
    var _tabs = [];
    var _$tabbedPane = $('<div id="tabbed-pane"></div>');
    var _$tabsBar = $('<ul id="tabs-bar"></ui>');

    //Accordion for filters pane
    var _filtersAccord = new MLJ.gui.Accordion();
    _filtersAccord.jQuery().attr('id', 'accordion-filters');

    //Tool bar for rendering pane
    var _renderingTb = new gui.ToolBar();
    //Accordion for rendering pane
    var _renderingAccord = new gui.Accordion();
    _renderingAccord.jQuery().attr('id', 'accordion-rendering');

    function init() {
        _$tabbedPane.append(_$tabsBar);

        var filterTab = new gui.Tab("Filters");
        filterTab.appendContent(_filtersAccord.jQuery());

        var renderingTab = new gui.Tab("Rendering");
        renderingTab.appendContent(_renderingTb.jQuery())
                .appendContent(_renderingAccord.jQuery());

        gui.TabbedPane.addTab(filterTab, renderingTab);

    }

    var _widget = new gui.Widget(
            function () {//build function                

                $(document).ready(function () {
                    var tab;
                    for (var i = 0, m = _tabs.length; i < m; i++) {
                        tab = _tabs[i];
                        _$tabsBar.append(tab.jQueryTab());
                        _$tabbedPane.append(tab.jQueryTabContent());
                    }
                    $('#tabbed-pane').tabs({heightStyle: 'fill'});
                    _filtersAccord.jQuery().accordion({heightStyle: 'content'});
                    _renderingAccord.jQuery().accordion({heightStyle: 'content'});
                });

                return _$tabbedPane;
            },
            function () {
                $('#tabbed-pane').tabs("refresh");
            });

    this.addTab = function () {
        var tab;
        for (var i = 0; i < arguments.length; i++) {
            tab = arguments[i];
            if (tab instanceof gui.Tab) {
                _tabs.push(tab);
            } else {
                console.error("The parameter must be an instance of MLJ.gui.Button");
            }
        }
    };

    this.filtersAccordion = function () {
        return _filtersAccord;
    };

    this.renderingAccordion = function () {
        return _renderingAccord;
    };

    this.renderingToolbar = function () {
        return _renderingTb;
    };

    init();

    gui.addWidget(_widget);

}).call(MLJ.gui.TabbedPane, MLJ.gui);