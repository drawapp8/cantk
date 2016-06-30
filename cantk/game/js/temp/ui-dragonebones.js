/*
 * File:   ui-skeleton-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  SkelentonAnimation
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIDragoneBones() {
	return;
}

UIDragoneBones.prototype = new UISkeletonAnimation();
UIDragoneBones.prototype.isUIDragoneBones = true;
UIDragoneBones.prototype.initUIDragoneBones = UISkeletonAnimation.prototype.initUISkeletonAnimation;

UIDragoneBones.prototype.pause = function() {
	if(this.armature) {
		this.armature.animation.stop();
	}

	return this;
}

UIDragoneBones.prototype.resume = function() {
	if(this.armature) {
		this.armature.animation.play();
	}

	return this;
}

UIDragoneBones.prototype.setupLoop = function(animationName, repeatTimes, onDone, onOneCycle) {
	var me = this;
	function loopComplete(e) {
		if(!e || !e.animationState 
			|| e.animationState.name != animationName) {
			return;
		}
		if(me.onOneCycle) {
			try {
				me.onOneCycle();
			} catch(e) {
				console.debug('onOneCycle:', e);
			}
		}
	}

	function complete() {
		//me.stop();
		if(me.onDone) {
			try {
				me.onDone();
			} catch(e) {
				console.debug('onDone:', e);
			}
		}
	}

	if(!isNaN(repeatTimes)) {
		this.onDone = onDone;
		this.onOneCycle = onOneCycle;
		this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, complete);
		this._armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, loopComplete);
	}
}

UIDragoneBones.prototype.doPlay = UIDragoneBones.prototype.gotoAndPlay = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn, duration) {
	this.animationName = animationName;

	if(this.armature) {
		var armature = this.armature;

		if(animationName && armature.animation.animationList.indexOf(animationName) >= 0) {
			//if(onDone || onOneCycle || repeatTimes || typeof repeatTimes === 'undefined') {
			if(onDone || onOneCycle || repeatTimes) {
				repeatTimes = isNaN(repeatTimes) ? 0xFFFFFFFF : repeatTimes;
				this.setupLoop.apply(armature.animation, arguments);
			}
			var fadeIn = !useFadeIn ? 0 : undefined;
			armature.animation.gotoAndPlay(animationName, fadeIn, duration, repeatTimes);
		}
		else if(this.animations && animationName) {
			this.animate(animationName);
		}
		else {
			console.log("Unknow animation name: " + animationName);
		}
	}

	return this;
}

UIDragoneBones.prototype.destroyArmature = function() {
	if(this.armature) {
		this.armature = null;
	}

	return;
}

UISkeletonAnimation.prototype.destroy = function() {
	this.destroyArmature();
	Shape.prototype.destroy.call(this);

	return;
}

UISkeletonAnimation.prototype.getSlotRect = function(name) {
	if(!this.armature) {
		return null;
	}

	var slotList = this.armature._slotList;
	for(var i = 0; i < slotList.length; i++) {
		var iter = slotList[i];
		if(iter.name === name) {
			var display = iter.getDisplay();
			return display.textureAtlasRect;
		}
	}

	return null;
}

UISkeletonAnimation.prototype.replaceSlotImage = function(name, image, imageRect) {
	if(!this.armature) {
		return this;
	}

	if(imageRect && imageRect.w) {
		imageRect.width = imageRect.w;
	}
	if(imageRect && imageRect.h) {
		imageRect.height = imageRect.h;
	}

	var slotList = this.armature._slotList;
	for(var i = 0; i < slotList.length; i++) {
		var iter = slotList[i];
		if(iter.name === name) {
			iter.image = image;
			iter.imageRect = imageRect;
		}
	}

	return;
}

UIDragoneBones.prototype.advanceTime = function() {
	var self = this;
	var armature = this.armature;

	armature.advanceTime = function() {
		if(self.isVisible()) {
			dragonBones.Armature.prototype.advanceTime.apply(this, arguments);
		}
	}

	return this;
}

UIDragoneBones.prototype.createArmature = function(texture, textureData, skeletonData) {
	if(this.armature) {
		this.armature = null;
	}

	if(!this.rendererContext) {
		this.rendererContext = new CanvasRenderer();
		this.rendererContext.container = new DisplayObjectContainer();
	}
	else {
		this.rendererContext.container.removeChildren();
	}

	var factory = null;
	if(!MainContext.instance.factory) {
		factory = new dragonBones.EgretFactory();
		MainContext.instance.factory = factory;
	}
	else {
		factory = MainContext.instance.factory;
	}

	if(!factory.getSkeletonData(skeletonData.name)) {
		factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
	}

	if(!factory.getTextureAtlas(textureData.name)) {
		factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
	}

	var armature = factory.buildArmature(skeletonData.armature[0].name, skeletonData.name);
	this.rendererContext.container.addChild(armature.display);

	this.armature = armature;
	this.animationNames = armature.animation.animationList;
	this.animationName = this.animationNames.indexOf(this.animationName) > -1 ? this.animationName : this.animationNames[0];
}

UIDragoneBones.prototype.getDuration = UIDragoneBones.prototype.getAnimationDuration = function(animaName) {
	if(!this.armature) return 0;

	animaName = animaName || this.animationName;

	var index = this.armature.animation.animationList.indexOf(animaName);
	if(index > -1) {
		return this.armature.animation.animationDataList[index].duration;
	}

	return 0;
}

UIDragoneBones.prototype.paintSelfOnly =function(canvas) {
	if(this.armature) {
		if(!this.timeScaleIsZero()) {
			var dt = (canvas.timeStep * UIElement.timeScale * this.animTimeScale)/1000;
			this.armature.advanceTime(dt);
		}

		var x = this.w >> 1;
		var y = this.h >> 1;
		canvas.save();
		var scaleX = (this.animationScaleX) === 1 ? 1.01 : this.animationScaleX;
		var scaleY = (this.animationScaleY) === 1 ? 1.01 : this.animationScaleY;

		this.rendererContext.setScale(scaleX, scaleY);
		this.rendererContext.setPosition(x, y);
		MainContext.instance.renderLoop.call(this.rendererContext, canvas);
		canvas.restore();

		canvas.needRedraw++;
	}

	return;
}

function UISkeletonAnimationCreator(type) {
	var args = [type, type, null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDragoneBones();
		return g.initUIDragoneBones(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISkeletonAnimationCreator("ui-dragonbones"));
ShapeFactoryGet().addShapeCreator(new UISkeletonAnimationCreator("ui-skeleton-animation"));

