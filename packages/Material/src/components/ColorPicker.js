Ext.define('Material.components.ColorPicker', {
    extend: 'Ext.Panel',
    xtype: 'md-ColorPicker',
    alias: 'widget.ColorPicker',
    requires: [
        'Material.components.Slider'
    ],
    config: {
        // We give it a left and top property
        //to make it floating by default
        /*left: 0,
         top: 0,*/

        itemIndex: '',
        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: true,
        centered: true,

        // Set the width and height of the panel


        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },

        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },
        items: [
            {
                xtype: 'container',
                layout: 'vbox',

                width:'350px',
                itemId: 'parent1',
                items: [
                    {
                        xtype: 'container',
                        itemId: 'parent2',

                        width:'100%',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'vbox',
                                itemId: 'parent3',

                                width:'70%',
                                padding: 10,
                                items: [
                                    {
                                        xtype: 'container',
                                        itemId: 'tpl',
                                        style: 'background:rgb(0,0,0); marginBottom:25px',
                                        width:'100%',
                                        height: 150,
                                        items: {
                                            xtype: 'textfield',
                                            itemId: 'code-color',
                                            text: '#Color',
                                            clearIcon: false,
                                            style: 'font-size: 100%; background:transparent;padding-left:20%',
                                            centered: true
                                        }
                                    },
                                    {
                                        xtype: 'md-slider',
                                        width:'100%',
                                        height: 60,
                                        max: 255,
                                        itemId: 'itemIdR',
                                        min: 0,
                                        step: 1,
                                        type: 'notickSingleLeft',
                                        tick: 'hidden',
                                        codeColor: 'red'
                                    },
                                    {
                                        xtype: 'md-slider',
                                        itemId: 'itemIdG',
                                        width:'100%',
                                        height: 60,
                                        max: 255,
                                        min: 0,
                                        step: 1,
                                        type: 'notickSingleLeft',
                                        tick: 'hidden',
                                        codeColor: 'green'
                                    },
                                    {
                                        xtype: 'md-slider',
                                        itemId: 'itemIdB',
                                        width:'100%',
                                        height: 60,
                                        max: 255,
                                        min: 0,
                                        step: 1,
                                        type: 'notickSingleLeft',
                                        tick: 'hidden',
                                        codeColor: 'blue'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                //height: 400,
                                itemId: 'parent33',
                                width: '30%',
                                style: 'margin:10px 10px 0px 0px',
                                height: 350,
                                items: [
                                    {
                                        xtype: 'list',
                                        itemId: 'listItemId',
                                        itemTpl: '<div style="text-align: center; vertical-align: middle;display: table; font-size: 12px; margin-top: -5px; margin-left: 18px">' + '{value}' + '</div>',
                                        cls: 'forColorPicker',
                                        height: '100%',
                                        width: '100%',
                                        data: [

                                            { title: 'Red', value: '#F44336'  },
                                            { title: 'Pink', value: '#E91E63'  },
                                            { title: 'Purple', value: '#9C27B0'  },
                                            { title: 'Deep Purple', value: '#673AB7'  },
                                            { title: 'Indigo', value: '#3F51B5'  },
                                            { title: 'Blue', value: '#2196F3'  },
                                            { title: 'Light Blue', value: '#03A9F4'  },
                                            { title: 'Cyan', value: '#00BCD4'  },
                                            { title: 'Teal', value: '#009688'  },
                                            { title: 'Green', value: '#4CAF50'  },
                                            { title: 'Light Green', value: '#8BC34A' },
                                            { title: 'Lime', value: '#CDDC39'  },
                                            { title: 'Yellow', value: '#FFEB3B'  },
                                            { title: 'Amber', value: '#FFC107'  },
                                            { title: 'Orange', value: '#FF9800'  },
                                            { title: 'Deep Orange', value: '#FF5722'  },
                                            { title: 'Brown', value: '#795548'  },
                                            { title: 'Grey', value: '#9E9E9E'  },
                                            { title: 'Blue Grey', value: '#607D8B'  },
                                            { title: 'Black', value: '#000000'  },
                                            { title: 'White', value: '#FFFFFF' }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar',

                        itemId: 'parent22',
                        width: '100%',
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
                                xtype: 'button',
                                text: 'Cancel',
                                itemId: 'btnCancel',
                                cls: 'md-flat',
                                cls: 'md-flab'
                            },
                            {
                                xtype: 'button',
                                text: 'OK',
                                cls: 'md-flat',
                                itemId: 'btnOk'
                               /* listeners :
                                {
                                    element : 'element',
                                    tap : function(e, t)
                                    {
                                        var me = this;
                                        me.up('ColorPicker').setItemIndex(1);

                                    }
                                }*/
                            }
                        ]
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callParent();
        var me = this;


        this.getComponent('parent1').getComponent('parent2').getComponent('parent3').setStyle('opacity:0.9');

        this.getComponent('parent1').getComponent('parent22').getComponent('btnOk').on('tap', function () {
            me.hidePop();
        });
        var r = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');

        var g = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG')

        var b = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB');

        var tpl = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl');
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');

        codeColor.on('change', function () {
            tpl.setStyle('background:' + codeColor.getValue());
            me.chanceValueSlider(codeColor.getValue());
        });
        r.element.on({
            scope: this,
            'touchstart': function (ev) {
            },
            'touchend': function (ev) {


                var vR = r.getValueLeft();

                var vG = g.getValueLeft();

                var vB = b.getValueLeft();


                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());


                if (vR < 150 && vG < 150 && vB < 150)
                    codeColor.setStyle('-webkit-text-fill-color:white');
                else
                    codeColor.setStyle('-webkit-text-fill-color:black');


            },
            'touchmove': function (ev) {

                var vR = r.getValueLeft();

                var vG = g.getValueLeft();

                var vB = b.getValueLeft();

                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());

                if (vR < 150 && vG < 150 && vB < 150)
                    codeColor.setStyle('-webkit-text-fill-color:white');
                else
                    codeColor.setStyle('-webkit-text-fill-color:black');
            }
        });
        g.element.on({
            scope: this,

            'touchstart': function (ev) {
            },
            'touchend': function (ev) {


                var vR = r.getValueLeft();

                var vG = g.getValueLeft();

                var vB = b.getValueLeft();


                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());


                if (vR < 150 && vG < 150 && vB < 150)
                    codeColor.setStyle('-webkit-text-fill-color:white');
                else
                    codeColor.setStyle('-webkit-text-fill-color:black');

            },
            'touchmove': function (ev) {

                var vR = r.getValueLeft();

                var vG = g.getValueLeft();

                var vB = b.getValueLeft();

                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());

                if (vR < 150 && vG < 150 && vB < 150)
                    codeColor.setStyle('-webkit-text-fill-color:white');
                else
                    codeColor.setStyle('-webkit-text-fill-color:black');
            }
        });
        b.element.on({
            scope: this,

            'touchstart': function (ev) {
            },
            'touchend': function (ev) {


                var vR = r.getValueLeft();

                var vG = g.getValueLeft();

                var vB = b.getValueLeft();


                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());


                if (vR < 150 && vG < 150 && vB < 150)
                    codeColor.setStyle('-webkit-text-fill-color:white');
                else
                    codeColor.setStyle('-webkit-text-fill-color:black');
            },
            'touchmove': function (ev) {

                var vR = r.getValueLeft();

                var vG = g.getValueLeft();

                var vB = b.getValueLeft();

                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());

                if (vR < 150 && vG < 150 && vB < 150)
                    codeColor.setStyle('-webkit-text-fill-color:white');
                else
                    codeColor.setStyle('-webkit-text-fill-color:black');
            }
        });
        this.getComponent('parent1').getComponent('parent2').getComponent('parent33').getComponent('listItemId').addListener
        (
            {
                itemtap: function (list, index, item, record) {
                    me.setColorItemList(record.get('value'));
                    me.setCodeColor(record.get('value'));

                    me.chanceValueSlider(record.get('value'));
                    me.chanTextColor();

                }

            });
        var list = this.getComponent('parent1').getComponent('parent2').getComponent('parent33').getComponent('listItemId');

        var arr = list.getData();

        for (var i = 0; i < list.getData().length; i++) {
            list.getItemAt(i).setStyle('background:' + arr[i].value + ';min-height:28px;height:28px');
        }
        me.chanTextColor();
    },
    componentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    rgbToHex: function (r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    hidePop: function () {
        this.setStyle({ display: 'none'});
        this.hide();
    },
    showPop: function () {
        this.setStyle({ display: 'block'});
        this.show();
    },
    codeColor: function () {
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        return   codeColor.getValue().toUpperCase();
    },
    setColorItemList: function (codeColor) {
        var me = this;
        var tpl = me.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl');
        tpl.setStyle('background:' + codeColor);
    },
    setCodeColor: function (code) {
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        codeColor.setValue(code.toUpperCase());
    },
    chanTextColor: function () {
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        var r = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var vR = r.getValueLeft();
        var g = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG')
        var vG = g.getValueLeft();
        var b = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB')
        var vB = b.getValueLeft();
        if (vR < 150 && vG < 150 && vB < 150)
            codeColor.setStyle('-webkit-text-fill-color:white');
        else
            codeColor.setStyle('-webkit-text-fill-color:black');
    },
    hexToRGB: function (hex) {
        var r, g, b;
        r = hex.charAt(0) + "" + hex.charAt(1);
        g = hex.charAt(2) + "" + hex.charAt(3);
        b = hex.charAt(4) + "" + hex.charAt(5);

        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    chanceValueSlider: function (hex) {
        if (hex.charAt(0) == '#') {
            hex = hex.substr(1);
        }
        var r = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        r.fireEvent('touchstart', this);
        r.setValueLeft(parseInt(hex.charAt(0) + "" + hex.charAt(1), 16));

        var g = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG')
        g.setValueLeft(parseInt(hex.charAt(2) + "" + hex.charAt(3), 16));
        var b = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB')
        b.setValueLeft(parseInt(hex.charAt(4) + "" + hex.charAt(5), 16));

    },
    setValueColorPicker: function (codehexa) {
        this.chanceValueSlider(codehexa);
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        codeColor.setValue(codehexa.toUpperCase());
        var tpl = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl');
        tpl.setStyle('background:' + codehexa);

    }
})
;
