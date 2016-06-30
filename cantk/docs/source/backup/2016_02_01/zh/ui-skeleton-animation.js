/**
 * @class UISkeletonAnimation
 * @extends UIElement
 * 骨骼动画。目前支持[DragonBones](https://github.com/DragonBones)和[Spine](https://github.com/EsotericSoftware/spine-runtimes)两种格式。
 */

/**
 * @method play
 * 播放动画。
 * @param {String} name 动作名称。
 * @param {Number} repeatTimes 播放次数。 
 * @param {Function} onDone (可选) 播放指定次数后的回调函数。
 * @param {Function} onOneCycle (可选) 每播放一次的回调函数。
 * @param {Number} useFadeIn (可选) 启用渐变。
 * @return {Object} 返回Promise
 *
 */

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method resume 
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getAnimationDuration
 * 获取指定动作的时长。
 * @param {String} animaName 动作名称。
 * @return {UIElement} 返回指定动画的时长。
 *
 */

/**
 * @method setTimeScale
 * 设置时间缩放比例, 小于1变慢，大于1变快。
 * @param {Number} animTimeScale 时间缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setSkin
 * 设置当前皮肤的名称。
 * @param {String} skinName 皮肤的名称。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getSkin
 * 获取当前皮肤的名称。
 * @return {String} 返回当前皮肤的名称。
 *
 */

