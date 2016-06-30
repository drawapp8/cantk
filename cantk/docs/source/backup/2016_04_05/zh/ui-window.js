/**
 * @class UIWindow
 * @extends UIElement
 * 窗口是普通窗口和对话框的基类。
 *
 */

/**
 * @event onLoad 
 * 此事件在第一批资源加载完成时触发。发生在onSystemInit事件之后，onBeforeOpen事件之前。
 *
 * 注意：由于窗口并未打开，请不要使用界面上的控件。
 */

/**
 * @event onSystemInit
 * 系统初始化事件，UI数据加载完成，但其它资源尚未加载。
 *
 * 注意：由于窗口并未打开，请不要使用界面上的控件。
 */

/**
 * @event onBeforeOpen
 * 窗口已经创建，但是还没有显示出来。
 * @param {Object} initData 初始化参数，此参数是从openWindow方法传过来的。
 *
 */

/**
 * @event onOpen
 * 窗口打开事件。
 * @param {Object} initData 初始化参数，此参数是从openWindow方法传过来的。
 *
 * 打开窗口：
 *
 *     @example small frame
 *     var initData = "abcd";
 *     this.openWindow("win-test", function (retCode) {console.log("window closed.");}, false, initData);
 *
 * onOpen事件处理代码：
 *
 *     @example small frame
 *     console.log(initData);
 *
 */

/**
 * @event onClose
 * 窗口关闭。
 * @param {Object} retInfo 由closeWindow函数传递过来。
 *
 */

/**
 * @event onSwitchToBack
 * 打开新窗口，当前窗口切换到后台时，当前窗口触发本事件。
 *
 */

/**
 * @event onSwitchToFront
 * 关闭当前窗口，前一个窗口切换到前台时，前一个窗口触发本事件。
 */

/**
 * @event onSwipeLeft
 * 手势向左滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeRight
 * 手势向右滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeUp
 * 手势向上滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onSwipeDown
 * 手势向下滑动事件。
 * @param {Point} start 起始点。
 * @param {Point} end 结束点。
 */

/**
 * @event onKeyDown
 * Key Down事件。
 * @param {Number} code 按键的代码。
 *
 * 代码影射表：
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
 * 用法示例：
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
 * Key Up事件。
 * @param {Number} code 按键的代码。
 */

/**
 * @event onMultiTouch
 * 多点触摸事件。
 * @param {String} action "touchstart", "touchmove", "touchend"
 * @param {Array} points 点的数组。坐标是根据Canvas的缩放比例转换过的，相对当前窗口的坐标。
 * @param {Object} event 原始Touch事件。
 */

/**
 * @method setTimeout
 * 是对系统setTimeout的包装，保证窗口关闭时，定时器被销毁。
 * @param {Function} func 定时器回调函数。 
 * @param {Number} dt 时长(毫秒) 
 * @return {Number} 返回timerID
 *
 */

/**
 * @method clearTimeout
 * 清除定时器。
 * @param {Number} id timerID
 *
 */

/**
 * @method setInterval
 * 是对系统setInterval的包装，保证窗口关闭时，定时器被销毁。
 * @param {Function} func 定时器回调函数。 
 * @param {Number} dt 时长(毫秒) 
 * @return {Number} 返回timerID
 *
 */

/**
 * @method clearInterval
 * 清除定时器。
 * @param {Number} id timerID
 *
 */

/**
 * @class UINormalWindow
 * @extends UIWindow
 * 普通窗口是全屏的窗口。
 *
 */

