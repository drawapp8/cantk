/*
 * File:   ui-skeleton-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  SkelentonAnimation
 *
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 *
 */

/**
 * @class UISkeletonAnimation
 * @extends UIElement
 * 骨骼动画。目前支持[DragonBones](https://github.com/DragonBones)和[Spine](https://github.com/EsotericSoftware/spine-runtimes)两种格式。
 */
function UISkeletonAnimation() {
	return;
}

UISkeletonAnimation.prototype = new UIElement();
UISkeletonAnimation.prototype.isUISkeletonAnimation = true;

UISkeletonAnimation.prototype.saveProps = ["enableCache", "animationName", "skinName", "animationScaleX", "animationScaleY",
"textureJsonURL", "skeletonJsonURL", "textureURL"];

UISkeletonAnimation.prototype.urlProps = ["textureJsonURL", "skeletonJsonURL", "textureURL"];

UISkeletonAnimation.prototype.initUISkeletonAnimation = function(type, w, h) {
	this.initUIElement(type);

	this.setDefSize(w, h);
	this.setSizeLimit(50, 50);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onDoubleClick", "onUpdateTransform", "onLoadDone"]);

	this.animTimeScale = 1;
	this.animationScaleX = 1;
	this.animationScaleY = 1;
	this.animationNames = [];

	return this;
}

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
UISkeletonAnimation.prototype.play = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn, duration) {
	var me = this;

    if(me.loadDataDone !== true) {
        this.initPlayArgs = [].slice.call(arguments);
        return;
    }

	var deferred = Deferred();
	this.resume();
	this.doPlay(animationName, repeatTimes, function() {
		if(typeof onDone === 'function') {
			onDone.call(me);
		}
		deferred.resolve();
	}, function() {
		if(typeof onOneCycle === 'function') {
			onOneCycle.call(me);
		}
	}, useFadeIn, duration);

	return deferred.promise;
};


/**
 * @method setSkeletonJsonURL
 * 设置骨骼动画的JSON URL。需要调用reload才能生效。
 * @param {String} skeletonJsonURL 骨骼动画的JSON URL。
 * @return {UIElement} 返回控件本身。
 */
UISkeletonAnimation.prototype.setSkeletonJsonURL = function(skeletonJsonURL) {
	this.skeletonJsonURL = skeletonJsonURL;

	return this;
}

/**
 * @method getSkeletonJsonURL
 * 获取骨骼动画的JSON URL。
 * @return {String} 返回骨骼动画的JSON URL。
 */
UISkeletonAnimation.prototype.getSkeletonJsonURL = function() {
	return this.skeletonJsonURL ? this.skeletonJsonURL : "";
}

/**
 * @method setTextureJsonURL
 * 设置骨骼动画的纹理集的JSON/ATLAS URL。需要调用reload才能生效。
 * @param {String} textureJsonURL 骨骼动画的纹理集的JSON/ATLAS URL。
 * @return {UIElement} 返回控件本身。
 */
UISkeletonAnimation.prototype.setTextureJsonURL = function(textureJsonURL) {
	this.textureJsonURL = textureJsonURL;

	return this;
}

/**
 * @method getTextureJsonURL
 * 获取骨骼动画的纹理集的JSON/ATLAS URL。
 * @return {String} 返回骨骼动画的纹理集的JSON/ATLAS URL。
 */
UISkeletonAnimation.prototype.getTextureJsonURL = function() {
	return this.textureJsonURL ? this.textureJsonURL : "";
}

/**
 * @method setTextureURL
 * 设置骨骼动画的纹理图片的URL。需要调用reload才能生效。
 * @param {String} textureURL 骨骼动画的纹理图片的URL。
 * @return {UIElement} 返回控件本身。
 */
UISkeletonAnimation.prototype.setTextureURL = function(textureURL) {
	this.textureURL = textureURL;

	return this;
}

/**
 * @method getTextureURL
 * 获取骨骼动画的纹理图片的URL。
 * @return {String} 返回骨骼动画的纹理图片的URL。
 */
UISkeletonAnimation.prototype.getTextureURL = function() {
	return this.textureURL ? this.textureURL : "";
}

UISkeletonAnimation.prototype.loadSheletonData = function(textureJsonURL, skeletonJsonURL, textureURL, onDone) {
	var me = this;
	ResLoader.loadImage(textureURL, function(texture) {
		var loadFunc = ResLoader.loadJson;
		if(textureJsonURL.indexOf(".atlas") > 0) {
			loadFunc = ResLoader.loadData;
		}

		loadFunc(textureJsonURL, function(data) {
			var textureData = data;
			if(!data) {
				console.log("Get Json Failed:" + textureJsonURL);
				return;
			}

			ResLoader.loadJson(skeletonJsonURL, function(data) {
				if(!data) {
					console.log("Get Json Failed:" + skeletonJsonURL);
					return;
				}

				var skeletonData = data;
				onDone(texture, textureData, skeletonData);
			});
		});
	});

	return;
}

