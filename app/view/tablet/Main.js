Ext.define('splitViewPortfolio.view.tablet.Main', {
    extend: 'Ext.Container',
    xtype: 'mainview',

    requires: [
        'Ext.dataview.NestedList',
        'splitViewPortfolio.view.tablet.NavigationBar',
        'splitViewPortfolio.view.tablet.NestedList'
    ],

    config: {
        fullscreen: true,

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 250
            }
        },

        items: [
            {
                id: 'launchscreen',
                cls : 'card',
                scrollable: true,
                html: '<div style="width: 100%; margin: 0 auto; text-align: center;"><img src="resources/images/portfolioIntro.png" style="max-width: 500px; max-height: 500px;"></div>'
            },
            {
                id: 'mainNestedList',
                xtype : 'tabletnestedlist',
                useTitleAsBackText: false,
                docked: 'left',
                width: 200,

                listConfig: {
                    itemTpl: '<div><img class="appart" src="{imgsrc}"></img><span>{text}</span></div>'
                },

                store: 'Apps'
            },
            {
                id: 'mainNavigationBar',
                xtype: 'tabletnavigationbar',
                title: 'About',
                docked: 'top',
                
                items: {
                    xtype: 'button',
                    action: 'viewSource',
                    align: 'right',
                    hidden: true,
                    icon: (Ext.filterPlatform('ios')) ? 'resources/images/source-code-ios.svg' : 'resources/images/source-code.svg',
                    id: 'viewSourceButton',
                    ui: 'action-round'
                },
                
                listeners: {
                               
                   painted: function(element, eOpts) {
                        
                        console.log("Painted event for TitleBar fired, element is:");
                        console.log(element);
                        
                    }    
                }
            }
        ]
    }
});
