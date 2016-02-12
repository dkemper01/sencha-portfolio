(function() {
    var $timeout = setTimeout;
    Ext.define('Material.helpers.RippleService', {
        //singleton: true,
        attachButtonBehavior: function attachButtonBehavior(scope, element, options) {
            return this.attach(scope, element, Ext.merge({}, {
                isFAB: element.hasCls('md-fab'),
                isMenuItem: element.hasCls('md-menu-item'),
                center: false,
                dimBackground: false
            }, options));
        },
        attachCheckboxBehavior: function attachCheckboxBehavior(scope, element, options) {
            return this.attach(scope, element, Ext.merge({}, {
                center: true,
                dimBackground: false
            }, options));
        },
        attachTabBehavior: function attachTabBehavior(scope, element, options) {
            return this.attach(scope, element, Ext.merge({}, {
                center: false,
                dimBackground: true,
                outline: true
            }, options));
        },
        attach: function attach(scope, element, options) {
            if (Ext.theme.is.MountainView) {
                var initialConfig = scope.getInitialConfig();
                if ((initialConfig.noInk || options.noInk) === true) {
                    return Ext.emptyFn;
                }
                options = Ext.merge({}, {
                    colorElement: element.dom,
                    mousedown: true,
                    hover: true,
                    focus: true,
                    center: false,
                    mousedownPauseTime: 150,
                    dimBackground: false,
                    outline: false,
                    isFAB: false,
                    isMenuItem: false
                }, options);
                var rippleContainer, rippleSize,
                    counter = 0,
                    ripples = [],
                    states = [],
                    isActive = false,
                    isHeld = false,
                    node = element.dom,
                    color = parseColor(initialConfig.inkColor || options.inkColor) || parseColor(window.getComputedStyle(options.colorElement).color || 'rgb(0, 0, 0)');
                element.on({
                    scope: scope,
                    touchstart: function(e) {
                        if (scope.getDisabled()) {
                            return false;
                        }
                        createRipple(e.pageX, e.pageY);
                        isHeld = true;
                    },
                    touchend: function(e) {
                        isHeld = false;
                        var index = ripples.length - 1;
                        ripple = ripples[index];
                        updateElement(ripple);
                    },
                    destroy: function() {
                        rippleContainer && rippleContainer.destroy();
                        rippleContainer = null;
                    }
                });
            }
            function parseColor(color) {
                if (!color)  {
                    return;
                }
                
                if (color.indexOf('rgba') === 0)  {
                    return color.replace(/\d?\.?\d*\s*\)\s*$/, '0.1)');
                }
                
                if (color.indexOf('rgb') === 0)  {
                    return rgbToRGBA(color);
                }
                
                if (color.indexOf('#') === 0)  {
                    return hexToRGBA(color);
                }
                
                /**
                 * Converts a hex value to an rgba string
                 *
                 * @param {string} hex value (3 or 6 digits) to be converted
                 *
                 * @returns {string} rgba color with 0.1 alpha
                 */
                function hexToRGBA(color) {
                    var hex = color.charAt(0) === '#' ? color.substr(1) : color,
                        dig = hex.length / 3,
                        red = hex.substr(0, dig),
                        grn = hex.substr(dig, dig),
                        blu = hex.substr(dig * 2);
                    if (dig === 1) {
                        red += red;
                        grn += grn;
                        blu += blu;
                    }
                    return 'rgba(' + parseInt(red, 16) + ',' + parseInt(grn, 16) + ',' + parseInt(blu, 16) + ',0.1)';
                }
                /**
                 * Converts rgb value to rgba string
                 *
                 * @param {string} rgb color string
                 *
                 * @returns {string} rgba color with 0.1 alpha
                 */
                function rgbToRGBA(color) {
                    return color.replace(')', ', 0.1)').replace('(', 'a(');
                }
            }
            function removeElement(elem, wait) {
                ripples.splice(ripples.indexOf(elem), 1);
                if (ripples.length === 0) {
                    rippleContainer && rippleContainer.setStyle({
                        backgroundColor: ''
                    });
                }
                $timeout(function() {
                    elem.dom.remove();
                }, wait, false);
            }
            function updateElement(elem) {
                var index = ripples.indexOf(elem),
                    state = states[index] || {},
                    elemIsActive = ripples.length > 1 ? false : isActive,
                    elemIsHeld = ripples.length > 1 ? false : isHeld;
                if (elemIsActive || state.animating || elemIsHeld) {
                    elem.addCls('md-ripple-visible');
                } else if (elem) {
                    elem.removeCls('md-ripple-visible');
                    if (options.outline) {
                        elem.setWidth(rippleSize + 'px');
                        elem.setHeight(rippleSize + 'px');
                        elem.setStyle({
                            marginLeft: (rippleSize * -1) + 'px',
                            marginTop: (rippleSize * -1) + 'px'
                        });
                    }
                    removeElement(elem, options.outline ? 450 : 650);
                }
            }
            /**
             * Creates a ripple at the provided coordinates
             *
             * @param {number} left cursor position
             * @param {number} top cursor position
             *
             * @returns {angular.element} the generated ripple element
             */
            function createRipple(left, top) {
                color = parseColor(element.getAttribute('mdInkRipple')) || parseColor(window.getComputedStyle(options.colorElement).color || 'rgb(0, 0, 0)');
                var container = getRippleContainer(),
                    size = getRippleSize(left, top),
                    css = getRippleCss(size, left, top),
                    elem = getRippleElement(css),
                    index = ripples.indexOf(elem),
                    state = states[index] || {};
                rippleSize = size;
                state.animating = true;
                $timeout(function() {
                    if (options.dimBackground) {
                        container.setStyle({
                            backgroundColor: color
                        });
                    }
                    elem.addCls('md-ripple-placed md-ripple-scaled');
                    if (options.outline) {
                        elem.setStyle({
                            borderWidth: (size * 0.5) + 'px',
                            marginLeft: (size * -0.5) + 'px',
                            marginTop: (size * -0.5) + 'px'
                        });
                    } else {
                        elem.setStyle({
                            left: '50%',
                            top: '50%'
                        });
                    }
                    updateElement(elem);
                    $timeout(function() {
                        state.animating = false;
                        updateElement(elem);
                    }, (options.outline ? 450 : 225), false);
                }, 0, false);
                return elem;
                /**
                 * Creates the ripple element with the provided css
                 *
                 * @param {object} css properties to be applied
                 *
                 * @returns {angular.element} the generated ripple element
                 */
                function getRippleElement(css) {
                    //'<div class="md-ripple" data-counter="' + counter++ + '">'
                    var elem = new Ext.Element(document.createElement('div'));
                    elem.addCls('md-ripple');
                    elem.set({
                        dataCounter: counter++
                    });
                    ripples.unshift(elem);
                    states.unshift({
                        animating: true
                    });
                    container.dom.appendChild(elem.dom);
                    css && elem.setStyle(css);
                    return elem;
                }
                /**
                 * Calculate the ripple size
                 *
                 * @returns {number} calculated ripple diameter
                 */
                function getRippleSize(left, top) {
                    var width = container.getWidth(),
                        height = container.getHeight(),
                        multiplier, size, rect;
                    if (options.isMenuItem) {
                        size = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
                        console.log('menu-item', size);
                    } else if (options.outline) {
                        rect = node.getBoundingClientRect();
                        left -= rect.left;
                        top -= rect.top;
                        width = Math.max(left, width - left);
                        height = Math.max(top, height - top);
                        size = 2 * Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
                    } else {
                        multiplier = options.isFAB ? 1.1 : 0.8;
                        size = Math.max(width, height) * multiplier;
                    }
                    return size;
                }
                /**
                 * Generates the ripple css
                 *
                 * @param {number} the diameter of the ripple
                 * @param {number} the left cursor offset
                 * @param {number} the top cursor offset
                 *
                 * @returns {{backgroundColor: *, width: string, height: string, marginLeft: string, marginTop: string}}
                 */
                function getRippleCss(size, left, top) {
                    var rect,
                        css = {
                            backgroundColor: rgbaToRGB(color),
                            borderColor: rgbaToRGB(color),
                            width: size + 'px',
                            height: size + 'px'
                        };
                    if (options.outline) {
                        css.width = 0;
                        css.height = 0;
                    } else {
                        css.marginLeft = css.marginTop = (size * -0.5) + 'px';
                    }
                    if (options.center) {
                        css.left = css.top = '50%';
                    } else {
                        rect = node.getBoundingClientRect();
                        css.left = Math.round((left - rect.left) / container.getWidth() * 100) + '%';
                        css.top = Math.round((top - rect.top) / container.getHeight() * 100) + '%';
                    }
                    return css;
                    /**
                     * Converts rgba string to rgb, removing the alpha value
                     *
                     * @param {string} rgba color
                     *
                     * @returns {string} rgb color
                     */
                    function rgbaToRGB(color) {
                        return color.replace('rgba', 'rgb').replace(/,[^\)\,]+\)/, ')');
                    }
                }
                /**
                 * Gets the current ripple container
                 * If there is no ripple container, it creates one and returns it
                 *
                 * @returns {angular.element} ripple container element
                 */
                function getRippleContainer() {
                    if (rippleContainer)  {
                        return rippleContainer;
                    }
                    
                    //'<div class="md-ripple-container">'
                    var container = rippleContainer = new Ext.Element(document.createElement('div'));
                    container.addCls('md-ripple-container');
                    element.dom.appendChild(container.dom);
                    return container;
                }
            }
        }
    }, function(RippleService) {
        Material.RippleService = new RippleService();
    });
}());

/**
 *
 * @class Material.components.Button
 * @override Ext.Button
 *
 * This overridden is just to add the ripple effect to the root element of the Button with
 * the help of #{Material.helper.RippleService}
 * */
Ext.define('Material.components.Button', {
    override: 'Ext.Button',
    xtype: 'button',
    //width:'200px !important',
    //height:'200px !important',
    config: {},
    //category: 'raised'
    /* width: '200px',
        height: '200px'*/
    requires: [
        'Material.helpers.RippleService'
    ],
    initialize: function() {
        this.callParent();
        var rippleService = Material.RippleService;
        rippleService.attachButtonBehavior(this, this.element);
        this.element.addCls('md-button');
        return this;
    },
    applyCategory: function(category) {
        var element = this.element;
        element.removeCls([
            'md-flat',
            'md-fab',
            'md-raised'
        ]);
        switch (category) {
            case 'flat':
                element.addCls('md-flat');
                break;
            case 'fab':
                element.addCls('md-fab');
                break;
            default:
                element.addCls('md-raised');
                break;
        }
        return category;
    }
});

Ext.define('Material.components.field.Field', {
    override: 'Ext.field.Field'
});

/**
 *
 * This is an overridden of {@link Ext.MessageBox} to match the definition of Google Material Design.
 *
 */
Ext.define('Material.components.MessageBox', {
    override: 'Ext.MessageBox',
    statics: {
        OK: {
            text: 'OK',
            itemId: 'ok',
            ui: 'action',
            cls: 'md-flat'
        },
        YES: {
            text: 'Yes',
            itemId: 'yes',
            ui: 'action',
            cls: 'md-flat'
        },
        NO: {
            text: 'No',
            itemId: 'no',
            cls: 'md-flat'
        },
        CANCEL: {
            text: 'Cancel',
            itemId: 'cancel',
            cls: 'md-flat'
        },
        OKCANCEL: [
            {
                text: 'Cancel',
                itemId: 'cancel',
                cls: 'md-flat'
            },
            {
                text: 'OK',
                itemId: 'ok',
                ui: 'action',
                cls: 'md-flat'
            }
        ],
        YESNOCANCEL: [
            {
                text: 'Cancel',
                itemId: 'cancel',
                cls: 'md-flat'
            },
            {
                text: 'No',
                itemId: 'no',
                cls: 'md-flat'
            },
            {
                text: 'Yes',
                itemId: 'yes',
                ui: 'action',
                cls: 'md-flat'
            }
        ],
        YESNO: [
            {
                text: 'No',
                itemId: 'no',
                cls: 'md-flat'
            },
            {
                text: 'Yes',
                itemId: 'yes',
                ui: 'action',
                cls: 'md-flat'
            }
        ]
    },
    /**
     * Adds the new {@link Ext.Toolbar} instance into this container.
     * @private
     */
    updateButtons: function(newButtons) {
        var me = this;
        // If there are no new buttons or it is an empty array, set newButtons
        // to false
        newButtons = (!newButtons || newButtons.length === 0) ? false : newButtons;
        if (newButtons) {
            if (me.buttonsToolbar) {
                me.buttonsToolbar.show();
                me.buttonsToolbar.removeAll();
                me.buttonsToolbar.setItems(newButtons);
            } else {
                var layout = {
                        type: 'hbox',
                        pack: 'right',
                        align: 'center'
                    };
                var isFlexed = Ext.theme.name == "CupertinoClassic" || Ext.theme.name == "MountainView" || Ext.theme.name == "Blackberry";
                me.buttonsToolbar = Ext.create('Ext.Toolbar', {
                    docked: 'bottom',
                    defaultType: 'button',
                    defaults: {
                        flex: (isFlexed) ? 1 : undefined,
                        ui: (Ext.theme.name == "Blackberry") ? 'action' : undefined
                    },
                    layout: layout,
                    ui: me.getUi(),
                    cls: me.getBaseCls() + '-buttons',
                    items: newButtons
                });
                me.add(me.buttonsToolbar);
            }
        } else if (me.buttonsToolbar) {
            me.buttonsToolbar.hide();
        }
    }
});

/**
 * @class Material.components.List
 * @override Ext.dataview.List
 *
 * This overridden is to add Material Design's ripple effect into list item or control inside list item.
 * */
