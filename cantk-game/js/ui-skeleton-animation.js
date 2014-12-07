/*
 * File:   ui-skeleton-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  SkelentonAnimation
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
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
	this.addEventNames(["onUpdateTransform", "onBeginContact", "onEndContact", "onMoved", "onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);

	return this;
}

UISkeletonAnimation.prototype.afterChildAppended = function(shape) {
	shape.xAttr = UIElement.X_CENTER_IN_PARENT;
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return;
}

UISkeletonAnimation.prototype.gotoAndPlay = function(animationName) {
	this.animationName = animationName;

	if(this.armature) {
		var armature = this.armature;

		if(animationName && armature.animation.animationNameList.indexOf(animationName) >= 0) {
			armature.animation.gotoAndPlay(animationName);
		}
		else {
			console.log("Unknow animation name: " + animationName);
		}
	}

	return this;
}

UISkeletonAnimation.prototype.play = UISkeletonAnimation.prototype.gotoAndPlay;

UISkeletonAnimation.prototype.setAnimationName = function(animationName) {
	this.animationName = animationName;

	return this;
}

UISkeletonAnimation.prototype.getAnimationNames = function() {
	if(this.armature) {
		return this.armature.animation.animationNameList;
	}
	else {
		return [];
	}
}

UISkeletonAnimation.prototype.getAnimationName = function() {
	if(this.animationName) {
		return this.animationName;
	}
	else if(this.armature) {
		return this.armature.animation.animationNameList[0];	
	}
	else {
		return "";
	}
}

UISkeletonAnimation.prototype.setAnimationScale = function(animationScale) {
	this.animationScale = animationScale;

	if(this.armature) {
		this.armature.setScale(animationScale, animationScale);
	}

	return;
}

UISkeletonAnimation.prototype.getAnimationScale = function() {
	return this.animationScale ? this.animationScale : "";
}

UISkeletonAnimation.prototype.setSkeletonJsonURL = function(skeletonJsonURL) {
	this.skeletonJsonURL = skeletonJsonURL;

	return;
}

UISkeletonAnimation.prototype.getSkeletonJsonURL = function() {
	return this.skeletonJsonURL ? this.skeletonJsonURL : "";
}

UISkeletonAnimation.prototype.setTextureJsonURL = function(textureJsonURL) {
	this.textureJsonURL = textureJsonURL;

	return;
}

UISkeletonAnimation.prototype.getTextureJsonURL = function() {
	return this.textureJsonURL ? this.textureJsonURL : "";
}

UISkeletonAnimation.prototype.setTextureURL = function(textureURL) {
	this.textureURL = textureURL;

	return;
}

UISkeletonAnimation.prototype.loadSkelentonAnimation = function() {
	var me = this;
	var x = this.w >> 1;
	var y = this.h >> 1;
	var scale = this.animationScale;

	loadDragonBoneArmature(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, function(armature) {
		me.armature = armature;
		armature.setPosition(x, y);

		if(scale) {
			armature.setScale(scale, scale);
		}

		dragonBones.animation.WorldClock.clock.add(armature);

		var animationName = armature.animation.animationNameList[0];
		if(me.animationName && armature.animation.animationNameList.indexOf(me.animationName) >= 0) {
			animationName = me.animationName;
		}

		for(var i = 0; i < armature.animation.animationNameList.length; i++) {
			console.log(armature.animation.animationNameList[i]);
		}

		armature.animation.gotoAndPlay(animationName);
		me.postRedraw();
	});

	return;
}

UISkeletonAnimation.prototype.onFromJsonDone = function() {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {
		this.loadSkelentonAnimation();
	}

	return;
}

UISkeletonAnimation.prototype.getTextureURL = function() {
	return this.textureURL ? this.textureURL : "";
}

UISkeletonAnimation.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPhysicsShape || shape.isUIMouseJoint || shape.isUIStatus;
}

UISkeletonAnimation.prototype.beforePaintChildren = UISprite.prototype.beforePaintChildren;

UISkeletonAnimation.prototype.paintSelfOnly =function(canvas) {
	if(this.armature) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		this.armature.setPosition(x, y);

		dragonBones.animation.WorldClock.clock.advanceTime(1/50);

		canvas.save();
		this.armature.draw(canvas);
		canvas.restore();

		var me = this;
		UIElement.setAnimTimer(function() {
			me.postRedraw();
			return false;
		});
	}

	return;
}

function UISkeletonAnimationCreator() {
	var args = ["ui-skeleton-animation", "ui-skeleton-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISkeletonAnimation();
		return g.initUISkeletonAnimation(this.type, 200, 200);
	}
	
	return;
}

