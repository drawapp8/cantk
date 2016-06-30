/*
 * File:   ui-spine.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Spine Skeleton Animation. 
 * 
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UISpine() {
}

UISpine.prototype = new UISkeletonAnimation();
UISpine.prototype.initUISpine = UISkeletonAnimation.prototype.initUISkeletonAnimation;

UISpine.prototype.doPlay = UISpine.prototype.gotoAndPlay = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn, duration) {
	var me = this;
	this.animationName = animationName;

	if(this.spineWrapper) {
		var repeatTimes = repeatTimes ? repeatTimes : 0xffffffff;
		this.spineWrapper.setAnimationByName(animationName, this.skinName, repeatTimes, onDone, onOneCycle);
	}

	return this;
}

UISpine.prototype.pause = function() {
	if(this.spineWrapper) {
		this.spineWrapper.setTimeScale(0);
	}

	return this;
}

UISpine.prototype.resume = function() {
	if(this.spineWrapper) {
		this.spineWrapper.setTimeScale(1);
	}
	return this;
}

UISpine.prototype.createArmature = function(texture, textureData, skeletonJSON, onDone) {
	if(this.spineWrapper) {
		this.spineWrapper.dropPose();
	}

	this.spineWrapper = new SpineWrapper(skeletonJSON, textureData, texture);
	this.animationNames = this.spineWrapper.getAnimationKeys();
	this.animationName = this.animationName && this.animationNames.indexOf(this.animationName) > -1 ? 
		this.animationName : this.animationNames[0];

	return;
}

UISpine.prototype.update = function(canvas) {
	var dt = (canvas.timeStep * UIElement.timeScale * this.animTimeScale);
	this.spineWrapper.update(canvas, dt);
}

UISpine.prototype.destroyArmature = function() {
	if(this.spineWrapper) {
		this.spineWrapper.dropPose();
		this.spineWrapper = void 0;
		this.animaName = void 0;
		this.skinName = void 0;
	}
}

UISpine.prototype.paintSelfOnly = function(canvas) {
	if(!this.spineWrapper) {
		return;
	}

	var ay = this.h;
	var ax = this.w >> 1;

	canvas.translate(ax, ay);
	canvas.scale(this.animationScaleX, this.animationScaleY);

	if(!this.timeScaleIsZero()) {
		this.update(canvas);
	}
	this.spineWrapper.paint(canvas);

	if(isNaN(canvas.needRedraw)) {
		canvas.needRedraw = 1;
	}
	canvas.needRedraw++;

	return;
}

UISpine.prototype.setSkin = function(skinName) {
	this.skinName = skinName;
	if(this.spineWrapper) {
		this.spineWrapper.setSkinByName(skinName);
	}

	return this;
}

UISpine.prototype.getCurrentSkinKey = function() {
	if(this.spineWrapper) {
		return this.spineWrapper.getCurrentSkinKey();
	}
};

UISpine.prototype.getCurrentAnimKey = function() {
	if(this.spineWrapper) {
		return this.spineWrapper.getCurrentAnimKey();
	}
};

UISpine.prototype.getSkins = function() {
	if(this.spineWrapper) {
		return this.spineWrapper.getSkinKeys();
	}

	return ["default"];
}

UISpine.prototype.getDuration = UISpine.prototype.getAnimationDuration = function(animaName) {
	if(!this.spineWrapper) return 0;
	animaName = animaName || this.animationName;

	return this.spineWrapper.getAnimDuration(animaName);
}

function UISpineCreator() {
	var args = ["ui-spine", "ui-spine", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISpine();
		return g.initUISpine(this.type, 200, 200);
	}

	return;
}

ShapeFactoryGet().addShapeCreator(new UISpineCreator());
