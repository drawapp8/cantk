/**
 * @class UISelect
 * @extends UIElement
 * 提供多个选项给用户，让用户选择其中一个。可以用getValue来获取用户选择的值。
 *
 */

/**
 * @event onChanged
 * 用户选择选项时触发本事件。
 * @param {String} value 当前的选项。
 */

/**
 * @method setOptions
 * 设置控件的可选项。
 * @param {Array} options 可选项(字符串数组)。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var selector = this.win.find("select");
 *     selector.setOptions(["one", "two", "three"]);
 *
 */

/**
 * @method getOptions
 * 获取可选项。
 * @return {Array} 返回可选项(字符串数组)。
 */

