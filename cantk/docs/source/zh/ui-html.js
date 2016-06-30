/**
 * @class UIHtml
 * @extends UIElement
 * 主要用于在特殊情况下嵌入HTML代码。比如长按识别二维码，给HTML内容指定一张图片, 如：
 *
 *     @example small frame
 *
 *     <img src="http://studio.holaverse.cn/assets/controls/studio_qrcode.png" width="100%" height="100%" />
 *
 * 注意：CanTK Runtime不支持HTML，如果开发在runtime上运行的游戏，请不要使用本控件。
 *
 */

/**
 * @property {String} innerHTML
 * html content。
 *
 *     @example small frame
 *     this.win.find("html").innerHTML = "hello";
 */

