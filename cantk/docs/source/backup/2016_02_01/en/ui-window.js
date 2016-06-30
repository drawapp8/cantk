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
 */

/**
 * @event onSwipeRight
 * Swipe right event.
 */

/**
 * @event onSwipeUp
 * Swipe up event.
 */

/**
 * @event onSwipeDown
 * Swipe down event.
 */

/**
 * @event onKeyDown
 * Key Down event.
 * @param {Number} code Code of the key.
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

