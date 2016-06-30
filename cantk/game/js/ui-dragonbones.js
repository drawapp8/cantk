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
 * @class UIDragonBones
 * @extends UISkeletonAnimation
 * 龙骨骨骼动画。参考：[DragonBones](https://github.com/DragonBones)
 */
function UIDragonBones() {
	return;
}

UIDragonBones.prototype = new UISkeletonAnimation();
UIDragonBones.prototype.isUIDragonBones = true;
UIDragonBones.prototype.initUIDragonBones = UISkeletonAnimation.prototype.initUISkeletonAnimation;

UIDragonBones.prototype.pause = function() {
	if(this.armature) {
		this.armature.animation.stop();
	}

	return this;
}

UIDragonBones.prototype.resume = function() {
	if(this.armature) {
		this.armature.animation.play();
	}

	return this;
}

UIDragonBones.prototype.getEnableCache = function() {
    return !!this.enableCache;
}

UIDragonBones.prototype.setEnableCache = function(value) {
    this.enableCache = value;
    return this;
}

UIDragonBones.prototype.setupLoop = function(animationName, repeatTimes, onDone, onOneCycle) {
	var me = this;
	function loopComplete(e) {
		if(!e || !e.animationState
            || e.armature !== me._armature) {
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

UIDragonBones.prototype.doPlay = UIDragonBones.prototype.gotoAndPlay = function(animationName, repeatTimes, onDone, onOneCycle, useFadeIn, duration) {
	this.animationName = animationName;

	if(this.armature) {
		var armature = this.armature;

		if(animationName && armature.animation.animationList.indexOf(animationName) >= 0) {
			//if(onDone || onOneCycle || repeatTimes || typeof repeatTimes === 'undefined') {
			if(onDone || onOneCycle || repeatTimes) {
				repeatTimes = isNaN(repeatTimes) ? Number.MAX_VALUE : repeatTimes;
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

UIDragonBones.prototype.destroyArmature = function() {
	if(this.armature) {
		this.armature = null;
	}

	return;
}

UISkeletonAnimation.prototype.destroy = function() {
	this.destroyArmature();
	UIElement.prototype.destroy.call(this);

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

UIDragonBones.prototype.advanceTime = function() {
	var self = this;
	var armature = this.armature;

	armature.advanceTime = function() {
		if(self.isVisible()) {
			dragonBones.Armature.prototype.advanceTime.apply(this, arguments);
		}
	}

	return this;
}

UIDragonBones.prototype.createArmature = function(texture, textureData, skeletonData) {
	if(this.armature) {
		this.armature = null;
	}

	var factory = null;
	if(!MainContext.instance.factory) {
		factory = new dragonBones.HolaFactory();
		MainContext.instance.factory = factory;
	}
	else {
		factory = MainContext.instance.factory;
	}

	if(!factory.getSkeletonData(skeletonData.name)) {
		factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
	}

	if(!factory.getTextureAtlas(textureData.name)) {
		factory.addTextureAtlas(new dragonBones.HolaTextureAtlas(texture, textureData));
	}

    if(this.enableCache) {
        var armature = factory.buildFastArmature(skeletonData.armature[0].name, skeletonData.name);
        armature.enableAnimationCache(24);
    }
    else {
        var armature = factory.buildArmature(skeletonData.armature[0].name, skeletonData.name);
    }

	this.armature = armature;
	this.animationNames = armature.animation.animationList;
	this.animationName = this.animationNames.indexOf(this.animationName) > -1 ? this.animationName : this.animationNames[0];
}

UIDragonBones.prototype.getDuration = UIDragonBones.prototype.getAnimationDuration = function(animaName) {
	if(!this.armature) return 0;

	animaName = animaName || this.animationName;

	var index = this.armature.animation.animationList.indexOf(animaName);
	if(index > -1) {
		return this.armature.animation.animationDataList[index].duration;
	}

	return 0;
}

UIDragonBones.prototype.paintSelfOnly = function(canvas) {
	if(this.armature) {
		if(!this.isPaused()) {
			var dt = (canvas.timeStep * this.animTimeScale)/1000;
			this.armature.advanceTime(dt);
		}

		var x = this.w >> 1;
		var y = this.h >> 1;
		canvas.save();
		var scaleX = (this.animationScaleX) === 1 ? 1.01 : this.animationScaleX;
		var scaleY = (this.animationScaleY) === 1 ? 1.01 : this.animationScaleY;

        MainContext.instance.setObjectContainer(this.armature.display);
		MainContext.instance.setScale(scaleX, scaleY);
		MainContext.instance.setPosition(x, y);
		MainContext.instance.renderLoop(canvas);
		canvas.restore();

		canvas.needRedraw++;
	}

	return;
}

function UISkeletonAnimationCreator(type) {
	var args = [type, type, null, 1];

	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDragonBones();
		return g.initUIDragonBones(this.type, 200, 200);
	}

	return;
}

ShapeFactoryGet().addShapeCreator(new UISkeletonAnimationCreator("ui-dragonbones"));
ShapeFactoryGet().addShapeCreator(new UISkeletonAnimationCreator("ui-skeleton-animation"));

