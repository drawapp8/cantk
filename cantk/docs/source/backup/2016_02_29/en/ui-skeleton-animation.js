/**
 * @class UISkeletonAnimation
 * @extends UIElement
 * Skeletal animation. Currently supports [DragonBones] (https://github.com/DragonBones) and [Spine] (https://github.com/EsotericSoftware/spine-runtimes) formats.
 */

/**
 * @method play
 * Play animation.
 * @param {String} name Action name.
 * @param {Number} repeatTimes Times played. 
 * @param {Function} onDone (optional) Callback function for after animation finishes a set number of times.
 * @param {Function} onOneCycle (optional) Callback function after animation finishes once.
 * @param {Number} useFadeIn (optional) Enable transitions.
 * @return {Object} Returns Promise
 *
 */

/**
 * @method pause
 * Pause animation.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method resume 
 * Unpause animation.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getAnimationDuration
 * Gets length of specified movement.
 * @param {String} animaName Action name.
 * @return {UIElement} Returns length of specified animation.
 *
 */

/**
 * @method setTimeScale
 * Sets time scaling. < 1 = slower, > 1 = faster.
 * @param {Number} animTimeScale Time scaling.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setSkin
 * Sets name of the current skin.
 * @param {String} skinName Name of the current skin.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getSkin
 * Gets name of the current skin.
 * @return {String} Returns name of the current skin.
 *
 */

