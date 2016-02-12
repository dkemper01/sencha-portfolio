/**
 *
 * This is an overridden of {@link Ext.MessageBox} to match the definition of Google Material Design.
 *
 */
Ext.define('Material.components.MessageBox', {
    override: 'Ext.MessageBox',

    statics: {
        OK    : {text: 'OK',     itemId: 'ok',  ui: 'action', cls: 'md-flat'},
        YES   : {text: 'Yes',    itemId: 'yes', ui: 'action', cls: 'md-flat'},
        NO    : {text: 'No',     itemId: 'no', cls: 'md-flat'},
        CANCEL: {text: 'Cancel', itemId: 'cancel', cls: 'md-flat'},

        OKCANCEL: [
            {text: 'Cancel', itemId: 'cancel', cls: 'md-flat'},
            {text: 'OK',     itemId: 'ok',  ui : 'action', cls: 'md-flat'}
        ],
        YESNOCANCEL: [
            {text: 'Cancel', itemId: 'cancel', cls: 'md-flat'},
            {text: 'No',     itemId: 'no', cls: 'md-flat'},
            {text: 'Yes',    itemId: 'yes', ui: 'action', cls: 'md-flat'}
        ],
        YESNO: [
            {text: 'No',  itemId: 'no', cls: 'md-flat'},
            {text: 'Yes', itemId: 'yes', ui: 'action', cls: 'md-flat'}
        ]
    },

    /**
     * Adds the new {@link Ext.Toolbar} instance into this container.
     * @private
     */
    updateButtons: function(newButtons) {
        var me = this;

        // If there are no new buttons or it is an empty array, set newButtons
        // to false
        newButtons = (!newButtons || newButtons.length === 0) ? false : newButtons;

        if (newButtons) {
            if (me.buttonsToolbar) {
                me.buttonsToolbar.show();
                me.buttonsToolbar.removeAll();
                me.buttonsToolbar.setItems(newButtons);
            } else {
                var layout = {
                    type: 'hbox',
                    pack: 'right',
                    align: 'center'
                };

                var isFlexed = Ext.theme.name == "CupertinoClassic"  || Ext.theme.name == "MountainView"  || Ext.theme.name == "Blackberry";

                me.buttonsToolbar = Ext.create('Ext.Toolbar', {
                    docked: 'bottom',
                    defaultType: 'button',
                    defaults: {
                        flex: (isFlexed) ? 1 : undefined,
                        ui: (Ext.theme.name == "Blackberry") ? 'action' : undefined
                    },
                    layout: layout,
                    ui: me.getUi(),
                    cls: me.getBaseCls() + '-buttons',
                    items: newButtons
                });

                me.add(me.buttonsToolbar);
            }
        } else if (me.buttonsToolbar) {
            me.buttonsToolbar.hide();
        }
    }
});