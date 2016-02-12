(function () {
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
                    touchstart: function (e) {
                        if (scope.getDisabled()) {
                            return false;
                        }

                        createRipple(e.pageX, e.pageY);
                        isHeld = true;
                    },
                    touchend: function (e) {
                        isHeld = false;
                        var index = ripples.length - 1;
                        ripple = ripples[index];

                        updateElement(ripple);
                    },
                    destroy: function () {
                        rippleContainer && rippleContainer.destroy();
                        rippleContainer = null;
                    }
                });
            }

            function parseColor(color) {
                if (!color) return;
                if (color.indexOf('rgba') === 0) return color.replace(/\d?\.?\d*\s*\)\s*$/, '0.1)');
                if (color.indexOf('rgb') === 0) return rgbToRGBA(color);
                if (color.indexOf('#') === 0) return hexToRGBA(color);

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
                    return color.replace(')', ', 0.1)').replace('(', 'a(')
                }

            }

            function removeElement(elem, wait) {
                ripples.splice(ripples.indexOf(elem), 1);
                if (ripples.length === 0) {
                    rippleContainer && rippleContainer.setStyle({ backgroundColor: '' });
                }
                $timeout(function () { elem.dom.remove(); }, wait, false);
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

                $timeout(function () {
                    if (options.dimBackground) {
                        container.setStyle({ backgroundColor: color });
                    }
                    elem.addCls('md-ripple-placed md-ripple-scaled');
                    if (options.outline) {
                        elem.setStyle({
                            borderWidth: (size * 0.5) + 'px',
                            marginLeft: (size * -0.5) + 'px',
                            marginTop: (size * -0.5) + 'px'
                        });
                    } else {
                        elem.setStyle({ left: '50%', top: '50%' });
                    }
                    updateElement(elem);
                    $timeout(function () {
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
                    states.unshift({ animating: true });

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
                    if (rippleContainer) return rippleContainer;
                    //'<div class="md-ripple-container">'
                    var container = rippleContainer = new Ext.Element(document.createElement('div'));
                    container.addCls('md-ripple-container');

                    element.dom.appendChild(container.dom);

                    return container;
                }
            }
        }
    }, function(RippleService){
        Material.RippleService = new RippleService();
    });
}());