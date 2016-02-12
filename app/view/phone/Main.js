Ext.define('splitViewPortfolio.view.phone.Main', {
    extend: 'Ext.dataview.NestedList',
    requires: ['Ext.TitleBar'],

    id: 'mainNestedList',

    config: {
        fullscreen: true,
        title: 'Portfolios',
        useTitleAsBackText: false,
        layout: {
            animation: {
                duration: 250,
                easing: 'ease-in-out'
            }
        },

        listConfig: {
                    itemTpl: '<div><img class="appart" src="{imgsrc}"></img><span>{text}</span></div>'
        },
        
        store: 'Apps',

        toolbar: {
            id: 'mainNavigationBar',
            xtype : 'titlebar',
            docked: 'top',
            title : 'Portfolios',

            items: {
                xtype: 'button',
                action: 'viewSource',
                align: 'right',
                hidden: true,
                icon: (Ext.filterPlatform('ios')) ? 'resources/images/source-code-ios.svg' : 'resources/images/source-code.svg',
                id: 'viewSourceButton',
                ui: 'action-round'
            }
        }
    }
});
