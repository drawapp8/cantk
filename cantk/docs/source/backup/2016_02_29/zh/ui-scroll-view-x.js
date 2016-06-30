/**
 * @class UIScrollViewX
 * @extends UIElement
 * 滚动视图。使用时先设置虚拟高度和宽度，虚拟高度小于实际高度时，上下不滚动，虚拟宽度小于实际宽度时，左右不滚动。
 *
 * 在IDE中，拖动滚动视图是改变滚动视图的可视区，要拖动滚动视图本身请使用滚动视图下方的拖动手柄，或者使用方向键，或者直接修改它的坐标。
 *
 * 往滚动视图中添加子控件时，先将控件放到滚动视图的可视区，然后拖动到其它区域。
 */

/**
 * @property {Number} virtualWidth 
 * 虚拟宽度。  
 */

/**
 * @property {Number} virtualHeight
 * 虚拟高度。  
 */

/**
 * @property {Number} xOffset 
 * X方向偏移量。  
 */

/**
 * @property {Number} yOffset 
 * X方向偏移量。  
 */

/**
 * @method scrollToPercent
 * 滚动到指定位置。
 * @param {Number} xOffsetPercent X方向偏移量百分比(0,100)。
 * @param {Number} yOffsetPercent Y方向偏移量百分比(0,100)。
 * @param {Number} duration 滚动时间(毫秒)。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method scrollTo
 * 滚动到指定位置。
 * @param {Number} xOffset X方向偏移量。
 * @param {Number} yOffset Y方向偏移量。
 * @param {Number} duration 滚动时间(毫秒)。
 * @return {UIElement} 返回控件本身。
 */

