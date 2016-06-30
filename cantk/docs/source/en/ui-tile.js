/**
 * @class UITile
 * @extends UIElement
 * A tile game map element. If a map is placed in a UITile scene, it will automatically be linked with the scene. UITile supports maps created with Map Editor Tiled. When multiple maps are in a scene, the UITile's SetEnable function can be used, or the scene's setMap settings can be used to set the current map.
 *
 * Note:
 *
 * 1. When creating a new map choose the CSV format for tile layer format. When saving, save in a JSON format. The image and data will be placed in the same folder.
 *
 * 2. the image name in JSON data can't contains directory.
 *
 * 3. To start the physics engine: Create an image layer in tiled, then add some custom properties to the layer. When physics = true, the physics engine will be enabled. Friction indicates the friction index; restitution indicates the elasticity index.
 *
 * See: http://www.mapeditor.org
 *
 */

/**
 * @method getMapWidth
 * Gets the maps width.
 * @return {Number} Returns the maps width.
 *
 */

/**
 * @method getMapHeight
 * Gets the maps height.
 * @return {Number} Returns the maps height.
 *
 */

/**
 * @method getLayerNr
 * Gets the number of map layers.
 * @return {Number} Returns the number of map layers.
 *
 */

/**
 * @method getLayerByIndex
 * Gets data from a specific map layer.
 * @param {Number} index Layer index.
 * @return {Object} Returns data from a specific map layer. layer.info is raw data created by tiled.
 *
 */

/**
 * @method setClipRegion
 * Only displays the map of a specific area. Some games will only display the map in the player's range of vision. This can be achieved with this function.
 * @param {Array} rects
 * @return {UIElement} Returns element.
 *
 *     @example small frame
 *     var tile = this.win.find("tile");
 *     tile.setClipRegion([{x:40, y:50, w:100, h:200},{x:200, y:200, w:100, h:200}]);
 */

