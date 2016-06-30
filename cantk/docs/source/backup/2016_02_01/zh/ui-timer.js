/**
 * @class UITimer
 * @extends UIElement
 * 定时器。用于实现定时操作，可以通过setEnable启用或关闭定时器。定时器用来代替javascript原生的setInterval和setTimeout方法，它会在窗口退到后台自动暂停，取消预览时自动停止。可以使用setEnable来启用或禁用定时器。
 */

/**
 * @property {Number} times
 * 触发的次数，默认为100000000。
 */

/**
 * @property {String} durationType 
 * "random"使用随机时长，否则使用固定时长。
 */

/**
 * @property {Number} duration 
 * 使用固定时长的时长，默认为500，单位为毫秒。
 */

/**
 * @property {Number} durationMin
 * 使用随机时长的最小时长。
 */

/**
 * @property {Number} durationMax
 * 使用随机时长的最大时长。
 */

/**
 * @method pause
 * 暂停。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method resume 
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */

