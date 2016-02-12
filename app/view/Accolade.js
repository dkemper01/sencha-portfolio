/**
 * Demonstrates usage of a custom Ext.tab.Panel component with the tabBar docked to the top of the screen
 * for Material Design Theme / Android, and at the bottom for all other themes.
 */

/**
 * This method returns an array of all items we should add into the form panel we create below in the splitViewPortfolio.view.MaterialPanel
 * We have created this function to simply make things cleaner and easier to read and understand. You could just put these items
 * inline down below in the form `config`.
 * @return {Array} items
 */
var getFormItems = function () {

    return [

        {
            xtype: 'fieldset',
            title: 'Contact Me',
            instructions: 'Please enter the information above.',
            defaults: {
                labelWidth: '35%',
                required: true
            },
            items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        label: 'Name',
                        autoCapitalize: false,
                        clearIcon: true
               },
                    {
                        xtype: 'textareafield',
                        name: 'message',
                        label: 'Message',
                        disabled: false,
                        autoCapitalize: false,
                        clearIcon: true
               },
                    {
                        xtype: 'emailfield',
                        name: 'email',
                        label: 'Email',
                        placeHolder: 'you@yourcompany.com',
                        clearIcon: true
               },
                    {
                        xtype: 'urlfield',
                        name: 'url',
                        label: 'Your Site',
                        placeHolder: 'http://yoursite.com',
                        clearIcon: true
               },
                    {
                        xtype: 'panel',
                        docked: 'bottom',
                        layout: {
                            type: 'hbox',
                            align: 'right'
                        },

                        style: 'background-color: transparent;',

                        items: [
                            {
                                xtype: 'button',
                                flex: 0.5,
                                style: "margin: 5px;",
                                text: 'Reset',
                                iconCls: 'refresh',
                                ui: 'confirm',
                                iconMask: true,
                                handler: function () {
                                    var contactForm = Ext.ComponentQuery.query('formpanel');
                                    contactForm[0].reset();
                                }
                           },
                            {
                                xtype: 'button',
                                flex: 0.5,
                                style: "margin: 5px;",
                                text: 'Send',
                                iconCls: 'arrow_up',
                                ui: 'confirm',
                                iconMask: true,
                                handler: function () {
                                    var contactForm = Ext.ComponentQuery.query('formpanel');
                                    contactForm[0].submit({
                                        waitMsg: {
                                            message: 'Submitting'
                                        }
                                    });
                                }
                           }
                   ]

               } // end toolbar config

           ] // end fieldset items
       }

   ];
};

var has3d = function() {
    return ('WebKitCSSMatrix' in window);
}

