/**
 *
 * @class Material.components.Button
 * @override Ext.Button
 *
 * This overridden is just to add the ripple effect to the root element of the Button with
 * the help of #{Material.helper.RippleService}
 * */
Ext.define('Material.components.Button', {
    override: 'Ext.Button',
    xtype: 'button',
    //width:'200px !important',
    //height:'200px !important',


    config: {
        //category: 'raised'
       /* width: '200px',
        height: '200px'*/
    },

    requires: [
        'Material.helpers.RippleService'
    ],

    initialize: function () {
        this.callParent();
        var rippleService = Material.RippleService;
        rippleService.attachButtonBehavior(this, this.element);
        this.element.addCls('md-button');
        return this;
    },

            applyCategory: function (category) {
            var element = this.element;

            element.removeCls(['md-flat', 'md-fab', 'md-raised']);

            switch (category) {
                case 'flat':
                    element.addCls('md-flat');

                    break;
                case 'fab':
                    element.addCls('md-fab');

                    break;
                default:
                    element.addCls('md-raised');

                    break;
            }

        return category;
    }
});