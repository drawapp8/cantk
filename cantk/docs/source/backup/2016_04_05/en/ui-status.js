/**
 * @class UIStatus
 * @extends UIElement
 * Used to indicate an event's state, such as the HP of a monster or player. The current state can be changed with setValue. Values can be 0 - 100. 
 * the onBecomeZero event will be fired when the value reaches 0.
 * the onBecomeFull event will be fired when the value reaches 100.
 * Fires an onChanged event when the value changes.
 *
 */

/**
 * @event onBecomeZero
 * This event fires when the value becomes 0.
 */

/**
 * @event onBecomeFull
 * This event fires when the value becomes 100.
 */

/**
 * @event onChanged
 * This event fires when the value changes.
 * @param {Number} value Current value.
 */

