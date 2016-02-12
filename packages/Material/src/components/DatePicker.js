/*
 *
 * Represents the date picker as defined by Google Material Design.
 */
Ext.define('Material.components.DatePicker', {
    extend: 'Ext.Sheet',
    xtype: 'md-date-picker',
    requires: [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.Label',
        'Material.components.picker.DatePickerSlot',
        'Material.components.picker.CalendarItem',
        'Material.components.picker.DateDetailsPanel',
        'Material.helpers.DatePickerService'
    ],
    config: {
        //modal: true,
        baseCls: 'md-date-picker',
        cls: 'x-msgbox x-msgbox-dark',
        ui: 'dark',
        layout: {
            type: 'vbox',
            pack: 'justify',
            align: 'stretched'
        },

        /**
         * @cfg
         * @inheritdoc
         */
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },

        /**
         * @cfg
         * @inheritdoc
         */
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },

        items: [
            {
                xtype: 'panel',
                itemId: 'main-container',
                cls: 'main-container',
                layout: {
                    type: 'vbox',
                    pack: 'justify',
                    align: 'stretched'
                },
                items: [
                    {
                        xtype: 'md-date-details',
                        itemId: 'md-date-details'
                    },
                    {
                        xtype: 'panel',
                        cls: 'main-panel',
                        itemId: 'main-panel',
                        layout: {
                            type: 'card',
                            animation: 'fade'
                        },
                        items: [
                            {
                                xtype: 'md-date-picker-slot',
                                cls: 'x-picker-slot month-picker',
                                itemId: 'month-picker',
                                barHeight: 270,
                                useComponents: true,
                                defaultType: 'calendar-item',
                                data: [
                                    {
                                        value: new Date(),
                                        selectedDate: new Date()
                                    }
                                ]
                            },
                            {
                                xtype: 'md-date-picker-slot',
                                cls: 'x-picker-slot year-picker',
                                itemId: 'year-picker',
                                barHeight: 72,
                                data: [
                                    {
                                        value: 2015,
                                        text: 2015
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'dark',
                itemId: 'button-bar',
                cls: 'x-msgbox-buttons',
                layout: {
                    type: 'hbox',
                    pack: 'right',
                    align: 'center'
                },
                defaults: {
                    type: 'button'
                },
                items: [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: 'OK',
                        ui: 'action'
                    }
                ]
            }
        ],

        orientationMode: 'portrait',
        selectedDate: new Date(),
        yearFrom: new Date().getFullYear() - 50,
        yearTo: new Date().getFullYear() + 50
    },

    initialize: function () {
        this.callParent();

        this.setupEventHandler();

        this.updateYearPicker()
        this.prepareMonthPicker();
        this.showCalendar();
    },

    setupEventHandler: function () {

        this.element.on({
            scope: this,
            delegate: '.md-calendar-item button',
            tap: 'selectDate'
        });

        this.on({
            scope: this,
            delegate: 'toolbar#button-bar button',
            tap: 'onClick'
        });

        this.on({
            'show-month': 'showCalendar',
            delegate: 'md-date-details',
            scope: this
        });

        this.on({
            'show-year': 'showYearList',
            delegate: 'md-date-details',
            scope: this
        });

        this.on({
            tap: 'showYearList',
            delegate: 'panel#selected-date button#year',
            scope: this
        });

        this.on({
            slotpick: 'pickYear',
            delegate: 'md-date-picker-slot#year-picker',
            scope: this
        });
    },

    getMainPanel: function() {
        return this._mainPanel || (this._mainPanel = this.getComponent('main-container').getComponent('main-panel'));
    },

    getYearPicker: function() {
        return this._yearPicker || (this._yearPicker = this.getMainPanel().getComponent('year-picker'));
    },

    getMonthPicker: function() {
        return this._monthPicker || (this._monthPicker = this.getMainPanel().getComponent('month-picker'));
    },

    updateYearPicker: function(){

        var yearFrom = this.getYearFrom(),
            yearTo = this.getYearTo(),
            years = [];

        while(true){
            years.push({
                text: yearFrom,
                value: yearFrom
            });

            if(yearTo == yearFrom){
                break;
            }

            yearFrom++;
        }

        this.getYearPicker().getStore().setData(years);
    },

    pickYear: function(sender, selectedYear){
        var helper = Material.DatePickerService,
            temp = helper.clone(this.getSelectedDate());

        temp.setYear(selectedYear);

        this.setSelectedDate(temp);

        this.showCalendar();
    },

    showCalendar: function(){
        var helper = Material.DatePickerService,
            mainPanel = this.getMainPanel();

        if (mainPanel.calendarShown !== true){
            mainPanel.setActiveItem(0);
            mainPanel.calendarShown = true;
        }

        this.getMonthPicker().setValue(this.getSelectedDate());
    },

    showYearList: function(){
        var mainPanel = this.getMainPanel();
        var yearList = this.getYearPicker();
        if (mainPanel.calendarShown !== false){
            mainPanel.setActiveItem(1);
            mainPanel.calendarShown = false;
        }
        yearList.setValue(this.getSelectedDate().getFullYear());
    },

    onClick: function (sender, e) {
        if (sender.getUi() == 'action') {
            this._onDone(this.getSelectedDate());
        }

        this._onHide();
        this.hide();
    },

    selectDate: function (sender, e) {
        var previous = this.lastSelectedDate,
            xsender = sender.target || sender.delegatedTarget;
        if (previous != xsender) {
            var temp = Ext.Element.get(xsender);
            var selectedDate = Date.parse(temp.getAttribute('data-date'));

            if(isNaN(selectedDate)){
                return;
            }

            this.setSelectedDate(new Date(selectedDate));

            if (previous){
                Ext.Element.get(previous).removeCls('selected');
            }

            this.lastSelectedDate = xsender;
            temp.addCls('selected');
        }
    },

    applySelectedDate: function (newValue) {
        if (newValue && !(newValue instanceof Date)) {
            newValue = Date.parse(newValue);
        }

        return newValue instanceof Date ? newValue : new Date();
    },

    updateSelectedDate: function (newValue, oldValue) {
        if (newValue instanceof Date) {
            var
                helper = Material.DatePickerService,
                dateDetailsPanel = this.getComponent('main-container').getComponent('md-date-details');

            dateDetailsPanel.setSelectedDate(newValue);

            this.prepareMonthPicker();
        }
    },

    prepareMonthPicker: function () {
        var helper = Material.DatePickerService,
            selectedDate = this.getSelectedDate(),
            selectedYear = selectedDate.getFullYear();

        if (this._currentYear == selectedYear){
            Ext.each(this.query('panel#week-grid button'), function(item){
                if(helper.isEqualDate(item.date, selectedDate)){
                    item.element.addCls('selected');
                    this.lastSelectedDate = item;
                }else{
                    item.element.removeCls('selected');
                }
            });
            this.getMonthPicker().setValue(selectedDate);
            return;
        }

        this._currentYear = selectedYear;

        var months = [];
        for(var i= 0; i < 12; i++){
            months.push({
                value: new Date(selectedYear, i, 1, 0, 0, 0),
                selectedDate: selectedDate
            });
        }

        this.getMonthPicker().getStore().setData(months);
        this.getMonthPicker().setValue(selectedDate);
    },

    onOrientationChange: function () {
        var mainContainer = this.getComponent('main-container'),
            newValue = Ext.Viewport.getOrientation();

        this.element.removeCls('landscape portrait');

        if (newValue == 'landscape') {
            mainContainer.getLayout().setOrient('horizontal')
            this.element.addCls('landscape');
        } else {
            mainContainer.getLayout().setOrient('vertical')
            this.element.addCls('portrait');
        }
    },

    show: function (callbacks) {
        if (!callbacks) {
            return;
        }

        //if it has not been added to a container, add it to the Viewport.
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);

            Ext.Viewport.on({
                orientationchange: this.onOrientationChange,
                scope: this
            });

            this.onOrientationChange();
        }

        this._onDone = callbacks.done || Ext.emptyFn;
        this._onHide = callbacks.hide || Ext.emptyFn;
        this.showCalendar();

        this.callParent();

        return this;
    }
}, function(DatePicker){
    Ext.onSetup(function(){
        Material.DatePicker = new DatePicker();
    });
});

