/**
 * @class Interpolator 
 * Interpolation algorithm interface  Its basic function is to transform the time progress (0-1) to actual mission progress (0,1), to accelerate or decelerate, accelerate then decelerate, or achieve a recoil affect. 
 */

/**
 * @method get 
 * Gets mission progress. 
 * @param {Number} percent Time progress (0-1). 
 * @return {Number} Returns mission progress. 
 */

/**
 * @class Interpolator 
 * Interpolation algorithm interface  Its basic function is to transform the time progress (0-1) to actual mission progress (0,1), to accelerate or decelerate, accelerate then decelerate, or achieve a recoil affect. 
 */

/**
 * @method create 
 * Creates interpolation algorithm object. 
 * @param {String} name Interpolation algorithm name. 
 * @return {Interpolator} Returns interpolation algorithm object. 
 *
 *     @example small frame
 *     //Creates linear algorithm (l|linear): 
 *     var interpolator = Interpolator.create('l');
 *     //Creates bounce algorithm (b|bounce) 
 *     var interpolator = Interpolator.create('b');
 *     //Creates acceleration algorithm (a|accelerate) 
 *     var interpolator = Interpolator.create('a');
 *     //Creates acceleration-deceleration interpolation algorithm (ad|accelerate-decelerate) 
 *     var interpolator = Interpolator.create('ad');
 *     //Creates deceleration interpolation algorithm (d|decelerate) 
 *     var interpolator = Interpolator.create('d');
 */