Ext.define('Material.components.List', {
    override: 'Ext.dataview.List',
    requires: [
        'Material.helpers.RippleService'
    ],
    /* config: {
    for:''
    },*/
    /**
     * @private
     * */
    rippleService: null,
    /**
     * This overridden is to add the initialization of private property #{Material.components.List}.rippleService
     * for re-use later on
     *
     * @override
     * */
    initialize: function() {
        this.callParent();
        if (this.getCls() == 'forList') {
            this.element.addCls('forList');
        } else if (this.getCls() == 'forColorPicker') {
            this.element.addCls('forColorPicker');
        }
    },
    /**
     * This overridden is to check if this instance is a list of menu items.
     * If so, it will as ripple effect for each menu item.
     *
     * @override
     * */
    createItem: function(config) {
        var item = this.callParent([
                config
            ]),
            initialConfig = this.getInitialConfig();
        /*  if (initialConfig && initialConfig.isMenu === true)*/
        {
            Material.RippleService.attachButtonBehavior(this, item.element, {
                isMenuItem: true
            });
        }
        return item;
    },
    /**
     * This overridden is to check if each item on list contains a checkbox.
     * If so, it will as ripple effect for each checkbox.
     *
     * @override
     * */
    updateListItem: function(item, index, info) {
        this.callParent([
            item,
            index,
            info
        ]);
        var checkbox = item.element.down('.md-checkbox .md-container');
        if (checkbox) {
            this.rippleService.attachCheckboxBehavior(this, checkbox);
        }
    }
});

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
        setTimeout(function() {
            self.superclass.hide.call(self);
            var onHide = self.getOnHide();
            if (typeof onHide === 'function') {
                onHide.call(self);
            }
            self.element.removeCls('x-top x-right x-left x-bottom x-hiding');
        }, 201);
    },
    showBy: function() {
        this.callParent(arguments);
        this.getModal().addCls('x-mask-select-panel');
    },
    alignTo: function(component, alignment) {
        var alignmentInfo = this.getAlignmentInfo(component, alignment);
        if (alignmentInfo.isAligned)  {
            return;
        }
        
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
            } else {
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
            } else {
                realWidth = Math.min(width, rightToLeft);
                self.setLeft(alignToBox.right - realWidth);
                self.setWidth(realWidth);
                self.element.addCls('x-right');
            }
            self.setCurrentAlignmentInfo(alignmentInfo);
        }, 10);
    }
});

/**
 * @author Vu Duc Tuyen
 * @public
 *
 * This is an overridden of {@link Ext.field.Select} in which we will show up the customized
 * {@link Material.components.field.SelectPanel} rather than the built-in {@Ext.Panel}.
 *
 * Additionally, there is an indicator added to indicate whenever this field is focused or not.
 *
 */
Ext.define('Material.components.field.Select', {
    override: 'Ext.field.Select',
    requires: [
        'Material.components.field.SelectPanel'
    ],
    // @private
    getTabletPicker: function() {
        var config = this.getDefaultTabletPickerConfig(),
            self = this;
        if (!this.listPanel) {
            this.listPanel = Ext.create('Material.components.field.SelectPanel', Ext.apply({
                left: 0,
                top: 0,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                //width: Ext.os.is.Phone ? '14em' : '18em',
                height: (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) ? '12em' : (Ext.os.is.Phone ? '12.5em' : '22em'),
                items: {
                    xtype: 'list',
                    cls: 'forList',
                    isMenu: true,
                    store: this.getStore(),
                    itemTpl: '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select: this.onListSelect,
                        itemtap: this.onListTap,
                        scope: this
                    }
                },
                onHide: function() {
                    self.element.removeCls('x-field-focused');
                }
            }, config));
        }
        return this.listPanel;
    },
    onFocus: function() {
        this.element.addCls('x-field-focused');
        this.callParent(arguments);
    }
});

