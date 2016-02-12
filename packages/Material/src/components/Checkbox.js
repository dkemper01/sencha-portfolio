/**
 *
 * @class Material.components.Checkbox
 *
 * This class is to define an existing control, checkbox, with a totally template of HTML structure
 * */
Ext.define('Material.components.Checkbox', {
    extend: 'Ext.Component',

    xtype: 'md-checkbox',
    template: [
        {
            tag: 'div',
            reference: 'containerElement',
            className: 'md-container',
            children: [
                {
                    tag: 'div',
                    reference: 'containerElement1',
                    className: 'md-container1',
                    children: [
                        {
                            tag: 'div',
                            reference: 'icon',
                            className: 'md-icon'
                        },
                        {
                            tag: 'div',
                            reference: 'icon2',
                            className: 'md-icon2'
                        } ,
                        {
                            tag: 'div',
                            reference: 'clip',
                            className: 'md-icon2'
                        }
                    ]

                }

            ]
        }
    ],

    config: {
        baseCls: 'md-checkbox',
        valueChecked: true,
        valueUnchecked: false,
        value: false,
        checkedCls: 'md-checked',
        radioCls: 'md-checkbox-radio',
        nonradioCls: 'md-checkbox-nonradius',
        clipCls: 'md-checkbox-clip',
        type: 'abc'


    },

    initialize: function () {
        this.callParent();
        if (this.getType() == 'radio') {
            this.element.removeCls(this.getBaseCls());

            this.element.addCls(this.getRadioCls());


        }
        else if (this.getType() == 'nonradius') {
            this.element.removeCls(this.getBaseCls());
            this.element.removeCls(this.getRadioCls());
            this.element.addCls(this.getNonradioCls());

        }
        else if (this.getType() == 'clip') {
            this.element.removeCls(this.getBaseCls());
            this.element.removeCls(this.getRadioCls());
            this.element.removeCls(this.getNonradioCls());
            this.element.addCls(this.getClipCls());

        }
        this.element.on({
            scope: this,
            tap: 'onTap'
        });

        this.doTap(true);

        var rippleService = Material.RippleService;

        rippleService.attachCheckboxBehavior(this, this.containerElement);
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
        }

        this.render(checked);
    },

    render: function render(checked) {
        var clip = this.clip.dom;

        if (checked) {
            this.element.addCls(this.getCheckedCls());
            this.icon2.dom.style.zIndex = '9';
            clip.style.borderColor = 'transparent';
            var i = 0;

            clip.style.height = 25 + "px";
            clip.style.top = 5 + "px";
            var interval = window.setInterval(function () {

                clip.style.marginLeft = i + "px";

                i++;
                if (i >= 35)
                {
                    clearInterval(interval);

                }


            }, 10);


        } else {
            this.element.removeCls(this.getCheckedCls());

            clip.style.marginLeft = "0px";

        }

    }

});