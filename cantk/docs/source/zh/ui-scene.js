/**
 * @class UIScene
 * @extends UINormalWindow
 * 游戏场景。在UINormalWindow上增加了物理引擎和虚拟屏幕的支持。
 *
 */

/**
 * @property {Number} xOffset 
 * 当场景的虚拟大小大于实际大小时，当前可视区域的X偏移量。
 */

/**
 * @property {Number} yOffset 
 * 当场景的虚拟大小大于实际大小时，当前可视区域的Y偏移量。
 */

/**
 * @property {Number} virtualWidth 
 * 当场景的虚拟宽度。
 */

/**
 * @property {Number} virtualHeight 
 * 当场景的虚拟高度。
 */

/**
 * @method setOffset
 * 设置场景可视区左上角的坐标。
 * @param {Number} xOffset 
 * @param {Number} yOffset
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setOffsetPercent 
 * 按百分比设置场景可视区左上角的坐标。
 * @param {Number} xOffsetPercent X方向偏移量百分比(0,100)。
 * @param {Number} yOffsetPercent Y方向偏移量百分比(0,100)。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method setTipsImage
 * 设置提示图片的编号。提示图片通常用于显示游戏玩法之类信息。
 * @param {Number} index index 提示图片的编号，通常是1到5，0表示不显示。
 * @param {Number} display 图片显示方式。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getWorld
 * 获取Box2d的World对象。
 * @return {Object} 获取Box2d的World对象。
 *
 * 参考：http://www.box2dflash.org/docs/2.1a/reference/
 */

/**
 * @method isPlaying
 * 是否处于暂停状态。
 * @return {Boolean} 是否处于暂停状态。
 *
 */

/**
 * @method replay
 * 重置游戏。
 * @return {UIScene} 返回场景本身。
 *
 */

/**
 * @method pause
 * 暂停游戏。
 * @return {UIScene} 返回场景本身。
 *
 */

/**
 * @method resume
 * 恢复游戏。
 * @return {UIScene} 返回场景本身。
 *
 */

/**
 * @method toMeter
 * 把像素转化成米。
 * @param {Number} pixel
 * @return {Number} 米。
 *
 */

/**
 * @method toPixel
 * 把米转化成像素。
 * @param {Number} meter
 * @return {Number} 像素。
 *
 */

/**
 * @method setAutoClearForce
 * 设置是否自动清除作用力。
 * @param {Boolean} autoClearForce 为真则每个时间片断自动清除作用力，否则力会持续作用。
 * @return {UIScene} 返回场景本身。
 *
 */

/**
 * @method setCameraFollowParams 
 * 设置镜头自动跟随的参数。
 * @param {Number} xMin [0-1] 角色的x < this.w * xMin时向左移动。
 * @param {Number} xMax [0-1] 角色的x > this.w * xMax时向右移动。
 * @param {Number} yMin [0-1] 角色的y < this.h * yMin时向上移动。
 * @param {Number} yMax [0-1] 角色的y > this.h * yMax时向下移动。
 * @return {UIScene} 返回场景本身。
 *
 */

