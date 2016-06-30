/**
 * @class UITimer
 * @extends UIElement
 * Timer. Used to achieve timed operations. setEnable can be used to enable or disable the timer. The timer replaces javascript's original setInterval and setTimeout functions. It will pause automatically when the window is switched to the back, and stop automatically when the preview is canceled. The timer can be enabled/disabled with setEnable.
 */

/**
 * @property {Number} times
 * Times fired. Default is 100000000.
 */

/**
 * @property {String} durationType 
 * "random" uses a random duration, otherwise a fixed duration is used.
 */

/**
 * @property {Number} duration 
 * Uses fixed duration. Default is 500. Unit is milliseconds.
 */

/**
 * @property {Number} durationMin
 * Uses the minimum random duration.
 */

/**
 * @property {Number} durationMax
 * Uses the maximum random duration.
 */

/**
 * @method pause
 * Pause.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method resume 
 * Unpause.
 * @return {UIElement} Returns element.
 *
 */

