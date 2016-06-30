/**
 * @class UIFrameAnimation
 * @extends UIImage
 * 帧动画。通过连续播放多张图片形成动画效果。可以对图片进行分组，播放时指定分组的名称。
 *
 */

/**
 * @method resume 
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method stop 
 * 停止动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method play
 * 播放动画。
 * @param {String} name 分组名称。
 * @param {Number} repeatTimes 播放次数。 
 * @param {Function} onDone (可选) 播放指定次数后的回调函数。
 * @param {Function} onOneCycle (可选) 每播放一次的回调函数。
 *
 */

/**
 * @method getFrameRate 
 * 获取帧率。
 * @return {Number} 返回帧率。
 *
 */

/**
 * @method setFrameRate 
 * 设置帧率。
 * @param {Number} frameRate 帧率。
 * @return {UIElement} 返回控件本身。
 *
 */

