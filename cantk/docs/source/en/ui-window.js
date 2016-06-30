/**
 * @class UIWindow
 * @extends UIElement
 * A base class of normal windows and dialog.
 *
 */

/**
 * @event onLoad 
 * This event fires when the first batch of resources is finished loading. Occurs after the onSystemInit and before the onBeforeOpen events.
 *
 * Note: Since the window is not fully opened, please don't use interface elements.
 */

/**
 * @event onSystemInit
 * System initialization event. Fires when UI data is finished loading, but other resources have not been loaded yet.
 *
 * Note: Since the window is not fully opened, please don't use interface elements.
 */

/**
 * @event onBeforeOpen
 * Window is created, but has not been displayed.
 * @param {Object} initData Initialized parameters. These parameters are given with the openWindow method.
 *
 */

/**
 * @event onOpen
 * Window open event.
 * @param {Object} initData Initialized parameters. These parameters are given with the openWindow method.
 *
 * Open window:
 *
 *     @example small frame
 *     var initData = "abcd";
 *     this.openWindow("win-test", function (retCode) {console.log("window closed.");}, false, initData);
 *
 * onOpen event handling code:
 *
 *     @example small frame
 *     console.log(initData);
 *
 */

/**
 * @event onClose
 * Closes window.
 * @param {Object} retInfo Returned via the closeWindow function.
 *
 */

/**
 * @event onSwitchToBack
 * When a new window is opened and the current window moves to the back, the current window will fire this event.
 *
 */

/**
 * @event onSwitchToFront
 * When the current window is closed and a previous window moves to the front, the previous window will fire this event.
 */

/**
 * @event onSwipeLeft
 * Swipe left event. 
 * @param {Point} start start point.
 * @param {Point} end end point.
 */

/**
 * @event onSwipeRight
 * Swipe right event.
 * @param {Point} start start point.
 * @param {Point} end end point.
 */

/**
 * @event onSwipeUp
 * Swipe up event.
 * @param {Point} start start point.
 * @param {Point} end end point.
 */

/**
 * @event onSwipeDown
 * Swipe down event.
 * @param {Point} start start point.
 * @param {Point} end end point.
 */

