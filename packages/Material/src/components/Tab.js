Ext.define('Material.components.Tab', {
    override: 'Ext.tab.Tab',
    requires: [
        'Material.helpers.RippleService'
    ],

    initialize: function () {
        this.callParent();

        var rippleService = Material.RippleService;

        rippleService.attachTabBehavior(this, this.element, {
            inkColor: '#ffff85'
        });

        this.element.addCls('md-tab');

        return this;
    }
});