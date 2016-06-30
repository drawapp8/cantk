/**
 * @class UIScrollViewX
 * @extends UIElement
 * Scrolling view.  When using, first set the virtual height and width. When the virtual height and is smaller than the actual height, you cannot scroll up and down. When the virtual width is smaller than the actual width, you cannot scroll left and right. 
 *
 * In the IDE, dragging the scroll view can change the drag views' viewing area. If you wish to drag the scrolling view itself, use the drag tool at the bottom, the arrow keys, or edit the coordinates.  
 *
 * When adding a child element to the scrolling view, first put the element in the viewing area of the scrolling view, then drag it to another area. 
 */

/**
 * @property {Number} virtualWidth 
 * Virtual width.   
 */

/**
 * @property {Number} virtualHeight
 * Virtual height.   
 */

/**
 * @property {Number} xOffset 
 * X-axis deviation.   
 */

/**
 * @property {Number} yOffset 
 * X-axis deviation.   
 */

/**
 * @method scrollToPercent
 * Scroll to designated location. 
 * @param {Number} xOffsetPercent X-axis deviation percentage (0,100). 
 * @param {Number} yOffsetPercent Y-axis deviation percentage (0,100). 
 * @param {Number} duration Scroll time (in ms). 
 * @return {UIElement} Returns element. 
 */

/**
 * @event onScrolling
 * Scroll event. 
 * @param {Number} xOffset x deviation 
 * @param {Number} yOffset Y deviation 
 */

/**
 * @event onScrollDone
 * Scroll onDone event. 
 * @param {Number} xOffset x deviation 
 * @param {Number} yOffset Y deviation 
 */

/**
 * @method scrollTo
 * Scroll to designated location. 
 * @param {Number} xOffset X-axis deviation. 
 * @param {Number} yOffset Y-axis deviation. 
 * @param {Number} duration Scroll time (in ms). 
 * @return {UIElement} Returns element. 
 */

