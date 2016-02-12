var allListeners = ((Ext.filterPlatform('chrome') || Ext.filterPlatform('android')) && (!Ext.filterPlatform('ios')))? [
    {
        event: 'show',
        order: 'after',
        fn: 'afterShow'
    },
    {
        event: 'activeitemchange',
        fn: 'activeItemChange'
    }
] : null;

Ext.define('splitViewPortfolio.view.MaterialPanel', {
    extend: 'Ext.tab.Panel',
    requires: ['Material.helpers.RippleService'],

    initialize: function () {

        var self = this;

        self.callParent();

        if ((Ext.filterPlatform('chrome') || Ext.filterPlatform('android')) && (!Ext.filterPlatform('ios'))) {

            var rippleService = Material.RippleService;

            rippleService.attachTabBehavior(this, this.element, {
                inkColor: '#607d8b'
            });

            if (Ext.os.is('Desktop')) {
                Ext.Viewport.on('resize', 'handleResize', self, { scope: self, buffer: 100 });
            }
        }
   
        return this;
    },

    config: {
        listeners: allListeners
    },

    activeItemChange: function (component, value, oldValue, eOpts) {

        var inkBarConfig = component.stageInkBar(component);
        var materialClass = '.' + component.getCls()[0];
        var tabBarInner = Ext.DomQuery.select(materialClass + ' .x-tabbar > .x-tabbar-inner');

        component.inkBarTransition(component, inkBarConfig.mdInkBar, inkBarConfig.selectedTabExt, Ext.get(tabBarInner[0]));
    },

    afterShow: function (component, eOpts) {

        // Stage ink bar.
        //
        var inkBarConfig = component.stageInkBar(component);
        var materialClass = '.' + component.getCls()[0];
        var tabBarInner = Ext.DomQuery.select(materialClass + ' .x-tabbar > .x-tabbar-inner');
        
        component.inkBarTransition(component, inkBarConfig.mdInkBar, inkBarConfig.selectedTabExt, Ext.get(tabBarInner[0]));
    },

    inkBarTransition: function (component, mdInkBar, selectedTabEl, tabBarEl) {

        // Measuring and calculations for the ink bar.
        //
        var totalWidth = tabBarEl.getWidth();
        var mdInkBarCurrentOffsets = mdInkBar.getOffsetsTo(tabBarEl);
        var offsets = selectedTabEl.getOffsetsTo(tabBarEl);
        var l = offsets[0] + 'px';
        var r = totalWidth - offsets[0] - selectedTabEl.getWidth() + 'px';

        component.updateInkBarClassName(mdInkBar, mdInkBarCurrentOffsets[0], offsets[0]);
        mdInkBar.applyStyles({ left: l, right: r });
    },

    stageInkBar: function (component) {

        var extInkBar = null;
        var materialClass = '.' + component.getCls()[0];
        var tabBarInner = Ext.DomQuery.select(materialClass + ' .x-tabbar > .x-tabbar-inner');
        var existingInkBar = Ext.DomQuery.select(materialClass + ' .x-tabbar > .x-tabbar-inner > .md-ink-bar');
        var selectedTab = Ext.DomQuery.select(materialClass + ' .x-tabbar > .x-tabbar-inner > .x-tab-active');
        var extSelectedTab = Ext.get(selectedTab[0]);

        if (existingInkBar.length == 0) {

            var mdInkBar = document.createElement('div');

            mdInkBar.className = 'md-ink-bar';
            extInkBar = new Ext.Element(mdInkBar);

            extInkBar.appendTo(tabBarInner[0]);
            extInkBar.applyStyles({ top: (extSelectedTab.getHeight() - extInkBar.getHeight()) + 'px' });

            component.setMdInkBar(extInkBar);

        } else {

            extInkBar = component.getMdInkBar();
        }

        return { mdInkBar: extInkBar, selectedTabExt: extSelectedTab };
    },

    updateInkBarClassName: function (mdInkBar, mdInkBarOffsetLeft, selectedTabOffsetLeft) {

        if (selectedTabOffsetLeft > mdInkBarOffsetLeft) {
            mdInkBar.replaceCls('md-left', 'md-right');
        } else {
            mdInkBar.replaceCls('md-right', 'md-left');
        }
    },

    handleResize: function (component, eOpts, opts) {

        opts.scope.activeItemChange(opts.scope);
    }
});