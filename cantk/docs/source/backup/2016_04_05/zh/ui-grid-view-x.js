/**
 * @class UIGridViewX
 * @extends UIScrollViewX
 * 网格视图，里面的子控件按行列排列，每个子控件大小相同。可以水平滚动，也可以垂直滚动。
 * 
 * 设计时按住Alt可以拖动可视区，调节子控件的zIndex可以设置子控件的顺序。
 *
 */

/**
 * @method setVertical
 * 设置网格视图的滚动方向。
 * @param {Boolean} value true表示垂直滚动，false表示水平滚动。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getVertical
 * 获取网格视图的滚动方向。
 * @return {Boolean} 滚动方向。true表示垂直滚动，false表示水平滚动。
 *
 */

/**
 * @method setRows
 * 设置可视区行数，主要用于控制行高。对于水平滚动的网格视图，这个行数与实际行数一致，对于垂直滚动的网格视图，这个行数与实际行数无关。
 * @param {Number} value 行数。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getRows
 * 获取行数。
 * @return {Number} 返回行数。
 *
 */

/**
 * @method setCols
 * 设置可视区列数，主要用于控制列宽。对于垂直滚动的网格视图，这个列数与实际列数一致，对于水平滚动的网格视图，这个列数与实际列数无关。
 * @param {Number} value 列数。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getCols
 * 获取列数。
 * @return {Number} 返回列数。
 *
 */