/**
 * @event onKeyDown
 * Key Down event.
 * @param {Number} code Code of the key.
 * 
 * Key code map:
 *
 *     @example small frame
 *
 *     var KeyEvent = {
 *        DOM_VK_CANCEL: 3,
 *        DOM_VK_HELP: 6,
 *        DOM_VK_BACK_SPACE: 8,
 *        DOM_VK_TAB: 9,
 *        DOM_VK_CLEAR: 12,
 *        DOM_VK_RETURN: 13,
 *        DOM_VK_ENTER: 14,
 *        DOM_VK_SHIFT: 16,
 *        DOM_VK_CONTROL: 17,
 *        DOM_VK_ALT: 18,
 *        DOM_VK_PAUSE: 19,
 *        DOM_VK_CAPS_LOCK: 20,
 *        DOM_VK_ESCAPE: 27,
 *        DOM_VK_SPACE: 32,
 *        DOM_VK_PAGE_UP: 33,
 *        DOM_VK_PAGE_DOWN: 34,
 *        DOM_VK_END: 35,
 *        DOM_VK_HOME: 36,
 *        DOM_VK_LEFT: 37,
 *        DOM_VK_UP: 38,
 *        DOM_VK_RIGHT: 39,
 *        DOM_VK_DOWN: 40,
 *        DOM_VK_PRINTSCREEN: 44,
 *        DOM_VK_INSERT: 45,
 *        DOM_VK_DELETE: 46,
 *        DOM_VK_0: 48,
 *        DOM_VK_1: 49,
 *        DOM_VK_2: 50,
 *        DOM_VK_3: 51,
 *        DOM_VK_4: 52,
 *        DOM_VK_5: 53,
 *        DOM_VK_6: 54,
 *        DOM_VK_7: 55,
 *        DOM_VK_8: 56,
 *        DOM_VK_9: 57,
 *        DOM_VK_SEMICOLON: 59,
 *        DOM_VK_EQUALS: 61,
 *        DOM_VK_A: 65,
 *        DOM_VK_B: 66,
 *        DOM_VK_C: 67,
 *        DOM_VK_D: 68,
 *        DOM_VK_E: 69,
 *        DOM_VK_F: 70,
 *        DOM_VK_G: 71,
 *        DOM_VK_H: 72,
 *        DOM_VK_I: 73,
 *        DOM_VK_J: 74,
 *        DOM_VK_K: 75,
 *        DOM_VK_L: 76,
 *        DOM_VK_M: 77,
 *        DOM_VK_N: 78,
 *        DOM_VK_O: 79,
 *        DOM_VK_P: 80,
 *        DOM_VK_Q: 81,
 *        DOM_VK_R: 82,
 *        DOM_VK_S: 83,
 *        DOM_VK_T: 84,
 *        DOM_VK_U: 85,
 *        DOM_VK_V: 86,
 *        DOM_VK_W: 87,
 *        DOM_VK_X: 88,
 *        DOM_VK_Y: 89,
 *        DOM_VK_Z: 90,
 *        DOM_VK_CONTEXT_MENU: 93,
 *        DOM_VK_NUMPAD0: 96,
 *        DOM_VK_NUMPAD1: 97,
 *        DOM_VK_NUMPAD2: 98,
 *        DOM_VK_NUMPAD3: 99,
 *        DOM_VK_NUMPAD4: 100,
 *        DOM_VK_NUMPAD5: 101,
 *        DOM_VK_NUMPAD6: 102,
 *        DOM_VK_NUMPAD7: 103,
 *        DOM_VK_NUMPAD8: 104,
 *        DOM_VK_NUMPAD9: 105,
 *        DOM_VK_MULTIPLY: 106,
 *        DOM_VK_ADD: 107,
 *        DOM_VK_SEPARATOR: 108,
 *        DOM_VK_SUBTRACT: 109,
 *        DOM_VK_DECIMAL: 110,
 *        DOM_VK_DIVIDE: 111,
 *        DOM_VK_BACK_BUTTON: 115, 
 *        DOM_VK_MENU_BUTTON: 118, 
 *        DOM_VK_SEARCH_BUTTON: 120, 
 *        DOM_VK_F1: 112,
 *        DOM_VK_F2: 113,
 *        DOM_VK_F3: 114,
 *        DOM_VK_F4: 115,
 *        DOM_VK_F5: 116,
 *        DOM_VK_F6: 117,
 *        DOM_VK_F7: 118,
 *        DOM_VK_F8: 119,
 *        DOM_VK_F9: 120,
 *        DOM_VK_F10: 121,
 *        DOM_VK_F11: 122,
 *        DOM_VK_F12: 123,
 *        DOM_VK_F13: 124,
 *        DOM_VK_F14: 125,
 *        DOM_VK_F15: 126,
 *        DOM_VK_F16: 127,
 *        DOM_VK_F17: 128,
 *        DOM_VK_F18: 129,
 *        DOM_VK_F19: 130,
 *        DOM_VK_F20: 131,
 *        DOM_VK_F21: 132,
 *        DOM_VK_F22: 133,
 *        DOM_VK_F23: 134,
 *        DOM_VK_F24: 135,
 *        DOM_VK_NUM_LOCK: 144,
 *        DOM_VK_SCROLL_LOCK: 145,
 *        DOM_VK_COMMA: 188,
 *        DOM_VK_PERIOD: 190,
 *        DOM_VK_SLASH: 191,
 *        DOM_VK_BACK_QUOTE: 192,
 *        DOM_VK_OPEN_BRACKET: 219,
 *        DOM_VK_BACK_SLASH: 220,
 *        DOM_VK_CLOSE_BRACKET: 221,
 *        DOM_VK_QUOTE: 222,
 *        DOM_VK_META: 224,
 *        DOM_VK_BACK: 225
 *      }
 *
 * Usage example：
 *
 *     @example small frame
 *     var win = this.getWindow();
 *     var image = win.find("image");
 *     switch (code) {
 *         case KeyEvent.DOM_VK_UP:
 *             image.y -= 5;
 *             break;
 *         case KeyEvent.DOM_VK_DOWN:
 *             image.y += 5;
 *             break;
 *         case KeyEvent.DOM_VK_LEFT:
 *             image.x -= 5;
 *             break;
 *         case KeyEvent.DOM_VK_RIGHT:
 *             image.x += 5;
 *             break;
 *         default:
 *             break;
 *     }

 */

/**
 * @event onKeyUp
 * Key Up event.
 * @param {Number} code Code of the key.
 */

/**
 * @event onMultiTouch
 * Multi-touch event.
 * @param {String} action "touchstart", "touchmove", "touchend"
 * @param {Array} points Touch data array. Coordinates are converted based on the Canvas scale, and correspond to the current window's coordinates. 
 * @param {Object} event Primitive touch event.
 */

/**
 * @class UINormalWindow
 * @extends UIWindow
 * Normal windows are full screen windows.
 *
 */

/**
 * @method setTimeout
 * A system setTimeout wrapper. Ensures that the timer is destroyed when a window is closed.
 * @param {Function} func Timer callback function. 
 * @param {Number} dt Duration (in milliseconds) 
 * @return {Number} Returns timerID
 *
 */

/**
 * @method clearTimeout
 * Removes timer.
 * @param {Number} id timerID
 *
 */

/**
 * @method setInterval
 * A system setInterval wrapper. Ensures that the timer is destroyed when a window is closed.
 * @param {Function} func Timer callback function. 
 * @param {Number} dt Duration (in milliseconds) 
 * @return {Number} Returns timerID
 *
 */

/**
 * @method clearInterval
 * Removes timer.
 * @param {Number} id timerID
 *
 */
