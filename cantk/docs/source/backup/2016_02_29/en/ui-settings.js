/**
 * @class UISettings
 * @extends UIElement
 * Makes the game's settings independent. It creates a visible interface in the IDE, so that game development doesn't require the program. These values can be edited to adjust in-game effects (when using, first add a setting with the manage settings dialog).
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
 * Gets the corresponding value of the name setting.
 * @param {String} name 
 * @return {Number} Returns the corresponding value.
 *
 */

/**
 * @method setSetting
 * Sets the corresponding value of the name setting.
 * @param {String} name 
 * @param {Number} value
 * @return {UIElement} Returns element.
 *
 */

