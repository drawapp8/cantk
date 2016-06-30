/**
 * @class Point
 * Point.
 */

/**
 * @property {Number} x 
 * x coordinate
 */

/**
 * @property {Number} y
 * y coordinate
 */

/**
 * @class Rect 
 * Rectangle.
 */

/**
 * @property {Number} x 
 * x coordinate
 */

/**
 * @property {Number} y
 * y coordinate
 */

/**
 * @property {Number} w
 * Width
 */

/**
 * @property {Number} h
 * Height
 */

/**
 * @class WImage
 * Image object. Contains an HTMLImage object and an area.
 */

/**
 * @method getImage
 * Gets HTMLImage object
 */

/**
 * @method getImageRect
 * Gets image area.
 * @return {Rect} Image area.
 */

/**
 * @class AnimationConfig
 * Animation settings information.
 */

/**
 * @property {Number} delay
 * Delays animation. Time units are in milliseconds (ms).
 */

/**
 * @property {Number} duration
 * Animation duration. Time units are in milliseconds (ms).
 */

/**
 * @property {Number} xStart
 * Element's starting position on the x coordinate.
 */

/**
 * @property {Number} yStart
 * Element's starting position on the y coordinate.。
 */

/**
 * @property {Number} x
 * Element's ending position on the x coordinate.
 */

/**
 * @property {Number} xEnd
 * Element's ending position on the x coordinate.
 */

/**
 * @property {Number} y
 * Element's ending position on the y coordinate.
 */

/**
 * @property {Number} yEnd
 * Element's ending position on the y coordinate.
 */

/**
 * @property {Number} opacityStart
 * Element's transparency starting value (0 - 1).
 */

/**
 * @property {Number} opacity
 * Element's transparency ending value (0 - 1).
 */

/**
 * @property {Number} opacityEnd
 * Element's transparency ending value (0 - 1).
 */

/**
 * @property {Number} rotationStart
 * Element's angle starting value (unit is range).
 */

/**
 * @property {Number} rotation
 * Element's angle ending value (unit is range).
 */

/**
 * @property {Number} rotationEnd
 * Element's angle ending value (unit is range).
 */

/**
 * @property {Number} scaleXStart
 * Element's scaling starting value on the X axis.
 */

/**
 * @property {Number} scaleX
 * Element's scaling ending value on the X axis.
 */

/**
 * @property {Number} scaleXEnd
 * Element's scaling ending value on the X axis.
 */

/**
 * @property {Number} scaleYStart
 * Element's scaling starting value on the Y axis.
 */

/**
 * @property {Number} scaleY
 * Element's scaling ending value on the Y axis.
 */

/**
 * @property {Number} scaleYEnd
 * Element's scaling ending value on the Y axis.
 */

/**
 * @property {Number} scaleStart
 * Element's scaling starting value.
 */

/**
 * @property {Number} scale
 * Element's scaling ending value.
 */

/**
 * @property {Number} scaleEnd
 * Element's scaling ending value.
 */

/**
 * @property {String} interpolator
 * Element's interpolator. Currently supports three types: 'linear', 'bounce', 'accelerate', and 'accelerate-decelerate', which can be written as: 'l', 'b', 'a', and 'ad'.
 */

/**
 * @property {Function} onDone(name)
 * Callback function when the animation is finished. If the parameters' onDone is not empty, prioritizes onDone.
 */

/**
 * @property {String} actionWhenBusy
 * Method for handling this request while the animation is playing. Here, "replace" will replace the current animation, and "append" will append an animation after the current animation.
 */

/**
 * @class Global 
 *
 * Global is no a class, it a global functions set. You can call them by window object or call it directly.
 *
 */

/**
 * @method webappGetText
 * Get the coresponding localization text.
 *
 * In Hola Studio，Tool menu has localization settings, put the translated text in it, usually the engine will automatically setting the text on element to localization text. 
 *
 * Sometimes text needs to be modified dynamicly, for example: Show player's score, you can get text by webappGetText first, then replace the score.
 *
 * @param {String} text 
 * @return {String}  the localization text
 *
 * Example：
 *
 *     @example small frame
 *     var str = webappGetText("Your Scores Is {score}");
 *     str = str.replace(/{score}/, 100);
 *     this.win.find("score", true).setText(str)；
 */

