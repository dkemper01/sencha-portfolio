Ext.define('splitViewPortfolio.profile.Tablet', {
    extend: 'splitViewPortfolio.profile.Base',

    config: {
        controllers: ['Main'],
        views: ['Main', 'TouchEvents']
    },

    isActive: function() {
        return Ext.os.is.Tablet || Ext.os.is.Desktop;
    },

    launch: function() {
        Ext.create('splitViewPortfolio.view.tablet.Main');
        // this.callParent();
    }
});
