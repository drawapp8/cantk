/**
 * @class UISkeletonAnimation
 * @extends UIElement
 * 骨骼动画。目前支持[DragonBones](https://github.com/DragonBones)和[Spine](https://github.com/EsotericSoftware/spine-runtimes)两种格式。
 */

/**
 * @method play
 * 播放动画。
 * @param {String} name 动作名称。
 * @param {Number} repeatTimes 播放次数。
 * @param {Function} onDone (可选) 播放指定次数后的回调函数。
 * @param {Function} onOneCycle (可选) 每播放一次的回调函数。
 * @param {Number} useFadeIn (可选) 启用渐变。
 * @return {Object} 返回Promise
 *
 */

/**
 * @method setSkeletonJsonURL
 * 设置骨骼动画的JSON URL。需要调用reload才能生效。
 * @param {String} skeletonJsonURL 骨骼动画的JSON URL。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getSkeletonJsonURL
 * 获取骨骼动画的JSON URL。
 * @return {String} 返回骨骼动画的JSON URL。
 */

/**
 * @method setTextureJsonURL
 * 设置骨骼动画的纹理集的JSON/ATLAS URL。需要调用reload才能生效。
 * @param {String} textureJsonURL 骨骼动画的纹理集的JSON/ATLAS URL。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getTextureJsonURL
 * 获取骨骼动画的纹理集的JSON/ATLAS URL。
 * @return {String} 返回骨骼动画的纹理集的JSON/ATLAS URL。
 */

/**
 * @method setTextureURL
 * 设置骨骼动画的纹理图片的URL。需要调用reload才能生效。
 * @param {String} textureURL 骨骼动画的纹理图片的URL。
 * @return {UIElement} 返回控件本身。
 */

/**
 * @method getTextureURL
 * 获取骨骼动画的纹理图片的URL。
 * @return {String} 返回骨骼动画的纹理图片的URL。
 */

/**
 * @method reload
 * 修改骨骼动画的URL后，需要调用本函数重新载入新的数据。
 * @return {UIElement} 返回控件本身。
 *
 *     @example small frame
 *     var dragonbones = this.win.dragonbones;
 *     var assets = this.win.assets;
 *
 *     dragonbones.setSkeletonJsonURL(assets.getAssetURL("Robot.json"));
 *     dragonbones.setTextureJsonURL(assets.getAssetURL("texture.json"));
 *     dragonbones.setTextureURL(assets.getAssetURL("texture.png"));
 *     dragonbones.reload();
 */

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method resume
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getAnimationDuration
 * 获取指定动作的时长。
 * @param {String} animaName 动作名称。
 * @return {UIElement} 返回指定动画的时长。
 *
 */

/**
 * @method getAnimationName
 * 获取当前播放动画得名称。
 * @return {String} 返回当前播放的动画名称
 *
 */

/**
 * @method setTimeScale
 * 设置时间缩放比例, 小于1变慢，大于1变快。
 * @param {Number} animTimeScale 时间缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method setSkin
 * 设置当前皮肤的名称。
 * @param {String} skinName 皮肤的名称。
 * @return {UIElement} 返回控件本身。
 *
 */

/**
 * @method getSkin
 * 获取当前皮肤的名称。
 * @return {String} 返回当前皮肤的名称。
 *
 */

