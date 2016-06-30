/**
 * @class UITile
 * @extends UIElement
 * 是瓦片游戏地图控件，只需要放一个UITile到场景中，地图自动与场景关联。UITile支持由Map Editor Tiled制作的地图。场景中有多个地图时，可以通过UITile的setEnable函数，或用场景的setMap来设置场景当前的地图。
 *
 * 注意：
 *
 * 1.在新建地图时请选择CSV格式作为tile layer format，保存时使用JSON格式保存，图片与数据放在同一目录下。
 *
 * 2.JSON数据中的图片名不能带路径。
 *
 * 3.启用物理引擎的方法：在tiled中新建立一个图层，给图层加几个自定义的属性。physics为true表示启用物理引擎，friction表示刚体的摩擦力系数，restitution表示刚体的弹力系数。
 *
 * 参考：http://www.mapeditor.org
 *
 */

/**
 * @method getMapWidth
 * 获取地图的宽度。
 * @return {Number} 返回地图的宽度。
 *
 */

/**
 * @method getMapHeight
 * 获取地图的高度。
 * @return {Number} 返回地图的高度。
 *
 */

/**
 * @method getLayerNr
 * 获取地图的层数。
 * @return {Number} 返回地图的层数。
 *
 */

/**
 * @method getLayerByIndex
 * 获取地图某层的数据。
 * @param {Number} index 层数索引。
 * @return {Object} 返回地图某层的数据。layer.info里是tiled生成的原始数据。
 *
 */

/**
 * @method setClipRegion
 * 只显示指定区域的地图。有的游戏中只显示玩家视力范围类的地图，这时可以用本函数实现。
 * @param {Array} rects
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var tile = this.win.find("tile");
 *     tile.setClipRegion([{x:40, y:50, w:100, h:200},{x:200, y:200, w:100, h:200}]);
 */

