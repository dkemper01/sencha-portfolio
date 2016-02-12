Ext.define('splitViewPortfolio.profile.Phone', {
    extend: 'splitViewPortfolio.profile.Base',

    config: {
        controllers: ['Main'],
        views: ['Main', 'TouchEvents']
    },

    isActive: function() {
        return Ext.os.is.Phone; // || Ext.os.is.Desktop;
    },

    launch: function() {
        Ext.create('splitViewPortfolio.view.phone.Main');
        // this.callParent();
    }
});
