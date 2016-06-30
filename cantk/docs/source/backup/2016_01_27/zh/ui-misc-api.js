/**
 * @class Point
 * 点。
 */

/**
 * @property {Number} x 
 * x 坐标
 */

/**
 * @property {Number} y
 * y 坐标
 */

/**
 * @class Rect 
 * 矩形。
 */

/**
 * @property {Number} x 
 * x 坐标
 */

/**
 * @property {Number} y
 * y 坐标
 */

/**
 * @property {Number} w
 * 宽度
 */

/**
 * @property {Number} h
 * 高度
 */

/**
 * @class WImage
 * 图片对象，它包含一个HTMLImage对象和一个区域。
 */

/**
 * @method getImage
 * 获取HTMLImage对象
 */

/**
 * @method getImageRect
 * 获取图片区域。
 * @return {Rect} 图片区域。
 */

/**
 * @class AnimationConfig
 * 动画配置信息。
 */

/**
 * @property {Number} delay
 * 延迟播放时间，单位为毫秒。
 */

/**
 * @property {Number} duration
 * 动画持续时间，单位为毫秒。
 */

/**
 * @property {Number} xStart
 * 控件的X坐标起始位置。
 */

/**
 * @property {Number} yStart
 * 控件的Y坐标起始位置。
 */

/**
 * @property {Number} x
 * 控件的X坐标结束位置。
 */

/**
 * @property {Number} xEnd
 * 控件的X坐标结束位置。
 */

/**
 * @property {Number} y
 * 控件的Y坐标结束位置。
 */

/**
 * @property {Number} yEnd
 * 控件的Y坐标结束位置。
 */

/**
 * @property {Number} opacityStart
 * 控件的透明度起始值(取值0-1)。
 */

/**
 * @property {Number} opacity
 * 控件的透明度结束值(取值0-1)。
 */

/**
 * @property {Number} opacityEnd
 * 控件的透明度结束值(取值0-1)。
 */

/**
 * @property {Number} rotationStart
 * 控件的角度起始值(单位为幅度)。
 */

/**
 * @property {Number} rotation
 * 控件的角度结束值(单位为幅度)。
 */

/**
 * @property {Number} rotationEnd
 * 控件的角度结束值(单位为幅度)。
 */

/**
 * @property {Number} scaleXStart
 * 控件的X轴缩放比起始值。
 */

/**
 * @property {Number} scaleX
 * 控件的X轴缩放比结束值。
 */

/**
 * @property {Number} scaleXEnd
 * 控件的X轴缩放比结束值。
 */

/**
 * @property {Number} scaleYStart
 * 控件的Y轴缩放比起始值。
 */

/**
 * @property {Number} scaleY
 * 控件的Y轴缩放比结束值。
 */

/**
 * @property {Number} scaleYEnd
 * 控件的Y轴缩放比结束值。
 */

/**
 * @property {Number} scaleStart
 * 控件的缩放比起始值。
 */

/**
 * @property {Number} scale
 * 控件的缩放比结束值。
 */

/**
 * @property {Number} scaleEnd
 * 控件的缩放比结束值。
 */

/**
 * @property {String} interpolator
 * 控件动画插值器，目前支持三种：'linear'(匀速)、'bounce'(反弹)、'accelerate'（加速）、'accelerate-decelerate'（先加速后减速），可以分别简写为：'l'、'b'、'a'、'ad'。
 */

/**
 * @property {Function} onDone(name)
 * 动画完成时的回调函数，如果参数onDone不为空，优先使用参数的onDone。
 */

/**
 * @property {String} actionWhenBusy
 * 动画正在进行时，处理本次请求的方法：“replace”:表示替换当前动画，"append":追加到当前动画后面播放。
 */

