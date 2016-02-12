Ext.define('Material.components.ColorPickerMain', {
    extend: 'Ext.Container',
    //extend: 'Ext.field.DatePicker',

    xtype: 'md-ColorPickerMain',
    requires: [

        'Material.components.ColorPicker'




    ],


    config: {
        fortype:'down',
        labelColor:'black' ,
        texLabel:'a',

        items: {
            xtype: 'container',

            width:'370px',
            style: 'background:transparent',
            itemId: 'root',
            items: [
                {
                    xtype: 'label',
                    text: 'color',
                    color: 'black',
                    html:'value',
                    width: 100,
                    left:0,
                    itemId:'lb',

                    style: 'background:trasparent;position:absolute; line-height:35px; height:35px'

                  //  cls: 'md-flab'

                },
                {
                    xtype: 'label',
                    text: 'color',
                    color: 'black',
                    width: 100,
                    top:40,
                    left:0,
                    style: 'background-color:transparent;position:absolute;vertical-align: middle; textAlign:center; line-height:35px; height:35px',
                    itemId: 'btnColor'
                   // cls: 'md-flab'
                }
                ,
                {
                    xtype: 'md-ColorPicker',
                    itemId: 'colorPicker',
                    top: 80,
                    right:0,
                    width:'100%'
                }
            ]
        }

    },

    initialize: function () {
        this.callParent();

        var me = this;

        var root = me.getComponent('root');
        var w1 = 35;//window.innerWidth;
        var h1 = 35;//window.innerHeight;
        var w = 500;//window.innerWidth;
        var h = 500;//window.innerHeight;
     /*   root.setHeight(h1);
        root.setWidth(w1);*/

        var colorPicker = me.getComponent('root').getComponent('colorPicker');
        var btnColor = me.getComponent('root').getComponent('btnColor');
        var lb = me.getComponent('root').getComponent('lb');
        lb.setHtml(this.getTexLabel());
        lb.setStyle('color:'+this.getLabelColor());
        this.setCodeColor('#000000');
        me.chanTextColor();
        colorPicker.hidePop();

        btnColor.element.on('tap', function () {
            colorPicker.showPop();
            /*root.setHeight(h);
            root.setWidth(w);*/

        });

        if(this.getFortype()=='up')
        {
            colorPicker.setStyle({top:'-480px'});
        }

        var oldValue = '#000000';

        colorPicker.getComponent('parent1').getComponent('parent22').getComponent('btnOk').on('tap', function () {
            btnColor.element.show();
            oldValue = btnColor.getHtml();
            btnColor.setHtml(me.getComponent('root').getComponent('colorPicker').codeColor());
            btnColor.setStyle('background:' + me.getComponent('root').getComponent('colorPicker').codeColor());
            me.getComponent('root').getComponent('colorPicker').hidePop();
            me.chanTextColor();

            var argsColor = {oldValue: oldValue, newValue: me.getComponent('root').getComponent('colorPicker').codeColor()};

            me.fireEvent('onColorChanged', argsColor);
           /* root.setHeight(h1);
            root.setWidth(w1);*/
        });

        colorPicker.getComponent('parent1').getComponent('parent22').getComponent('btnCancel').on('tap', function () {
            btnColor.element.show();
            me.getComponent('root').getComponent('colorPicker').hidePop();
           /* root.setHeight(h1);
            root.setWidth(w1);*/


        });


    },
    setCodeColor: function (code) {
        var me = this;
        var colorPicker = me.getComponent('root').getComponent('colorPicker');
        colorPicker.setValueColorPicker(code);
        var btnColor = me.getComponent('root').getComponent('btnColor');
        btnColor.setHtml(me.getComponent('root').getComponent('colorPicker').codeColor())
        btnColor.setStyle('background:' + me.getComponent('root').getComponent('colorPicker').codeColor());
        var r = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var vR = r.getValueLeft();
        var g = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG')
        var vG = g.getValueLeft();
        var b = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB')
        var vB = b.getValueLeft();
        if (vR < 150 && vG < 150 && vB < 150)
            btnColor.setStyle('color:white');
        else
            btnColor.setStyle('color:black');

    },
    getCodeColor: function () {
        var btnColor = this.getComponent('root').getComponent('btnColor');

        console.log('getCodeColor: ' + btnColor.getHtml());
        return  btnColor.getHtml();
    },
    chanTextColor: function () {

        var btnColor = this.getComponent('root').getComponent('btnColor');
        var r = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var vR = r.getValueLeft();
        var g = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG')
        var vG = g.getValueLeft();
        var b = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB')
        var vB = b.getValueLeft();
        if (vR < 150 && vG < 150 && vB < 150)
            btnColor.setStyle('color:white');
        else
            btnColor.setStyle('color:black');
    }
});
