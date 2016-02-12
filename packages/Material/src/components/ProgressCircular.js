/**
 * @class Material.components.ProgressCircular
 *
 * This class is to define an existing control, progress circular in new HTML structure.
 * */
Ext.define('Material.components.ProgressCircular', {
    extend: 'Ext.Mask',

    xtype: 'md-progress-circular',

    config: {
        /**
         * @cfg {Boolean} endless Indicates if it's an endless circular progress (Indeterminate) or not (Determinate)
         * @accessor
         */
        endless: false,

        /**
         * @cfg {Number} value The current progress percentage value
         * @accessor
         * @range 0-100
         */
        value: 0,
        type: 'percent',

        /**
         *
         */
        message: 'Loading'
    },

    getTemplate: function () {
        return [
            {
                tag: 'div',
                reference: 'outerElement',
                cls: 'md-progress-circular',
                children: [
                    {
                        tag: 'div',
                        reference: 'wrapperElement',
                        cls: 'md-spinner-wrapper',
                        children: [
                            //the elements required for the CSS loading {@link #indicator}
                            {
                                tag: 'div',
                                reference: 'innerElement',
                                cls: 'md-inner',
                                children: [
                                    {
                                        tag: 'div',
                                        reference: 'P100',
                                        cls: 'myrounded',
                                        text: '0 %'

                                    },

                                    {
                                        tag: 'div',
                                        cls: 'md-right',
                                        children: [
                                            {
                                                tag: 'div',
                                                reference: 'r',
                                                cls: 'md-half-circle'
                                            }
                                        ]
                                    },
                                    {
                                        tag: 'div',
                                        cls: 'md-left',
                                        children: [
                                            {
                                                tag: 'div',
                                                reference: 'l',
                                                cls: 'md-half-circle'

                                            }
                                        ]
                                    }


                                ]
                            }
                        ]
                    }


                ]
            }

        ];
    },

    applyEndless: function (endless) {
        var outerElementDom = this.outerElement.dom;

        if (endless === true) {
            outerElementDom.setAttribute('md-mode', 'indeterminate');
        } else {
            outerElementDom.setAttribute('md-mode', 'determinate');
        }

        return endless;
    },

    applyValue: function (value) {
         /*var outerElementDom = this.outerElement.dom;

         if (value > 100) {
         value = 100;
         } else if (value < 0) {
         value = 0;
         }

         outerElementDom.setAttribute('value', value);

         return value;*/

    }
    ,
    initialize: function () {
        this.callParent();
        var outerElementDom = this.outerElement.dom;
        var r = this.r.dom;
        var l= this.l.dom;
        var r_=-135;
        var l_= 135;
        var click= true;
        if (this.getType() === 'percent') {
                    localStorage.setItem("dem",0);
                    var P = this.P100;
                    l.style.webkitTransform ="rotate("+l_+"deg)";
                    l.style.WebkitTransition ="-webkit-transform 0.1s  ease-out" ;
                    r.style.webkitTransform ="rotate("+r_+"deg)";
                    r.style.WebkitTransition ="-webkit-transform 0.1s  ease-out" ;
                    // firefox
                    l.style.MozTransform ="rotate("+l_+"deg)";
                    l.style.MozTransition ="-webkit-transform 0.1s  ease-out" ;
                    r.style.MozTransform ="rotate("+r_+"deg)";
                    r.style.MozTransition ="-webkit-transform 0.1s  ease-out" ;
                    // opera
                    l.style.OTransform ="rotate("+l_+"deg)";
                    l.style.OTransition ="-webkit-transform 0.1s  ease-out" ;
                    r.style.OTransform ="rotate("+r_+"deg)";
                    r.style.OTransition ="-webkit-transform 0.1s  ease-out" ;
                    this.on("tap", function() {
                         if(click)
                         {
                             click = false;
                             localStorage.setItem("dem",0);
                             r_=-135;
                             l_= 135;
                             var interval= window.setInterval(function () {
                                 if (parseInt(localStorage.getItem("dem")) >= 100) {
                                     clearInterval(interval);
                                     click = true;
                                     /*localStorage.setItem("dem",0);
                                      r_=-135;
                                      l_= 135;*/
                                 }
                                 if(parseInt(localStorage.getItem("dem"))<=50)
                                 {

                                     // safari and chrome
                                     l.style.webkitTransform ="rotate("+l_+"deg)";
                                     l.style.WebkitTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r.style.webkitTransform ="rotate("+r_+"deg)";
                                     r.style.WebkitTransition ="-webkit-transform 0.1s  ease-out" ;
                                     // firefox
                                     l.style.MozTransform ="rotate("+l_+"deg)";
                                     l.style.MozTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r.style.MozTransform ="rotate("+r_+"deg)";
                                     r.style.MozTransition ="-webkit-transform 0.1s  ease-out" ;
                                     // opera
                                     l.style.OTransform ="rotate("+l_+"deg)";
                                     l.style.OTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r.style.OTransform ="rotate("+r_+"deg)";
                                     r.style.OTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r_=r_+3.6;


                                 }
                                 else
                                 {
                                     r_=45;
                                     l_=l_+3.6;
                                     // safari and chrome
                                     l.style.webkitTransform ="rotate("+l_+"deg)";
                                     l.style.WebkitTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r.style.webkitTransform ="rotate("+r_+"deg)";
                                     r.style.WebkitTransition ="-webkit-transform 0.1s  ease-out" ;
                                     // firefox
                                     l.style.MozTransform ="rotate("+l_+"deg)";
                                     l.style.MozTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r.style.MozTransform ="rotate("+r_+"deg)";
                                     r.style.MozTransition ="-webkit-transform 0.1s  ease-out" ;
                                     // opera
                                     l.style.OTransform ="rotate("+l_+"deg)";
                                     l.style.OTransition ="-webkit-transform 0.1s  ease-out" ;
                                     r.style.OTransform ="rotate("+r_+"deg)";
                                     r.style.OTransition ="-webkit-transform 0.1s  ease-out" ;

                                 }

                                 P.setText(localStorage.getItem("dem") + '%');
                                 localStorage.setItem("dem",parseInt(localStorage.getItem("dem"))+1);
                             },100);

                         }



            });

        }
        else {
            this.P100.setStyle({'display': 'none' });
            outerElementDom.setAttribute('md-mode', 'indeterminate');
        }
    }

});
