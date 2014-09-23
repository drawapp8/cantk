/*
 * File:   ui-frame-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frame Animation.
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFrameAnimation() {
	return;
}

UIFrameAnimation.prototype = new UIElement();
UIFrameAnimation.prototype.isUIFrameAnimation = true;

UIFrameAnimation.prototype.initUIFrameAnimation = function(type, w, h) {
	this.initUIElement(type);	
	
	this.setDefSize(w, h);
	this.addEventNames(["onChanged"]);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.current = 0;
	this.frameRate = 10;
	this.startFrame = 0;
	this.endFrame = 0;
	this.playing = false;
	this.autoPlay = true;
	this.repeatTimes = 0xFFFFFFFF;
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;

	this.addEventNames(["onOnUpdateTransform", "onBeginContact", "onEndContact", "onMoved", "onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);

	return this;
}

UIFrameAnimation.prototype.afterChildAppended = function(shape) {
	shape.xAttr = C_X_CENTER_IN_PARENT;
	shape.yAttr = C_Y_MIDDLE_IN_PARENT;

	return;
}

UIFrameAnimation.prototype.setAutoPlay = function(autoPlay) {
	this.autoPlay = autoPlay;

	return;
}

UIFrameAnimation.prototype.stop = function() {
	this.playing = false;

	return;
}

UIFrameAnimation.prototype.gotoAndPlay = function(startFrame, endFrame, repeatTimes, onDone) {
	if(this.frames && this.frames.length) {
		this.playing = true;
		this.repeatTimes = repeatTimes ? repeatTimes : 0xFFFFFFFF;

		this.onDone = onDone;
		var n = this.frames.length;
		this.startFrame = (startFrame ? startFrame : 0)%n;
		this.endFrame = (endFrame ? endFrame : n - 1)%n;

		if(this.startFrame > this.endFrame) {
			var t = this.startFrame;
			this.startFrame = this.endFrame;
			this.endFrame = t;
		}

		this.current = this.startFrame;
	}
	else {
		this.playing = false;
	}

	return;
}

UIFrameAnimation.prototype.nextFrame = function() {
	if(!this.frames || !this.frames.length) {
		return;
	}

	var n = this.frames.length;
	var start = this.startFrame;
	var end = this.endFrame;

	var current = (this.current - start + 1)%(end - start + 1) + start;

	this.current = current;

	if(current === end) {
		this.repeatTimes--;
		if(this.repeatTimes <= 0) {
			this.playing = false;
			if(this.onDone) {
				var onDone = this.onDone;
				onDone(this);
			}
		}
	}

	return;
}

UIFrameAnimation.prototype.getCurrentImage = function() {
	if(!this.frames || !this.frames.length) {
		return null;
	}

	if(this.current >= this.frames.length) {
		this.current = 0;
	}

	return this.frames[this.current];
}

UIFrameAnimation.prototype.getValue = function() {
	var str = "";
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter) {
			str += iter.src + "\n";
		}
	}

	return str;
}

UIFrameAnimation.prototype.setValue = function(value) {
	var display = this.images.display;
	this.images = {};
	this.frames = [];
	this.images.display = display;

	if(value) {
		var i = 0;
		var k = 0;
		var arr = value.split("\n");

		for(var i = 0; i < arr.length; i++) {
			var iter = arr[i];
			if(!iter) continue;

			if(iter.indexOf("/") === 0) {
				iter = iter.substr(1);
			}

			var name = "option_image_" + (k++);
			this.setImage(name, iter);
		}

		for(var key in this.images) {
			var iter = this.images[key];
			if(key.indexOf("option_image_") >= 0 && iter) {
				this.frames.push(iter);
			}
		}
	}
	
	return;
}

UIFrameAnimation.prototype.onFromJsonDone = function() {
	this.playing = false;
	
	this.frames = [];
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter) {
			this.frames.push(iter);
		}
	}

	return;
}
		
UIFrameAnimation.prototype.onInit = function() {
	var me =  this;
	var duration = 1000/this.getFrameRate();

	function update() {
		if(me.playing) {
			me.postRedraw();
			me.nextFrame();
		}

		setTimeout(update, duration);
	}

	if(this.autoPlay) {
		this.gotoAndPlay();	
	}
	else {
		this.stop();
	}

	update();

	return;
}

UIFrameAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

UIFrameAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return;
}

UIFrameAnimation.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPhysicsShape || shape.isUIMouseJoint || shape.isUIImage;
}

UIFrameAnimation.prototype.drawImage =function(canvas) {
	var image = this.getCurrentImage();

	if(image) {
		var me = this;
		var srcRect = image.getImageRect();
		if(image.image) {
			this.drawImageAt(canvas, image.image, this.images.display, 0, 0, this.w, this.h, srcRect);
		}	
	}

	return;
}

function UIFrameAnimationCreator() {
	var args = [ "ui-frame-animation", "ui-frame-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFrameAnimation();
		return g.initUIFrameAnimation(this.type, 200, 200);
	}
	
	return;
}

