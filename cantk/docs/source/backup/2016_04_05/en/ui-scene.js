/**
 * @class UIScene
 * @extends UINormalWindow
 * Game scene. Added physics engine and virtual screen support to UINormalWindow.
 *
 */

/**
 * @property {Number} xOffset 
 * When the scene's virtual size is greater than its actual size, this is the X offset value of the current viewable window.
 */

/**
 * @property {Number} yOffset 
 * When the scene's virtual size is greater than its actual size, this is the Y offset value of the current viewable window.
 */

/**
 * @property {Number} virtualWidth 
 * Virtual width of the current scene.
 */

/**
 * @property {Number} virtualHeight 
 * Virtual height of the current scene.
 */

/**
 * @method setOffset
 * Sets the coordinate of the upper-left corner of the scene's viewable area.
 * @param {Number} xOffset 
 * @param {Number} yOffset
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method setOffsetPercent 
 * Set the top left coordinate of scene view area by percentage.
 * @param {Number} xOffsetPercent X offset percentage(0,100).
 * @param {Number} yOffsetPercent Y offset percentage(0,100).
 * @return {UIElement} Returns element.
 */

/**
 * @method setTipsImage
 * Sets the number of the tips image. The tips image is typically used to display information like how to play the game.
 * @param {Number} index index The tips image number. Typically 1 - 5, with 0 meaning hidden.
 * @param {Number} display Image display method.
 * @return {UIElement} Returns element.
 *
 */

/**
 * @method getWorld
 * Gets box2d's World object.
 * @return {Object} Gets box2d's World object.
 *
 * See: http://www.box2dflash.org/docs/2.1a/reference/
 */

/**
 * @method isPlaying
 * Whether it is in a paused state.
 * @return {Boolean} Whether it is in a paused state.
 *
 */

/**
 * @method replay
 * Resets game.
 * @return {UIScene} Returns this scene.
 *
 */

/**
 * @method pause
 * Pauses game.
 * @return {UIScene} Returns this scene.
 *
 */

/**
 * @method resume
 * Resumes game.
 * @return {UIScene} Returns this scene.
 *
 */

/**
 * @method toMeter
 * Converts pixels to meters.
 * @param {Number} pixel
 * @return {Number} Meters.
 *
 */

/**
 * @method toPixel
 * Converts meters to pixels.
 * @param {Number} meter
 * @return {Number} Pixels.
 *
 */

/**
 * @method setAutoClearForce
 * Sets whether to auto-clear force.
 * @param {Boolean} autoClearForce If true, will automatically clear force every time slice. Otherwise, force will continue being applied.
 * @return {UIScene} Returns this scene.
 *
 */

/**
 * @method setCameraFollowParams 
 * Sets auto-follow parameters for the camera.
 * @param {Number} xMin [0-1] When character's x < this.w * xMin, move left.
 * @param {Number} xMax [0-1] When character's x >this.w * xMax, move right
 * @param {Number} yMin [0-1] When character's y < this.w * yMin, move up.
 * @param {Number} yMax [0-1] When character's y > this.w * yMax, move down
 * @return {UIScene} Returns this scene.
 *
 */

