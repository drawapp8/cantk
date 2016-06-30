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

UIDragoneBones.startTimerIfNot = function() {
	if(UIDragoneBones.timerID) {
		return;			
	}

	UIDragoneBones.lastUpdateTime = Date.now();
	function stepIt() {
		if(WWindowManager.getInstance().getPaintEnable()) {
			var now = Date.now();
			var dt = (now - UIDragoneBones.lastUpdateTime)/1000;

			UIDragoneBones.lastUpdateTime = now;
			dragonBones.WorldClock.clock.advanceTime(dt * UIElement.timeScale);
		}
	}

	UIDragoneBones.timerID = setInterval(stepIt, 25);

	return;
}

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
		me.stop();
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

UIDragoneBones.prototype.play = UIDragoneBones.prototype.gotoAndPlay = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn) {
	this.animationName = animationName;

	if(this.armature) {
		var armature = this.armature;

		if(animationName && armature.animation.animationList.indexOf(animationName) >= 0) {
			//if(onDone || onOneCycle || repeatTimes || typeof repeatTimes === 'undefined') {
			if(onDone || onOneCycle || repeatTimes) {
				repeatTimes = isNaN(repeatTimes) ? 0xFFFFFFFF : repeatTimes;
				this.setupLoop.apply(armature.animation, arguments);
			}
			var fadeIn = useFadeIn === false ? 0 : undefined;
			armature.animation.gotoAndPlay(animationName, fadeIn, undefined, repeatTimes);
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

UIDragoneBones.prototype.setAnimationScale = function(animationScale) {
	this.animationScale = animationScale;

	if(this.armature) {
		this.rendererContext.setScale(this.animationScale, this.animationScale);
	}

	return;
}


UIDragoneBones.prototype.destroyArmature = function() {
	if(this.armature) {
		dragonBones.WorldClock.clock.remove(this.armature);
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

UIDragoneBones.prototype.createArmature = function(texture, textureData, skeletonData) {
	if(this.armature) {
		dragonBones.WorldClock.clock.remove(this.armature);
		this.armature = null;
	}

	if(!this.rendererContext) {
		this.rendererContext = new CanvasRenderer();
		this.rendererContext.container = new DisplayObjectContainer();
	}
	else {
		this.rendererContext.container.removeChildren();
	}

	if(this.animationScale) {
		this.rendererContext.setScale(this.animationScale, this.animationScale);
	}

	var factory = null;
	if(!MainContext.instance.factory) {
		factory = new dragonBones.EgretFactory();
		MainContext.instance.factory = factory;
	}
	else {
		factory = MainContext.instance.factory;
	}
	factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
	factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
	// var armature = factory.buildArmature(skeletonData.armature[0].name);
	var armature = factory.buildFastArmature(skeletonData.armature[0].name);
	// var armatureDisplay = armature.getDisplay();
	this.rendererContext.container.addChild(armature.display);
	var animationCachManager = armature.enableAnimationCache(60);
		
	this.armature = armature;
	UIDragoneBones.startTimerIfNot();
	dragonBones.WorldClock.clock.add(armature);
	this.animationNames = armature.animation.animationList;
	this.animationName = this.animationNames.indexOf(this.animationName) > -1 ? this.animationName : this.animationNames[0];
}

UIDragoneBones.prototype.paintSelfOnly =function(canvas) {
	if(this.armature) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		canvas.save();
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

