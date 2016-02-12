/**
 * Presents a large touch zone and reports all of the touch events fired when the user interacts with it
 */
Ext.define('splitViewPortfolio.view.TouchEvents', {
    extend: 'Ext.Container',
    xtype: 'touchevents'
    /*,

    requires: [
        'Portfolio.SplitView.view.touchevent.Info',
        'Portfolio.SplitView.view.touchevent.Logger',
        'Portfolio.SplitView.view.touchevent.Pad'
    ],

    initialize: function() {
        this.callParent(arguments);

        var padElement = Ext.get('touchpad');

        padElement.on(['touchstart', 'touchend', 'touchmove',
                        'swipe', 'dragstart', 'drag', 'dragend',
                        'tap', 'singletap', 'doubletap', 'longpress', 'pinch', 'rotate'],
        'onTouchPadEvent', this);
    },

    onTouchPadEvent: function(e, target, options, eventController) {
        this.down('toucheventlogger').addLog(eventController.info.eventName);
    }
    */
});
