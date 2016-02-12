/**
 * @author Vu Duc Tuyen
 * @public
 *
 * This is an overridden of {@link Ext.field.Select} in which we will show up the customized
 * {@link Material.components.field.SelectPanel} rather than the built-in {@Ext.Panel}.
 *
 * Additionally, there is an indicator added to indicate whenever this field is focused or not.
 *
 */
Ext.define('Material.components.field.Select', {
    override: 'Ext.field.Select',

    requires: [
        'Material.components.field.SelectPanel'
    ],

    // @private
    getTabletPicker: function() {
        var config = this.getDefaultTabletPickerConfig(),
            self = this;

        if (!this.listPanel) {
            this.listPanel = Ext.create('Material.components.field.SelectPanel', Ext.apply({
                left: 0,
                top: 0,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                //width: Ext.os.is.Phone ? '14em' : '18em',
                height: (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) ? '12em' : (Ext.os.is.Phone ? '12.5em' : '22em'),
                items: {
                    xtype: 'list',
                    cls:'forList',

                    isMenu: true,
                    store: this.getStore(),
                    itemTpl: '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select: this.onListSelect,
                        itemtap: this.onListTap,
                        scope: this
                    }
                },
                onHide: function(){
                    self.element.removeCls('x-field-focused');
                }
            }, config));
        }

        return this.listPanel;
    },

    onFocus: function() {
        this.element.addCls('x-field-focused');

        this.callParent(arguments);
    }
});