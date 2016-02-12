/**
 * @author Vu Duc Tuyen
 * @public
 *
 * This is a special class for displaying the list of values for the field {@link Material.components.field.Select}.
 *
 */
Ext.define('Material.components.field.SelectPanel', {
    extend: 'Ext.Panel',

    requires: [
        'Material.helpers.RippleService'
    ],

    config: {
        onHide: null
    },

    xtype: 'select-panel',

    hide: function() {
        this.element.addCls('x-hiding');
        var self = this;

        setTimeout(function(){
            self.superclass.hide.call(self);

            var onHide = self.getOnHide();
            if(typeof onHide === 'function') {
                onHide.call(self);
            }

            self.element.removeCls('x-top x-right x-left x-bottom x-hiding');
        }, 201);
    },

    showBy: function(){
        this.callParent(arguments);
        this.getModal().addCls('x-mask-select-panel');
    },

    alignTo: function(component, alignment) {
        var alignmentInfo = this.getAlignmentInfo(component, alignment);
        if(alignmentInfo.isAligned) return;

        var alignToBox = alignmentInfo.stats.alignToBox,
            constrainBox = this.getParent().element.getPageBox(),
            height = alignmentInfo.stats.height,
            width = Math.max(alignToBox.width, this.getWidth() || 0),
            topToBottom = alignToBox.bottom - constrainBox.top - 24,
            bottomToTop = constrainBox.bottom - alignToBox.top + 24,
            leftToRight = constrainBox.right - alignToBox.left - 16,
            rightToLeft = alignToBox.right - constrainBox.left + 16,
            realHeight, realWidth,
            self = this;

        setTimeout(function() {
            if (topToBottom >= height || topToBottom >= bottomToTop) {
                realHeight = Math.min(height, topToBottom);
                self.setTop(alignToBox.bottom - realHeight - 2);
                self.setHeight(realHeight);
                self.element.addCls('x-bottom');
            }
            else {
                realHeight = Math.min(height, bottomToTop);
                self.setTop(alignToBox.top);
                self.setHeight(realHeight);
                self.element.addCls('x-top');
            }

            if (leftToRight >= width || leftToRight >= rightToLeft) {
                realWidth = Math.min(width, leftToRight);
                self.setLeft(alignToBox.left);
                self.setWidth(realWidth);
                self.element.addCls('x-left');
            }
            else {
                realWidth = Math.min(width, rightToLeft);
                self.setLeft(alignToBox.right - realWidth);
                self.setWidth(realWidth);
                self.element.addCls('x-right');
            }

            self.setCurrentAlignmentInfo(alignmentInfo);
        },  10);
    }
});