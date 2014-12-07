/*
 * File:   ui-frame-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Frame Animation.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
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
	this.setTextType(Shape.TEXT_NONE);
	this.current = 0;
	this.frameRate = 10;
	this.startFrame = 0;
	this.endFrame = 0;
	this.playing = false;
	this.autoPlay = true;
	this.repeatTimes = 0xFFFFFFFF;
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.addEventNames(["onUpdateTransform", "onBeginContact", "onEndContact", "onMoved", "onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);

	return this;
}

UIFrameAnimation.prototype.afterChildAppended = function(shape) {
	shape.xAttr = UIElement.X_CENTER_IN_PARENT;
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return;
}

UIFrameAnimation.prototype.setAutoPlay = function(autoPlay) {
	this.autoPlay = autoPlay;

	return this;
}

UIFrameAnimation.prototype.stop = function() {
	this.playing = false;

	return this;
}

UIFrameAnimation.prototype.gotoAndPlayByName = function(name, repeatTimes, onDone, onOneCycle) {
	var range = this.getGroupRange(name);
	
	return this.gotoAndPlay(range.start, range.end, repeatTimes, onDone, onOneCycle);
}

UIFrameAnimation.prototype.play = UIFrameAnimation.prototype.gotoAndPlayByName;

UIFrameAnimation.prototype.gotoAndPlay = function(startFrame, endFrame, repeatTimes, onDone, onOneCycle) {
	if(this.frames && this.frames.length) {
		this.playing = true;
		this.repeatTimes = repeatTimes ? repeatTimes : 0xFFFFFFFF;

		this.onDone = onDone;
		this.onOneCycle = onOneCycle;
		var n = this.frames.length;
		this.startFrame = startFrame ? Math.min(startFrame, n-1) : 0;
		this.endFrame = endFrame ? Math.min(endFrame, n-1) : 0;

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

	return this;
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
				try{
					onDone(this);
				}catch(e) {
					console.log("onDone: " + e.message);
				}
			}
		}

		if(this.onOneCycle) {
			var onOneCycle = this.onOneCycle;

			try {
				onOneCycle(this);
			}catch(e) {
				console.log("onOneCycle: " + e.message);
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

UIFrameAnimation.prototype.parseGroupsData = function(groupsData) {
	var groups = {};
	var arrGroups = groupsData.split(";");
	for(var i = 0; i < arrGroups.length; i++) {
		var keyValue = arrGroups[i].split(":");
		if(!keyValue || keyValue.length < 2) {
			continue;
		}

		try {
			var range = JSON.parse(keyValue[1]);
		}catch(e) {
			console.log(e.message);
			continue;
		}

		if(!range || range.length < 2) {
			continue;
		}

		var name  = keyValue[0];
		var start = range[0];
		var end   = range[1];

		groups[name] = {start:start, end:end};
	}

	return groups;
}

UIFrameAnimation.prototype.stringifyGroups = function(groups) {
	if(!groups) {
		return null;
	}

	var str = "";
	for(var key in groups) {
		var range = groups[key];
		if(str) {
			str += ";";
		}

		str += key + ":[" + range.start + "," + range.end + "]";
	}

	return str;
}

UIFrameAnimation.prototype.setGroupsData = function(groupsData) {
	if(groupsData) {
		this.groups = this.parseGroupsData(groupsData);
		this.groupsData = this.stringifyGroups(this.groups);
	}else {
		this.groups = {};
		this.groupsData = null;
	}

	return this;
}

UIFrameAnimation.prototype.getGroupsData = function() {
	return this.groupsData ? this.groupsData : "";
}

UIFrameAnimation.prototype.getGroupRange = function(name) {
	if(this.groups && name) {
		return this.groups[name];
	}
	else {
		return {start:0, end:this.frames.length-1};
	}
}

UIFrameAnimation.prototype.getValue = function() {
	var str = "";
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter && iter.src) {
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
	
	return this;
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

	if(this.groupsData) {
		this.setGroupsData(this.groupsData);
	}

	return;
}
		
UIFrameAnimation.prototype.onInit = function() {
	var me =  this;
	var duration = this.getDuration();

	function update() {
		if(!me.parentShape) {
			return false;
		}

		if(me.playing && me.isVisible()) {
			me.postRedraw();
			me.nextFrame();
		}
	
		var newDuration = me.getDuration();
		if(duration !== newDuration) {
			duration = newDuration;
			UIElement.setTimeout(update, duration);
			console.log("duration changed to:" + duration);

			return false;
		}
		else {
			return true;
		}
	}

	UIElement.setTimeout(update, duration);

	if(this.autoPlay && this.frames && this.frames.length) {
		this.gotoAndPlay(0, this.frames.length-1, 10000000);	
	}
	else {
		this.stop();
	}

	return;
}

UIFrameAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

UIFrameAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return this;
}

UIFrameAnimation.prototype.getDuration = function() {
	return Math.floor(1000/this.frameRate);
}

UIFrameAnimation.prototype.shapeCanBeChild = function(shape) {
	if(this.widthAttr === UIElement.WIDTH_FILL_PARENT && this.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		return false;
	}

	return shape.isUIPhysicsShape || shape.isUIMouseJoint || shape.isUIImage || shape.isUIBitmapFontText || shape.isUIStatus;
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

UIFrameAnimation.prototype.prepareStyle = function(canvas) {}
UIFrameAnimation.prototype.resetStyle = function(canvas) {}

function UIFrameAnimationCreator() {
	var args = [ "ui-frame-animation", "ui-frame-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFrameAnimation();
		return g.initUIFrameAnimation(this.type, 200, 200);
	}
	
	return;
}

