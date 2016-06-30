function SpriteSheet(texture, scale) {
    this.srcX = 0;
    this.srcY = 0;
    this.scale = scale;
    this.textureMap = {};
    this.srcTexture = texture;
    this.srcWidth = texture.width;
    this.srcHeight = texture.height;
}

SpriteSheet.prototype.getTexture = function(name) {
    return this.srcTexture[name];
};

SpriteSheet.prototype.createTexture = function(name, dstX, dstY, dstW, dstH, offsetX, offsetY, srcW, srcH) {
    var newTexture;

    if (offsetX === void 0 || offsetX == 0) { offsetX = 0; }
    if (offsetY === void 0 || offsetY == 0) { offsetY = 0; }

    if (srcW === undefined) {
        srcW = offsetX + dstW;
    }

    if (srcH === undefined) {
        srcH = offsetY + dstH;
    }

    newTexture = Object.create(null);
    newTexture.sx = this.srcX + dstX;
    newTexture.sy = this.srcY + dstY;
    newTexture.sw = dstW * this.scale;
    newTexture.sh = dstH * this.scale;
    newTexture.dx = offsetX;
    newTexture.dy = offsetY;
    newTexture.dw = srcW * this.scale;
    newTexture.dh = srcH * this.scale;

    newTexture.name = name;
    newTexture.texture = this.srcTexture;
    this.textureMap[name] = newTexture;

    return newTexture;
};

SpriteSheet.prototype.dispose = function() {
    if(this.texture) {
        this.texture.dispose();
    }
};

function HolaTextureAtlas(texture, textureAtlasRawData, scale) {
    if (scale === void 0) { scale = 1; }
    this.scale = scale;
    this.texture = texture;
    this.textureDatas = {};
    this.textureAtlasRawData = textureAtlasRawData;
    this.name = textureAtlasRawData[dragonBones.ConstValues.A_NAME];
    this.parseData(textureAtlasRawData);
    this.spriteSheet = new SpriteSheet(texture, scale);
}

/**
*解析纹理数据
*/
HolaTextureAtlas.prototype.parseData = function (textureAtlasRawData) {
    this.textureDatas = dragonBones.DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
};

/**
*根据名字获取纹理
*/
HolaTextureAtlas.prototype.getTexture = function (fullName) {
    var result = this.spriteSheet.getTexture(fullName);
    if (!result) {
        var data = this.textureDatas[fullName];
        if (data) {
            var frame = data.frame;
            if (frame) {
                result = this.spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height, -frame.x, -frame.y, frame.width, frame.height);
            }
            else {
                result = this.spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height);
            }
            if (data.rotated) {
                HolaTextureAtlas.rotatedDic[fullName] = 1;
            }
        }
    }
    return result;
};

/**
* 释放资源
*/
HolaTextureAtlas.prototype.dispose = function () {
    this.texture = null;
};

/**
*根据子纹理的名字获取子纹理所在的实际矩形区域
*/
HolaTextureAtlas.prototype.getRegion = function (subTextureName) {
    var textureData = this.textureDatas[subTextureName];
    if (textureData && textureData instanceof dragonBones.TextureData) {
        return textureData.region;
    }
    return null;
};

/**
*根据子纹理的名字获取子纹理所在的真实矩形区域
*/
HolaTextureAtlas.prototype.getFrame = function (subTextureName) {
    var textureData = this.textureDatas[subTextureName];
    if (textureData && textureData instanceof dragonBones.TextureData) {
        return textureData.frame;
    }
    return null;
};

/**
* 根据子纹理的名字获取子纹理数据
*/
HolaTextureAtlas.prototype.getTextureData = function (subTextureName) {
    return this.textureDatas[subTextureName];
};

HolaTextureAtlas.rotatedDic = {};

dragonBones = dragonBones || {};
dragonBones.HolaTextureAtlas = HolaTextureAtlas;
