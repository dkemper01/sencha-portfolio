/**
 * @author Vu Duc Tuyen
 * @public
 *
 * This is an overridden of {@link Ext.field.DatePicker} in which we will show up the customized
 * {@link Material.components.DatePicker} rather than the built-in {@Ext.picker.Date}
 *
 */
Ext.define('Material.components.field.DatePicker', {
    extend: 'Ext.field.DatePicker',
    requires: [
        'Material.components.DatePicker'
    ],
       xtype:'md-datepicker',
    updateValue: function(newValue, oldValue) {
        var me     = this;

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            me.getComponent().setValue(Ext.Date.format(newValue, me.getDateFormat() || Ext.util.Format.defaultDateFormat));
            this.toggleValueIndicator(true);
        } else {
            me.getComponent().setValue('');
            this.toggleValueIndicator(false);
        }

        if (!Material.DatePickerService.isEqualDate(newValue, oldValue)) {
            me.fireEvent('change', me, newValue, oldValue);
        }
    },

    getValue: function() {
        return this._value;
    },

    onFocus: function(e) {
        var component = this.getComponent(),
            self = this;
        this.fireEvent('focus', this, e);

        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();

        if (this.getReadOnly()) {
            return false;
        }

        this.isFocused = true;
        this.element.addCls('x-field-focused');

        Material.DatePicker.setSelectedDate(self.getValue());

        Material.DatePicker.show({
            done: function(selectedDate){
                self.onDatePickerDone(selectedDate);
            },
            hide: function(){
                self.onDatePickerHide();
            }
        });
    },

    onDatePickerHide: function(){
        this.element.removeCls('x-field-focused');
    },

    onDatePickerDone: function(selectedDate){
        this.setValue(selectedDate);
    },

    // @private
    destroy: function() {
        this.callSuper(arguments);
    }
});