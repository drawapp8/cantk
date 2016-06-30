/**
 * @class HolaSDK
 * HolaSDK. Ad, sharing, and statistics APIs.
 *
 * All functions are directly called with the HolaSDK Example:
 * 
 *     @example small frame
 *     HolaSDK.exit()
 *
 */

/**
 * @method showAd
 * Show ad (typically doesn't need to be called directly).
 * @param {String} placementID Position ID.
 * @param {Number} placementType Class. 
 * @param {Number} impressionTime Display time.
 * @param {Boolean} closable Whether it can be closed.
 *
 */

/**
 * @method closeAd
 * Close ad (typically doesn't need to be called directly).
 */

/**
 * @method share
 * Share (all you need to do is fill out the corresponding parameters in the Share button's Click event).
 * @param {String} title Title.
 * @param {String} description Desc.
 * @param {String} link Link.
 * @param {String} icon Icon.
 *
 */

/**
 * @method sendBarrage
 * Post comment.
 * @param {Number} score Current number of points. 
 * @param {Number} level Current level.
 * @param {Number} duration Game time (in ms).
 *
 */

/**
 * @method ping
 * Update game status.
 * @param {Number} score Current number of points. 
 * @param {Number} level Current level.
 * @param {Number} duration Game time (in ms).
 *
 */

/**
 * @method whenPaused
 * Callback function to register a pause event.
 * @param {Function} callback 
 *
 */

/**
 * @method whenResumed
 * Callback function to register an unpause event.
 * @param {Function} callback 
 *
 */

/**
 * @method whenRestarted
 * Callback function to register a replay event. This event is fired when the "replay" button on the console is pressed.
 * @param {Function} callback 
 *
 */

/**
 * @method gameStarted
 * Called when the game begins (used to update statistic information).
 * @param {Number} level Current level.
 *
 */

/**
 * @method gamePaused
 * Called when the game is paused (used to update statistic information).
 *
 */

/**
 * @method gameResumed
 * Called when the game is unpaused (used to update statistic information).
 *
 */

/**
 * @method gameOver
 * Called when the game ends (used to update statistic information).
 * @param {Number} score Current number of points. 
 * @param {Number} level Current level.
 * @param {Number} duration Game time (in ms).
 *
 */

/**
 * @method exit
 * Exits game and returns to lobby.
 *
 */

