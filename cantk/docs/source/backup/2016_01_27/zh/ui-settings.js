/**
 * @class UISettings
 * @extends UIElement
 * 将游戏的设置独立出来，在IDE中提供一个可视化的界面，让游戏策划不需要程序配合，就可以修改这些数值来调节游戏的效果（使用时先用管理设置对话框中增加设置)。
 *
 *     @example small frame
 *     var settings = this.win.find("settings");
 *
 *     var speed = settings.getSetting("speed");
 *     console.log(speed);
 *
 */

/**
 * @method getSetting
 * 获取name设置对应的值。
 * @param {String} name 
 * @return {Number} 返回对应的值。
 *
 */

/**
 * @method setSetting
 * 设置name设置对应的值。
 * @param {String} name 
 * @param {Number} value
 * @return {UIElement} 返回控件本身。
 *
 */

