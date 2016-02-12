/**
 * @author FSB
 * @public
 *
 * This is a special class to create each calendar item on {@link Material.components.DatePicker}.
 *
 * Each calendar item will have a month title, a week bar header followed by a list of week days called week grid.
 *
 * The week grid is built based on the given value, a valid date. Each cell, a button, on the grid will be a date of
 * the given month. A cell will be marked with CSS class "today" if it holds date value of today. It will be marked
 * with CSS class "selected" if it holds date value of selected date.
 */
Ext.define('Material.components.picker.CalendarItem', {
    extend: 'Ext.Component',
    xtype: 'calendar-item',
    width:'280px',
    height:'250px',
    isComposite: true,
    requires: [
        'Material.helpers.RippleService'
    ],
    template: [
        {
            tag: 'div',
            html: 'February 1989',
            reference: 'headerElement',
            className: 'header'
        },
        {
            tag: 'div',
            className: 'week-bar',
            children: [
                {
                    tag: 'span',
                    text: 'S'
                },
                {
                    tag: 'span',
                    text: 'M'
                },
                {
                    tag: 'span',
                    text: 'T'
                },
                {
                    tag: 'span',
                    text: 'W'
                },
                {
                    tag: 'span',
                    text: 'T'
                },
                {
                    tag: 'span',
                    text: 'F'
                },
                {
                    tag: 'span',
                    text: 'S'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '1'
                },
                {
                    tag: 'button',
                    text: '2'
                },
                {
                    tag: 'button',
                    text: '3'
                },
                {
                    tag: 'button',
                    text: '4'
                },
                {
                    tag: 'button',
                    text: '5'
                },
                {
                    tag: 'button',
                    text: '6'
                },
                {
                    tag: 'button',
                    text: '7'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '8'
                },
                {
                    tag: 'button',
                    text: '9'
                },
                {
                    tag: 'button',
                    text: '10'
                },
                {
                    tag: 'button',
                    text: '11'
                },
                {
                    tag: 'button',
                    text: '12'
                },
                {
                    tag: 'button',
                    text: '13'
                },
                {
                    tag: 'button',
                    text: '14'
                }
            ]
        },
        {
            tag: 'div',
            
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '15'
                },
                {
                    tag: 'button',
                    text: '16'
                },
                {
                    tag: 'button',
                    text: '17'
                },
                {
                    tag: 'button',
                    text: '18'
                },
                {
                    tag: 'button',
                    text: '19'
                },
                {
                    tag: 'button',
                    text: '20'
                },
                {
                    tag: 'button',
                    text: '21'
                }
            ]
        },
        {
            tag: 'div',
            
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '22'
                },
                {
                    tag: 'button',
                    text: '23'
                },
                {
                    tag: 'button',
                    text: '24'
                },
                {
                    tag: 'button',
                    text: '25'
                },
                {
                    tag: 'button',
                    text: '26'
                },
                {
                    tag: 'button',
                    text: '27'
                },
                {
                    tag: 'button',
                    text: '28'
                }
            ]
        },
        {
            tag: 'div',
            
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '29'
                },
                {
                    tag: 'button',
                    text: '30'
                },
                {
                    tag: 'button',
                    text: '31'
                },
                {
                    tag: 'button',
                    text: '32'
                },
                {
                    tag: 'button',
                    text: '33'
                },
                {
                    tag: 'button',
                    text: '34'
                },
                {
                    tag: 'button',
                    text: '35'
                }
            ]
        },
        {
            tag: 'div',
            
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '36'
                },
                {
                    tag: 'button',
                    text: '37'
                },
                {
                    tag: 'button',
                    text: '38'
                },
                {
                    tag: 'button',
                    text: '39'
                },
                {
                    tag: 'button',
                    text: '40'
                },
                {
                    tag: 'button',
                    text: '41'
                },
                {
                    tag: 'button',
                    text: '42'
                }
            ]
        }
    ],

    config: {
        baseCls: 'md-calendar-item',
        dataview: null,
        record: null,
        width: '100%'
    },

    initialize: function() {
        this.callParent(arguments);
       /* var rippleService = Material.RippleService;
        rippleService.attachButtonBehavior(this, this.element);*/

    },

    updateRecord: function(newRecord) {
        if (!newRecord) {
            return;
        }
        this._record = newRecord;

        var me = this,
            dataview = me.dataview || this.getDataview(),
            data = dataview.prepareData(newRecord.getData(true), dataview.getStore().indexOf(newRecord), newRecord);

        me.generateWeekGrid(data);

        /**
        * @event updatedata
        * Fires whenever the data of the DataItem is updated.
        * @param {Ext.dataview.component.DataItem} this The DataItem instance.
        * @param {Object} newData The new data.
        */
        me.fireEvent('updatedata', me, data);
    },

    generateWeekGrid: function (data) {
        var helper = Material.DatePickerService,
            currentMonth = data.value,
            weekArray = helper.getWeekArray(currentMonth),
            dayButtons = this.element.query('.week button'),
            headerElement = this.headerElement,
            today = new Date(),
            selectedDate = data.selectedDate || today,
            picker = (this.dataview || this.getDataview()).up('md-date-picker');


        this.element.removeCls('md-4-weeks md-5-weeks md-6-weeks');
        this.element.addCls('md-' + weekArray.length + '-weeks');

        headerElement.setHtml(helper.getFullMonth(currentMonth) + ' ' + currentMonth.getFullYear());

        Ext.each(weekArray, function (weekDays, i) {
            Ext.each(weekDays, function (day, j) {
                var dayButton = Ext.Element.get(dayButtons[j + i * 7]);

                dayButton.removeCls('selected today');
                dayButton.setHtml('&nbsp;');
                dayButton.set({
                    'data-date': null
                }, true);




                if (day instanceof Date) {
                    dayButton.setHtml(day.getDate());
                    dayButton.set({
                        'data-date': day
                    }, true);

                    if (helper.isEqualDate(selectedDate, day)) {
                        dayButton.addCls('selected');
                        picker.lastSelectedDate = dayButton;

                    }

                    if (helper.isEqualDate(today, day)) {
                        dayButton.addCls('today');
                    }
                }
            }, this);
        }, this);
    }

});
