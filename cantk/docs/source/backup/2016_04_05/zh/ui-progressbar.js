/**
 * @class UIProgressBar
 * @extends UIElement
 * 进度条。可以用setValue/getValue来设置/获取进度。缺省进度取值范围0-100，也可以用setRange来设置它的取值范围。
 *
 * 在进度条上放一张图片，可以把进度条变成一个滑块控件。
 *
 * 进度条有3种表现形式：
 * 
 * 1.宽度大于高度时为水平进度条。

 * 2.宽度小于高度时为垂直进度条。
 * 
 * 3.宽度约等于高度时为环状进度条。
 *
 *     @example small frame
 *     this.win.find("progressbar").setValue(50, true, true);
 *
 */

/**
 * @event onChanged
 * 进度变化时触发本事件。
 * @param {Number} value 当前的进度。
 */

/**
 * @event onChanging
 * 进度正在变化时触发本事件。只有做为滑块控件时，拖动滑块才会触发本事件。
 * @param {Number} value 当前的进度。
 */

/**
 * @method setStepSize
 * 设置Slider的步长。
 * @param {Number} stepSize 取值范围0-50，0表示平滑移动。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setStepSize(20);
 */

/**
 * @method setRange 
 * 设置进度条的取值范围。
 * @param {Number} minValue 最小值。
 * @param {Number} maxValue 最大值。
 * @return {UIElement} 返回控件本身。
 *
 * 示例：
 *
 *     @example small frame
 *     var win = this.win;
 *     var slider = win.find("slider");
 *     slider.setRange(0, 5);
 *     slider.setStepSize(1);
 */

/**
 * @method getStepSize
 * 获取Slider的步长。
 * @return {Number} Slider的步长。
 */

/**
 * @method getMinValue
 * 获取范围的最小值。可以用setRange来设置取值范围。
 * @return {Number} 范围的最小值。
 */

/**
 * @method getMaxValue
 * 获取范围的最大值。可以用setRange来设置取值范围。
 * @return {Number} 范围的最大值。
 */