var screenShotsContent = (has3d()) ? {
    xtype: 'panel',
    cls: 'cube-container',
    initialCubeSize: 300,
    maxCubeSize: 650,
    flex: 2,
    listeners: {
        painted: function (element, eOpts) {

            var hexaFlipInner = null;
            var hexaFlipSides = null;
            var ancestorContainer = null;
            var ancestorComputedStyle = null;
            var cOpts = this.getInitialConfig();

            console.log('splitViewPortfolio.view.CubePanel: entering painted handler');

            if (this.hexaFlip) {

                hexaFlipInner = Ext.DomQuery.select('.cube-container > .hexaflip');
                hexaFlipInner = hexaFlipInner[0];

                hexaFlipInner.removeChild(hexaFlipInner.firstChild);

                this.hexaFlip = null;
            }

            var parentComponent = this.getParent();

            // Stage the cube.
            //
            var cubeMarginTop = 0;
            var cubeSize = cOpts.initialCubeSize;
            var panelWidth = parentComponent.element.dom.clientWidth;
            var innerContainer = element.down('.x-panel-inner');
            var appImages = [
                /*
                            '/t3/examples/sencha-touch-2.4.2/splitViewPortfolio/resources/images/sample-app-medium-1.png',
                            '/t3/examples/sencha-touch-2.4.2/splitViewPortfolio/resources/images/sample-app-medium-2.png',
                            '/t3/examples/sencha-touch-2.4.2/splitViewPortfolio/resources/images/sample-app-medium-3.png',
                            '/t3/examples/sencha-touch-2.4.2/splitViewPortfolio/resources/images/sample-app-medium-4.png',
                            '/t3/examples/sencha-touch-2.4.2/splitViewPortfolio/resources/images/sample-app-medium-5.png',
                            '/t3/examples/sencha-touch-2.4.2/splitViewPortfolio/resources/images/sample-app-medium-6.png'
                */
                
                            './resources/images/sample-app-medium-1.png',
                            './resources/images/sample-app-medium-2.png',
                            './resources/images/sample-app-medium-3.png',
                            './resources/images/sample-app-medium-4.png',
                            './resources/images/sample-app-medium-5.png',
                            './resources/images/sample-app-medium-6.png'
                
                        ];

            if ((panelWidth > 480) && (panelWidth < 600)) {

                cubeSize = Math.ceil(panelWidth * (3 / 4));

            } else if (panelWidth >= 600) {

                cubeSize = Math.ceil(panelWidth * (2 / 3));
                cubeSize = cubeSize > cOpts.maxCubeSize ? cOpts.maxCubeSize : cubeSize;
                cubeMarginTop = (panelWidth >= 1000) ? Math.floor(cubeSize * (1 / 11)) * -1 : 0;
            }

            // Create the cube.
            //
            this.hexaFlip = new HexaFlip(innerContainer.dom, {
                set: appImages
            }, {
                size: cubeSize,
                horizontalFlip: true
            });

            // Adjust top.
            //
            hexaFlipInner = Ext.DomQuery.select('.cube-container > .hexaflip');
            hexaFlipInner = hexaFlipInner[0];
            hexaFlipInner.firstChild.style.marginTop = cubeMarginTop + 'px';
            
            // Force color background on sides.
            //
            if ((Ext.filterPlatform('chrome') || Ext.filterPlatform('android')) && (!Ext.filterPlatform('ios'))) {

                ancestorContainer = Ext.DomQuery.select('.x-container-screenshots');
                ancestorComputedStyle = getComputedStyle(ancestorContainer[0]);
                hexaFlipSides = Ext.DomQuery.select('.hexaflip-side');
                
                for (var i = 0; i < hexaFlipSides.length; i++) {

                    hexaFlipSides[i].style.backgroundColor = ancestorComputedStyle["backgroundColor"];
                }
            }
        }
    },
    style: 'text-align: center; margin: 0 auto; overflow: auto;'
} : {
    xtype: 'dataview',
    flex: 2,
    store: {
        fields: ['screenShot'],
        data: [
            {
                screenShot: 'resources/images/sample-app-medium-3.png'
        },
            {
                screenShot: 'resources/images/sample-app-medium-4.png'
        },
            {
                screenShot: 'resources/images/sample-app-medium-5.png'
        }
                            ]
    },
    style: 'margin: 0 auto; text-align: center;',
    itemTpl: '<img src="{screenShot}" style="min-width: 300px; width: 70%; max-width: 570px;">'
};

var isOfViewport = function isViewport(o) {
    return o instanceof Ext.viewport.Viewport;
};

var isOfContainer = function isContainer(o) {
    return o instanceof Ext.Container;
};

