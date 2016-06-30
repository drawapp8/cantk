/**
 * @class UICanvas
 * @extends UIElement
 * 画布控件。
 *
 * 注意：UICanvas其实与其它控件共享一个画布，只是把画布的接口暴露出来，所以每次窗口重绘时，里面的内容都被清除，需要重新绘制。
 *
 */

/**
 * @event onPaint(canvas2dCtx) 
 * 绘图事件。
 * @param {Object} canvas2dCtx 画布的2d Context。
 * 参考：[https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
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

