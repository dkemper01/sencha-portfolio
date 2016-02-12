/**
 * @author FSB
 *
 * Represents a date picker slot in which we will not listen for scroll end event and the title of the slot is
 * always hidden.
 *
 * Additionally, each item on the slot may be a complex one, so the original implementation
 * from the base class is amended to exactly identify the wrapped DOM element.
 *
 * The last thing is that each value associated with an slot item could be a Date, so we have change the equality
 * comparison in that case when searching an item from the underlying store.
 *
 */
Ext.define('Material.components.picker.DatePickerSlot', {
    extend: 'Ext.picker.Slot',
    xtype: 'md-date-picker-slot',
    config: {
        barHeight: 48
    },

    setupBar: function() {
        if (!this.isRendered()) {
            //if the component isnt rendered yet, there is no point in calculating the padding just eyt
            return;
        }

        var element = this.element,
            innerElement = this.innerElement,
            value = this.getValue(),
            showTitle = this.getShowTitle(),
            title = this.getTitle(),
            scrollable = this.getScrollable(),
            scroller = scrollable.getScroller(),
            titleHeight = 0,
            barHeight, padding;

        if (showTitle && title) {
            titleHeight = title.element.getHeight();
        }

        padding = Math.ceil((element.getHeight() - titleHeight - this.getBarHeight()) / 2);

        if (this.getVerticallyCenterItems()) {
            innerElement.setStyle({
                padding: padding + 'px 0 ' + padding + 'px'
            });
        }

        scroller.refresh();
        scroller.setSlotSnapSize(barHeight);
        this.setValue(value);
    },

    onScrollEnd: function(scroller, x, y) {
        //var me = this,
        //    index = Math.round(y / this.getBarHeight()),
        //    viewItems = me.getViewItems(),
        //    item = viewItems[index];
        //
        //if (item) {
        //    me.selectedIndex = index;
        //    me.selectedNode = item;
        //
        //    me.fireEvent('slotpick', me, me.getValue(), me.selectedNode);
        //}
    },

    doItemTap: function(list, index, item, e){
        var me = this;
        me.selectedIndex = index;
        me.selectedNode = item;
        me.scrollToItem(item.getY ? item : item.element, true);

        this.fireEvent('slotpick', this, this.getValue(true), this.selectedNode);
    },
    doSetValue: function(value, animated) {
        if (!this.isRendered()) {
            //we don't want to call this until the slot has been rendered
            this._value = value;
            return;
        }

        var store = this.getStore(),
            viewItems = this.getViewItems(),
            valueField = this.getValueField(),
            helper = Material.DatePickerService,
            self = this,
            index, item;

        index = store.findBy(function(record){
            var fieldValue = record.get(valueField);
            return value instanceof Date ? helper.isEqualMonth(fieldValue, value) : fieldValue === value;
        });


        if (index == -1) {
            index = 0;
        }

        item = Ext.get(viewItems[index]);

        self.selectedIndex = index;
        self.selectedNode = item;

        if (item) {
            if(this._item_scrolling){
                clearTimeout(this._item_scrolling);
            }
            this._item_scrolling = setTimeout(function(){
                self.scrollToItem(item.getY ? item : item.element, (animated) ? {
                    duration: 100
                } : false);
                self.select(self.selectedIndex);
            }, 250)
        }

        this._value = value;
    }
})