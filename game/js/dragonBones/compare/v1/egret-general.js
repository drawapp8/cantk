var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.EgretSlot
     * @extends dragonBones.Slot
     * @classdesc
     * egret引擎使用的插槽
     */
    var EgretSlot = (function (_super) {
        __extends(EgretSlot, _super);
        /**
         * 创建一个新的 EgretSlot 实例
         */
        function EgretSlot() {
            _super.call(this, this);
            this._egretDisplay = null;
        }
        /**
         * 释放资源
         */
        EgretSlot.prototype.dispose = function () {
            if (this._displayList) {
                var length = this._displayList.length;
                for (var i = 0; i < length; i++) {
                    var content = this._displayList[i];
                    if (content instanceof Armature) {
                        content.dispose();
                    }
                }
            }
            _super.prototype.dispose.call(this);
            this._egretDisplay = null;
        };
        /** @private */
        EgretSlot.prototype._updateDisplay = function (value) {
            this._egretDisplay = value;
        };
        //Abstract method
        /** @private */
        EgretSlot.prototype._getDisplayIndex = function () {
            if (this._egretDisplay && this._egretDisplay.parent) {
                return this._egretDisplay.parent.getChildIndex(this._egretDisplay);
            }
            return -1;
        };
        /** @private */
        EgretSlot.prototype._addDisplayToContainer = function (container, index) {
            if (index === void 0) {
                index = -1;
            }
            var egretContainer = container;
            if (this._egretDisplay && egretContainer) {
                if (index < 0) {
                    egretContainer.addChild(this._egretDisplay);
                }
                else {
                    egretContainer.addChildAt(this._egretDisplay, Math.min(index, egretContainer.numChildren));
                }
            }
        };
        /** @private */
        EgretSlot.prototype._removeDisplayFromContainer = function () {
            if (this._egretDisplay && this._egretDisplay.parent) {
                this._egretDisplay.parent.removeChild(this._egretDisplay);
            }
        };
        /** @private */
        EgretSlot.prototype._updateTransform = function () {
            if (this._egretDisplay) {
                this._egretDisplay.__hack_local_matrix = this._globalTransformMatrix;
            }
        };
        /** @private */
        EgretSlot.prototype._updateDisplayVisible = function (value) {
            if (this._egretDisplay && this._parent) {
                this._egretDisplay.visible = this._parent._visible && this._visible && value;
            }
        };
        /** @private */
        EgretSlot.prototype._updateDisplayColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange) {
            if (colorChange === void 0) {
                colorChange = false;
            }
            _super.prototype._updateDisplayColor.call(this, aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange);
            if (this._egretDisplay) {
                this._egretDisplay.alpha = aMultiplier;
            }
        };
        /** @private */
        EgretSlot.prototype._updateDisplayBlendMode = function (value) {
            if (this._egretDisplay && value) {
                this._egretDisplay.blendMode = value;
            }
        };
        EgretSlot.prototype._calculateRelativeParentTransform = function () {
            this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
            this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
            this._global.skewX = this._origin.skewX + this._offset.skewX;
            this._global.skewY = this._origin.skewY + this._offset.skewY;
            this._global.x = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
            this._global.y = this._origin.y + this._offset.y + this._parent._tweenPivot.y;
            if (this._displayDataList &&
                this._currentDisplayIndex >= 0 &&
                this._displayDataList[this._currentDisplayIndex] &&
                dragonBones.EgretTextureAtlas.rotatedDic[this._displayDataList[this._currentDisplayIndex].name] == 1) {
                this._global.skewX -= 1.57;
                this._global.skewY -= 1.57;
            }
        };
        return EgretSlot;
    })(dragonBones.Slot);
    dragonBones.EgretSlot = EgretSlot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.EgretFactory
     * @extends dragonBones.BaseFactory
     * @classdesc
     * Egret引擎中DragonBones工厂的基类实现
     */
    var EgretFactory = (function (_super) {
        __extends(EgretFactory, _super);
        function EgretFactory() {
            _super.call(this, this);
        }
        /** @private */
        EgretFactory.prototype._generateArmature = function () {
        	//var display = {};
            var armature = new dragonBones.Armature(new DisplayObjectContainer());
            //var armature = new dragonBones.Armature(display);
            //return armatureInit(armature);
            return armature;
        };
        /** @private */
        EgretFactory.prototype._generateSlot = function () {
            var slot = new dragonBones.EgretSlot();
            return slot;
        };
        /** @private */
        EgretFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
            var bitmap = new Bitmap();
            //var bitmap = {};
            //var rect = textureAtlas.getRegion(fullName);
            bitmap.texture = textureAtlas.getTexture(fullName);
            if (isNaN(pivotX) || isNaN(pivotY)) {
                var subTextureFrame = (textureAtlas).getFrame(fullName);
                if (subTextureFrame != null) {
                    pivotX = subTextureFrame.width / 2 + subTextureFrame.x;
                    pivotY = subTextureFrame.height / 2 + subTextureFrame.y;
                }
                else {
                    pivotX = bitmap.width / 2;
                    pivotY = bitmap.height / 2;
                }
            }
            else {
                if (subTextureFrame != null) {
                    pivotX += subTextureFrame.x;
                    pivotY += subTextureFrame.y;
                }
            }
            bitmap.textureAtlas = textureAtlas;
            //bitmap.textureAtlasRect = rect;
            bitmap.anchorOffsetX = pivotX;
            bitmap.anchorOffsetY = pivotY;
            return bitmap;
        };
        return EgretFactory;
    })(dragonBones.BaseFactory);
    dragonBones.EgretFactory = EgretFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @class dragonBones.EgretTextureAtlas
     * @implements dragonBones.ITextureAtlas
     * @classdesc
     * egret引擎使用的纹理集
     */
    var EgretTextureAtlas = (function () {
        /**
         * 创建一个新的EgretTextureAtlas实例
         * @param texture 纹理集
         * @param textureAtlasRawData 纹理集数据
         * @param scale 缩放
         */
        function EgretTextureAtlas(texture, textureAtlasRawData, scale) {
            if (scale === void 0) { scale = 1; }
            this.texture = texture;
            this.textureAtlasRawData = textureAtlasRawData;
            this._textureDatas = {};
            this.scale = scale;
            this.name = textureAtlasRawData[dragonBones.ConstValues.A_NAME];
            this.parseData(textureAtlasRawData);
            this.spriteSheet = new SpriteSheet(texture);
        }
        /**
         * 根据名字获取纹理
         * @param fullName 纹理的名字
         * @returns {egret.Texture} 获取到的纹理
         */
        EgretTextureAtlas.prototype.getTexture = function (fullName) {
            var result = this.spriteSheet.getTexture(fullName);
            if (!result) {
                var data = this._textureDatas[fullName];
                if (data) {
                    result = this.spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height);
                    if (data.rotated) {
                        EgretTextureAtlas.rotatedDic[fullName] = 1;
                    }
                }
            }
            return result;
        };
        /**
         * 释放资源
         */
        EgretTextureAtlas.prototype.dispose = function () {
            this.texture = null;
        };
        /**
         * 根据子纹理的名字获取子纹理所在的实际矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 子纹理所在的矩形区域
         */
        EgretTextureAtlas.prototype.getRegion = function (subTextureName) {
            var textureData = this._textureDatas[subTextureName];
            if (textureData && textureData instanceof dragonBones.TextureData) {
                return textureData.region;
            }
            return null;
        };
        /**
         * 根据子纹理的名字获取子纹理所在的真实矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 子纹理所在的矩形区域
         */
        EgretTextureAtlas.prototype.getFrame = function (subTextureName) {
            var textureData = this._textureDatas[subTextureName];
            if (textureData && textureData instanceof TextureData) {
                return textureData.frame;
            }
            return null;
        };
        EgretTextureAtlas.prototype.parseData = function (textureAtlasRawData) {
            this._textureDatas = dragonBones.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
        };
        EgretTextureAtlas.rotatedDic = {};
        return EgretTextureAtlas;
    })();
    dragonBones.EgretTextureAtlas = EgretTextureAtlas;
})(dragonBones || (dragonBones = {}));
