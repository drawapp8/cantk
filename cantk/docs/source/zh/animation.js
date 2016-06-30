/**
 * @class Interpolator 
 * 插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。
 */

/**
 * @method get 
 * 获取任务实际进度。
 * @param {Number} percent 时间进度(0-1)。
 * @return {Number} 返回任务实际进度。
 */

/**
 * @class Interpolator 
 * 插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。
 */

/**
 * @method create 
 * 创建插值算法对象。
 * @param {String} name 插值算法的名称。
 * @return {Interpolator} 返回插值算法对象。
 *
 *     @example small frame
 *     //创建线形插值算法（l|linear):
 *     var interpolator = Interpolator.create('l');
 *     //创建回弹插值算法 (b|bounce)
 *     var interpolator = Interpolator.create('b');
 *     //创建加速插值算法 (a|accelerate)
 *     var interpolator = Interpolator.create('a');
 *     //创建先加速再加速插值算法(ad|accelerate-decelerate)
 *     var interpolator = Interpolator.create('ad');
 *     //创建减速插值算法(d|decelerate)
 *     var interpolator = Interpolator.create('d');
 */

