Ext.define('Material.components.picker.DateDetailsPanel', {
    extend: 'Ext.Component',
    xtype: 'md-date-details',

    requires: [
        'Material.helpers.DatePickerService',
        'Material.helpers.RippleService'

    ],

    template: [
        {
            tag: 'label',
            className: 'day-of-week',
            reference: 'lblDayOfWeek',
            html: 'Thursday'
        },
        {
            tag: 'div',
            className: 'day-of-month',
            children: [
                {
                    tag: 'button',
                    className: 'month',
                    reference: 'btnMonth',
                    html: 'FEB'
                },
                {
                    tag: 'button',
                    className: 'day',
                    reference: 'btnDay',
                    html: '09'
                },
                {
                    tag: 'button',
                    className: 'year',
                    reference: 'btnYear',
                    html: '1989'
                }
            ]
        }
    ],

    config: {
        baseCls: 'md-date-details',
        selectedDate: null
    },

    initialize: function () {
        this.callParent(arguments);
        /*var rippleService = Material.RippleService;
        rippleService.attachButtonBehavior(this, this.element);*/
        this.setSelectedDate(new Date());

        var showMonthAction = {
                scope: this,
                tap: function () {
                    this.toggleHighlight(true);

                    this.fireEvent('show-month', this);
                }
            };

        this.btnDay.on(showMonthAction);

        this.btnMonth.on(showMonthAction);

        this.btnYear.on({
            scope: this,
            tap: function () {
                this.toggleHighlight(false);

                this.fireEvent('show-year', this);
            }
        });
    },

    applySelectedDate: function (newValue) {
        if (newValue instanceof Date) {
            return newValue;
        }

        return new Date();
    },

    updateSelectedDate: function (newValue, oldValue) {
        var helper = Material.DatePickerService;

        this.updateDisplay(newValue);
    },

    updateDisplay: function (newValue) {
        if (!this.lblDayOfWeek) {
            return;
        }

        var helper = Material.DatePickerService;

        this.lblDayOfWeek.setHtml(helper.getDayOfWeek(newValue));

        this.btnDay.setText(newValue.getDate());
        this.btnMonth.setText(helper.getShortMonth(newValue));
        this.btnYear.setText(newValue.getFullYear());

        this.toggleHighlight(true);
    },

    toggleHighlight: function (switcher) {
        var highLightCls = 'highlight';

        if (switcher) {
            this.btnDay.addCls(highLightCls);
            this.btnMonth.addCls(highLightCls);
            this.btnYear.removeCls(highLightCls);
        } else {
            this.btnDay.removeCls(highLightCls);
            this.btnMonth.removeCls(highLightCls);
            this.btnYear.addCls(highLightCls);
        }
    }
});