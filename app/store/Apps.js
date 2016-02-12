(function () {

    var root = {
        id: 'root',
        text: 'SplitView Portfolio App',
        items: [
            {
                id: 'portfolio-app-1',
                cls: 'launchscreen',
                text: 'SafeGrid',
                view: 'SafeGrid',
                imgsrc: 'resources/icons/informationApp1.png',
                leaf: true
            },
            {
                id: 'portfolio-app-2',
                cls: 'launchscreen',
                text: 'Accolade',
                view: 'Accolade',
                imgsrc: 'resources/icons/informationApp2.png',
                leaf: true
            },
            {
                id: 'portfolio-app-3',
                cls: 'launchscreen',
                text: 'Chronicle',
                view: 'Chronicle',
                imgsrc: 'resources/icons/informationApp3.png',
                leaf: true
            }
        ]
    };

    Ext.define('splitViewPortfolio.store.Apps', {
        alias: 'store.Apps',
        extend: 'Ext.data.TreeStore',
        requires: ['splitViewPortfolio.model.App'],

        config: {
            model: 'splitViewPortfolio.model.App',
            root: root,
            defaultRootProperty: 'items'
        }
    });
})();
