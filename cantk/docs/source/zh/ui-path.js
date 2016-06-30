/**
 * @class UIPath
 * @extends UIElement
 * UIPath 控制物体按照指定的路径运动。目前路径支持直线，抛物线，二次和三次贝塞尔曲线，sin/cos函数和圆弧曲线。可以指定运动的速度(由duration控制)和加速度(由interpolator决定)。
 *
 * 使用时先放一个UIPath对象到场景中，然后在onInit事件里增加路径，在任何时间都可以向UIPath增加对象或删除对象。
 *
 * 注意：
 *
 * 1.文档中时长的单位为毫秒，速度单位为像素/秒，加速单位为像素/秒^2，角度单位为弧度。
 *
 * 2.插值算法实现加速/加速/匀速等效果，请参考插值算法。
 *
 */

/**
 * @method restart
 * 重新开始。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method pause
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method resume 
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method addObj
 * 增加一个对象，让它沿路径运动。
 * @param {UIElement} shape 对象。
 * @param {Function} onStep 每一步的回调函数（可选）。
 * @param {Function} onDone 完成时的回调函数（可选）。
 * @param {Number} delayTime 延迟启动时间（可选）。
 * @param {Number} noRotation 是否禁止旋转（可选）。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method removeObj
 * 从路径中移除一个对象。
 * @param {UIElement} shape 对象。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method resetObjs
 * 清除全部对象。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method resetPath
 * 重置路径。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method addLine
 * 增加一条直线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 终点。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method addArc
 * 增加一条弧线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} origin 原点
 * @param {Number} r 半径。
 * @param {Number} sAngle 初始角度。
 * @param {Number} eAngle 结束角度。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method addPara
 * 增加一条抛物线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p 初始位置。 
 * @param {Point} a 加速度。
 * @param {Point} v 初速度。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method addSin
 * 增加一条sin/cos曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Number} p 初始位置。
 * @param {Number} waveLenth 波长。
 * @param {Number} v 波速(X方向上的速度)。
 * @param {Number} amplitude 振幅。
 * @param {Number} phaseOffset 角度偏移。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method addBezier
 * 增加一条三次贝塞尔曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 控制点1。
 * @param {Point} p3 控制点2。
 * @param {Point} p4 终点。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method addQuad
 * 增加一条二次贝塞尔曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 控制点。
 * @param {Point} p3 终点。
 * @return {UIElement} 返回控件本身。
 */

