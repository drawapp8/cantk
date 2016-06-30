/**
 * @class UIListViewX
 * @extends UIScrollViewX
 * 列表视图，可以水平滚动，也可以垂直滚动。
 *
 * 垂直的列表视图和只有一列垂直的网格视图相似，只是列表视图的单项itemSize为0时，里面的子控件可以具有不同的高度。
 * 水平的列表视图和只有一行水平的网格视图相似，只是列表视图的单项itemSize为0时，里面的子控件可以具有不同的宽度。
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
 * @method setItemSize
 * 设置子控件的大小。
 *
 * 列表视图为垂直方向时，指单项的高度，0表示使用子控件原来的高度，否则使用指定的高度。
 *
 * 列表视图为水平方向时，指单项的宽度，0表示使用子控件原来的宽度，否则使用指定的宽度。
 *
 * @param {Number} value 设置子控件的大小。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getItemSize
 * 
 * @return {UIElement} 返回单项的高度(垂直)或宽度(水平)。
 *
 */