UISkeletonAnimation.prototype.createSkelentonAnimation = function(onDone) {
	var me = this;
	this.destroyArmature();

	function onDataLoad(texture, textureData, skeletonData) {
		me.createArmature(texture, textureData, skeletonData);
		var animationName = me.getAnimationName();
		if(me.skinName) {
			me.setSkin(me.skinName);
		}
        me.loadDataDone = true;
        if(me.initPlayArgs) {
            me.play.apply(me, me.initPlayArgs);
            me.initPlayArgs = null;
        }
        else {
		    me.play(animationName);
        }
		me.callOnLoadDoneHandler();
		if(onDone) {
			onDone();
		}
	}

    me.loadDataDone = false;
	this.loadSheletonData(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, onDataLoad);

	return;
}

UISkeletonAnimation.prototype.onFromJsonDone = function(js) {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {

		function onDataLoad(texture, textureData, skeletonData) {
			console.log("skeleton preload data done.");
		}

		this.loadSheletonData(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, onDataLoad);
	}

	if(js && js.animationScale) {
		if(!js.animationScaleX) {
			this.animationScaleX = js.animationScale;
		}

		if(!js.animationScaleY) {
			this.animationScaleY = js.animationScale;
		}
		delete this.animationScale;
	}

	return;
}

UISkeletonAnimation.prototype.onInit = function() {
	this.reload();

	return;
}

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
UISkeletonAnimation.prototype.reload = function(onDone) {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {
		this.createSkelentonAnimation(onDone);
	}

	return this;
}

UISkeletonAnimation.prototype.destroy = function() {
	this.destroyArmature();
	Shape.prototype.destroy.call(this);

	return;
}

UISkeletonAnimation.prototype.callOnLoadDoneHandler = function() {
	if(this.isInDesignMode()) {
		return;
	}

	if(!this.handleOnLoadDone) {
		var sourceCode = this.events["onLoadDone"];
		if(sourceCode) {
			sourceCode = "this.handleOnLoadDone = function() {\n" + sourceCode + "\n}\n";
			try {
				eval(sourceCode);
			}catch(e) {
				console.log("eval sourceCode failed: " + e.message + "\n" + sourceCode);
			}
		}
	}

	if(this.handleOnLoadDone) {
		try {
			this.handleOnLoadDone();
		}catch(e) {
			console.log("this.handleOnLoadDone:" + e.message);
		}
	}

	return true;
}

UISkeletonAnimation.prototype.destroyArmature = function() {
}

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.pause = function() {
	return this;
}

/**
 * @method resume
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.resume = function() {
	return this;
}

/**
 * @method getAnimationDuration
 * 获取指定动作的时长。
 * @param {String} animaName 动作名称。
 * @return {UIElement} 返回指定动画的时长。
 *
 */
UISkeletonAnimation.prototype.getAnimationDuration = function(animaName) {
}

UISkeletonAnimation.prototype.getAnimationNames = function() {
	return this.animationNames;
}

UISkeletonAnimation.prototype.setAnimationName = function(animationName) {
	this.animationName = animationName;

	return this;
}

/**
 * @method getAnimationName
 * 获取当前播放动画得名称。
 * @return {String} 返回当前播放的动画名称
 *
 */
UISkeletonAnimation.prototype.getAnimationName = function() {
	if(this.animationName) return this.animationName;

	var animationNames = this.getAnimationNames();
	return animationNames ? animationNames[0] : "";
}

UISkeletonAnimation.prototype.setScale = function(animationScale) {
	this.animationScaleX = animationScale;
	this.animationScaleY = animationScale;
	return this;
}

UISkeletonAnimation.prototype.getScale = function() {
	return this.animationScaleX;
}

UISkeletonAnimation.prototype.setScaleX = function(animationScale) {
	this.animationScaleX = animationScale;
	return this;
}

UISkeletonAnimation.prototype.setScaleY = function(animationScale) {
	this.animationScaleY = animationScale;
	return this;
}

UISkeletonAnimation.prototype.getScaleX = function(animationScale) {
	return this.animationScaleX;
}

UISkeletonAnimation.prototype.getScaleY = function(animationScale) {
	return this.animationScaleY;
}

UISkeletonAnimation.prototype.applyScale = function(canvas) {
}

/**
 * @method setTimeScale
 * 设置时间缩放比例, 小于1变慢，大于1变快。
 * @param {Number} animTimeScale 时间缩放比例。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.setTimeScale = function(animTimeScale) {
	this.animTimeScale = animTimeScale;

	return this;
}

UISkeletonAnimation.prototype.setDuration = function(duration) {
//TODO
}

UISkeletonAnimation.prototype.preprocessTextureAtlas = function(skeletonData) {
	return skeletonData;
}

/**
 * @method setSkin
 * 设置当前皮肤的名称。
 * @param {String} skinName 皮肤的名称。
 * @return {UIElement} 返回控件本身。
 *
 */
UISkeletonAnimation.prototype.setSkin = function(skinName) {
	this.skinName = skinName;

	return this;
}

/**
 * @method getSkin
 * 获取当前皮肤的名称。
 * @return {String} 返回当前皮肤的名称。
 *
 */
UISkeletonAnimation.prototype.getSkin = function() {
	return this.skinName;
}

UISkeletonAnimation.prototype.getSkins = function() {
	return ["default"];
}

UISkeletonAnimation.prototype.isPaused = function() {
	return this.timeScaleIsZero();
}

UISkeletonAnimation.prototype.shapeCanBeChild = UISprite.prototype.shapeCanBeChild;


