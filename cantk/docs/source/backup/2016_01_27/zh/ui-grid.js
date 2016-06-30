/**
 * @class UIGrid
 * @extends UIElement
 * 网格容器，里面的子控件按行列排列，每个子控件大小相同。
 *
 */

/**
 * @method setRows
 * 设置行数。
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
 * 设置列数。
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

/**
 * @method isCheckable
 * 检查是否进入勾选模式。
 * @return {Boolean} 是否进入勾选模式。
 *
 */

/**
 * @method setCheckable
 * 设置是否进入勾选模式。进入勾选模式后可以勾选子控件。
 * (记得在IDE中设置网格的勾选子项的图标)
 * @param {Boolean} value 是否进入勾选模式。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setChildChecked
 * 勾选指定的子控件。
 * @param {Number} index 子控件的索引。
 * @param {Boolean} checked 是否勾选。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method isChildChecked
 * 检查指定的子控件是否勾选。
 * @param {Number} index 子控件的索引。
 * @return {Boolean} 返回子控件是否勾选。
 *
 */

/**
 * @method getChildByRowCol
 * 通过行列数获取对应的子控件。
 * @param {Number} row 行数。
 * @param {Number} col 列数。
 * @return {UIElement} 返回子控件。
 *
 */

/**
 * @method getChildRow
 * 获取指定子控件所在的行数。
 * @param {UIElement} child 子控件。
 * @return {Number} 返回行数。
 *
 */

/**
 * @method getChildCol
 * 获取指定子控件所在的列数。
 * @param {UIElement} child 子控件。
 * @return {Number} 返回列数。
 *
 */

/**
 * @method exchangeTwoChildren
 * 交换两个子控件的位置。
 * @param {Number} child1Index 子控件1的索引。
 * @param {Number} child2Index 子控件2的索引。
 * @param {Boolean} enableAnimation 是否启用动画。
 * @return {UIElement} 返回控件本身。
 *
 */

