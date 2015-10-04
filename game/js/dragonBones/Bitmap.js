var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    /**
     * 创建一个 egret.Bitmap 对象以引用指定的 Texture 对象
     * @param texture {Texture} 纹理
     */
    function Bitmap(texture) {
        _super.call(this);
        this._texture = null;
        this.fillMode = "scale";
        if (texture) {
            this._texture = texture;
            this._setSizeDirty();
        }
        this.needDraw = true;
    }

    Object.defineProperty(Bitmap.prototype, "texture", {
        /**
         * 渲染纹理
         * @member {egret.Texture} egret.Bitmap#texture
         */
        get: function () {
            return this._texture;
        },
        set: function (value) {
            if (value == this._texture) {
                return;
            }
            this._setSizeDirty();
            this._texture = value;
        },
        enumerable: true,
        configurable: true
    })

    Bitmap.prototype._render = function (renderContext) {
        var texture = this._texture;
        if (!texture) {
            this._texture_to_render = null;
            return;
        }
        this._texture_to_render = texture;
        var destW = this._DO_Props_._hasWidthSet ? this._DO_Props_._explicitWidth : texture._textureWidth;
        var destH = this._DO_Props_._hasHeightSet ? this._DO_Props_._explicitHeight : texture._textureHeight;
        Bitmap._drawBitmap(renderContext, destW, destH, this);
    }

    Bitmap._drawBitmap = function (renderContext, destW, destH, thisObject) {
        var texture = thisObject._texture_to_render;
        if (!texture) {
            return;
        }

        var textureWidth = texture._textureWidth;
        var textureHeight = texture._textureHeight;
        var offsetX = texture._offsetX;
        var offsetY = texture._offsetY;
        var bitmapWidth = texture._bitmapWidth || textureWidth;
        var bitmapHeight = texture._bitmapHeight || textureHeight;
        var scaleX = destW / textureWidth;
        offsetX = Math.round(offsetX * scaleX);
        destW = Math.round(bitmapWidth * scaleX);
        var scaleY = destH / textureHeight;
        offsetY = Math.round(offsetY * scaleY);
        destH = Math.round(bitmapHeight * scaleY);
        renderContext.drawImage(texture, texture._bitmapX, texture._bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
    }

    return Bitmap;
})(DisplayObject);
