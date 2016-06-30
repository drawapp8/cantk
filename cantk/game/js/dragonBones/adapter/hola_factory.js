(function (dragonBones) {
    /**
     * @class dragonBones.HolaFactory
     * @extends dragonBones.BaseFactory
     * @classdesc
     * Hola引擎中DragonBones工厂的基类实现
    */
    function HolaFactory() {
        dragonBones.BaseFactory.call(this);
    }
    __extends(HolaFactory, dragonBones.BaseFactory);

    /**
     *创建骨架
     */
    HolaFactory.prototype._generateArmature = function () {
        return new dragonBones.Armature(DisplayObjectContainer.create());
    };

    /**
     *创建插槽
     */
    HolaFactory.prototype._generateSlot = function () {
        return new dragonBones.HolaSlot();
    };

    /**
     *创建显示对象
     */
    HolaFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
        var texture = textureAtlas.getTexture(fullName);
        var bitmap = Bitmap.create(fullName);
        bitmap.setTexture(texture);
        if (isNaN(pivotX) || isNaN(pivotY)) {
            var subTextureFrame = (textureAtlas).getFrame(fullName);
            if (subTextureFrame != null) {
                pivotX = subTextureFrame.width / 2;
                pivotY = subTextureFrame.height / 2;
            }
            else {
                pivotX = bitmap.width / 2;
                pivotY = bitmap.height / 2;
            }
        }
        bitmap.setAnchorOffset(pivotX, pivotY);
        return bitmap;
    };

    /**
    *创建快速版本骨架
    */
    HolaFactory.prototype._generateFastArmature = function () {
        return new dragonBones.FastArmature(DisplayObjectContainer.create());
    };

    /**
    *创建快速版本插槽
    */
    HolaFactory.prototype._generateFastSlot = function () {
        return new dragonBones.HolaFastSlot(Bitmap.create());
    };

    /**
    *创建蒙皮
    */
    HolaFactory.prototype._generateMesh = function (textureAtlas, fullName, meshData, slot) {
        if (egret.Capabilities.renderMode == "webgl") {
            var mesh = new egret.Mesh();
            var meshNode = mesh.$renderNode;
            mesh.texture = textureAtlas.getTexture(fullName);
            var i = 0, iD = 0, l = 0;
            for (i = 0, l = meshData.numVertex; i < l; i++) {
                iD = i * 2;
                var dbVertexData = meshData.vertices[i];
                meshNode.uvs[iD] = dbVertexData.u;
                meshNode.uvs[iD + 1] = dbVertexData.v;
                meshNode.vertices[iD] = dbVertexData.x;
                meshNode.vertices[iD + 1] = dbVertexData.y;
            }
            for (i = 0, l = meshData.triangles.length; i < l; i++) {
                meshNode.indices[i] = meshData.triangles[i];
            }
            slot.isMeshEnabled = true;
            return mesh;
        }
        var bitmap = new egret.Bitmap();
        bitmap.texture = textureAtlas.getTexture(fullName);
        var subTextureFrame = (textureAtlas).getFrame(fullName);
        var pivotX = 0, pivotY = 0;
        if (subTextureFrame != null) {
            pivotX = subTextureFrame.width / 2;
            pivotY = subTextureFrame.height / 2;
        }
        else {
            pivotX = bitmap.width / 2;
            pivotY = bitmap.height / 2;
        }
        bitmap.anchorOffsetX = pivotX;
        bitmap.anchorOffsetY = pivotY;
        return bitmap;
    };

    dragonBones.HolaFactory = HolaFactory;
})(dragonBones || (dragonBones = {}));
