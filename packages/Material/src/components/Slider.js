Ext.define('Material.components.Slider', {
    extend: 'Ext.Component',

    xtype: 'md-slider',

    template: [
        {
            tag: 'div',
            reference: 'trackContainerElement',
            className: 'md-track-container',
            children: [
                {
                    tag: 'div',
                    reference: 'mdTrachElement',
                    className: 'md-track'
                },
                {
                    tag: 'div',
                    reference: 'mdTrachElementLeft',
                    className: 'track-left'
                },
                {
                    tag: 'div',
                    reference: 'trackFillElement',
                    className: 'md-track md-track-fill'
                },
                {
                    tag: 'div',
                    reference: 'trackFillElementLeft',
                    className: 'left'
                },
                {
                    tag: 'div',
                    reference: 'trackTicksElement',
                    className: 'md-track-ticks'
                }
            ]
        },
        {
            tag: 'div',
            reference: 'thumbContainerElement',
            id: 'thumbContainerElementID',
            className: 'md-thumb-container',
            children: [
                {
                    tag: 'div',
                    reference: 'thumbElement',
                    className: 'md-thumb'
                },
                {
                    tag: 'div',
                    className: 'md-focus-thumb'
                },
                {
                    tag: 'div',
                    className: 'md-focus-ring'
                },
                {
                    tag: 'div',
                    className: 'md-sign'
                },
                {
                    tag: 'div',
                    className: 'md-disabled-thumb'
                }
            ]
        }
        ,
        {
            tag: 'div',
            id: 'thumbContainerElementLeftID',
            reference: 'thumbContainerElementLeft',
            className: '.md-thumb-containerLeft',
            children: [
                {
                    tag: 'div',
                    reference: 'thumbElementLeft',
                    className: 'md-thumbL'
                },
                {
                    tag: 'div',
                    className: 'md-focus-thumb'
                },
                {
                    tag: 'div',
                    className: 'md-focus-ring'
                },
                {
                    tag: 'div',
                    className: 'md-sign'
                },
                {
                    tag: 'div',
                    className: 'md-disabled-thumb'
                }
            ]
        }

    ],

    config: {
        baseCls: 'md-slider',

        min: 0,

        max: 100,

        step: 20,

        width:0,

        value: 0,

        valueLeft: 0,

        typeTick:'notradius',

        type: 'tick',
        tick :'show',
        sliderLeftCls: 'md-slider-left',
        codeColor:''



    },

    updateAll: function () {
        this.refreshSliderDimensions();

        this.renderLeft();
        this.render();//----------------trunghq
        this.redrawTicks();

    },

    updateMin: function () {
        this.updateAll();
    },

    applyMin: function (value) {
        return parseFloat(value);
    },

    updateMax: function () {
        this.updateAll();
    },

    applyMax: function (value) {
        return parseFloat(value);
    },

    updateStep: function () {

        this.redrawTicks();
    },

    applyStep: function (value) {
        return parseFloat(value);
    },

    redrawTicks: function () {
        //alert('redrawTicks');
        //if (!this.element.is('.md-discrete')) return;
        if (this.getType() === 'notick' || this.getType() === 'notickSingleRight' || this.getType() === 'notickSingleLeft')
            return;

        var min = this.getMin(),
            max = this.getMax(),
            step = this.getStep(),

            numSteps = Math.floor((max - min) / step);

        //alert (step);


        if (!this.tickCanvas) {
            this.tickCanvas = document.createElement("DIV");
            this.tickCanvas.style.position='absolute';
            if(this.getTick()==="hidden") this.tickCanvas.style.display="none";
            // var dimensions = this.getWidth();
            //alert(dimensions);
            this.tickCanvas.style.width = this.getWidth();
            // this.tickCanvas.setHeight('6px');

            var distance;
            for (var i = 0; i <= numSteps; i++) {
                distance =((this.getWidth()/ numSteps) * i)/(1);
                //if(i==0) distance =1;
                //this.tickCtx.fillRect(distance-1, 1, 1, 600);


                var span = document.createElement("Span");
                span.style.position="absolute";
                // span.style.fontSize=" 15px ";
                // span.style.color="brown";
                span.style.width ="2px";
                span.style.height = "6px";

                if(this.getTypeTick()=="radius")
                {
                    span.style.width ="6px";
                    span.style.height = "6px";
                    span.style.borderRadius="50%";
                }

                span.style.background="#b1ac9c";
                // var t = document.createTextNode(i * step);
                //span.appendChild(t);
                span.style.marginLeft = distance+"px";
                span.style.marginTop = "-4px";
                this.tickCanvas.appendChild(span);



            }



            this.trackTicksElement.appendChild(this.tickCanvas);
        }

        if (!this.tickCanvasText) {
            this.tickCanvasText = document.createElement("DIV");
            this.tickCanvasText.style.marginTop ="-47px" ;

            this.tickCanvasText.style.width = this.getWidth();
            for (var j = 0; j <= numSteps; j++) {

                if (this.getType() == 'tickSingleRight') {
                    distance = ((this.getWidth()/ numSteps )*(numSteps-j))/(1);
                    var span = document.createElement("Span");
                    span.style.position="absolute";
                    span.style.color="white";
                    span.style.background="transparent"  ;
                    span.style.width= '30px';
                    span.style.height='30px';
                    span.style.opacity='0';
                    span.style.webkitTransitionDuration = '0.3s';
                    span.style.MozTransitionDuration = '0.4s';
                    /* span.style.webkitTransitionProperty = 'width';
                     span.style.webkitTransitionProperty = 'height';*/
                    span.style.marginLeft = distance-15+"px";

                    //////////////////
                    var span1 = document.createElement("Span");
                    span1.style.position = "absolute";
                    span1.style.fontSize = " 15px ";
                    span1.style.color = "white";
                    span1.style.display = 'inline-block';


                    span1.style.width = '30px';
                    span1.style.height = '30px';
                    span1.style.zIndex = 3;
                    span1.style.borderRadius = '50%';
                    span1.style.background = 'transparent';
                    span1.style.textAlign = "center";
                    span1.style.paddingTop = "6px";
                    span1.style.fontSize="12px";



                    var t = document.createTextNode(j * step);
                    span1.appendChild(t);

                    span.appendChild(span1);
                    /////////////
                    var span2 = document.createElement("Span");
                    span2.style.position = "absolute";
                    span2.style.display = 'inline-block';
                    //span2.style.transform = 'scale(1,1.2)';
                    span2.style.transform = 'rotate(135deg)';
                    span2.style.webkitTransform = 'rotate(135deg)';
                    span2.style.background = '#66BB6c';
                    span2.style.webkitTransitionDuration = '0.3s';
                    span2.style.MozTransitionDuration = '0.4s';
                    /*span2.style.webkitTransitionProperty = 'width';
                     span2.style.webkitTransitionProperty = 'height';*/
                    span2.style.margin='auto';
                    //top:0px;
                    span2.style.left='0px';
                    span2.style.right='0px';
                    span2.style.bottom='0px';

                    span2.style.width = '0px';
                    span2.style.height = '0px';
                    span2.style.zIndex = 2;
                    //span2.style.borderRadius= '100% 0 55% 50% / 55% 0 100% 50%';
                    span2.style.borderTopLeftRadius = '50%';
                    span2.style.borderBottomLeftRadius = '50%';
                    span2.style.borderBottomRightRadius = '50%';





                    span.appendChild(span2);
                    this.tickCanvasText.appendChild(span);

                }
                else
                {
                    distance =( Math.floor(this.getWidth() * (j / numSteps)))/(1);
                    var span = document.createElement("Span");
                    span.style.position="absolute";
                    // span.style.fontSize=" 1px ";
                    span.style.color="white";
                    span.style.background="transparent"  ;
                    span.style.width= '30px';
                    span.style.height='30px';
                    span.style.opacity='0';
                    span.style.webkitTransitionDuration = '0.3s';
                    /* span.style.webkitTransitionProperty = 'width';
                     span.style.webkitTransitionProperty = 'height';*/
                    span.style.MozTransitionDuration = '0.4s';
                    span.style.marginLeft = distance-15+"px";

                    //////////////////
                    var span1 = document.createElement("Span");
                    span1.style.position = "absolute";
                    span1.style.fontSize = " 15px ";
                    span1.style.color = "white";
                    span1.style.display = 'inline-block';


                    span1.style.width = '30px';
                    span1.style.height = '30px';
                    span1.style.zIndex = 3;
                    span1.style.borderRadius = '50%';
                    span1.style.background = 'transparent';
                    span1.style.textAlign = "center";
                    span1.style.paddingTop = "6px";
                    span1.style.fontSize="12px";


                    var t = document.createTextNode(j * step);
                    span1.appendChild(t);

                    span.appendChild(span1);
                    /////////////
                    var span2 = document.createElement("Span");
                    span2.style.position = "absolute";
                    span2.style.display = 'inline-block';
                    //span2.style.transform = 'scale(1,1.2)';
                    span2.style.transform = 'rotate(135deg)';
                    span2.style.webkitTransform = 'rotate(135deg)';
                    span2.style.background = '#66BB6c';
                    span2.style.webkitTransitionDuration = '0.3s';
                    span2.style.MozTransitionDuration = '0.4s';
                    /*   span2.style.webkitTransitionProperty = 'width';
                     span2.style.webkitTransitionProperty = 'height';*/
                    span2.style.margin='auto';
                    //top:0px;
                    span2.style.left='0px';
                    span2.style.right='0px';
                    span2.style.bottom='0px';

                    span2.style.width = '0px';
                    span2.style.height = '0px';
                    span2.style.zIndex = 2;
                    //span2.style.borderRadius= '100% 0 55% 50% / 55% 0 100% 50%';
                    span2.style.borderTopLeftRadius = '50%';
                    span2.style.borderBottomLeftRadius = '50%';
                    span2.style.borderBottomRightRadius = '50%';

                    span.appendChild(span2);


                    this.tickCanvasText.appendChild(span);


                }

            }

            this.trackContainerElement.appendChild(this.tickCanvasText);
        }
    },

    refreshSliderDimensions: function () {
        this.sliderDimensions = this.trackContainerElement.dom.getBoundingClientRect();
    },

    getSliderDimensions: function () {
        //throttledRefreshDimensions();
        return this.sliderDimensions;
    },

    /**
     * ngModel setters and validators
     */
    setModelValue: function (value) {
        this.setValue(this.minMaxValidator(this.stepValidator(value)));
    },
    setModelValueLeft: function (value) {
        this.setValueLeft(this.minMaxValidator(this.stepValidator(value)));
    },

    updateValue: function (newValue, oldValue) {
        this.render();
        this.fireEvent('change', this, this.thumbElement, newValue, oldValue);

    },
    updateValueLeft: function (newValue, oldValue) {
        this.renderLeft();
        this.fireEvent('change', this, this.thumbElementLeft, newValue, oldValue);     //-----trunghq---------
    },


    render: function () {
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValue(),
            percent = (value - min) / (max - min);

        this.setSliderPercent(percent);               //--------trunghq-----------
    },
    renderLeft: function () {
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValueLeft(),
            percent = (value - min) / (max - min);
        this.setSliderPercentLeft(percent);

    },

    minMaxValidator: function (value) {
        if (typeof value === 'number' && !isNaN(value)) {
            var min = this.getMin(),
                max = this.getMax();

            return Math.max(min, Math.min(max, value));
        }
    },
    stepValidator: function (value) {
        if (typeof value === 'number' && !isNaN(value)) {
            var step = this.getStep();
            return Math.round(value / step) * step;
        }
    },

    /**
     * @param percent 0-1
     */
    setSliderPercent: function (percent) {
        this.trackFillElement.setWidth((percent * 100) + '%');
        //this.draggable && this.draggable.setOffset((this.getSliderDimensions().width) * percent*(-1), 0);
        /*  if (this.getType() == 'slider-right') {*/
        this.draggable && this.draggable.getTranslatable().translate((-1) * (this.getSliderDimensions().width) * percent, 0);

        /* }
         else if (this.getType() == 'slider-left') {
         this.draggable && this.draggable.getTranslatable().translate((+1) * (this.getSliderDimensions().width) * percent, 0);
         }*/
        //console.log(this.getSliderDimensions().width);
       /* if (percent === 0) {
            this.element.addCls('md-min');
        } else {
            this.element.removeCls('md-min');
        }*/
    },
    setSliderPercentLeft: function (percent) {
        this.trackFillElementLeft.setWidth((percent * 100) + '%');
        //this.draggable && this.draggable.setOffset((this.getSliderDimensions().width) * percent*(-1), 0);
        /* if (this.getType() == 'slider-right') {
         this.draggable && this.draggable.getTranslatable().translate((-1) * (this.getSliderDimensions().width) * percent, 0);

         }
         else if (this.getType() == 'slider-left') {*/
        this.draggable && this.draggable.getTranslatable().translate((+1) * (this.getSliderDimensions().width) * percent, 0);
      //  this.thumbElementLeft.setStyle({transform:'translate(10, 0)'});
        //}
        //console.log(this.getSliderDimensions().width);
       /* if (percent === 0) {
            this.element.addCls('md-min');
        } else {
            this.element.removeCls('md-min');
        }*/
    },

    initialize: function () {

        this.callParent();


        this.element.addCls('md-slider');

        if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
            this.mdTrachElement.setStyle({ display: 'none'
            });
            this.thumbContainerElement.setStyle({ display: 'none'
            });


        }
        else if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
            this.mdTrachElement.setStyle({ display: 'none'
            });
            this.thumbContainerElementLeft.setStyle({ display: 'none'
            });


        }
        else {
            this.mdTrachElement.setStyle({ backgroundColor: 'rgb(102,187,106)', zIndex: '-10'
            });
            this.mdTrachElementLeft.setStyle({ backgroundColor: 'rgb(102,187,106)', zIndex: '-10'
            });
            this.trackFillElement.setStyle({ backgroundColor: '#b1ac9c'
            });
            this.trackFillElementLeft.setStyle({ backgroundColor: '#b1ac9c'
            });

        }


        this.element.on({
            scope: this,

            'touchstart': function (ev) {
                if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
                    this.draggable = draggable;
                }
                else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
                    this.draggable = draggableLeft;
                    //alert("touchstart");
                }
                else {
                    //type range
                    if (ev.target.className === 'md-thumbL') {
                        //alert(ev.target);
                        this.draggable = draggableLeft;
                    }
                    else if (ev.target.className === 'md-thumb') {
                        this.draggable = draggable;
                    }
                }
                if (this.getDisabled())
                    return false;

                this.isSliding = true;

                this.element.addCls('active');

                this.refreshSliderDimensions();
                //alert(ev.target.id);
                if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
                    this.onPan(this.element, ev);
                }
                else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
                    this.onPanLeft(this.element, ev);
                }
                else {
                    if (ev.target.className === 'md-thumbL')
                        this.onPanLeft(this.element, ev);
                    else if (ev.target.className === 'md-thumb')
                        this.onPan(this.element, ev);
                }
                // this.onPan(this.element, ev);
                ///////////-----------trunghq----------------//////////////
                ev.stopPropagation();
            },
            'touchend': function (ev) {
                if (this.isSliding && this.element.is('.md-discrete')) {
                    if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
                        this.onPanEnd(ev);
                    }
                    else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
                        this.onPanEndLeft(ev)
                    }
                    else {
                        if (ev.target.className === 'md-thumbL') {

                            this.onPanEndLeft(ev);    //------trunghq----------
                        }
                        else if (ev.target.className === 'md-thumb') {
                            this.onPanEnd(ev);
                        }
                    }
                }

                this.isSliding = false;
                this.element.removeCls('panning active');
            }
        });


        var draggable = Ext.factory({
            element: this.thumbContainerElement,
            direction: 'horizontal'
        }, Ext.util.Draggable);

        draggable.onBefore({
            dragstart: 'onPanStart',
            drag: 'onPan',
            dragend: 'onPanEnd',
            scope: this
        });


        ///---------------------------------------//
        var draggableLeft = Ext.factory({
            element: this.thumbContainerElementLeft,
            direction: 'horizontal'
        }, Ext.util.Draggable);

        draggableLeft.onBefore({
            dragstart: 'onPanStart',
            drag: 'onPanLeft',
            dragend: 'onPanEndLeft',
            scope: this
        });


       /* if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
            this.draggable = draggable;
        }
        else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
            this.draggable = draggableLeft;

        }*/
        if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight'||this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft')
        {
         if(this.getCodeColor()=='red')
         {
             this.element.addCls('md-red');
           this.thumbElementLeft.setStyle({'background-color': 'red' });

             this.trackFillElementLeft.setStyle({'background-color': 'red' });
         }
        else if(this.getCodeColor()=='green')
         {
             this.element.addCls('md-green');
            this.thumbElementLeft.setStyle({'background-color': 'green' });
             this.trackFillElementLeft.setStyle({'background-color': 'green' });
         }
        else
         if(this.getCodeColor()=='blue')
         {
             this.element.addCls('md-blue');
             this.thumbElementLeft.setStyle({'background-color': 'blue' });
             this.trackFillElementLeft.setStyle({'background-color': 'blue' });
         }
        else
         {

             this.thumbElementLeft.setStyle({'background-color': '  rgb(102,187,106)' });
             this.trackFillElementLeft.setStyle({'background-color': '  rgb(102,187,106)' });

         }
        }
        else
        {
            this.thumbElementLeft.setStyle({'background-color': ' rgb(102,187,106)' });
            this.trackFillElementLeft.setStyle({'background-color': '#b1ac9c' });
        }

        var self = this;

        self.element.on({
            'resize': 'onResize',
            scope: self
        });
       /* var thumL = document.getElementsByClassName('.md-thumb-containerLeft x-size-monitored x-paint-monitored x-draggable');
        alert(thumL);

        if(!thumL)
        thumL.style.transform ='translate3d(30px, 0px, 0px)';*/
       // this.doSlideLeft(10);
        return this;


    },


    onResize: function () {
        //alert('resize');
        var self = this;

        setTimeout(function () {
            self.refreshSliderDimensions();
            self.updateAll();

        });
    },

    onPanStart: function () {
        if (this.getDisabled())
            return false;

        if (!this.isSliding) return;
        this.element.addCls('panning');
    },

    onPan: function (sender, ev) {
        if (!this.isSliding) return false;

        this.doSlide(ev.pageX);
        // alert(ev.pageX);
        ev.stopPropagation && ev.stopPropagation();
        return false;
    },

    onPanEnd: function (ev) {
        if (this.element.is('.md-discrete') && !this.getDisabled()) {
            // Convert exact to closest discrete value.
            // Slide animate the thumb... and then update the model value.

            var exactVal = this.percentToValue(this.positionToPercent(ev.center.x));
            var closestVal = this.minMaxValidator(this.stepValidator(exactVal));

            this.setSliderPercent(this.valueToPercent(closestVal));

            this.setModelValue(closestVal);

            ev.stopPropagation && ev.stopPropagation();

            return false;
        }
    },
    onPanLeft: function (sender, ev) {
        if (!this.isSliding) return false;

        this.doSlideLeft(ev.pageX);
        // alert(ev.pageX);
        ev.stopPropagation && ev.stopPropagation();
        return false;
    },

    onPanEndLeft: function (ev) {
        if (this.element.is('.md-discrete') && !this.getDisabled()) {
            // Convert exact to closest discrete value.
            // Slide animate the thumb... and then update the model value.

            var exactVal = this.percentToValue(this.positionToPercentLeft(ev.center.x));
            var closestVal = this.minMaxValidator(this.stepValidator(exactVal));

            this.setSliderPercentLeft(this.valueToPercent(closestVal));

            this.setModelValueLeft(closestVal);

            ev.stopPropagation && ev.stopPropagation();

            return false;
        }
    },

    /**
     * Slide the UI by changing the model value
     * @param x
     */
    doSlide: function (x) {
        this.setModelValue(this.percentToValue(this.positionToPercent(x)));

        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValue();
        var   percent;
        percent =  (value - min) / (max - min);
        /*if (this.getType() == 'tick') {
         percent = 1-(this.getValue() - min) / (max - min);
         console.log(percent);
         }

         else {
         percent =  (value - min) / (max - min);

         }*/
        var percent1 =  (this.getValueLeft() - min) / (max - min);


        var    step = this.getStep(),

            numSteps = Math.floor((max - min) / step);
        if (this.tickCanvasText)

            for (var i = 0; i <= numSteps; i++) {
                if (this.getType() == 'tick') {
                    if (i / numSteps === percent  ) {

                        console.log(i / numSteps +"============="+percent);
                        this.tickCanvasText.childNodes[numSteps-i].style.opacity = '1';
                        this.tickCanvasText.childNodes[numSteps-i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[numSteps-i].childNodes[1].style.height = '30px';

                    }

                    else
                    {
                        this.tickCanvasText.childNodes[numSteps-i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[numSteps-i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[numSteps-i].style.opacity = '0';


                    }




                }

                else {
                    if (i / numSteps === percent) {


                        this.tickCanvasText.childNodes[i].style.opacity = '1';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';

                    }
                    else {


                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[i].style.opacity = '0';

                    }

                }


            }
        if (this.getType() == 'tick')
        {
            for(var i=0 ;i<=numSteps;i++)
            {
                if(i / numSteps === percent1)
                {
                    this.tickCanvasText.childNodes[i].style.opacity = '1';
                    this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                    this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';
                }
            }

        }

    },
    doSlideLeft: function (x) {
        this.setModelValueLeft(this.percentToValue(this.positionToPercentLeft(x)));
        // console.log(x);
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValueLeft(),
            percent = (value - min) / (max - min),
            percent1 = (this.getValue() - min) / (max - min),


            step = this.getStep(),

            numSteps = Math.floor((max - min) / step);
        if (this.tickCanvasText)

            for (var i = 0; i <= numSteps; i++) {
                if (this.getType() == 'tick') {
                    if (i / numSteps === percent||i / numSteps === 1-percent1 ) {
                        this.tickCanvasText.childNodes[i].style.opacity = '1';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';
                    }
                    else
                    {
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[i].style.opacity = '0';
                    }
                }
                else
                {
                    if (i / numSteps === percent) {


                        this.tickCanvasText.childNodes[i].style.opacity = '1';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';

                    }
                    else {


                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[i].style.opacity = '0';

                    }
                }


            }
    },

    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    adjustThumbPosition: function (x) {
         var exactVal = this.percentToValue(this.positionToPercent(x));
         var closestVal = this.minMaxValidator(this.stepValidator(exactVal));
         this.setSliderPercent(this.positionToPercent(x));
    },

    /**
     * Convert horizontal position on slider to percentage value of offset from beginning...
     * @param x
     * @returns {number}
     */
    positionToPercent: function (x) {
        /* if (this.getType() == 'slider-right') {*/
        return Math.max(0, Math.min(1, (this.sliderDimensions.right - x) / (this.sliderDimensions.width )));
        /*}
         else if (this.getType() == 'slider-left') {
         return Math.max(0, Math.min(1, (x - this.sliderDimensions.left) / (this.sliderDimensions.width )));
         }*/
        //  return Math.max(0, Math.min(1, (this.sliderDimensions.right-x) / (this.sliderDimensions.width )));
        // alert(this.sliderDimensions.left);
        // console.log(x);
        // console.log(this.sliderDimensions.left);
    },
    positionToPercentLeft: function (x) {
        /*  if (this.getType() == 'slider-right') {
         return Math.max(0, Math.min(1, (this.sliderDimensions.right - x) / (this.sliderDimensions.width )));
         }
         else if (this.getType() == 'slider-left') {*/
        return Math.max(0, Math.min(1, (x - this.sliderDimensions.left) / (this.sliderDimensions.width )));
        // }
        //  return Math.max(0, Math.min(1, (this.sliderDimensions.right-x) / (this.sliderDimensions.width )));
        // alert(this.sliderDimensions.left);
        // console.log(x);
        // console.log(this.sliderDimensions.left);
    },


    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    percentToValue: function (percent) {
        var min = this.getMin(),
            max = this.getMax();

        return (min + percent * (max - min));
    },

    valueToPercent: function (val) {
        var min = this.getMin(),
            max = this.getMax();

        return (val - min) / (max - min);
    }
});