/**
 * @class UIImage
 * @extends UIElement
 * 用来显示一张图片。UIImage可以设置多张图片，但只有一张是当前显示的图片，其它图片是备用图片(目前为15张，可以增加)。可以用setValue把指定的备用图片设置为当前图片。
 *
 * 把第一张备用图片设置为当前图片(可以在UIImage的图片属性页中设置备用图片)：
 *
 *     @example small frame
 *     this.setImage(0);
 *
 * 或者：
 *
 *     @example small frame
 *     this.setValue(0);
 *
 */

