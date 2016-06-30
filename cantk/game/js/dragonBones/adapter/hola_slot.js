(function (dragonBones) {
    /**
     * hola引擎使用的插槽
     */

    function HolaSlot() {
        dragonBones.Slot.call(this);
        this._holaDisplay = null;
    }
    __extends(HolaSlot, dragonBones.Slot);

    /**
     * 释放资源
     */
    HolaSlot.prototype.dispose = function() {
        if (this._displayList) {
            var length = this._displayList.length;
            for (var i = 0; i < length; i++) {
                var content = this._displayList[i];
                if (content instanceof dragonBones.Armature) {
                    content.dispose();
                }
            }
        }
        dragonBones.Slot.prototype.dispose.call(this);
        this._holaDisplay = null;
    };

    /**
     *更新显示对象
     */
    HolaSlot.prototype._updateDisplay = function (value) {
        this._holaDisplay = value;
    };

    /**
     *获取显示对象索引
     */
    HolaSlot.prototype._getDisplayIndex = function () {
        if (this._holaDisplay && this._holaDisplay.parent) {
            return this._holaDisplay.parent.getChildIndex(this._holaDisplay);
        }
        return -1;
    };

    /**
     *添加显示对象到容器
     */
    HolaSlot.prototype._addDisplayToContainer = function (container, index) {
        if (index === void 0) {
            index = -1;
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

    /**
     *移除当前显示对象
     */
    HolaSlot.prototype._removeDisplayFromContainer = function () {
        if (this._holaDisplay) {
            var parent = this._holaDisplay.getParent();
            if(parent) {
                parent.removeChild(this._holaDisplay);
            }
        }
    };

    /**
     *更新显示对象矩阵
     */
    HolaSlot.prototype._updateTransform = function () {
        if(this._holaDisplay) {
            this._holaDisplay.setTransform(this._globalTransformMatrix);
        }
    };

    /**
     *设置显示对象可见性(当插槽以及插槽上的骨骼可见时，显示对象可见)
     */
    HolaSlot.prototype._updateDisplayVisible = function (value) {
        if (this._holaDisplay && this._parent) {
            this._holaDisplay.setVisible(this._parent._visible && this._visible && value);
        }
    };

    /**
     *显示对象颜色变换
     */
    HolaSlot.prototype._updateDisplayColor = function (aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange) {
        if (colorChange === void 0) {
            colorChange = false;
        }
        dragonBones.Slot.prototype._updateDisplayColor.call(this, aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier, colorChange);
        if (this._holaDisplay) {
            this._holaDisplay.setAlpha(aMultiplier);
        }
    };

    /**
     *设置显示对象混合模式
     */
    HolaSlot.prototype._updateDisplayBlendMode = function (value) {
        if (this._holaDisplay && value) {
            this._holaDisplay.setBlend(value);
        }
    };

    /**
     *更新相对父节点的矩阵变换
     */
    HolaSlot.prototype._calculateRelativeParentTransform = function () {
        this._global.scaleX = this._origin.scaleX * this._offset.scaleX;
        this._global.scaleY = this._origin.scaleY * this._offset.scaleY;
        this._global.skewX = this._origin.skewX + this._offset.skewX;
        this._global.skewY = this._origin.skewY + this._offset.skewY;
        this._global.x = this._origin.x + this._offset.x + this._parent._tweenPivot.x;
        this._global.y = this._origin.y + this._offset.y + this._parent._tweenPivot.y;
        if (this._displayDataList &&
            this._currentDisplayIndex >= 0 &&
            this._displayDataList[this._currentDisplayIndex] &&
            dragonBones.HolaTextureAtlas.rotatedDic[this._displayDataList[this._currentDisplayIndex].name] == 1) {
            this._global.skewX -= 1.57;
            this._global.skewY -= 1.57;
        }
    };

    /**
     *更新蒙皮
     */
    HolaSlot.prototype._updateMesh = function () {
        if (!this._meshData || !this.isMeshEnabled) {
            return;
        }
        var mesh = this._holaDisplay;
        var meshNode = mesh.$renderNode;
        var i = 0, iD = 0, l = 0;
        var xG = 0, yG = 0;
        if (this._meshData.skinned) {
            var bones = this._armature.getBones(false);
            var iF = 0;
            for (i = 0, l = this._meshData.numVertex; i < l; i++) {
                var vertexBoneData = this._meshData.vertexBones[i];
                var j = 0;
                var xL = 0;
                var yL = 0;

                iD = i * 2;
                xG = 0;
                yG = 0;
                for (var iB = 0, lB = vertexBoneData.indices.length; iB < lB; ++iB) {
                    var boneIndex = vertexBoneData.indices[iB];
                    var bone = this._meshBones[boneIndex];
                    var matrix = bone._globalTransformMatrix;
                    var point = vertexBoneData.vertices[j];
                    var weight = Number(vertexBoneData.weights[j]);
                    if (!this._ffdVertices || iF < this._ffdOffset || iF >= this._ffdVertices.length) {
                        xL = point.x;
                        yL = point.y;
                    }
                    else {
                        xL = point.x + this._ffdVertices[iF];
                        yL = point.y + this._ffdVertices[iF + 1];
                    }
                    xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                    yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                    j++;
                    iF += 2;
                }
                meshNode.vertices[iD] = xG;
                meshNode.vertices[iD + 1] = yG;
            }
                mesh.$updateVertices();
                mesh.$invalidateTransform();
        }
        else if (this._ffdChanged) {
            this._ffdChanged = false;
            for (i = 0, l = this._meshData.numVertex; i < l; ++i) {
                var vertexData = this._meshData.vertices[i];
                iD = i * 2;
                if (!this._ffdVertices || iD < this._ffdOffset || iD >= this._ffdVertices.length) {
                    xG = vertexData.x;
                    yG = vertexData.y;
                }
                else {
                    xG = Number(vertexData.x) + this._ffdVertices[iD - this._ffdOffset];
                    yG = Number(vertexData.y) + this._ffdVertices[iD - this._ffdOffset + 1];
                }
                meshNode.vertices[iD] = xG;
                meshNode.vertices[iD + 1] = yG;
            }
            mesh.$updateVertices();
            mesh.$invalidateTransform();
        }
    };

    dragonBones.HolaSlot = HolaSlot;
})(dragonBones || (dragonBones = {}));
