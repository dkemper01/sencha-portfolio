Ext.define('splitViewPortfolio.view.tablet.NestedList', {
    extend: 'Ext.NestedList',

    xtype: 'tabletnestedlist',   
    cls: 'windows-background',

    config: {
        title: 'Portfolios'
    },
    
    platformConfig: [
        {
            platform: 'blackberry',
            toolbar: {
                ui: 'dark'
            }
        },
        {
            platform: 'android',
            toolbar: {
                ui: 'light'
            }
        },
        {
            platform: 'chrome',
            toolbar: {
                ui: 'light'
            }
        }
    ]
});
