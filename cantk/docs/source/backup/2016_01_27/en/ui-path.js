/**
 * @class UIPath
 * @extends UIElement
 * UIPath controls movement of objects along specific paths. Current pathing supports straight lines, parabolas, quadratic and cubic Bezier curves, sin/cos functions, and circular arcs. You can set speed of movement (controlled by duration) and acceleration (controlled by interpolator).
 *
 * When using, first place a UIPatch object in a scene, and then add a path in the onInit event. You can add or delete objects from the UIPath at any time.
 *
 * Note:
 *
 * 1. The unit of time in these files is milliseconds (ms). The unit of speed is pixel/sec. The unit of acceleration is pixel/sec^2. The unit of angle is range.
 *
 * 2. For interpolation algorithms for acceleration, maintain pace, and other effects, see interpolation algorithms.
 *
 */

/**
 * @method restart
 * Restarts.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method pause
 * Unpause.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method resume 
 * Unpause.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method addObj
 * Adds an object, and sets it to move along the path.
 * @param {UIElement} shape Object.
 * @param {Function} onStep Callback function for each step (optional).
 * @param {Function} onDone Callback function when finished (optional).
 * @param {Number} delayTime Delays start time (optional).
 * @param {Number} noRotation Whether to disable rotation (optional).
 * @return {UIElement} Returns element.
 */

/**
 * @method removeObj
 * Removes an object from the path.
 * @param {UIElement} shape Object.
 * @return {UIElement} Returns element.
 */

/**
 * @method resetObjs
 * Removes all objects.
 * @return {UIElement} Returns element.
 */

/**
 * @method resetPath
 * Resets path.
 * @return {UIElement} Returns element.
 */

/**
 * @method addLine
 * Adds a straight line to the path.
 * @param {Number} duration Time needed along this path.
 * @param {Object} interpolator Interpolation algorithm.
 * @param {Point} p1 Start point.
 * @param {Point} p2 End point.
 * @return {UIElement} Returns element.
 */

/**
 * @method addArc
 * Adds an arc to the path.
 * @param {Number} duration Time needed along this path.
 * @param {Object} interpolator Interpolation algorithm.
 * @param {Point} origin Origin
 * @param {Number} r Radius.
 * @param {Number} sAngle Start angle.
 * @param {Number} eAngle End angle.
 * @return {UIElement} Returns element.
 */

/**
 * @method addPara
 * Adds a parabola to the path.
 * @param {Number} duration Time needed along this path.
 * @param {Object} interpolator Interpolation algorithm.
 * @param {Point} p Start point. 
 * @param {Point} a Increases speed.
 * @param {Point} v Starting speed.
 * @return {UIElement} Returns element.
 */

/**
 * @method addSin
 * Adds a sin/cos arc to the path.
 * @param {Number} duration Time needed along this path.
 * @param {Object} interpolator Interpolation algorithm.
 * @param {Number} p Start point.
 * @param {Number} waveLenth Wavelength.
 * @param {Number} v Wave speed (speed along X).
 * @param {Number} amplitude Amplitude.
 * @param {Number} phaseOffset Angular deflection.
 * @return {UIElement} Returns element.
 */

/**
 * @method addBezier
 * Add a cubic Bezier curve to the path.
 * @param {Number} duration Time needed along this path.
 * @param {Object} interpolator Interpolation algorithm.
 * @param {Point} p1 Start point.
 * @param {Point} p2 Control point 1.
 * @param {Point} p3 Control point 2.
 * @param {Point} p4 End point.
 * @return {UIElement} Returns element.
 */

/**
 * @method addQuad
 * Add a quadratic Bezier curve to the path.
 * @param {Number} duration Time needed along this path.
 * @param {Object} interpolator Interpolation algorithm.
 * @param {Point} p1 Start point.
 * @param {Point} p2 Control point.
 * @param {Point} p3 End point.
 * @return {UIElement} Returns element.
 */