Ext.define('splitViewPortfolio.view.Accolade', {
    extend: 'splitViewPortfolio.view.MaterialPanel',
    mixin: ['Ext.mixin.Responsive'],

    initialize: function () {

        var self = this;

        self.callParent();

        // Add a Listener. Listen for [Viewport ~ Orientation] Change.
        //
        Ext.Viewport.on('orientationchange', 'handleOrientationChange', self, {
            buffer: 50
        });

        return this;
    },

    config: {
        activeTab: 0,
        cls: 'md-tabpanel-2',
        mdInkBar: null,
        scrollable: false,
        ui: 'light',
        tabBar: {
            ui: Ext.filterPlatform('blackberry') || Ext.filterPlatform('ie10') ? 'dark' : 'light',
            layout: {
                pack: 'center',
                align: 'center'
            },
            docked: Ext.filterPlatform('chrome') || Ext.filterPlatform('android') ? 'top' : 'bottom'
        },
        items: [
            {
                title: 'ScreenShots',
                iconCls: 'photos',
                xtype: 'container',
                itemId: 'ext-container-screenshots-two',
                cls: 'x-container-screenshots',

                layout: {
                    type: 'vbox'
                },

                padding: '0 1 8 1',

                items: [
                    {
                        xtype: 'panel',
                        cls: 'card',
                        html: '<div style="text-align: center;">Never lose site of your service or product sales goals again.</div>',
                        style: 'text-align: center;',
                        docked: 'top',
                        flex: 1
                    },
                    screenShotsContent
                ]
            },
            {
                title: 'Details',
                styleHtmlContent: false,
                html: '<div class="app-details-panel"><p>Accolade manages your sales goals with ease and style!</p><ol><li>Fully configurable, adjustable sales targets.</em></li><li>Beautiful reports display information on why top performers are out-selling others.</li><li>Projection analysis tool to forecast the next quarter.</li></ol><p>Cloud-based solution provides you:</p><ol><li>100% up-time.</li><li>Mobile and desktop options.</li><li>Highly competitive pricing per-seat.</li></ol></div>',
                iconCls: 'info',
                cls: 'x-container-details',
                scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
                xtype: 'container'
            },
            {
                cls: 'app-contact-form',
                title: 'Contact Me',
                iconCls: 'user',
                xtype: 'formpanel',
                url: 'postUser.php',
                standardSubmit: false,

                items: getFormItems(),

                listeners: {
                    submit: function (form, result) {
                        console.log('success', Ext.toArray(arguments));
                        Ext.Msg.alert('Success', 'Thanks!  Your message was successfully transmitted.', Ext.emptyFn);
                    },
                    exception: function (form, result) {
                        console.log('failure', Ext.toArray(arguments));
                        Ext.Msg.alert('Failure', 'Sorry!  Your message was not sent, please check all fields for values.', Ext.emptyFn);
                    }
                }
            }
        ]
    },

    handleOrientationChange: function (component, orientation, width, height) {

        // alert('Orientation has changed to: ' + orientation);
        // alert('Component passed to orientationchange event handler is: ' + component.getItemId());
        // alert('First panel found is: ' + component.down('#ext-container-screenshots').getItemId());

        var screenShotsContainer = component.down('#ext-container-screenshots-two');

        if (screenShotsContainer != null) {

            var materialPanel = screenShotsContainer.getParent();
            var containerItems = screenShotsContainer.getItems();
            var panelToHide = containerItems.getAt(0);
            var dataView = containerItems.getAt(1);

            if (orientation == "landscape") {

                if (Ext.os.is('Phone')) {
                    panelToHide.hide();
                    dataView.setMargin('2 0 0 0');
                }
            } else {

                if (Ext.os.is('Phone')) {
                    panelToHide.show();
                    dataView.setMargin('0 0 0 0');
                }

            }
            
            if ((Ext.filterPlatform('chrome') || Ext.filterPlatform('android')) && (!Ext.filterPlatform('ios'))) {
                materialPanel.activeItemChange(materialPanel);
            }

        }

        /*
        var items = component.getItems();
        var parentPanel = items.getAt(0);
        var childItems = parentPanel.getItems();
        var childPanel = childItems.getAt(1);
         
        alert(childPanel.getItemId());
         
        Ext.Anim.run(childPanel, 'slide', { direction: 'up'});   
        */
        
    }
});