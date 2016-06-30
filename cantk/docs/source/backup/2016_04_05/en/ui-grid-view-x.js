/**
 * @class UIGridViewX
 * @extends UIScrollViewX
 * A grid view. Child elements are arrayed in columns and rows.  Can scroll horizontally or vertically. 
 * 
 * When designing, hold down Alt to drag the view area. Adjust the child element's zIndex to set the order of the child elements. 
 *
 */

/**
 * @method setVertical
 * Sets the scroll direction of the grid view. 
 * @param {Boolean} value true = vertical scrolling, false = horizontal scrolling. 
 * @return {UIElement} Returns element. 
 *
 */

/**
 * @method getVertical
 * Gets the scroll direction of the grid view. 
 * @return {Boolean} Scroll direction.  true = vertical scrolling, false = horizontal scrolling. 
 *
 */

/**
 * @method setRows
 * Sets the rows of the view area. Mainly used to control row height.  For the horizontal scrolling grid view, this number of rows is the same as the actual number of rows. For the vertical scrolling grid view, this number of rows is unrelated to the actual number of rows. 
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
 * Sets the columns of the view area. Mainly used to control column width.  For the vertical scrolling grid view, this number of columns is the same as the actual number of columns. For the horizontal scrolling grid view, this number of columns is unrelated to the actual number of columns. 
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

