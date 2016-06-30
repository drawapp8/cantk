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
 * API参考：http://www.html5canvastutorials.com/tutorials/html5-canvas-element/
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

