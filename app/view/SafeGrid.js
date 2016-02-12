/**
 * Demonstrates usage of a custom Ext.tab.Panel component with the tabBar docked to the top of the screen
 * for Material Design Theme / Android, and at the bottom for all other themes.  
 */

/**
* This method returns an array of all items we should add into the form panel we create below in the Ext.Tab.Panel
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
                                       waitMsg: { message: 'Submitting' }
                                   });
                               }
                           }
                   ]

               } // end toolbar config

           ] // end fieldset items
       }

   ];
};

var isOfViewport = function isViewport(o) {
    return o instanceof Ext.viewport.Viewport;
};

var isOfContainer = function isContainer(o) {
    return o instanceof Ext.Container;
};

Ext.define('splitViewPortfolio.view.SafeGrid', {
    extend: 'splitViewPortfolio.view.MaterialPanel',

    initialize: function () {

        var self = this;

        self.callParent();

        // Add a Listener. Listen for [Viewport ~ Orientation] Change.
        //
        Ext.Viewport.on('orientationchange', 'handleOrientationChange', self, { buffer: 50 });

        return this;
    },

    config: {
        activeTab: 0,
        cls: 'md-tabpanel-1',
        mdInkBar: null,
        scrollable: false,
        ui: 'light',
        tabBar: {
            ui: Ext.filterPlatform('blackberry') || Ext.filterPlatform('ie10') ? 'dark' : 'light',
            layout: {
                pack : 'center',
                align: 'center'
            },
            docked: Ext.filterPlatform('chrome') || Ext.filterPlatform('android') ? 'top' : 'bottom'
        },
        items: [
            {
                title: 'ScreenShots',
                iconCls: 'photos',
                xtype: 'container',
                itemId: 'ext-container-screenshots-one',
                cls: 'x-container-screenshots',
                
                layout: {
                    type: 'vbox'
                },

                padding: '0 1 8 1',

                items: [
                    {
                        xtype: 'panel',
                        cls: 'card',
                        html: '<div>Real-time traffic device monitoring with push notification.</div>',
                        style: 'text-align: center;',
                        docked: 'top',
                        flex: 1
                    },
                    {
                        xtype: 'dataview',
                        flex: 2,

                        /*
                        scrollable: {
                            direction: 'vertical',
                            directionLock: true
                        },
                        */
            
                        store: {
                            fields: ['screenShot'],
                            data: [
                                { screenShot: 'resources/images/sample-app-medium-4.png' },
                                { screenShot: 'resources/images/sample-app-medium-5.png' },
                                { screenShot: 'resources/images/sample-app-medium-6.png' }
                            ]
                        },
                        style: 'margin: 0 auto; text-align: center;',
                        itemTpl: '<img src="{screenShot}" style="min-width: 300px; width: 70%; max-width: 570px;">'
                    }
                ]
                
            },
            {
                title: 'Details',
                styleHtmlContent: false,
                html: '<div class="app-details-panel"><p>With push notification, SafeGrid immediately notifies users of both light and crosswalk outages via ...</p><ol><li>Vibrant, easing animation <em>for logged-in users.</em></li><li>Email</li><li>Text message</li></ol><p>SVG drawing allows the developers of SafeGrid to ...</p><ol><li>Present scalable graphics without fidelity loss when zooming, panning, or rotating</li><li>Give real-time feedback on areas of the grid.</li><li>Present interactive regions for your custom data.</li></ol></div>',
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

    handleOrientationChange: function(component, orientation, width, height) {

        // alert('Orientation has changed to: ' + orientation);
        // alert('Component passed to orientationchange event handler is: ' + component.getItemId());
        // alert('First panel found is: ' + component.down('#ext-container-screenshots').getItemId());
        
        var screenShotsContainer = component.down('#ext-container-screenshots-one');
        
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
