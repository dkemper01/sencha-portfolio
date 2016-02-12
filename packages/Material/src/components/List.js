/**
 * @class Material.components.List
 * @override Ext.dataview.List
 *
 * This overridden is to add Material Design's ripple effect into list item or control inside list item.
 * */
Ext.define('Material.components.List', {
    override: 'Ext.dataview.List',

    requires: [
        'Material.helpers.RippleService'
    ],
   /* config: {
    for:''
    },*/

    /**
     * @private
     * */
    rippleService: null,

    /**
     * This overridden is to add the initialization of private property #{Material.components.List}.rippleService
     * for re-use later on
     *
     * @override
     * */
    initialize: function() {
        this.callParent();
        if(this.getCls()=='forList')
        {
            this.element.addCls('forList');


        }
        else
        if(this.getCls()=='forColorPicker')
        {
            this.element.addCls('forColorPicker');


        }

    },

    /**
     * This overridden is to check if this instance is a list of menu items.
     * If so, it will as ripple effect for each menu item.
     *
     * @override
     * */
    createItem: function (config) {
        var item = this.callParent([config]),
            initialConfig = this.getInitialConfig();
      /*  if (initialConfig && initialConfig.isMenu === true)*/ {
            Material.RippleService.attachButtonBehavior(this, item.element, {
                isMenuItem: true
            });
        }

        return item;
    },

    /**
     * This overridden is to check if each item on list contains a checkbox.
     * If so, it will as ripple effect for each checkbox.
     *
     * @override
     * */
    updateListItem: function (item, index, info) {
        this.callParent([item, index, info]);
        var checkbox = item.element.down('.md-checkbox .md-container');

        if (checkbox) {
            this.rippleService.attachCheckboxBehavior(this, checkbox);
        }
    }
});