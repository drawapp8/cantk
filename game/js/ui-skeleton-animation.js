/*
 * File:   ui-skeleton-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  SkelentonAnimation
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UISkeletonAnimation() {
	return;
}

UISkeletonAnimation.prototype = new UIElement();
UISkeletonAnimation.prototype.isUISkeletonAnimation = true;

UISkeletonAnimation.prototype.initUISkeletonAnimation = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setSizeLimit(50, 50);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onDoubleClick", "onUpdateTransform", "onLoadDone"]);

	this.animationScale = 1;
	this.animationNames = [];

	return this;
}

UISkeletonAnimation.prototype.setSkeletonJsonURL = function(skeletonJsonURL) {
	this.skeletonJsonURL = skeletonJsonURL;

	return this;
}

UISkeletonAnimation.prototype.getSkeletonJsonURL = function() {
	return this.skeletonJsonURL ? this.skeletonJsonURL : "";
}

UISkeletonAnimation.prototype.setTextureJsonURL = function(textureJsonURL) {
	this.textureJsonURL = textureJsonURL;

	return this;
}

UISkeletonAnimation.prototype.getTextureJsonURL = function() {
	return this.textureJsonURL ? this.textureJsonURL : "";
}

UISkeletonAnimation.prototype.setTextureURL = function(textureURL) {
	this.textureURL = textureURL;

	return this;
}

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
		me.play(animationName);
	}

	this.loadSheletonData(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, onDataLoad);

	return;
}

UISkeletonAnimation.prototype.onFromJsonDone = function() {
	this.reload();

	return;
}

UISkeletonAnimation.prototype.reload = function(onDone) {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {
		this.createSkelentonAnimation(onDone);
	}

	return;
}

UISkeletonAnimation.prototype.destroy = function() {
	this.destroyArmature();
	Shape.prototype.destroy.call(this);

	return;
}

UISkeletonAnimation.prototype.callOnLoadDoneHandler = function() {
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

UISkeletonAnimation.prototype.pause = function() {
	return this;
}

UISkeletonAnimation.prototype.resume = function() {
	return this;
}

UISkeletonAnimation.prototype.getAnimationNames = function() {
	return this.animationNames;
}

UISkeletonAnimation.prototype.setAnimationName = function(animationName) {
	this.animationName = animationName;

	return this;
}

UISkeletonAnimation.prototype.getAnimationName = function() {
	if(this.animationName) return this.animationName;
	
	var animationNames = this.getAnimationNames();
	return animationNames ? animationNames[0] : "";
}

UISkeletonAnimation.prototype.setAnimationScale = function(animationScale) {
	this.animationScale = animationScale;
	return;
}

UISkeletonAnimation.prototype.getAnimationScale = function() {
	return this.animationScale;
}

UISkeletonAnimation.prototype.preprocessTextureAtlas = function(skeletonData) {
	return skeletonData;
}

UISkeletonAnimation.prototype.shapeCanBeChild = UISprite.prototype.shapeCanBeChild;


