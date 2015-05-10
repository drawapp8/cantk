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

UISkeletonAnimation.startTimerIfNot = function() {
	if(UISkeletonAnimation.timerID) {
		return;			
	}
	UISkeletonAnimation.lastUpdateTime = Date.now();
	function stepIt() {
		if(WWindowManager.getInstance().getPaintEnable()) {
			var now = Date.now();
			var dt = (now - UISkeletonAnimation.lastUpdateTime)/1000;

			UISkeletonAnimation.lastUpdateTime = now;
			dragonBones.animation.WorldClock.clock.advanceTime(Math.min(0.04, dt));
		}
	}

	UISkeletonAnimation.timerID = setInterval(stepIt, 25);

	return;
}

UISkeletonAnimation.prototype.initUISkeletonAnimation = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setSizeLimit(50, 50);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onDoubleClick", "onUpdateTransform", "onLoadDone"]);

	UISkeletonAnimation.startTimerIfNot();

	return this;
}

UISkeletonAnimation.prototype.afterChildAppended = function(shape) {
	shape.xAttr = UIElement.X_CENTER_IN_PARENT;
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return;
}

UISkeletonAnimation.prototype.pause = function() {
	if(this.armature) {
		this.armature.animation.stop();
	}

	return this;
}

UISkeletonAnimation.prototype.resume = function() {
	if(this.armature) {
		this.armature.animation.play();
	}

	return this;
}

UISkeletonAnimation.prototype.gotoAndPlay = function(animationName) {
	this.animationName = animationName;

	if(this.armature) {
		var armature = this.armature;

		if(animationName && armature.animation.animationNameList.indexOf(animationName) >= 0) {
			armature.animation.gotoAndPlay(animationName);
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

UISkeletonAnimation.prototype.destroy = function() {
	if(this.armature) {
		dragonBones.animation.WorldClock.clock.remove(this.armature);
		this.armature = null;
	}

	Shape.prototype.destroy.call(this);

	return;
}

UISkeletonAnimation.prototype.preprocessTextureAtlas = function(skeletonData) {

	return skeletonData;
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

UISkeletonAnimation.prototype.createArmature = function(texture, textureData, skeletonData, onDone) {
	var factory = new dragonBones.factorys.GeneralFactory();

	factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(skeletonData));
	factory.addTextureAtlas(this.preprocessTextureAtlas(new dragonBones.textures.GeneralTextureAtlas(texture, textureData)));

	for(var i = 0; i < skeletonData.armature.length; i++) {
		var name = skeletonData.armature[i].name;
		var armature = factory.buildArmature(name);

		if(i === 0) {
			onDone(armature);
		}
	}

	return;
}

UISkeletonAnimation.prototype.loadDragonBoneArmature = function(textureJsonURL, skeletonJsonURL, textureURL, onDone) {
	var me = this;
	ResLoader.loadImage(textureURL, function(texture) {
		ResLoader.loadJson(textureJsonURL, function(data) {
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
				me.createArmature(texture, textureData, skeletonData, onDone);
			});
		});
	});

	return;
}


UISkeletonAnimation.prototype.createSkelentonAnimation = function(onDone) {
	var me = this;
	var x = this.w >> 1;
	var y = this.h >> 1;
	var scale = this.animationScale;

	if(this.armature) {
		dragonBones.animation.WorldClock.clock.remove(this.armature);
		this.armature = null;
	}

	this.loadDragonBoneArmature(this.textureJsonURL, this.skeletonJsonURL, this.textureURL, function(armature) {
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

		if(onDone) {
			onDone(armature.animation.animationNameList);
		}

		me.callOnLoadDoneHandler();
		armature.animation.gotoAndPlay(animationName);
		me.postRedraw();
	});

	return;
}

UISkeletonAnimation.prototype.onFromJsonDone = function() {
	if(this.textureURL && this.textureJsonURL && this.skeletonJsonURL) {
		this.createSkelentonAnimation();
	}

	return;
}

UISkeletonAnimation.prototype.getTextureURL = function() {
	return this.textureURL ? this.textureURL : "";
}

UISkeletonAnimation.prototype.shapeCanBeChild = UISprite.prototype.shapeCanBeChild;

UISkeletonAnimation.prototype.paintSelfOnly =function(canvas) {
	if(this.armature) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		this.armature.setPosition(x, y);

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

function UISkeletonAnimationCreator() {
	var args = ["ui-skeleton-animation", "ui-skeleton-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISkeletonAnimation();
		return g.initUISkeletonAnimation(this.type, 200, 200);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISkeletonAnimationCreator());

