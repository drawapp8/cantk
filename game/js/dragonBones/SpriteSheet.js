/**
 * @class egret.SpriteSheet
 * @classdesc SpriteSheet 是一张由多个子位图拼接而成的集合位图，它包含多个 Texture 对象。
 * 每一个 Texture 都共享 SpriteSheet 的集合位图，但是指向它的不同的区域。
 * 在WebGL / OpenGL上，这种做法可以显著提升性能
 * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
 * SpriteSheet 格式的具体规范可以参见此文档  https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
 * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=135&terms1_id=25&terms2_id=31 纹理集的使用
 * @includeExample egret/display/SpriteSheet.ts
 */
var SpriteSheet = (function () {
    /**
     * 创建一个 egret.SpriteSheet 对象
     * @param texture {Texture} 纹理
     */
    function SpriteSheet(texture) {
        /**
         * 表示bitmapData.width
         */
        this._sourceWidth = 0;
        /**
         * 表示bitmapData.height
         */
        this._sourceHeight = 0;
        /**
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置x。
         */
        this._bitmapX = 0;
        /**
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置y。
         */
        this._bitmapY = 0;
        /**
         * 纹理缓存字典
         */
        this._textureMap = {};
        this.texture = texture;
        this._sourceWidth = texture.width;
        this._sourceHeight = texture.height;
        this._bitmapX = 0;//texture._bitmapX - texture._offsetX;
        this._bitmapY = 0;//texture._bitmapY - texture._offsetY;
    }
    var __egretProto__ = SpriteSheet.prototype;
    /**
     * 根据指定纹理名称获取一个缓存的 Texture 对象
     * @method egret.SpriteSheet#getTexture
     * @param name {string} 缓存这个 Texture 对象所使用的名称
     * @returns {egret.Texture} Texture 对象
     */
    __egretProto__.getTexture = function (name) {
        return this._textureMap[name];
    };
    /**
     * 为 SpriteSheet 上的指定区域创建一个新的 Texture 对象并缓存它
     * @method egret.SpriteSheet#createTexture
     * @param name {string} 缓存这个 Texture 对象所使用的名称，如果名称已存在，将会覆盖之前的 Texture 对象
     * @param bitmapX {number} 纹理区域在 bitmapData 上的起始坐标x
     * @param bitmapY {number} 纹理区域在 bitmapData 上的起始坐标y
     * @param bitmapWidth {number} 纹理区域在 bitmapData 上的宽度
     * @param bitmapHeight {number} 纹理区域在 bitmapData 上的高度
     * @param offsetX {number} 原始位图的非透明区域 x 起始点
     * @param offsetY {number} 原始位图的非透明区域 y 起始点
     * @param textureWidth {number} 原始位图的高度，若不传入，则使用 bitmapWidth 的值。
     * @param textureHeight {number} 原始位图的宽度，若不传入，则使用 bitmapHeight 的值。
     * @returns {egret.Texture} 创建的 Texture 对象
     */
    __egretProto__.createTexture = function (name, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (typeof textureWidth === "undefined") {
            textureWidth = offsetX + bitmapWidth;
        }
        if (typeof textureHeight === "undefined") {
            textureHeight = offsetY + bitmapHeight;
        }

        var texture = new Object();
        texture._bitmapData = this.texture;
        var scale = MainContext.instance.texture_scale_factor;
        texture._bitmapX = this._bitmapX + bitmapX;
        texture._bitmapY = this._bitmapY + bitmapY;
        texture._bitmapWidth = bitmapWidth * scale;
        texture._bitmapHeight = bitmapHeight * scale;
        texture._offsetX = offsetX;
        texture._offsetY = offsetY;
        texture._textureWidth = textureWidth * scale;
        texture._textureHeight = textureHeight * scale;
        texture._sourceWidth = this._sourceWidth;
        texture._sourceHeight = this._sourceHeight;
        this._textureMap[name] = texture;
        return texture;
    };
    /**
     * 销毁 SpriteSheet 对象所持有的纹理对象
     * @method egret.SpriteSheet#dispose
     */
    __egretProto__.dispose = function () {
        if (this.texture) {
            this.texture.dispose();
        }
    };
    return SpriteSheet;
})();
