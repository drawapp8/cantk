/**
 * @class UIStatus
 * @extends UIElement
 * 用来表示的事物状态，比如怪物的血量，角色的生命值。可以用setValue来改变当前的状态，value取值0-100。
 * 值为0触发onBecomeZero事件。
 * 值为100触发onBecomeFull事件。
 * 值有变化触发onChanged事件。
 *
 */

/**
 * @event onBecomeZero
 * value变为0时触发本事件。
 */

/**
 * @event onBecomeFull
 * value变为100时触发本事件。
 */

/**
 * @event onChanged
 * value变化时触发本事件。
 * @param {Number} value 当前的值。
 */