Ext.define('Material.components.Tab', {
    override: 'Ext.tab.Tab',
    requires: [
        'Material.helpers.RippleService'
    ],
    initialize: function() {
        this.callParent();
        var rippleService = Material.RippleService;
        rippleService.attachTabBehavior(this, this.element, {
            inkColor: '#ffff85'
        });
        this.element.addCls('md-tab');
        return this;
    }
});

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
                        },
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
    initialize: function() {
        this.callParent();
        if (this.getType() == 'radio') {
            this.element.removeCls(this.getBaseCls());
            this.element.addCls(this.getRadioCls());
        } else if (this.getType() == 'nonradius') {
            this.element.removeCls(this.getBaseCls());
            this.element.removeCls(this.getRadioCls());
            this.element.addCls(this.getNonradioCls());
        } else if (this.getType() == 'clip') {
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
        if (this.getDisabled())  {
            return;
        }
        
        this.doTap(false);
    },
    doTap: function(keepOrigin) {
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
            var interval = window.setInterval(function() {
                    clip.style.marginLeft = i + "px";
                    i++;
                    if (i >= 35) {
                        clearInterval(interval);
                    }
                }, 10);
        } else {
            this.element.removeCls(this.getCheckedCls());
            clip.style.marginLeft = "0px";
        }
    }
});

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
        },
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
        width: 0,
        value: 0,
        valueLeft: 0,
        typeTick: 'notradius',
        type: 'tick',
        tick: 'show',
        sliderLeftCls: 'md-slider-left',
        codeColor: ''
    },
    updateAll: function() {
        this.refreshSliderDimensions();
        this.renderLeft();
        this.render();
        //----------------trunghq
        this.redrawTicks();
    },
    updateMin: function() {
        this.updateAll();
    },
    applyMin: function(value) {
        return parseFloat(value);
    },
    updateMax: function() {
        this.updateAll();
    },
    applyMax: function(value) {
        return parseFloat(value);
    },
    updateStep: function() {
        this.redrawTicks();
    },
    applyStep: function(value) {
        return parseFloat(value);
    },
    redrawTicks: function() {
        //alert('redrawTicks');
        //if (!this.element.is('.md-discrete')) return;
        if (this.getType() === 'notick' || this.getType() === 'notickSingleRight' || this.getType() === 'notickSingleLeft')  {
            return;
        }
        
        var min = this.getMin(),
            max = this.getMax(),
            step = this.getStep(),
            numSteps = Math.floor((max - min) / step);
        //alert (step);
        if (!this.tickCanvas) {
            this.tickCanvas = document.createElement("DIV");
            this.tickCanvas.style.position = 'absolute';
            if (this.getTick() === "hidden")  {
                this.tickCanvas.style.display = "none";
            }
            
            // var dimensions = this.getWidth();
            //alert(dimensions);
            this.tickCanvas.style.width = this.getWidth();
            // this.tickCanvas.setHeight('6px');
            var distance;
            for (var i = 0; i <= numSteps; i++) {
                distance = ((this.getWidth() / numSteps) * i) / (1);
                //if(i==0) distance =1;
                //this.tickCtx.fillRect(distance-1, 1, 1, 600);
                var span = document.createElement("Span");
                span.style.position = "absolute";
                // span.style.fontSize=" 15px ";
                // span.style.color="brown";
                span.style.width = "2px";
                span.style.height = "6px";
                if (this.getTypeTick() == "radius") {
                    span.style.width = "6px";
                    span.style.height = "6px";
                    span.style.borderRadius = "50%";
                }
                span.style.background = "#b1ac9c";
                // var t = document.createTextNode(i * step);
                //span.appendChild(t);
                span.style.marginLeft = distance + "px";
                span.style.marginTop = "-4px";
                this.tickCanvas.appendChild(span);
            }
            this.trackTicksElement.appendChild(this.tickCanvas);
        }
        if (!this.tickCanvasText) {
            this.tickCanvasText = document.createElement("DIV");
            this.tickCanvasText.style.marginTop = "-47px";
            this.tickCanvasText.style.width = this.getWidth();
            for (var j = 0; j <= numSteps; j++) {
                if (this.getType() == 'tickSingleRight') {
                    distance = ((this.getWidth() / numSteps) * (numSteps - j)) / (1);
                    var span = document.createElement("Span");
                    span.style.position = "absolute";
                    span.style.color = "white";
                    span.style.background = "transparent";
                    span.style.width = '30px';
                    span.style.height = '30px';
                    span.style.opacity = '0';
                    span.style.webkitTransitionDuration = '0.3s';
                    span.style.MozTransitionDuration = '0.4s';
                    /* span.style.webkitTransitionProperty = 'width';
                     span.style.webkitTransitionProperty = 'height';*/
                    span.style.marginLeft = distance - 15 + "px";
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
                    span1.style.fontSize = "12px";
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
                    span2.style.margin = 'auto';
                    //top:0px;
                    span2.style.left = '0px';
                    span2.style.right = '0px';
                    span2.style.bottom = '0px';
                    span2.style.width = '0px';
                    span2.style.height = '0px';
                    span2.style.zIndex = 2;
                    //span2.style.borderRadius= '100% 0 55% 50% / 55% 0 100% 50%';
                    span2.style.borderTopLeftRadius = '50%';
                    span2.style.borderBottomLeftRadius = '50%';
                    span2.style.borderBottomRightRadius = '50%';
                    span.appendChild(span2);
                    this.tickCanvasText.appendChild(span);
                } else {
                    distance = (Math.floor(this.getWidth() * (j / numSteps))) / (1);
                    var span = document.createElement("Span");
                    span.style.position = "absolute";
                    // span.style.fontSize=" 1px ";
                    span.style.color = "white";
                    span.style.background = "transparent";
                    span.style.width = '30px';
                    span.style.height = '30px';
                    span.style.opacity = '0';
                    span.style.webkitTransitionDuration = '0.3s';
                    /* span.style.webkitTransitionProperty = 'width';
                     span.style.webkitTransitionProperty = 'height';*/
                    span.style.MozTransitionDuration = '0.4s';
                    span.style.marginLeft = distance - 15 + "px";
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
                    span1.style.fontSize = "12px";
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
                    span2.style.margin = 'auto';
                    //top:0px;
                    span2.style.left = '0px';
                    span2.style.right = '0px';
                    span2.style.bottom = '0px';
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
    refreshSliderDimensions: function() {
        this.sliderDimensions = this.trackContainerElement.dom.getBoundingClientRect();
    },
    getSliderDimensions: function() {
        //throttledRefreshDimensions();
        return this.sliderDimensions;
    },
    /**
     * ngModel setters and validators
     */
    setModelValue: function(value) {
        this.setValue(this.minMaxValidator(this.stepValidator(value)));
    },
    setModelValueLeft: function(value) {
        this.setValueLeft(this.minMaxValidator(this.stepValidator(value)));
    },
    updateValue: function(newValue, oldValue) {
        this.render();
        this.fireEvent('change', this, this.thumbElement, newValue, oldValue);
    },
    updateValueLeft: function(newValue, oldValue) {
        this.renderLeft();
        this.fireEvent('change', this, this.thumbElementLeft, newValue, oldValue);
    },
    //-----trunghq---------
    render: function() {
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValue(),
            percent = (value - min) / (max - min);
        this.setSliderPercent(percent);
    },
    //--------trunghq-----------
    renderLeft: function() {
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValueLeft(),
            percent = (value - min) / (max - min);
        this.setSliderPercentLeft(percent);
    },
    minMaxValidator: function(value) {
        if (typeof value === 'number' && !isNaN(value)) {
            var min = this.getMin(),
                max = this.getMax();
            return Math.max(min, Math.min(max, value));
        }
    },
    stepValidator: function(value) {
        if (typeof value === 'number' && !isNaN(value)) {
            var step = this.getStep();
            return Math.round(value / step) * step;
        }
    },
    /**
     * @param percent 0-1
     */
    setSliderPercent: function(percent) {
        this.trackFillElement.setWidth((percent * 100) + '%');
        //this.draggable && this.draggable.setOffset((this.getSliderDimensions().width) * percent*(-1), 0);
        /*  if (this.getType() == 'slider-right') {*/
        this.draggable && this.draggable.getTranslatable().translate((-1) * (this.getSliderDimensions().width) * percent, 0);
    },
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
    setSliderPercentLeft: function(percent) {
        this.trackFillElementLeft.setWidth((percent * 100) + '%');
        //this.draggable && this.draggable.setOffset((this.getSliderDimensions().width) * percent*(-1), 0);
        /* if (this.getType() == 'slider-right') {
         this.draggable && this.draggable.getTranslatable().translate((-1) * (this.getSliderDimensions().width) * percent, 0);

         }
         else if (this.getType() == 'slider-left') {*/
        this.draggable && this.draggable.getTranslatable().translate((+1) * (this.getSliderDimensions().width) * percent, 0);
    },
    //  this.thumbElementLeft.setStyle({transform:'translate(10, 0)'});
    //}
    //console.log(this.getSliderDimensions().width);
    /* if (percent === 0) {
            this.element.addCls('md-min');
        } else {
            this.element.removeCls('md-min');
        }*/
    initialize: function() {
        this.callParent();
        this.element.addCls('md-slider');
        if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
            this.mdTrachElement.setStyle({
                display: 'none'
            });
            this.thumbContainerElement.setStyle({
                display: 'none'
            });
        } else if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
            this.mdTrachElement.setStyle({
                display: 'none'
            });
            this.thumbContainerElementLeft.setStyle({
                display: 'none'
            });
        } else {
            this.mdTrachElement.setStyle({
                backgroundColor: 'rgb(102,187,106)',
                zIndex: '-10'
            });
            this.mdTrachElementLeft.setStyle({
                backgroundColor: 'rgb(102,187,106)',
                zIndex: '-10'
            });
            this.trackFillElement.setStyle({
                backgroundColor: '#b1ac9c'
            });
            this.trackFillElementLeft.setStyle({
                backgroundColor: '#b1ac9c'
            });
        }
        this.element.on({
            scope: this,
            'touchstart': function(ev) {
                if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
                    this.draggable = draggable;
                } else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
                    this.draggable = draggableLeft;
                } else //alert("touchstart");
                {
                    //type range
                    if (ev.target.className === 'md-thumbL') {
                        //alert(ev.target);
                        this.draggable = draggableLeft;
                    } else if (ev.target.className === 'md-thumb') {
                        this.draggable = draggable;
                    }
                }
                if (this.getDisabled())  {
                    return false;
                }
                
                this.isSliding = true;
                this.element.addCls('active');
                this.refreshSliderDimensions();
                //alert(ev.target.id);
                if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
                    this.onPan(this.element, ev);
                } else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
                    this.onPanLeft(this.element, ev);
                } else {
                    if (ev.target.className === 'md-thumbL')  {
                        this.onPanLeft(this.element, ev);
                    }
                    else if (ev.target.className === 'md-thumb')  {
                        this.onPan(this.element, ev);
                    }
                    
                }
                // this.onPan(this.element, ev);
                ///////////-----------trunghq----------------//////////////
                ev.stopPropagation();
            },
            'touchend': function(ev) {
                if (this.isSliding && this.element.is('.md-discrete')) {
                    if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight') {
                        this.onPanEnd(ev);
                    } else if (this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
                        this.onPanEndLeft(ev);
                    } else {
                        if (ev.target.className === 'md-thumbL') {
                            this.onPanEndLeft(ev);
                        }
                        //------trunghq----------
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
        if (this.getType() == 'tickSingleRight' || this.getType() == 'notickSingleRight' || this.getType() == 'tickSingleLeft' || this.getType() == 'notickSingleLeft') {
            if (this.getCodeColor() == 'red') {
                this.element.addCls('md-red');
                this.thumbElementLeft.setStyle({
                    'background-color': 'red'
                });
                this.trackFillElementLeft.setStyle({
                    'background-color': 'red'
                });
            } else if (this.getCodeColor() == 'green') {
                this.element.addCls('md-green');
                this.thumbElementLeft.setStyle({
                    'background-color': 'green'
                });
                this.trackFillElementLeft.setStyle({
                    'background-color': 'green'
                });
            } else if (this.getCodeColor() == 'blue') {
                this.element.addCls('md-blue');
                this.thumbElementLeft.setStyle({
                    'background-color': 'blue'
                });
                this.trackFillElementLeft.setStyle({
                    'background-color': 'blue'
                });
            } else {
                this.thumbElementLeft.setStyle({
                    'background-color': '  rgb(102,187,106)'
                });
                this.trackFillElementLeft.setStyle({
                    'background-color': '  rgb(102,187,106)'
                });
            }
        } else {
            this.thumbElementLeft.setStyle({
                'background-color': ' rgb(102,187,106)'
            });
            this.trackFillElementLeft.setStyle({
                'background-color': '#b1ac9c'
            });
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
    onResize: function() {
        //alert('resize');
        var self = this;
        setTimeout(function() {
            self.refreshSliderDimensions();
            self.updateAll();
        });
    },
    onPanStart: function() {
        if (this.getDisabled())  {
            return false;
        }
        
        if (!this.isSliding)  {
            return;
        }
        
        this.element.addCls('panning');
    },
    onPan: function(sender, ev) {
        if (!this.isSliding)  {
            return false;
        }
        
        this.doSlide(ev.pageX);
        // alert(ev.pageX);
        ev.stopPropagation && ev.stopPropagation();
        return false;
    },
    onPanEnd: function(ev) {
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
    onPanLeft: function(sender, ev) {
        if (!this.isSliding)  {
            return false;
        }
        
        this.doSlideLeft(ev.pageX);
        // alert(ev.pageX);
        ev.stopPropagation && ev.stopPropagation();
        return false;
    },
    onPanEndLeft: function(ev) {
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
    doSlide: function(x) {
        this.setModelValue(this.percentToValue(this.positionToPercent(x)));
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValue();
        var percent;
        percent = (value - min) / (max - min);
        /*if (this.getType() == 'tick') {
         percent = 1-(this.getValue() - min) / (max - min);
         console.log(percent);
         }

         else {
         percent =  (value - min) / (max - min);

         }*/
        var percent1 = (this.getValueLeft() - min) / (max - min);
        var step = this.getStep(),
            numSteps = Math.floor((max - min) / step);
        if (this.tickCanvasText)  {
            for (var i = 0; i <= numSteps; i++) {
                if (this.getType() == 'tick') {
                    if (i / numSteps === percent) {
                        console.log(i / numSteps + "=============" + percent);
                        this.tickCanvasText.childNodes[numSteps - i].style.opacity = '1';
                        this.tickCanvasText.childNodes[numSteps - i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[numSteps - i].childNodes[1].style.height = '30px';
                    } else {
                        this.tickCanvasText.childNodes[numSteps - i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[numSteps - i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[numSteps - i].style.opacity = '0';
                    }
                } else {
                    if (i / numSteps === percent) {
                        this.tickCanvasText.childNodes[i].style.opacity = '1';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';
                    } else {
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[i].style.opacity = '0';
                    }
                }
            };
        }
        
        if (this.getType() == 'tick') {
            for (var i = 0; i <= numSteps; i++) {
                if (i / numSteps === percent1) {
                    this.tickCanvasText.childNodes[i].style.opacity = '1';
                    this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                    this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';
                }
            }
        }
    },
    doSlideLeft: function(x) {
        this.setModelValueLeft(this.percentToValue(this.positionToPercentLeft(x)));
        // console.log(x);
        var min = this.getMin(),
            max = this.getMax(),
            value = this.getValueLeft(),
            percent = (value - min) / (max - min),
            percent1 = (this.getValue() - min) / (max - min),
            step = this.getStep(),
            numSteps = Math.floor((max - min) / step);
        if (this.tickCanvasText)  {
            for (var i = 0; i <= numSteps; i++) {
                if (this.getType() == 'tick') {
                    if (i / numSteps === percent || i / numSteps === 1 - percent1) {
                        this.tickCanvasText.childNodes[i].style.opacity = '1';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';
                    } else {
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[i].style.opacity = '0';
                    }
                } else {
                    if (i / numSteps === percent) {
                        this.tickCanvasText.childNodes[i].style.opacity = '1';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '30px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '30px';
                    } else {
                        this.tickCanvasText.childNodes[i].childNodes[1].style.width = '0px';
                        this.tickCanvasText.childNodes[i].childNodes[1].style.height = '0px';
                        this.tickCanvasText.childNodes[i].style.opacity = '0';
                    }
                }
            };
        }
        
    },
    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    adjustThumbPosition: function(x) {
        var exactVal = this.percentToValue(this.positionToPercent(x));
        var closestVal = this.minMaxValidator(this.stepValidator(exactVal));
        this.setSliderPercent(this.positionToPercent(x));
    },
    /**
     * Convert horizontal position on slider to percentage value of offset from beginning...
     * @param x
     * @returns {number}
     */
    positionToPercent: function(x) {
        /* if (this.getType() == 'slider-right') {*/
        return Math.max(0, Math.min(1, (this.sliderDimensions.right - x) / (this.sliderDimensions.width)));
    },
    /*}
         else if (this.getType() == 'slider-left') {
         return Math.max(0, Math.min(1, (x - this.sliderDimensions.left) / (this.sliderDimensions.width )));
         }*/
    //  return Math.max(0, Math.min(1, (this.sliderDimensions.right-x) / (this.sliderDimensions.width )));
    // alert(this.sliderDimensions.left);
    // console.log(x);
    // console.log(this.sliderDimensions.left);
    positionToPercentLeft: function(x) {
        /*  if (this.getType() == 'slider-right') {
         return Math.max(0, Math.min(1, (this.sliderDimensions.right - x) / (this.sliderDimensions.width )));
         }
         else if (this.getType() == 'slider-left') {*/
        return Math.max(0, Math.min(1, (x - this.sliderDimensions.left) / (this.sliderDimensions.width)));
    },
    // }
    //  return Math.max(0, Math.min(1, (this.sliderDimensions.right-x) / (this.sliderDimensions.width )));
    // alert(this.sliderDimensions.left);
    // console.log(x);
    // console.log(this.sliderDimensions.left);
    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    percentToValue: function(percent) {
        var min = this.getMin(),
            max = this.getMax();
        return (min + percent * (max - min));
    },
    valueToPercent: function(val) {
        var min = this.getMin(),
            max = this.getMax();
        return (val - min) / (max - min);
    }
});

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
                width: '350px',
                itemId: 'parent1',
                items: [
                    {
                        xtype: 'container',
                        itemId: 'parent2',
                        width: '100%',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'vbox',
                                itemId: 'parent3',
                                width: '70%',
                                padding: 10,
                                items: [
                                    {
                                        xtype: 'container',
                                        itemId: 'tpl',
                                        style: 'background:rgb(0,0,0); marginBottom:25px',
                                        width: '100%',
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
                                        width: '100%',
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
                                        width: '100%',
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
                                        width: '100%',
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
                                            {
                                                title: 'Red',
                                                value: '#F44336'
                                            },
                                            {
                                                title: 'Pink',
                                                value: '#E91E63'
                                            },
                                            {
                                                title: 'Purple',
                                                value: '#9C27B0'
                                            },
                                            {
                                                title: 'Deep Purple',
                                                value: '#673AB7'
                                            },
                                            {
                                                title: 'Indigo',
                                                value: '#3F51B5'
                                            },
                                            {
                                                title: 'Blue',
                                                value: '#2196F3'
                                            },
                                            {
                                                title: 'Light Blue',
                                                value: '#03A9F4'
                                            },
                                            {
                                                title: 'Cyan',
                                                value: '#00BCD4'
                                            },
                                            {
                                                title: 'Teal',
                                                value: '#009688'
                                            },
                                            {
                                                title: 'Green',
                                                value: '#4CAF50'
                                            },
                                            {
                                                title: 'Light Green',
                                                value: '#8BC34A'
                                            },
                                            {
                                                title: 'Lime',
                                                value: '#CDDC39'
                                            },
                                            {
                                                title: 'Yellow',
                                                value: '#FFEB3B'
                                            },
                                            {
                                                title: 'Amber',
                                                value: '#FFC107'
                                            },
                                            {
                                                title: 'Orange',
                                                value: '#FF9800'
                                            },
                                            {
                                                title: 'Deep Orange',
                                                value: '#FF5722'
                                            },
                                            {
                                                title: 'Brown',
                                                value: '#795548'
                                            },
                                            {
                                                title: 'Grey',
                                                value: '#9E9E9E'
                                            },
                                            {
                                                title: 'Blue Grey',
                                                value: '#607D8B'
                                            },
                                            {
                                                title: 'Black',
                                                value: '#000000'
                                            },
                                            {
                                                title: 'White',
                                                value: '#FFFFFF'
                                            }
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
                            }
                        ]
                    }
                ]
            }
        ]
    },
    /* listeners :
                                {
                                    element : 'element',
                                    tap : function(e, t)
                                    {
                                        var me = this;
                                        me.up('ColorPicker').setItemIndex(1);

                                    }
                                }*/
    initialize: function() {
        this.callParent();
        var me = this;
        this.getComponent('parent1').getComponent('parent2').getComponent('parent3').setStyle('opacity:0.9');
        this.getComponent('parent1').getComponent('parent22').getComponent('btnOk').on('tap', function() {
            me.hidePop();
        });
        var r = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var g = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG');
        var b = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB');
        var tpl = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl');
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        codeColor.on('change', function() {
            tpl.setStyle('background:' + codeColor.getValue());
            me.chanceValueSlider(codeColor.getValue());
        });
        r.element.on({
            scope: this,
            'touchstart': function(ev) {},
            'touchend': function(ev) {
                var vR = r.getValueLeft();
                var vG = g.getValueLeft();
                var vB = b.getValueLeft();
                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());
                if (vR < 150 && vG < 150 && vB < 150)  {
                    codeColor.setStyle('-webkit-text-fill-color:white');
                }
                else  {
                    codeColor.setStyle('-webkit-text-fill-color:black');
                }
                
            },
            'touchmove': function(ev) {
                var vR = r.getValueLeft();
                var vG = g.getValueLeft();
                var vB = b.getValueLeft();
                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());
                if (vR < 150 && vG < 150 && vB < 150)  {
                    codeColor.setStyle('-webkit-text-fill-color:white');
                }
                else  {
                    codeColor.setStyle('-webkit-text-fill-color:black');
                }
                
            }
        });
        g.element.on({
            scope: this,
            'touchstart': function(ev) {},
            'touchend': function(ev) {
                var vR = r.getValueLeft();
                var vG = g.getValueLeft();
                var vB = b.getValueLeft();
                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());
                if (vR < 150 && vG < 150 && vB < 150)  {
                    codeColor.setStyle('-webkit-text-fill-color:white');
                }
                else  {
                    codeColor.setStyle('-webkit-text-fill-color:black');
                }
                
            },
            'touchmove': function(ev) {
                var vR = r.getValueLeft();
                var vG = g.getValueLeft();
                var vB = b.getValueLeft();
                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());
                if (vR < 150 && vG < 150 && vB < 150)  {
                    codeColor.setStyle('-webkit-text-fill-color:white');
                }
                else  {
                    codeColor.setStyle('-webkit-text-fill-color:black');
                }
                
            }
        });
        b.element.on({
            scope: this,
            'touchstart': function(ev) {},
            'touchend': function(ev) {
                var vR = r.getValueLeft();
                var vG = g.getValueLeft();
                var vB = b.getValueLeft();
                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());
                if (vR < 150 && vG < 150 && vB < 150)  {
                    codeColor.setStyle('-webkit-text-fill-color:white');
                }
                else  {
                    codeColor.setStyle('-webkit-text-fill-color:black');
                }
                
            },
            'touchmove': function(ev) {
                var vR = r.getValueLeft();
                var vG = g.getValueLeft();
                var vB = b.getValueLeft();
                codeColor.setValue(this.rgbToHex(vR, vG, vB).toUpperCase());
                if (vR < 150 && vG < 150 && vB < 150)  {
                    codeColor.setStyle('-webkit-text-fill-color:white');
                }
                else  {
                    codeColor.setStyle('-webkit-text-fill-color:black');
                }
                
            }
        });
        this.getComponent('parent1').getComponent('parent2').getComponent('parent33').getComponent('listItemId').addListener({
            itemtap: function(list, index, item, record) {
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
    componentToHex: function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    hidePop: function() {
        this.setStyle({
            display: 'none'
        });
        this.hide();
    },
    showPop: function() {
        this.setStyle({
            display: 'block'
        });
        this.show();
    },
    codeColor: function() {
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        return codeColor.getValue().toUpperCase();
    },
    setColorItemList: function(codeColor) {
        var me = this;
        var tpl = me.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl');
        tpl.setStyle('background:' + codeColor);
    },
    setCodeColor: function(code) {
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        codeColor.setValue(code.toUpperCase());
    },
    chanTextColor: function() {
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        var r = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var vR = r.getValueLeft();
        var g = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG');
        var vG = g.getValueLeft();
        var b = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB');
        var vB = b.getValueLeft();
        if (vR < 150 && vG < 150 && vB < 150)  {
            codeColor.setStyle('-webkit-text-fill-color:white');
        }
        else  {
            codeColor.setStyle('-webkit-text-fill-color:black');
        }
        
    },
    hexToRGB: function(hex) {
        var r, g, b;
        r = hex.charAt(0) + "" + hex.charAt(1);
        g = hex.charAt(2) + "" + hex.charAt(3);
        b = hex.charAt(4) + "" + hex.charAt(5);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    chanceValueSlider: function(hex) {
        if (hex.charAt(0) == '#') {
            hex = hex.substr(1);
        }
        var r = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        r.fireEvent('touchstart', this);
        r.setValueLeft(parseInt(hex.charAt(0) + "" + hex.charAt(1), 16));
        var g = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG');
        g.setValueLeft(parseInt(hex.charAt(2) + "" + hex.charAt(3), 16));
        var b = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB');
        b.setValueLeft(parseInt(hex.charAt(4) + "" + hex.charAt(5), 16));
    },
    setValueColorPicker: function(codehexa) {
        this.chanceValueSlider(codehexa);
        var codeColor = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl').getComponent('code-color');
        codeColor.setValue(codehexa.toUpperCase());
        var tpl = this.getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('tpl');
        tpl.setStyle('background:' + codehexa);
    }
});

Ext.define('Material.components.ColorPickerMain', {
    extend: 'Ext.Container',
    //extend: 'Ext.field.DatePicker',
    xtype: 'md-ColorPickerMain',
    requires: [
        'Material.components.ColorPicker'
    ],
    config: {
        fortype: 'down',
        labelColor: 'black',
        texLabel: 'a',
        items: {
            xtype: 'container',
            width: '370px',
            style: 'background:transparent',
            itemId: 'root',
            items: [
                {
                    xtype: 'label',
                    text: 'color',
                    color: 'black',
                    html: 'value',
                    width: 100,
                    left: 0,
                    itemId: 'lb',
                    style: 'background:trasparent;position:absolute; line-height:35px; height:35px'
                },
                //  cls: 'md-flab'
                {
                    xtype: 'label',
                    text: 'color',
                    color: 'black',
                    width: 100,
                    top: 40,
                    left: 0,
                    style: 'background-color:transparent;position:absolute;vertical-align: middle; textAlign:center; line-height:35px; height:35px',
                    itemId: 'btnColor'
                },
                // cls: 'md-flab'
                {
                    xtype: 'md-ColorPicker',
                    itemId: 'colorPicker',
                    top: 80,
                    right: 0,
                    width: '100%'
                }
            ]
        }
    },
    initialize: function() {
        this.callParent();
        var me = this;
        var root = me.getComponent('root');
        var w1 = 35;
        //window.innerWidth;
        var h1 = 35;
        //window.innerHeight;
        var w = 500;
        //window.innerWidth;
        var h = 500;
        //window.innerHeight;
        /*   root.setHeight(h1);
        root.setWidth(w1);*/
        var colorPicker = me.getComponent('root').getComponent('colorPicker');
        var btnColor = me.getComponent('root').getComponent('btnColor');
        var lb = me.getComponent('root').getComponent('lb');
        lb.setHtml(this.getTexLabel());
        lb.setStyle('color:' + this.getLabelColor());
        this.setCodeColor('#000000');
        me.chanTextColor();
        colorPicker.hidePop();
        btnColor.element.on('tap', function() {
            colorPicker.showPop();
        });
        /*root.setHeight(h);
            root.setWidth(w);*/
        if (this.getFortype() == 'up') {
            colorPicker.setStyle({
                top: '-480px'
            });
        }
        var oldValue = '#000000';
        colorPicker.getComponent('parent1').getComponent('parent22').getComponent('btnOk').on('tap', function() {
            btnColor.element.show();
            oldValue = btnColor.getHtml();
            btnColor.setHtml(me.getComponent('root').getComponent('colorPicker').codeColor());
            btnColor.setStyle('background:' + me.getComponent('root').getComponent('colorPicker').codeColor());
            me.getComponent('root').getComponent('colorPicker').hidePop();
            me.chanTextColor();
            var argsColor = {
                    oldValue: oldValue,
                    newValue: me.getComponent('root').getComponent('colorPicker').codeColor()
                };
            me.fireEvent('onColorChanged', argsColor);
        });
        /* root.setHeight(h1);
            root.setWidth(w1);*/
        colorPicker.getComponent('parent1').getComponent('parent22').getComponent('btnCancel').on('tap', function() {
            btnColor.element.show();
            me.getComponent('root').getComponent('colorPicker').hidePop();
        });
    },
    /* root.setHeight(h1);
            root.setWidth(w1);*/
    setCodeColor: function(code) {
        var me = this;
        var colorPicker = me.getComponent('root').getComponent('colorPicker');
        colorPicker.setValueColorPicker(code);
        var btnColor = me.getComponent('root').getComponent('btnColor');
        btnColor.setHtml(me.getComponent('root').getComponent('colorPicker').codeColor());
        btnColor.setStyle('background:' + me.getComponent('root').getComponent('colorPicker').codeColor());
        var r = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var vR = r.getValueLeft();
        var g = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG');
        var vG = g.getValueLeft();
        var b = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB');
        var vB = b.getValueLeft();
        if (vR < 150 && vG < 150 && vB < 150)  {
            btnColor.setStyle('color:white');
        }
        else  {
            btnColor.setStyle('color:black');
        }
        
    },
    getCodeColor: function() {
        var btnColor = this.getComponent('root').getComponent('btnColor');
        console.log('getCodeColor: ' + btnColor.getHtml());
        return btnColor.getHtml();
    },
    chanTextColor: function() {
        var btnColor = this.getComponent('root').getComponent('btnColor');
        var r = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdR');
        var vR = r.getValueLeft();
        var g = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdG');
        var vG = g.getValueLeft();
        var b = this.getComponent('root').getComponent('colorPicker').getComponent('parent1').getComponent('parent2').getComponent('parent3').getComponent('itemIdB');
        var vB = b.getValueLeft();
        if (vR < 150 && vG < 150 && vB < 150)  {
            btnColor.setStyle('color:white');
        }
        else  {
            btnColor.setStyle('color:black');
        }
        
    }
});

/**
 * @author FSB
 *
 * Represents a date picker slot in which we will not listen for scroll end event and the title of the slot is
 * always hidden.
 *
 * Additionally, each item on the slot may be a complex one, so the original implementation
 * from the base class is amended to exactly identify the wrapped DOM element.
 *
 * The last thing is that each value associated with an slot item could be a Date, so we have change the equality
 * comparison in that case when searching an item from the underlying store.
 *
 */
Ext.define('Material.components.picker.DatePickerSlot', {
    extend: 'Ext.picker.Slot',
    xtype: 'md-date-picker-slot',
    config: {
        barHeight: 48
    },
    setupBar: function() {
        if (!this.isRendered()) {
            //if the component isnt rendered yet, there is no point in calculating the padding just eyt
            return;
        }
        var element = this.element,
            innerElement = this.innerElement,
            value = this.getValue(),
            showTitle = this.getShowTitle(),
            title = this.getTitle(),
            scrollable = this.getScrollable(),
            scroller = scrollable.getScroller(),
            titleHeight = 0,
            barHeight, padding;
        if (showTitle && title) {
            titleHeight = title.element.getHeight();
        }
        padding = Math.ceil((element.getHeight() - titleHeight - this.getBarHeight()) / 2);
        if (this.getVerticallyCenterItems()) {
            innerElement.setStyle({
                padding: padding + 'px 0 ' + padding + 'px'
            });
        }
        scroller.refresh();
        scroller.setSlotSnapSize(barHeight);
        this.setValue(value);
    },
    onScrollEnd: function(scroller, x, y) {},
    //var me = this,
    //    index = Math.round(y / this.getBarHeight()),
    //    viewItems = me.getViewItems(),
    //    item = viewItems[index];
    //
    //if (item) {
    //    me.selectedIndex = index;
    //    me.selectedNode = item;
    //
    //    me.fireEvent('slotpick', me, me.getValue(), me.selectedNode);
    //}
    doItemTap: function(list, index, item, e) {
        var me = this;
        me.selectedIndex = index;
        me.selectedNode = item;
        me.scrollToItem(item.getY ? item : item.element, true);
        this.fireEvent('slotpick', this, this.getValue(true), this.selectedNode);
    },
    doSetValue: function(value, animated) {
        if (!this.isRendered()) {
            //we don't want to call this until the slot has been rendered
            this._value = value;
            return;
        }
        var store = this.getStore(),
            viewItems = this.getViewItems(),
            valueField = this.getValueField(),
            helper = Material.DatePickerService,
            self = this,
            index, item;
        index = store.findBy(function(record) {
            var fieldValue = record.get(valueField);
            return value instanceof Date ? helper.isEqualMonth(fieldValue, value) : fieldValue === value;
        });
        if (index == -1) {
            index = 0;
        }
        item = Ext.get(viewItems[index]);
        self.selectedIndex = index;
        self.selectedNode = item;
        if (item) {
            if (this._item_scrolling) {
                clearTimeout(this._item_scrolling);
            }
            this._item_scrolling = setTimeout(function() {
                self.scrollToItem(item.getY ? item : item.element, (animated) ? {
                    duration: 100
                } : false);
                self.select(self.selectedIndex);
            }, 250);
        }
        this._value = value;
    }
});

/**
 * @author FSB
 * @public
 *
 * This is a special class to create each calendar item on {@link Material.components.DatePicker}.
 *
 * Each calendar item will have a month title, a week bar header followed by a list of week days called week grid.
 *
 * The week grid is built based on the given value, a valid date. Each cell, a button, on the grid will be a date of
 * the given month. A cell will be marked with CSS class "today" if it holds date value of today. It will be marked
 * with CSS class "selected" if it holds date value of selected date.
 */
Ext.define('Material.components.picker.CalendarItem', {
    extend: 'Ext.Component',
    xtype: 'calendar-item',
    width: '280px',
    height: '250px',
    isComposite: true,
    requires: [
        'Material.helpers.RippleService'
    ],
    template: [
        {
            tag: 'div',
            html: 'February 1989',
            reference: 'headerElement',
            className: 'header'
        },
        {
            tag: 'div',
            className: 'week-bar',
            children: [
                {
                    tag: 'span',
                    text: 'S'
                },
                {
                    tag: 'span',
                    text: 'M'
                },
                {
                    tag: 'span',
                    text: 'T'
                },
                {
                    tag: 'span',
                    text: 'W'
                },
                {
                    tag: 'span',
                    text: 'T'
                },
                {
                    tag: 'span',
                    text: 'F'
                },
                {
                    tag: 'span',
                    text: 'S'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '1'
                },
                {
                    tag: 'button',
                    text: '2'
                },
                {
                    tag: 'button',
                    text: '3'
                },
                {
                    tag: 'button',
                    text: '4'
                },
                {
                    tag: 'button',
                    text: '5'
                },
                {
                    tag: 'button',
                    text: '6'
                },
                {
                    tag: 'button',
                    text: '7'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '8'
                },
                {
                    tag: 'button',
                    text: '9'
                },
                {
                    tag: 'button',
                    text: '10'
                },
                {
                    tag: 'button',
                    text: '11'
                },
                {
                    tag: 'button',
                    text: '12'
                },
                {
                    tag: 'button',
                    text: '13'
                },
                {
                    tag: 'button',
                    text: '14'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '15'
                },
                {
                    tag: 'button',
                    text: '16'
                },
                {
                    tag: 'button',
                    text: '17'
                },
                {
                    tag: 'button',
                    text: '18'
                },
                {
                    tag: 'button',
                    text: '19'
                },
                {
                    tag: 'button',
                    text: '20'
                },
                {
                    tag: 'button',
                    text: '21'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '22'
                },
                {
                    tag: 'button',
                    text: '23'
                },
                {
                    tag: 'button',
                    text: '24'
                },
                {
                    tag: 'button',
                    text: '25'
                },
                {
                    tag: 'button',
                    text: '26'
                },
                {
                    tag: 'button',
                    text: '27'
                },
                {
                    tag: 'button',
                    text: '28'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '29'
                },
                {
                    tag: 'button',
                    text: '30'
                },
                {
                    tag: 'button',
                    text: '31'
                },
                {
                    tag: 'button',
                    text: '32'
                },
                {
                    tag: 'button',
                    text: '33'
                },
                {
                    tag: 'button',
                    text: '34'
                },
                {
                    tag: 'button',
                    text: '35'
                }
            ]
        },
        {
            tag: 'div',
            className: 'week',
            children: [
                {
                    tag: 'button',
                    text: '36'
                },
                {
                    tag: 'button',
                    text: '37'
                },
                {
                    tag: 'button',
                    text: '38'
                },
                {
                    tag: 'button',
                    text: '39'
                },
                {
                    tag: 'button',
                    text: '40'
                },
                {
                    tag: 'button',
                    text: '41'
                },
                {
                    tag: 'button',
                    text: '42'
                }
            ]
        }
    ],
    config: {
        baseCls: 'md-calendar-item',
        dataview: null,
        record: null,
        width: '100%'
    },
    initialize: function() {
        this.callParent(arguments);
    },
    /* var rippleService = Material.RippleService;
        rippleService.attachButtonBehavior(this, this.element);*/
    updateRecord: function(newRecord) {
        if (!newRecord) {
            return;
        }
        this._record = newRecord;
        var me = this,
            dataview = me.dataview || this.getDataview(),
            data = dataview.prepareData(newRecord.getData(true), dataview.getStore().indexOf(newRecord), newRecord);
        me.generateWeekGrid(data);
        /**
        * @event updatedata
        * Fires whenever the data of the DataItem is updated.
        * @param {Ext.dataview.component.DataItem} this The DataItem instance.
        * @param {Object} newData The new data.
        */
        me.fireEvent('updatedata', me, data);
    },
    generateWeekGrid: function(data) {
        var helper = Material.DatePickerService,
            currentMonth = data.value,
            weekArray = helper.getWeekArray(currentMonth),
            dayButtons = this.element.query('.week button'),
            headerElement = this.headerElement,
            today = new Date(),
            selectedDate = data.selectedDate || today,
            picker = (this.dataview || this.getDataview()).up('md-date-picker');
        this.element.removeCls('md-4-weeks md-5-weeks md-6-weeks');
        this.element.addCls('md-' + weekArray.length + '-weeks');
        headerElement.setHtml(helper.getFullMonth(currentMonth) + ' ' + currentMonth.getFullYear());
        Ext.each(weekArray, function(weekDays, i) {
            Ext.each(weekDays, function(day, j) {
                var dayButton = Ext.Element.get(dayButtons[j + i * 7]);
                dayButton.removeCls('selected today');
                dayButton.setHtml('&nbsp;');
                dayButton.set({
                    'data-date': null
                }, true);
                if (day instanceof Date) {
                    dayButton.setHtml(day.getDate());
                    dayButton.set({
                        'data-date': day
                    }, true);
                    if (helper.isEqualDate(selectedDate, day)) {
                        dayButton.addCls('selected');
                        picker.lastSelectedDate = dayButton;
                    }
                    if (helper.isEqualDate(today, day)) {
                        dayButton.addCls('today');
                    }
                }
            }, this);
        }, this);
    }
});

Ext.define('Material.helpers.DatePickerService', {
    //singleton: true,
    addDays: function(d, days) {
        var newDate = this.clone(d);
        newDate.setDate(d.getDate() + days);
        return newDate;
    },
    addMonths: function(d, months) {
        var newDate = this.clone(d);
        newDate.setMonth(d.getMonth() + months);
        return newDate;
    },
    clone: function(d) {
        return new Date(d.getTime());
    },
    getDaysInMonth: function(d) {
        var resultDate = this.getFirstDayOfMonth(d);
        resultDate.setMonth(resultDate.getMonth() + 1);
        resultDate.setDate(resultDate.getDate() - 1);
        return resultDate.getDate();
    },
    getFirstDayOfMonth: function(d) {
        return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
    },
    getFullMonth: function(d) {
        var month = d.getMonth();
        switch (month) {
            case 0:
                return 'January';
            case 1:
                return 'February';
            case 2:
                return 'March';
            case 3:
                return 'April';
            case 4:
                return 'May';
            case 5:
                return 'June';
            case 6:
                return 'July';
            case 7:
                return 'August';
            case 8:
                return 'September';
            case 9:
                return 'October';
            case 10:
                return 'November';
            case 11:
                return 'December';
        }
    },
    getShortMonth: function(d) {
        var month = d.getMonth();
        switch (month) {
            case 0:
                return 'Jan';
            case 1:
                return 'Feb';
            case 2:
                return 'Mar';
            case 3:
                return 'Apr';
            case 4:
                return 'May';
            case 5:
                return 'Jun';
            case 6:
                return 'Jul';
            case 7:
                return 'Aug';
            case 8:
                return 'Sep';
            case 9:
                return 'Oct';
            case 10:
                return 'Nov';
            case 11:
                return 'Dec';
        }
    },
    getDayOfWeek: function(d) {
        var dow = d.getDay();
        switch (dow) {
            case 0:
                return 'Sunday';
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
        }
    },
    getWeekArray: function(d) {
        var dayArray = [];
        var daysInMonth = this.getDaysInMonth(d);
        var daysInWeek;
        var emptyDays;
        var firstDayOfWeek;
        var week;
        var weekArray = [];
        for (var i = 1; i <= daysInMonth; i++) {
            dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
        }
        
        while (dayArray.length) {
            firstDayOfWeek = dayArray[0].getDay();
            daysInWeek = 7 - firstDayOfWeek;
            emptyDays = 7 - daysInWeek;
            week = dayArray.splice(0, daysInWeek);
            for (var i = 0; i < emptyDays; i++) {
                week.unshift(null);
            }
            
            for (var i = week.length; i < 7; i++) {
                week.push(null);
            }
            weekArray.push(week);
        }
        return weekArray;
    },
    format: function(date) {
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var y = date.getFullYear();
        return m + '/' + d + '/' + y;
    },
    isEqualDate: function(d1, d2) {
        return d1 && d2 && (d1.getFullYear() === d2.getFullYear()) && (d1.getMonth() === d2.getMonth()) && (d1.getDate() === d2.getDate());
    },
    isEqualMonth: function(d1, d2) {
        return d1 && d2 && (d1.getFullYear() === d2.getFullYear()) && (d1.getMonth() === d2.getMonth());
    },
    monthDiff: function(d1, d2) {
        var m;
        m = (d1.getFullYear() - d2.getFullYear()) * 12;
        m += d1.getMonth();
        m -= d2.getMonth();
        return m;
    }
}, function(DatePickerService) {
    Material.DatePickerService = new DatePickerService();
});

Ext.define('Material.components.picker.DateDetailsPanel', {
    extend: 'Ext.Component',
    xtype: 'md-date-details',
    requires: [
        'Material.helpers.DatePickerService',
        'Material.helpers.RippleService'
    ],
    template: [
        {
            tag: 'label',
            className: 'day-of-week',
            reference: 'lblDayOfWeek',
            html: 'Thursday'
        },
        {
            tag: 'div',
            className: 'day-of-month',
            children: [
                {
                    tag: 'button',
                    className: 'month',
                    reference: 'btnMonth',
                    html: 'FEB'
                },
                {
                    tag: 'button',
                    className: 'day',
                    reference: 'btnDay',
                    html: '09'
                },
                {
                    tag: 'button',
                    className: 'year',
                    reference: 'btnYear',
                    html: '1989'
                }
            ]
        }
    ],
    config: {
        baseCls: 'md-date-details',
        selectedDate: null
    },
    initialize: function() {
        this.callParent(arguments);
        /*var rippleService = Material.RippleService;
        rippleService.attachButtonBehavior(this, this.element);*/
        this.setSelectedDate(new Date());
        var showMonthAction = {
                scope: this,
                tap: function() {
                    this.toggleHighlight(true);
                    this.fireEvent('show-month', this);
                }
            };
        this.btnDay.on(showMonthAction);
        this.btnMonth.on(showMonthAction);
        this.btnYear.on({
            scope: this,
            tap: function() {
                this.toggleHighlight(false);
                this.fireEvent('show-year', this);
            }
        });
    },
    applySelectedDate: function(newValue) {
        if (newValue instanceof Date) {
            return newValue;
        }
        return new Date();
    },
    updateSelectedDate: function(newValue, oldValue) {
        var helper = Material.DatePickerService;
        this.updateDisplay(newValue);
    },
    updateDisplay: function(newValue) {
        if (!this.lblDayOfWeek) {
            return;
        }
        var helper = Material.DatePickerService;
        this.lblDayOfWeek.setHtml(helper.getDayOfWeek(newValue));
        this.btnDay.setText(newValue.getDate());
        this.btnMonth.setText(helper.getShortMonth(newValue));
        this.btnYear.setText(newValue.getFullYear());
        this.toggleHighlight(true);
    },
    toggleHighlight: function(switcher) {
        var highLightCls = 'highlight';
        if (switcher) {
            this.btnDay.addCls(highLightCls);
            this.btnMonth.addCls(highLightCls);
            this.btnYear.removeCls(highLightCls);
        } else {
            this.btnDay.removeCls(highLightCls);
            this.btnMonth.removeCls(highLightCls);
            this.btnYear.addCls(highLightCls);
        }
    }
});

/*
 *
 * Represents the date picker as defined by Google Material Design.
 */
Ext.define('Material.components.DatePicker', {
    extend: 'Ext.Sheet',
    xtype: 'md-date-picker',
    requires: [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.Label',
        'Material.components.picker.DatePickerSlot',
        'Material.components.picker.CalendarItem',
        'Material.components.picker.DateDetailsPanel',
        'Material.helpers.DatePickerService'
    ],
    config: {
        //modal: true,
        baseCls: 'md-date-picker',
        cls: 'x-msgbox x-msgbox-dark',
        ui: 'dark',
        layout: {
            type: 'vbox',
            pack: 'justify',
            align: 'stretched'
        },
        /**
         * @cfg
         * @inheritdoc
         */
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },
        /**
         * @cfg
         * @inheritdoc
         */
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },
        items: [
            {
                xtype: 'panel',
                itemId: 'main-container',
                cls: 'main-container',
                layout: {
                    type: 'vbox',
                    pack: 'justify',
                    align: 'stretched'
                },
                items: [
                    {
                        xtype: 'md-date-details',
                        itemId: 'md-date-details'
                    },
                    {
                        xtype: 'panel',
                        cls: 'main-panel',
                        itemId: 'main-panel',
                        layout: {
                            type: 'card',
                            animation: 'fade'
                        },
                        items: [
                            {
                                xtype: 'md-date-picker-slot',
                                cls: 'x-picker-slot month-picker',
                                itemId: 'month-picker',
                                barHeight: 270,
                                useComponents: true,
                                defaultType: 'calendar-item',
                                data: [
                                    {
                                        value: new Date(),
                                        selectedDate: new Date()
                                    }
                                ]
                            },
                            {
                                xtype: 'md-date-picker-slot',
                                cls: 'x-picker-slot year-picker',
                                itemId: 'year-picker',
                                barHeight: 72,
                                data: [
                                    {
                                        value: 2015,
                                        text: 2015
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'dark',
                itemId: 'button-bar',
                cls: 'x-msgbox-buttons',
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
                        text: 'Cancel'
                    },
                    {
                        text: 'OK',
                        ui: 'action'
                    }
                ]
            }
        ],
        orientationMode: 'portrait',
        selectedDate: new Date(),
        yearFrom: new Date().getFullYear() - 50,
        yearTo: new Date().getFullYear() + 50
    },
    initialize: function() {
        this.callParent();
        this.setupEventHandler();
        this.updateYearPicker();
        this.prepareMonthPicker();
        this.showCalendar();
    },
    setupEventHandler: function() {
        this.element.on({
            scope: this,
            delegate: '.md-calendar-item button',
            tap: 'selectDate'
        });
        this.on({
            scope: this,
            delegate: 'toolbar#button-bar button',
            tap: 'onClick'
        });
        this.on({
            'show-month': 'showCalendar',
            delegate: 'md-date-details',
            scope: this
        });
        this.on({
            'show-year': 'showYearList',
            delegate: 'md-date-details',
            scope: this
        });
        this.on({
            tap: 'showYearList',
            delegate: 'panel#selected-date button#year',
            scope: this
        });
        this.on({
            slotpick: 'pickYear',
            delegate: 'md-date-picker-slot#year-picker',
            scope: this
        });
    },
    getMainPanel: function() {
        return this._mainPanel || (this._mainPanel = this.getComponent('main-container').getComponent('main-panel'));
    },
    getYearPicker: function() {
        return this._yearPicker || (this._yearPicker = this.getMainPanel().getComponent('year-picker'));
    },
    getMonthPicker: function() {
        return this._monthPicker || (this._monthPicker = this.getMainPanel().getComponent('month-picker'));
    },
    updateYearPicker: function() {
        var yearFrom = this.getYearFrom(),
            yearTo = this.getYearTo(),
            years = [];
        while (true) {
            years.push({
                text: yearFrom,
                value: yearFrom
            });
            if (yearTo == yearFrom) {
                break;
            }
            yearFrom++;
        }
        this.getYearPicker().getStore().setData(years);
    },
    pickYear: function(sender, selectedYear) {
        var helper = Material.DatePickerService,
            temp = helper.clone(this.getSelectedDate());
        temp.setYear(selectedYear);
        this.setSelectedDate(temp);
        this.showCalendar();
    },
    showCalendar: function() {
        var helper = Material.DatePickerService,
            mainPanel = this.getMainPanel();
        if (mainPanel.calendarShown !== true) {
            mainPanel.setActiveItem(0);
            mainPanel.calendarShown = true;
        }
        this.getMonthPicker().setValue(this.getSelectedDate());
    },
    showYearList: function() {
        var mainPanel = this.getMainPanel();
        var yearList = this.getYearPicker();
        if (mainPanel.calendarShown !== false) {
            mainPanel.setActiveItem(1);
            mainPanel.calendarShown = false;
        }
        yearList.setValue(this.getSelectedDate().getFullYear());
    },
    onClick: function(sender, e) {
        if (sender.getUi() == 'action') {
            this._onDone(this.getSelectedDate());
        }
        this._onHide();
        this.hide();
    },
    selectDate: function(sender, e) {
        var previous = this.lastSelectedDate,
            xsender = sender.target || sender.delegatedTarget;
        if (previous != xsender) {
            var temp = Ext.Element.get(xsender);
            var selectedDate = Date.parse(temp.getAttribute('data-date'));
            if (isNaN(selectedDate)) {
                return;
            }
            this.setSelectedDate(new Date(selectedDate));
            if (previous) {
                Ext.Element.get(previous).removeCls('selected');
            }
            this.lastSelectedDate = xsender;
            temp.addCls('selected');
        }
    },
    applySelectedDate: function(newValue) {
        if (newValue && !(newValue instanceof Date)) {
            newValue = Date.parse(newValue);
        }
        return newValue instanceof Date ? newValue : new Date();
    },
    updateSelectedDate: function(newValue, oldValue) {
        if (newValue instanceof Date) {
            var helper = Material.DatePickerService,
                dateDetailsPanel = this.getComponent('main-container').getComponent('md-date-details');
            dateDetailsPanel.setSelectedDate(newValue);
            this.prepareMonthPicker();
        }
    },
    prepareMonthPicker: function() {
        var helper = Material.DatePickerService,
            selectedDate = this.getSelectedDate(),
            selectedYear = selectedDate.getFullYear();
        if (this._currentYear == selectedYear) {
            Ext.each(this.query('panel#week-grid button'), function(item) {
                if (helper.isEqualDate(item.date, selectedDate)) {
                    item.element.addCls('selected');
                    this.lastSelectedDate = item;
                } else {
                    item.element.removeCls('selected');
                }
            });
            this.getMonthPicker().setValue(selectedDate);
            return;
        }
        this._currentYear = selectedYear;
        var months = [];
        for (var i = 0; i < 12; i++) {
            months.push({
                value: new Date(selectedYear, i, 1, 0, 0, 0),
                selectedDate: selectedDate
            });
        }
        this.getMonthPicker().getStore().setData(months);
        this.getMonthPicker().setValue(selectedDate);
    },
    onOrientationChange: function() {
        var mainContainer = this.getComponent('main-container'),
            newValue = Ext.Viewport.getOrientation();
        this.element.removeCls('landscape portrait');
        if (newValue == 'landscape') {
            mainContainer.getLayout().setOrient('horizontal');
            this.element.addCls('landscape');
        } else {
            mainContainer.getLayout().setOrient('vertical');
            this.element.addCls('portrait');
        }
    },
    show: function(callbacks) {
        if (!callbacks) {
            return;
        }
        //if it has not been added to a container, add it to the Viewport.
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);
            Ext.Viewport.on({
                orientationchange: this.onOrientationChange,
                scope: this
            });
            this.onOrientationChange();
        }
        this._onDone = callbacks.done || Ext.emptyFn;
        this._onHide = callbacks.hide || Ext.emptyFn;
        this.showCalendar();
        this.callParent();
        return this;
    }
}, function(DatePicker) {
    Ext.onSetup(function() {
        Material.DatePicker = new DatePicker();
    });
});

Ext.define('Material.components.Entry', {
    extend: 'Ext.Component',
    xtype: 'md-entry',
    config: {
        value: null,
        label: null
    }
});

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
    getTemplate: function() {
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
    applyEndless: function(endless) {
        var outerElementDom = this.outerElement.dom;
        if (endless === true) {
            outerElementDom.setAttribute('md-mode', 'indeterminate');
        } else {
            outerElementDom.setAttribute('md-mode', 'determinate');
        }
        return endless;
    },
    applyValue: function(value) {},
    /*var outerElementDom = this.outerElement.dom;

         if (value > 100) {
         value = 100;
         } else if (value < 0) {
         value = 0;
         }

         outerElementDom.setAttribute('value', value);

         return value;*/
    initialize: function() {
        this.callParent();
        var outerElementDom = this.outerElement.dom;
        var r = this.r.dom;
        var l = this.l.dom;
        var r_ = -135;
        var l_ = 135;
        var click = true;
        if (this.getType() === 'percent') {
            localStorage.setItem("dem", 0);
            var P = this.P100;
            l.style.webkitTransform = "rotate(" + l_ + "deg)";
            l.style.WebkitTransition = "-webkit-transform 0.1s  ease-out";
            r.style.webkitTransform = "rotate(" + r_ + "deg)";
            r.style.WebkitTransition = "-webkit-transform 0.1s  ease-out";
            // firefox
            l.style.MozTransform = "rotate(" + l_ + "deg)";
            l.style.MozTransition = "-webkit-transform 0.1s  ease-out";
            r.style.MozTransform = "rotate(" + r_ + "deg)";
            r.style.MozTransition = "-webkit-transform 0.1s  ease-out";
            // opera
            l.style.OTransform = "rotate(" + l_ + "deg)";
            l.style.OTransition = "-webkit-transform 0.1s  ease-out";
            r.style.OTransform = "rotate(" + r_ + "deg)";
            r.style.OTransition = "-webkit-transform 0.1s  ease-out";
            this.on("tap", function() {
                if (click) {
                    click = false;
                    localStorage.setItem("dem", 0);
                    r_ = -135;
                    l_ = 135;
                    var interval = window.setInterval(function() {
                            if (parseInt(localStorage.getItem("dem")) >= 100) {
                                clearInterval(interval);
                                click = true;
                            }
                            /*localStorage.setItem("dem",0);
                                      r_=-135;
                                      l_= 135;*/
                            if (parseInt(localStorage.getItem("dem")) <= 50) {
                                // safari and chrome
                                l.style.webkitTransform = "rotate(" + l_ + "deg)";
                                l.style.WebkitTransition = "-webkit-transform 0.1s  ease-out";
                                r.style.webkitTransform = "rotate(" + r_ + "deg)";
                                r.style.WebkitTransition = "-webkit-transform 0.1s  ease-out";
                                // firefox
                                l.style.MozTransform = "rotate(" + l_ + "deg)";
                                l.style.MozTransition = "-webkit-transform 0.1s  ease-out";
                                r.style.MozTransform = "rotate(" + r_ + "deg)";
                                r.style.MozTransition = "-webkit-transform 0.1s  ease-out";
                                // opera
                                l.style.OTransform = "rotate(" + l_ + "deg)";
                                l.style.OTransition = "-webkit-transform 0.1s  ease-out";
                                r.style.OTransform = "rotate(" + r_ + "deg)";
                                r.style.OTransition = "-webkit-transform 0.1s  ease-out";
                                r_ = r_ + 3.6;
                            } else {
                                r_ = 45;
                                l_ = l_ + 3.6;
                                // safari and chrome
                                l.style.webkitTransform = "rotate(" + l_ + "deg)";
                                l.style.WebkitTransition = "-webkit-transform 0.1s  ease-out";
                                r.style.webkitTransform = "rotate(" + r_ + "deg)";
                                r.style.WebkitTransition = "-webkit-transform 0.1s  ease-out";
                                // firefox
                                l.style.MozTransform = "rotate(" + l_ + "deg)";
                                l.style.MozTransition = "-webkit-transform 0.1s  ease-out";
                                r.style.MozTransform = "rotate(" + r_ + "deg)";
                                r.style.MozTransition = "-webkit-transform 0.1s  ease-out";
                                // opera
                                l.style.OTransform = "rotate(" + l_ + "deg)";
                                l.style.OTransition = "-webkit-transform 0.1s  ease-out";
                                r.style.OTransform = "rotate(" + r_ + "deg)";
                                r.style.OTransition = "-webkit-transform 0.1s  ease-out";
                            }
                            P.setText(localStorage.getItem("dem") + '%');
                            localStorage.setItem("dem", parseInt(localStorage.getItem("dem")) + 1);
                        }, 100);
                }
            });
        } else {
            this.P100.setStyle({
                'display': 'none'
            });
            outerElementDom.setAttribute('md-mode', 'indeterminate');
        }
    }
});

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
    initialize: function() {
        this.callParent();
        this.element.addCls('transition');
        var draggable = Ext.factory({
                element: this.thumbContainerElement,
                direction: 'horizontal'
            }, Ext.util.Draggable);
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
    onResize: function() {
        var self = this;
        setTimeout(function() {
            self.doTap(true);
        });
    },
    onTap: function listener(ev) {
        if (this.getDisabled())  {
            return;
        }
        
        this.doTap(false);
    },
    doTap: function(keepOrigin) {
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
            if (this.getCodeColor() === 1)  {
                this.element.addCls(this.getCheckedCls1());
            }
            else if (this.getCodeColor() === 2)  {
                this.element.addCls(this.getCheckedCls2());
            }
            else if (this.getCodeColor() === 3)  {
                this.element.addCls(this.getCheckedCls3());
            }
            else  {
                this.element.addCls(this.getCheckedCls());
            }
            
            //TODO: should verify carefully on browser
            this.thumbContainerElement.setStyle({
                '-webkit-transform': 'translate3d(' + this.thumbContainerElement.getWidth() + 'px, 0, 0) ',
                '-moz-transform': 'translate3d(' + this.thumbContainerElement.getWidth() + 'px, 0, 0)'
            });
        } else {
            // handler for codeColor
            if (this.getCodeColor() === 1)  {
                this.element.removeCls(this.getCheckedCls1());
            }
            else if (this.getCodeColor() === 2)  {
                this.element.removeCls(this.getCheckedCls2());
            }
            
            if (this.getCodeColor() === 3)  {
                this.element.removeCls(this.getCheckedCls3());
            }
            else  {
                this.element.removeCls(this.getCheckedCls());
            }
            
            //TODO: should verify carefully on browser
            this.thumbContainerElement.setStyle({
                '-webkit-transform': 'translate3d(0, 0, 0)',
                '-moz-transform': 'translate3d(0, 0, 0)'
            });
        }
    },
    onDragStart: function onDragStart(sender, e) {
        if (this.getDisabled())  {
            return false;
        }
        
        this.barX = this.barElement.getX();
        this.element.removeCls('transition');
    },
    onDrag: function onDrag(ev, drag) {},
    onDragEnd: function onDragEnd(sender, e) {
        if (this.getDisabled())  {
            return false;
        }
        
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

/**
 * @author Vu Duc Tuyen
 * @public
 *
 * This is an overridden of {@link Ext.field.DatePicker} in which we will show up the customized
 * {@link Material.components.DatePicker} rather than the built-in {@Ext.picker.Date}
 *
 */
Ext.define('Material.components.field.DatePicker', {
    extend: 'Ext.field.DatePicker',
    requires: [
        'Material.components.DatePicker'
    ],
    xtype: 'md-datepicker',
    updateValue: function(newValue, oldValue) {
        var me = this;
        // Ext.Date.format expects a Date
        if (newValue !== null) {
            me.getComponent().setValue(Ext.Date.format(newValue, me.getDateFormat() || Ext.util.Format.defaultDateFormat));
            this.toggleValueIndicator(true);
        } else {
            me.getComponent().setValue('');
            this.toggleValueIndicator(false);
        }
        if (!Material.DatePickerService.isEqualDate(newValue, oldValue)) {
            me.fireEvent('change', me, newValue, oldValue);
        }
    },
    getValue: function() {
        return this._value;
    },
    onFocus: function(e) {
        var component = this.getComponent(),
            self = this;
        this.fireEvent('focus', this, e);
        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();
        if (this.getReadOnly()) {
            return false;
        }
        this.isFocused = true;
        this.element.addCls('x-field-focused');
        Material.DatePicker.setSelectedDate(self.getValue());
        Material.DatePicker.show({
            done: function(selectedDate) {
                self.onDatePickerDone(selectedDate);
            },
            hide: function() {
                self.onDatePickerHide();
            }
        });
    },
    onDatePickerHide: function() {
        this.element.removeCls('x-field-focused');
    },
    onDatePickerDone: function(selectedDate) {
        this.setValue(selectedDate);
    },
    // @private
    destroy: function() {
        this.callSuper(arguments);
    }
});

Ext.define('Material.components.field.Text', {
    extend: 'Ext.field.Text',
    requires: [
        'Material.helpers.RippleService'
    ],
    //rippleService: null,
    /**
     * Normally when setting value to text field's placeholder, that value will be set to the inner input's placeholder.
     * However, in Material Design there is no real placeholder for the inner input. The label will be the placeholder
     * when there is no value in the input and isn't focused. The label is gone away or displayed above the input
     * if it gets focused or has value. We will leverage #{Ext.field.Text.placeholder} property to indicate that if
     * placeholder is set,
     *  - it will become the field label,
     *  - the label will be gone away if the input has value or get focused
     *  - it has class x-has-placeholder for styling purpose
     *
     * @override
     * */
    initialize: function() {
        this.callParent();
    },
    //Material.RippleService.attachButtonBehavior(this, this.element);
    updatePlaceHolder: function(newPlaceHolder) {
        if (this.getLabelAlign() == 'top') {
            if (newPlaceHolder && !/^\s+$/.test(newPlaceHolder)) {
                this.setLabel(newPlaceHolder);
                this.renderElement.addCls('x-has-placeholder');
            } else {
                this.renderElement.removeCls('x-has-placeholder');
            }
        } else {
            this.callParent(arguments);
        }
    },
    updateReadOnly: function(newReadOnly) {
        this.callParent(arguments);
        this.element[newReadOnly === true ? 'addCls' : 'removeCls']('x-field-readonly');
    },
    updateValue: function(newValue) {
        this.callParent(arguments);
        this.toggleValueIndicator(newValue);
    },
    doKeyUp: function() {
        this.callParent(arguments);
        this.toggleValueIndicator(this.getValue());
    },
    toggleValueIndicator: function(newValue) {
        var valueValid = newValue !== undefined && newValue !== null && newValue !== "";
        this.element[valueValid ? 'addCls' : 'removeCls']('x-field-has-value');
    }
});

(function() {
    Ext.define('Material.helpers.Constants', {});
}());

/*! Hammer.JS - v2.0.4 - 2014-09-28
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2014 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a, b, c, d) {
    "use strict";
    function e(a, b, c) {
        return setTimeout(k(a, c), b);
    }
    function f(a, b, c) {
        return Array.isArray(a) ? (g(a, c[b], c) , !0) : !1;
    }
    function g(a, b, c) {
        var e;
        if (a)  {
            if (a.forEach)  {
                a.forEach(b, c);
            }
            else if (a.length !== d)  {
                for (e = 0; e < a.length; ) b.call(c, a[e], e, a) , e++;
            }
            else  {
                for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a);
            }
            ;
        }
        
    }
    function h(a, b, c) {
        for (var e = Object.keys(b),
            f = 0; f < e.length; ) (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]) , f++;
        return a;
    }
    function i(a, b) {
        return h(a, b, !0);
    }
    function j(a, b, c) {
        var d,
            e = b.prototype;
        d = a.prototype = Object.create(e) , d.constructor = a , d._super = e , c && h(d, c);
    }
    function k(a, b) {
        return function() {
            return a.apply(b, arguments);
        };
    }
    function l(a, b) {
        return typeof a == kb ? a.apply(b ? b[0] || d : d, b) : a;
    }
    function m(a, b) {
        return a === d ? b : a;
    }
    function n(a, b, c) {
        g(r(b), function(b) {
            a.addEventListener(b, c, !1);
        });
    }
    function o(a, b, c) {
        g(r(b), function(b) {
            a.removeEventListener(b, c, !1);
        });
    }
    function p(a, b) {
        for (; a; ) {
            if (a == b)  {
                return !0;
            }
            
            a = a.parentNode;
        }
        return !1;
    }
    function q(a, b) {
        return a.indexOf(b) > -1;
    }
    function r(a) {
        return a.trim().split(/\s+/g);
    }
    function s(a, b, c) {
        if (a.indexOf && !c)  {
            return a.indexOf(b);
        }
        
        for (var d = 0; d < a.length; ) {
            if (c && a[d][c] == b || !c && a[d] === b)  {
                return d;
            }
            
            d++;
        }
        return -1;
    }
    function t(a) {
        return Array.prototype.slice.call(a, 0);
    }
    function u(a, b, c) {
        for (var d = [],
            e = [],
            f = 0; f < a.length; ) {
            var g = b ? a[f][b] : a[f];
            s(e, g) < 0 && d.push(a[f]) , e[f] = g , f++;
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b];
        }) : d.sort()) , d;
    }
    function v(a, b) {
        for (var c, e,
            f = b[0].toUpperCase() + b.slice(1),
            g = 0; g < ib.length; ) {
            if (c = ib[g] , e = c ? c + f : b , e in a)  {
                return e;
            }
            
            g++;
        }
        return d;
    }
    function w() {
        return ob++;
    }
    function x(a) {
        var b = a.ownerDocument;
        return b.defaultView || b.parentWindow;
    }
    function y(a, b) {
        var c = this;
        this.manager = a , this.callback = b , this.element = a.element , this.target = a.options.inputTarget , this.domHandler = function(b) {
            l(a.options.enable, [
                a
            ]) && c.handler(b);
        } , this.init();
    }
    function z(a) {
        var b,
            c = a.options.inputClass;
        return new (b = c ? c : rb ? N : sb ? Q : qb ? S : M)(a, A);
    }
    function A(a, b, c) {
        var d = c.pointers.length,
            e = c.changedPointers.length,
            f = b & yb && d - e === 0,
            g = b & (Ab | Bb) && d - e === 0;
        c.isFirst = !!f , c.isFinal = !!g , f && (a.session = {}) , c.eventType = b , B(a, c) , a.emit("hammer.input", c) , a.recognize(c) , a.session.prevInput = c;
    }
    function B(a, b) {
        var c = a.session,
            d = b.pointers,
            e = d.length;
        c.firstInput || (c.firstInput = E(b)) , e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput,
            g = c.firstMultiple,
            h = g ? g.center : f.center,
            i = b.center = F(d);
        b.timeStamp = nb() , b.deltaTime = b.timeStamp - f.timeStamp , b.angle = J(h, i) , b.distance = I(h, i) , C(c, b) , b.offsetDirection = H(b.deltaX, b.deltaY) , b.scale = g ? L(g.pointers, d) : 1 , b.rotation = g ? K(g.pointers, d) : 0 , D(c, b);
        var j = a.element;
        p(b.srcEvent.target, j) && (j = b.srcEvent.target) , b.target = j;
    }
    function C(a, b) {
        var c = b.center,
            d = a.offsetDelta || {},
            e = a.prevDelta || {},
            f = a.prevInput || {};
        (b.eventType === yb || f.eventType === Ab) && (e = a.prevDelta = {
            x: f.deltaX || 0,
            y: f.deltaY || 0
        } , d = a.offsetDelta = {
            x: c.x,
            y: c.y
        }) , b.deltaX = e.x + (c.x - d.x) , b.deltaY = e.y + (c.y - d.y);
    }
    function D(a, b) {
        var c, e, f, g,
            h = a.lastInterval || b,
            i = b.timeStamp - h.timeStamp;
        if (b.eventType != Bb && (i > xb || h.velocity === d)) {
            var j = h.deltaX - b.deltaX,
                k = h.deltaY - b.deltaY,
                l = G(i, j, k);
            e = l.x , f = l.y , c = mb(l.x) > mb(l.y) ? l.x : l.y , g = H(j, k) , a.lastInterval = b;
        } else  {
            c = h.velocity , e = h.velocityX , f = h.velocityY , g = h.direction;
        }
        
        b.velocity = c , b.velocityX = e , b.velocityY = f , b.direction = g;
    }
    function E(a) {
        for (var b = [],
            c = 0; c < a.pointers.length; ) b[c] = {
            clientX: lb(a.pointers[c].clientX),
            clientY: lb(a.pointers[c].clientY)
        } , c++;
        return {
            timeStamp: nb(),
            pointers: b,
            center: F(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        };
    }
    function F(a) {
        var b = a.length;
        if (1 === b)  {
            return {
                x: lb(a[0].clientX),
                y: lb(a[0].clientY)
            };
        }
        
        for (var c = 0,
            d = 0,
            e = 0; b > e; ) c += a[e].clientX , d += a[e].clientY , e++;
        return {
            x: lb(c / b),
            y: lb(d / b)
        };
    }
    function G(a, b, c) {
        return {
            x: b / a || 0,
            y: c / a || 0
        };
    }
    function H(a, b) {
        return a === b ? Cb : mb(a) >= mb(b) ? a > 0 ? Db : Eb : b > 0 ? Fb : Gb;
    }
    function I(a, b, c) {
        c || (c = Kb);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e);
    }
    function J(a, b, c) {
        c || (c = Kb);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI;
    }
    function K(a, b) {
        return J(b[1], b[0], Lb) - J(a[1], a[0], Lb);
    }
    function L(a, b) {
        return I(b[0], b[1], Lb) / I(a[0], a[1], Lb);
    }
    function M() {
        this.evEl = Nb , this.evWin = Ob , this.allow = !0 , this.pressed = !1 , y.apply(this, arguments);
    }
    function N() {
        this.evEl = Rb , this.evWin = Sb , y.apply(this, arguments) , this.store = this.manager.session.pointerEvents = [];
    }
    function O() {
        this.evTarget = Ub , this.evWin = Vb , this.started = !1 , y.apply(this, arguments);
    }
    function P(a, b) {
        var c = t(a.touches),
            d = t(a.changedTouches);
        return b & (Ab | Bb) && (c = u(c.concat(d), "identifier", !0)) , [
            c,
            d
        ];
    }
    function Q() {
        this.evTarget = Xb , this.targetIds = {} , y.apply(this, arguments);
    }
    function R(a, b) {
        var c = t(a.touches),
            d = this.targetIds;
        if (b & (yb | zb) && 1 === c.length)  {
            return d[c[0].identifier] = !0 , [
                c,
                c
            ];
        }
        
        var e, f,
            g = t(a.changedTouches),
            h = [],
            i = this.target;
        if (f = c.filter(function(a) {
            return p(a.target, i);
        }) , b === yb)  {
            for (e = 0; e < f.length; ) d[f[e].identifier] = !0 , e++;
        }
        
        for (e = 0; e < g.length; ) d[g[e].identifier] && h.push(g[e]) , b & (Ab | Bb) && delete d[g[e].identifier] , e++;
        return h.length ? [
            u(f.concat(h), "identifier", !0),
            h
        ] : void 0;
    }
    function S() {
        y.apply(this, arguments);
        var a = k(this.handler, this);
        this.touch = new Q(this.manager, a) , this.mouse = new M(this.manager, a);
    }
    function T(a, b) {
        this.manager = a , this.set(b);
    }
    function U(a) {
        if (q(a, bc))  {
            return bc;
        }
        
        var b = q(a, cc),
            c = q(a, dc);
        return b && c ? cc + " " + dc : b || c ? b ? cc : dc : q(a, ac) ? ac : _b;
    }
    function V(a) {
        this.id = w() , this.manager = null , this.options = i(a || {}, this.defaults) , this.options.enable = m(this.options.enable, !0) , this.state = ec , this.simultaneous = {} , this.requireFail = [];
    }
    function W(a) {
        return a & jc ? "cancel" : a & hc ? "end" : a & gc ? "move" : a & fc ? "start" : "";
    }
    function X(a) {
        return a == Gb ? "down" : a == Fb ? "up" : a == Db ? "left" : a == Eb ? "right" : "";
    }
    function Y(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a;
    }
    function Z() {
        V.apply(this, arguments);
    }
    function $() {
        Z.apply(this, arguments) , this.pX = null , this.pY = null;
    }
    function _() {
        Z.apply(this, arguments);
    }
    function ab() {
        V.apply(this, arguments) , this._timer = null , this._input = null;
    }
    function bb() {
        Z.apply(this, arguments);
    }
    function cb() {
        Z.apply(this, arguments);
    }
    function db() {
        V.apply(this, arguments) , this.pTime = !1 , this.pCenter = !1 , this._timer = null , this._input = null , this.count = 0;
    }
    function eb(a, b) {
        return b = b || {} , b.recognizers = m(b.recognizers, eb.defaults.preset) , new fb(a, b);
    }
    function fb(a, b) {
        b = b || {} , this.options = i(b, eb.defaults) , this.options.inputTarget = this.options.inputTarget || a , this.handlers = {} , this.session = {} , this.recognizers = [] , this.element = a , this.input = z(this) , this.touchAction = new T(this, this.options.touchAction) , gb(this, !0) , g(b.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]) , a[3] && b.requireFailure(a[3]);
        }, this);
    }
    function gb(a, b) {
        var c = a.element;
        g(a.options.cssProps, function(a, d) {
            c.style[v(c.style, d)] = b ? a : "";
        });
    }
    function hb(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0) , d.gesture = c , c.target.dispatchEvent(d);
    }
    var ib = [
            "",
            "webkit",
            "moz",
            "MS",
            "ms",
            "o"
        ],
        jb = b.createElement("div"),
        kb = "function",
        lb = Math.round,
        mb = Math.abs,
        nb = Date.now,
        ob = 1,
        pb = /mobile|tablet|ip(ad|hone|od)|android/i,
        qb = "ontouchstart" in a,
        rb = v(a, "PointerEvent") !== d,
        sb = qb && pb.test(navigator.userAgent),
        tb = "touch",
        ub = "pen",
        vb = "mouse",
        wb = "kinect",
        xb = 25,
        yb = 1,
        zb = 2,
        Ab = 4,
        Bb = 8,
        Cb = 1,
        Db = 2,
        Eb = 4,
        Fb = 8,
        Gb = 16,
        Hb = Db | Eb,
        Ib = Fb | Gb,
        Jb = Hb | Ib,
        Kb = [
            "x",
            "y"
        ],
        Lb = [
            "clientX",
            "clientY"
        ];
    y.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && n(this.element, this.evEl, this.domHandler) , this.evTarget && n(this.target, this.evTarget, this.domHandler) , this.evWin && n(x(this.element), this.evWin, this.domHandler);
        },
        destroy: function() {
            this.evEl && o(this.element, this.evEl, this.domHandler) , this.evTarget && o(this.target, this.evTarget, this.domHandler) , this.evWin && o(x(this.element), this.evWin, this.domHandler);
        }
    };
    var Mb = {
            mousedown: yb,
            mousemove: zb,
            mouseup: Ab
        },
        Nb = "mousedown",
        Ob = "mousemove mouseup";
    j(M, y, {
        handler: function(a) {
            var b = Mb[a.type];
            b & yb && 0 === a.button && (this.pressed = !0) , b & zb && 1 !== a.which && (b = Ab) , this.pressed && this.allow && (b & Ab && (this.pressed = !1) , this.callback(this.manager, b, {
                pointers: [
                    a
                ],
                changedPointers: [
                    a
                ],
                pointerType: vb,
                srcEvent: a
            }));
        }
    });
    var Pb = {
            pointerdown: yb,
            pointermove: zb,
            pointerup: Ab,
            pointercancel: Bb,
            pointerout: Bb
        },
        Qb = {
            2: tb,
            3: ub,
            4: vb,
            5: wb
        },
        Rb = "pointerdown",
        Sb = "pointermove pointerup pointercancel";
    a.MSPointerEvent && (Rb = "MSPointerDown" , Sb = "MSPointerMove MSPointerUp MSPointerCancel") , j(N, y, {
        handler: function(a) {
            var b = this.store,
                c = !1,
                d = a.type.toLowerCase().replace("ms", ""),
                e = Pb[d],
                f = Qb[a.pointerType] || a.pointerType,
                g = f == tb,
                h = s(b, a.pointerId, "pointerId");
            e & yb && (0 === a.button || g) ? 0 > h && (b.push(a) , h = b.length - 1) : e & (Ab | Bb) && (c = !0) , 0 > h || (b[h] = a , this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [
                    a
                ],
                pointerType: f,
                srcEvent: a
            }) , c && b.splice(h, 1));
        }
    });
    var Tb = {
            touchstart: yb,
            touchmove: zb,
            touchend: Ab,
            touchcancel: Bb
        },
        Ub = "touchstart",
        Vb = "touchstart touchmove touchend touchcancel";
    j(O, y, {
        handler: function(a) {
            var b = Tb[a.type];
            if (b === yb && (this.started = !0) , this.started) {
                var c = P.call(this, a, b);
                b & (Ab | Bb) && c[0].length - c[1].length === 0 && (this.started = !1) , this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: tb,
                    srcEvent: a
                });
            }
        }
    });
    var Wb = {
            touchstart: yb,
            touchmove: zb,
            touchend: Ab,
            touchcancel: Bb
        },
        Xb = "touchstart touchmove touchend touchcancel";
    j(Q, y, {
        handler: function(a) {
            var b = Wb[a.type],
                c = R.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: tb,
                srcEvent: a
            });
        }
    }) , j(S, y, {
        handler: function(a, b, c) {
            var d = c.pointerType == tb,
                e = c.pointerType == vb;
            if (d)  {
                this.mouse.allow = !1;
            }
            else if (e && !this.mouse.allow)  {
                return;
            }
            
            b & (Ab | Bb) && (this.mouse.allow = !0) , this.callback(a, b, c);
        },
        destroy: function() {
            this.touch.destroy() , this.mouse.destroy();
        }
    });
    var Yb = v(jb.style, "touchAction"),
        Zb = Yb !== d,
        $b = "compute",
        _b = "auto",
        ac = "manipulation",
        bc = "none",
        cc = "pan-x",
        dc = "pan-y";
    T.prototype = {
        set: function(a) {
            a == $b && (a = this.compute()) , Zb && (this.manager.element.style[Yb] = a) , this.actions = a.toLowerCase().trim();
        },
        update: function() {
            this.set(this.manager.options.touchAction);
        },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers, function(b) {
                l(b.options.enable, [
                    b
                ]) && (a = a.concat(b.getTouchAction()));
            }) , U(a.join(" "));
        },
        preventDefaults: function(a) {
            if (!Zb) {
                var b = a.srcEvent,
                    c = a.offsetDirection;
                if (this.manager.session.prevented)  {
                    return void b.preventDefault();
                }
                
                var d = this.actions,
                    e = q(d, bc),
                    f = q(d, dc),
                    g = q(d, cc);
                return e || f && c & Hb || g && c & Ib ? this.preventSrc(b) : void 0;
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0 , a.preventDefault();
        }
    };
    var ec = 1,
        fc = 2,
        gc = 4,
        hc = 8,
        ic = hc,
        jc = 16,
        kc = 32;
    V.prototype = {
        defaults: {},
        set: function(a) {
            return h(this.options, a) , this.manager && this.manager.touchAction.update() , this;
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this))  {
                return this;
            }
            
            var b = this.simultaneous;
            return a = Y(a, this) , b[a.id] || (b[a.id] = a , a.recognizeWith(this)) , this;
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this : (a = Y(a, this) , delete this.simultaneous[a.id] , this);
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this))  {
                return this;
            }
            
            var b = this.requireFail;
            return a = Y(a, this) , -1 === s(b, a) && (b.push(a) , a.requireFailure(this)) , this;
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this))  {
                return this;
            }
            
            a = Y(a, this);
            var b = s(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1) , this;
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0;
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id];
        },
        emit: function(a) {
            function b(b) {
                c.manager.emit(c.options.event + (b ? W(d) : ""), a);
            }
            var c = this,
                d = this.state;
            hc > d && b(!0) , b() , d >= hc && b(!0);
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void (this.state = kc);
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length; ) {
                if (!(this.requireFail[a].state & (kc | ec)))  {
                    return !1;
                }
                
                a++;
            }
            return !0;
        },
        recognize: function(a) {
            var b = h({}, a);
            return l(this.options.enable, [
                this,
                b
            ]) ? (this.state & (ic | jc | kc) && (this.state = ec) , this.state = this.process(b) , void (this.state & (fc | gc | hc | jc) && this.tryEmit(b))) : (this.reset() , void (this.state = kc));
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
    } , j(Z, V, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b;
        },
        process: function(a) {
            var b = this.state,
                c = a.eventType,
                d = b & (fc | gc),
                e = this.attrTest(a);
            return d && (c & Bb || !e) ? b | jc : d || e ? c & Ab ? b | hc : b & fc ? b | gc : fc : kc;
        }
    }) , j($, Z, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Jb
        },
        getTouchAction: function() {
            var a = this.options.direction,
                b = [];
            return a & Hb && b.push(dc) , a & Ib && b.push(cc) , b;
        },
        directionTest: function(a) {
            var b = this.options,
                c = !0,
                d = a.distance,
                e = a.direction,
                f = a.deltaX,
                g = a.deltaY;
            return e & b.direction || (b.direction & Hb ? (e = 0 === f ? Cb : 0 > f ? Db : Eb , c = f != this.pX , d = Math.abs(a.deltaX)) : (e = 0 === g ? Cb : 0 > g ? Fb : Gb , c = g != this.pY , d = Math.abs(a.deltaY))) , a.direction = e , c && d > b.threshold && e & b.direction;
        },
        attrTest: function(a) {
            return Z.prototype.attrTest.call(this, a) && (this.state & fc || !(this.state & fc) && this.directionTest(a));
        },
        emit: function(a) {
            this.pX = a.deltaX , this.pY = a.deltaY;
            var b = X(a.direction);
            b && this.manager.emit(this.options.event + b, a) , this._super.emit.call(this, a);
        }
    }) , j(_, Z, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [
                bc
            ];
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & fc);
        },
        emit: function(a) {
            if (this._super.emit.call(this, a) , 1 !== a.scale) {
                var b = a.scale < 1 ? "in" : "out";
                this.manager.emit(this.options.event + b, a);
            }
        }
    }) , j(ab, V, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 500,
            threshold: 5
        },
        getTouchAction: function() {
            return [
                _b
            ];
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime > b.time;
            if (this._input = a , !d || !c || a.eventType & (Ab | Bb) && !f)  {
                this.reset();
            }
            else if (a.eventType & yb)  {
                this.reset() , this._timer = e(function() {
                    this.state = ic , this.tryEmit();
                }, b.time, this);
            }
            else if (a.eventType & Ab)  {
                return ic;
            }
            
            return kc;
        },
        reset: function() {
            clearTimeout(this._timer);
        },
        emit: function(a) {
            this.state === ic && (a && a.eventType & Ab ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = nb() , this.manager.emit(this.options.event, this._input)));
        }
    }) , j(bb, Z, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [
                bc
            ];
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & fc);
        }
    }) , j(cb, Z, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: 0.65,
            direction: Hb | Ib,
            pointers: 1
        },
        getTouchAction: function() {
            return $.prototype.getTouchAction.call(this);
        },
        attrTest: function(a) {
            var b,
                c = this.options.direction;
            return c & (Hb | Ib) ? b = a.velocity : c & Hb ? b = a.velocityX : c & Ib && (b = a.velocityY) , this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && mb(b) > this.options.velocity && a.eventType & Ab;
        },
        emit: function(a) {
            var b = X(a.direction);
            b && this.manager.emit(this.options.event + b, a) , this.manager.emit(this.options.event, a);
        }
    }) , j(db, V, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 2,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [
                ac
            ];
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime < b.time;
            if (this.reset() , a.eventType & yb && 0 === this.count)  {
                return this.failTimeout();
            }
            
            if (d && f && c) {
                if (a.eventType != Ab)  {
                    return this.failTimeout();
                }
                
                var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
                    h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp , this.pCenter = a.center , h && g ? this.count += 1 : this.count = 1 , this._input = a;
                var i = this.count % b.taps;
                if (0 === i)  {
                    return this.hasRequireFailures() ? (this._timer = e(function() {
                        this.state = ic , this.tryEmit();
                    }, b.interval, this) , fc) : ic;
                }
                
            }
            return kc;
        },
        failTimeout: function() {
            return this._timer = e(function() {
                this.state = kc;
            }, this.options.interval, this) , kc;
        },
        reset: function() {
            clearTimeout(this._timer);
        },
        emit: function() {
            this.state == ic && (this._input.tapCount = this.count , this.manager.emit(this.options.event, this._input));
        }
    }) , eb.VERSION = "2.0.4" , eb.defaults = {
        domEvents: !1,
        touchAction: $b,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [
                bb,
                {
                    enable: !1
                }
            ],
            [
                _,
                {
                    enable: !1
                },
                [
                    "rotate"
                ]
            ],
            [
                cb,
                {
                    direction: Hb
                }
            ],
            [
                $,
                {
                    direction: Hb
                },
                [
                    "swipe"
                ]
            ],
            [
                db
            ],
            [
                db,
                {
                    event: "doubletap",
                    taps: 2
                },
                [
                    "tap"
                ]
            ],
            [
                ab
            ]
        ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    var lc = 1,
        mc = 2;
    fb.prototype = {
        set: function(a) {
            return h(this.options, a) , a.touchAction && this.touchAction.update() , a.inputTarget && (this.input.destroy() , this.input.target = a.inputTarget , this.input.init()) , this;
        },
        stop: function(a) {
            this.session.stopped = a ? mc : lc;
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c,
                    d = this.recognizers,
                    e = b.curRecognizer;
                (!e || e && e.state & ic) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length; ) c = d[f] , b.stopped === mc || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a) , !e && c.state & (fc | gc | hc) && (e = b.curRecognizer = c) , f++;
            }
        },
        get: function(a) {
            if (a instanceof V)  {
                return a;
            }
            
            for (var b = this.recognizers,
                c = 0; c < b.length; c++) if (b[c].options.event == a)  {
                return b[c];
            }
            ;
            return null;
        },
        add: function(a) {
            if (f(a, "add", this))  {
                return this;
            }
            
            var b = this.get(a.options.event);
            return b && this.remove(b) , this.recognizers.push(a) , a.manager = this , this.touchAction.update() , a;
        },
        remove: function(a) {
            if (f(a, "remove", this))  {
                return this;
            }
            
            var b = this.recognizers;
            return a = this.get(a) , b.splice(s(b, a), 1) , this.touchAction.update() , this;
        },
        on: function(a, b) {
            var c = this.handlers;
            return g(r(a), function(a) {
                c[a] = c[a] || [] , c[a].push(b);
            }) , this;
        },
        off: function(a, b) {
            var c = this.handlers;
            return g(r(a), function(a) {
                b ? c[a].splice(s(c[a], b), 1) : delete c[a];
            }) , this;
        },
        emit: function(a, b) {
            this.options.domEvents && hb(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a , b.preventDefault = function() {
                    b.srcEvent.preventDefault();
                };
                for (var d = 0; d < c.length; ) c[d](b) , d++;
            }
        },
        destroy: function() {
            this.element && gb(this, !1) , this.handlers = {} , this.session = {} , this.input.destroy() , this.element = null;
        }
    } , h(eb, {
        INPUT_START: yb,
        INPUT_MOVE: zb,
        INPUT_END: Ab,
        INPUT_CANCEL: Bb,
        STATE_POSSIBLE: ec,
        STATE_BEGAN: fc,
        STATE_CHANGED: gc,
        STATE_ENDED: hc,
        STATE_RECOGNIZED: ic,
        STATE_CANCELLED: jc,
        STATE_FAILED: kc,
        DIRECTION_NONE: Cb,
        DIRECTION_LEFT: Db,
        DIRECTION_RIGHT: Eb,
        DIRECTION_UP: Fb,
        DIRECTION_DOWN: Gb,
        DIRECTION_HORIZONTAL: Hb,
        DIRECTION_VERTICAL: Ib,
        DIRECTION_ALL: Jb,
        Manager: fb,
        Input: y,
        TouchAction: T,
        TouchInput: Q,
        MouseInput: M,
        PointerEventInput: N,
        TouchMouseInput: S,
        SingleTouchInput: O,
        Recognizer: V,
        AttrRecognizer: Z,
        Tap: db,
        Pan: $,
        Swipe: cb,
        Pinch: _,
        Rotate: bb,
        Press: ab,
        on: n,
        off: o,
        each: g,
        merge: i,
        extend: h,
        inherit: j,
        bindFn: k,
        prefixed: v
    }) , typeof define == kb && define.amd ? define(function() {
        return eb;
    }) : "undefined" != typeof module && module.exports ? module.exports = eb : a[c] = eb;
}(window, document, "Hammer");
//# sourceMappingURL=hammer.min.map

