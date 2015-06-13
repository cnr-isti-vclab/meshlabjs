/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (component) {

    MLJ.gui.widget.TabbedPane = function () {

        var _tabs = [];
        var _$tabbedPane = $('<div id="mlj-tabbed-pane"></div>');
        var _$tabsBar = $('<ul id="mlj-tabs-bar"></ui>');

        //Accordion for filters pane
        var _filtersAccord = new component.Accordion({heightStyle: 'content'});
        _filtersAccord.$.attr('id', 'accordion-filters');

        //Tool bar for rendering pane
        var _renderingTb = new component.ToolBar();
        //Accordion for rendering pane
        var _renderingAccord = new component.Accordion({heightStyle: 'content'});
        _renderingAccord.$.attr('id', 'accordion-rendering');

        var _this = this;

        function Tab(name) {
            this.name = name;
            var _$content = $('<div id="tab-' + name + '"></div>');

            this.$tab = function () {
                return $('<li><a href="#tab-' + name + '"><span>' + name + '</span></a></li>');
            };

            this.$content = function () {
                return _$content;
            };

            this.appendContent = function (content) {
                _$content.append(content);
                return this;
            };
        }

        function init() {
            _$tabbedPane.append(_$tabsBar);

            var filterTab = new Tab("Filters");
//        filterTab.appendContent(_filtersAccord.$);

            var renderingTab = new Tab("Rendering");
//        renderingTab.appendContent(_renderingTb.$)
//                .appendContent(_renderingAccord.$);

            _tabs.push(filterTab, renderingTab);
        }

        this._make = function () {//build function                
            $(window).ready(function () {
                var tab;
                for (var i = 0, m = _tabs.length; i < m; i++) {
                    tab = _tabs[i];
                    _$tabsBar.append(tab.$tab);
                    _$tabbedPane.append(tab.$content);
                }
                _$tabbedPane.tabs({heightStyle: 'fill'});
            });

            return _$tabbedPane;
        };

        this._refresh = function () {
            _$tabbedPane.tabs("refresh");
        };

//        this.addTab = function (name, content) {
//            var tab;
//            for (var i = 0; i < arguments.length; i++) {
//                tab = arguments[i];
//                if (tab instanceof gui.Tab) {
//                    _tabs.push(tab);
//                } else {
//                    console.error("The parameter must be an instance of MLJ.gui.Button");
//                }
//            }
//        };

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
    };

    MLJ.extend(MLJ.gui.widget.Widget, MLJ.gui.widget.TabbedPane);

    //Install widget
    MLJ.gui.installWidget("TabbedPane", new MLJ.gui.widget.TabbedPane());

})(MLJ.gui.component);