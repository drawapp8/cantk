/**
 * @class UIGrid
 * @extends UIElement
 * A grid container. Child elements are arrayed in columns and rows.
 *
 */

/**
 * @method setRows
 * Sets number of rows.
 * @param {Number} value Number of rows.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getRows
 * Gets number of rows.
 * @return {Number} Returns number of rows.
 *
 */

/**
 * @method setCols
 * Sets number of columns.
 * @param {Number} value Number of columns.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getCols
 * Gets number of columns.
 * @return {Number} Returns number of columns.
 *
 */

/**
 * @method isCheckable
 * Checks whether to enter checked mode.
 * @return {Boolean} Whether to enter checked mode.
 *
 */

/**
 * @method setCheckable
 * Sets whether to enter checked mode. Checkable element after checked mode is entered.
 * (Remember to set the grid's checked image in the IDE)
 * @param {Boolean} value Whether to enter checked mode.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setChildChecked
 * Checks designated child element.
 * @param {Number} index The index of the child element.
 * @param {Boolean} checked Checked/unchecked?
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method isChildChecked
 * Checks to see if designated child element is checked.
 * @param {Number} index The index of the child element.
 * @return {Boolean} Returns child element's checked state.
 *
 */

/**
 * @method getChildByRowCol
 * Uses number of rows/columns to get corresponding child element.
 * @param {Number} row Number of rows.
 * @param {Number} col Number of columns.
 * @return {UIElement} Returns child element.
 *
 */

/**
 * @method getChildRow
 * Gets row number of designated child element.
 * @param {UIElement} child Child element.
 * @return {Number} Returns number of rows.
 *
 */

/**
 * @method getChildCol
 * Gets column number of designated child element.
 * @param {UIElement} child Child element.
 * @return {Number} Returns number of columns.
 *
 */

/**
 * @method exchangeTwoChildren
 * Switches positions of two child elements.
 * @param {Number} child1Index Index of child element 1.
 * @param {Number} child2Index Index of child element 2.
 * @param {Boolean} enableAnimation Sets whether or not to use animation.
 * @return {UIElement} Returns element.
 *
 */

