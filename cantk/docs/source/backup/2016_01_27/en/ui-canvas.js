/**
 * @class UICanvas
 * @extends UIElement
 * Canvas element.
 *
 * Note: UICanvas actually shares a canvas with other elements, and just reveals the canvas interface. So every time a window is re-rendered, the content will be cleared and need to be re-painted. 
 *
 */

/**
 * @event onPaint(canvas2dCtx) 
 * Paint event.
 * @param {Object} canvas2dCtx Canvas' 2d Context.
 * API Reference: http://www.html5canvastutorials.com/tutorials/html5-canvas-element/
 *
 *     @example small frame
 *     var x = this.w >> 2;
 *     var y = this.h >> 2;
 *     var w = this.w >> 1;
 *     var h = this.h >> 1;
 *     var ctx = canvas2dCtx;
 *
 *     ctx.lineWidth = 2;
 *     ctx.strokeStyle = "Green";
 *     ctx.rect(x, y, w, h);
 *     ctx.stroke();
 */

