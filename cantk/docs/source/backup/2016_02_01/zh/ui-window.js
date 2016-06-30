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
 */

/**
 * @event onSwipeRight
 * 手势向右滑动事件。
 */

/**
 * @event onSwipeUp
 * 手势向上滑动事件。
 */

/**
 * @event onSwipeDown
 * 手势向下滑动事件。
 */

/**
 * @event onKeyDown
 * Key Down事件。
 * @param {Number} code 按键的代码。
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
 * @class UINormalWindow
 * @extends UIWindow
 * 普通窗口是全屏的窗口。
 *
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

