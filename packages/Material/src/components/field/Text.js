Ext.define('Material.components.field.Text', {
    extend: 'Ext.field.Text',
    requires: [
        'Material.helpers.RippleService'
    ],
    //rippleService: null,
    /**
     * Normally when setting value to text field's placeholder, that value will be set to the inner input's placeholder.
     * However, in Material Design there is no real placeholder for the inner input. The label will be the placeholder
     * when there is no value in the input and isn't focused. The label is gone away or displayed above the input
     * if it gets focused or has value. We will leverage #{Ext.field.Text.placeholder} property to indicate that if
     * placeholder is set,
     *  - it will become the field label,
     *  - the label will be gone away if the input has value or get focused
     *  - it has class x-has-placeholder for styling purpose
     *
     * @override
     * */

    initialize: function () {
        this.callParent();


        //Material.RippleService.attachButtonBehavior(this, this.element);
    }, updatePlaceHolder: function (newPlaceHolder) {
        if (this.getLabelAlign() == 'top') {
            if (newPlaceHolder && !/^\s+$/.test(newPlaceHolder)) {
                this.setLabel(newPlaceHolder);
                this.renderElement.addCls('x-has-placeholder');
            } else {
                this.renderElement.removeCls('x-has-placeholder');
            }
        } else {
            this.callParent(arguments);
        }
    },

    updateReadOnly: function (newReadOnly) {
        this.callParent(arguments);
        this.element[newReadOnly === true ? 'addCls' : 'removeCls']('x-field-readonly');
    },

    updateValue: function (newValue) {
        this.callParent(arguments);
        this.toggleValueIndicator(newValue);
    },

    doKeyUp: function () {
        this.callParent(arguments);
        this.toggleValueIndicator(this.getValue());
    },

    toggleValueIndicator: function (newValue) {
        var valueValid = newValue !== undefined && newValue !== null && newValue !== "";

        this.element[valueValid ? 'addCls' : 'removeCls']('x-field-has-value');
    }
});