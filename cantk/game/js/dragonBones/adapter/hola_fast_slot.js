(function (dragonBones) {
    /**
     * @class dragonBones.HolaFastSlot
     * @extends dragonBones.Slot
     * @classdesc
     * hola引擎使用的插槽
     */
    function HolaFastSlot(rawDisplay) {
        dragonBones.FastSlot.call(this, rawDisplay);
        this._holaDisplay = null;
    }

    __extends(HolaFastSlot, dragonBones.FastSlot);

    /**
     * 释放资源
     */
    HolaFastSlot.prototype.dispose = function () {
        if (this._displayList) {
            var length = this._displayList.length;
            for (var i = 0; i < length; i++) {
                var content = this._displayList[i];
                if (content instanceof dragonBones.FastArmature) {
                    content.dispose();
                }
            }
        }
        dragonBones.FastSlot.prototype.dispose.call(this);
        this._holaDisplay = null;
    };
    /** @private */
    HolaFastSlot.prototype._updateDisplay = function (value) {
        this._holaDisplay = value;
    };
    /** @private */
    HolaFastSlot.prototype._addDisplay = function () {
        var container = this.armature.display;
        container.addChild(this._holaDisplay);
    };
    /** @private */
    HolaFastSlot.prototype._replaceDisplay = function (prevDisplay) {
        var container = this.armature.display;
        var displayObject = prevDisplay;
        container.addChild(this._holaDisplay);
        container.swapChildren(this._holaDisplay, displayObject);
        container.removeChild(displayObject);
    };
    /** @private */
    HolaFastSlot.prototype._removeDisplay = function () {
        this._holaDisplay.parent.removeChild(this._holaDisplay);
    };
    //Abstract method
    /** @private */
    HolaFastSlot.prototype._getDisplayIndex = function () {
        if (this._holaDisplay && this._holaDisplay.parent) {
            return this._holaDisplay.parent.getChildIndex(this._holaDisplay);
        }
        return -1;
    };
    /** @private */
    HolaFastSlot.prototype._addDisplayToContainer = function (container, index) {
        if (index === void 0) { index = -1; }
        if (!this._holaDisplay) {
            this._holaDisplay = this._rawDisplay;
        }
        if (this._holaDisplay && container) {
            if (index < 0) {
                container.addChild(this._holaDisplay);
            }
            else {
                index = Math.min(index, container.getChildCount());
                container.addChildAt(this._holaDisplay, index);
            }
        }
    };
    /** @private */
    HolaFastSlot.prototype._removeDisplayFromContainer = function () {
        if (this._holaDisplay && this._holaDisplay.parent) {
            this._holaDisplay.parent.removeChild(this._holaDisplay);
        }
    };
    /** @private */
    HolaFastSlot.prototype._updateTransform = function () {
        if (this._displayIndex >= 0) {
            this._holaDisplay.setTransform(this._globalTransformMatrix);
        }
    };
    /** @private */
    HolaFastSlot.prototype._updateDisplayVisible = function (value) {
        if(this._holaDisplay && this._parent){
            this._holaDisplay.visible = this._parent._visible && this._visible && value;
        }
    };
    /** @private */
    HolaFastSlot.prototype._updateDisplayColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChanged) {
        if (colorChanged === void 0) { colorChanged = false; }
        dragonBones.FastSlot.prototype._updateDisplayColor.call(this, aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChanged);
        if (this._holaDisplay) {
            this._holaDisplay.setAlpha(aMultiplier);
        }
    };
    /** @private */
    HolaFastSlot.prototype._updateFrame = function () {
        var dataLength = this._displayDataList.length;
        var textureIndex = this._displayIndex < dataLength ? this._displayIndex : (dataLength - 1);
        var textureData = textureIndex < 0 ? null : this._displayDataList[textureIndex][1];
        var display = this._holaDisplay;
        if (textureData) {
            var textureAtlasTexture = textureData.textureAtlas;
            var displayData = this.displayDataList[this._displayIndex][0];
            var rect = textureData.frame || textureData.region;
            var width = textureData.rotated ? rect.height : rect.width;
            var height = textureData.rotated ? rect.width : rect.height;
            //const pivotX = width * displayData.pivot.x - (textureData.frame ? textureData.frame.x : 0);
            //const pivotY = height * displayData.pivot.y - (textureData.frame ? textureData.frame.y : 0);
            var pivotX = displayData.pivot.x == displayData.pivot.x ? displayData.pivot.x : width * 0.5;
            var pivotY = displayData.pivot.y == displayData.pivot.y ? displayData.pivot.y : height * 0.5;
            if (!display.visible) {
                display.setVisible(true);
            }
            display.setTexture(textureAtlasTexture.getTexture(displayData.name));
            // display.readjustSize();
            display.setAnchorOffset(pivotX, pivotY);
        }
        else {
            if (display.visible) {
                display.setVisible(false);
            }
            display.setTexture(null);
        }
    };
    /** @private */
    HolaFastSlot.prototype._updateDisplayBlendMode = function (value) {
        if (this._holaDisplay && value) {
            this._holaDisplay.blendMode = value;
        }
    };

    dragonBones.HolaFastSlot = HolaFastSlot;
})(dragonBones || (dragonBones = {}));
