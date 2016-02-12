Ext.define('splitViewPortfolio.view.tablet.NavigationBar', {
    extend: 'Ext.TitleBar',
    xtype: 'tabletnavigationbar',

    config: {
        styleHtmlCls: 'titlebar-tablet',
        titleAlign: Ext.filterPlatform('chrome') || Ext.filterPlatform('android') ? 'left' : 'center'
    },

    platformConfig: [
        {
            platform: 'blackberry',
            ui: 'light'
        },
        {
            platform: 'chrome',
            ui: 'light'
        },
        {
            platform: 'android',
            ui: 'light'
        }
    ]
});
