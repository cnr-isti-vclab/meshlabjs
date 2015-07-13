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
    _$tabbedPane.append(_$tabsBar);

    var _widget = new MLJ.gui.Widget(
            function () {//build function                

                $(document).ready(function () {
                    var tab;
                    for (var i = 0, m = _tabs.length; i < m; i++) {
                        tab = _tabs[i];
                        _$tabsBar.append(tab.jQueryTab());
                        _$tabbedPane.append(tab.jQueryTabContent());
                    }
                    $('#tabbed-pane').tabs({heightStyle: 'fill'});
                });
                
                return _$tabbedPane;
            },
            function() {
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

    gui.addWidget(_widget);

}).call(MLJ.gui.TabbedPane, MLJ.gui);