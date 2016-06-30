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
 * API Reference: [https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 *
 *     @example small frame
 *     var image = this.getImageByType(0);
 *     var img = image.getImage();
 *     var rect = image.getImageRect();
 *
 *     canvas2dCtx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, this.w, this.h);
 *
 *     canvas2dCtx.moveTo(0, 0);
 *     canvas2dCtx.lineTo(this.w, this.h);
 *     canvas2dCtx.lineWidth = 2;
 *     canvas2dCtx.strokeStyle = "red";
 *     canvas2dCtx.stroke();
 *
 */

