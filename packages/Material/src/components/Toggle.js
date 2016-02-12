/**
 * @class Material.components.Toggle
 *
 * Define an existing control, Toggle, in new HTML structure.
 * */
Ext.define('Material.components.Toggle', {
    extend: 'Ext.Component',

    xtype: 'md-toggle',

    requires: [
        'Ext.util.Draggable'
    ],

    template: [
        {
            tag: 'div',
            reference: 'containerElement',
            className: 'md-container',
            children: [
                {
                    tag: 'div',
                    reference: 'barElement',
                    className: 'md-bar'
                },
                {
                    tag: 'div',
                    reference: 'thumbContainerElement',
                    className: 'md-thumb-container',
                    children: [
                        {
                            tag: 'div',
                            reference: 'thumbElement',
                            className: 'md-thumb'
                        }
                    ]
                }
            ]
        }
    ],

    config: {
        baseCls: 'md-switch',
        valueChecked: true,
        valueUnchecked: false,
        value: false,
        checkedCls: 'md-checked',
        checkedCls1: 'md-checked1',
        checkedCls2: 'md-checked2',
        checkedCls3: 'md-checked3',
        codeColor: ''
    },

    initialize: function () {
        this.callParent();

        this.element.addCls('transition');

        var draggable = Ext.factory({ element: this.thumbContainerElement, direction: 'horizontal' }, Ext.util.Draggable);

        draggable.onBefore({
            dragstart: 'onDragStart',
            drag: 'onDrag',
            dragend: 'onDragEnd',
            scope: this
        });

        this.element.on({
            scope: this,
            tap: 'onTap',
            resize: 'onResize'
        });

        var rippleService = Material.RippleService;

        rippleService.attachCheckboxBehavior(this, this.thumbElement);
    },

    onResize: function () {
        var self = this;

        setTimeout(function () {
            self.doTap(true);
        });
    },

    onTap: function listener(ev) {
        if (this.getDisabled())
            return;

        this.doTap(false);
    },

    doTap: function (keepOrigin) {
        var checked = undefined,
            newValue = undefined,
            value = this.getValue(),
            valueChecked = this.getValueChecked(),
            valueUnchecked = this.getValueUnchecked();

        if (value == valueChecked) {
            checked = true;
            newValue = valueUnchecked;
        } else if (value == valueUnchecked) {
            check = false;
            newValue = valueChecked;
        }

        if (!keepOrigin) {
            checked = !checked;
            this.setValue(newValue);

            this.fireEvent('change', this, this.thumbElement, newValue, value);
        }

        this.render(checked);
    },

    render: function render(checked) {
        if (checked) {
            // handler for codeColor
            if (this.getCodeColor() === 1)
                this.element.addCls(this.getCheckedCls1());
            else if (this.getCodeColor() === 2)
                this.element.addCls(this.getCheckedCls2());
            else if (this.getCodeColor() === 3)
                this.element.addCls(this.getCheckedCls3());
            else
                this.element.addCls(this.getCheckedCls());

            //TODO: should verify carefully on browser
            this.thumbContainerElement.setStyle({
                '-webkit-transform': 'translate3d(' + this.thumbContainerElement.getWidth() + 'px, 0, 0) ',
                '-moz-transform': 'translate3d(' + this.thumbContainerElement.getWidth() + 'px, 0, 0)'
            });
        } else {
            // handler for codeColor
            if (this.getCodeColor() === 1)
                this.element.removeCls(this.getCheckedCls1());
            else if (this.getCodeColor() === 2)
                this.element.removeCls(this.getCheckedCls2());
            if (this.getCodeColor() === 3)
                this.element.removeCls(this.getCheckedCls3());
            else
                this.element.removeCls(this.getCheckedCls());

            //TODO: should verify carefully on browser
            this.thumbContainerElement.setStyle({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                '-moz-transform': 'translate3d(0, 0, 0)'
            });
        }
    },

    onDragStart: function onDragStart(sender, e) {
        if (this.getDisabled())
            return false;

        this.barX = this.barElement.getX();

        this.element.removeCls('transition');
    },

    onDrag: function onDrag(ev, drag) {

    },

    onDragEnd: function onDragEnd(sender, e) {
        if (this.getDisabled())
            return false;

        this.element.addCls('transition');

        var value = this.getValue(),
            endPosition = Math.max(0, e.pageX - this.barX),
            halfDistance = this.barElement.getWidth() / 2,
            isChanged = value && (endPosition < halfDistance) || !value && (endPosition > halfDistance);

        if (isChanged) {
            this.doTap(false);
        } else {
            this.doTap(true);
        }

    }
});