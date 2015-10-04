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
	this.setTextType(Shape.TEXT_NONE);
	this.current = 0;
	this.frameRate = 10;
	this.playing = false;
	this.autoPlay = true;
	this.repeatTimes = 0xFFFFFFFF;
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.addEventNames(["onDoubleClick", "onUpdateTransform"]);

	return this;
}

UIFrameAnimation.prototype.syncImageFrames = function() {
	this.frames = [];
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter) {
			this.frames.push(iter);
		}
	}

	return;
}

UIFrameAnimation.prototype.elementToJson = function(o) {
	UIElement.prototype.elementToJson.call(this, o);

	if(this.groups) {
		o.groups = JSON.parse(JSON.stringify(this.groups));
	}

	return o;
}

UIFrameAnimation.prototype.elementFromJson = function(js) {
	UIElement.prototype.elementFromJson.call(this, js);
	
	this.playing = false;
	this.syncImageFrames();

	if(js.groups) {
		this.groups = js.groups;
	}
	else if(js.groupsData) {
		this.groups = this.parseGroupsData(js.groupsData);
		this.groupsData = null;
	}

	return js;
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

UIFrameAnimation.prototype.resume = function() {
	this.playing = true;

	return this;
}

UIFrameAnimation.prototype.pause = function() {
	this.playing = false;

	return this;
}

UIFrameAnimation.prototype.stop = function() {
	this.playing = false;

	return this;
}

UIFrameAnimation.prototype.playSequence = function(sequence, repeatTimes, onDone, onOneCycle) {
	var n = this.frames.length;
	if(!n || !sequence || !sequence.length) {
		return;
	}

	this.current = 0;
	this.playing = true;
	this.onDone = onDone;
	this.onOneCycle = onOneCycle;
	this.runningSequence = sequence;
	this.nextUpdateTime = Date.now();
	this.repeatTimes = repeatTimes ? repeatTimes : 0xFFFFFFFF;

	return;
}

UIFrameAnimation.prototype.playRange = function(startFrame, endFrame, repeatTimes, onDone, onOneCycle) {
	var n = this.frames.length;
	if(startFrame > endFrame) {
		var t = startFrame;
		startFrame = endFrame;
		endFrame = t;
	}

	var sequence = [];
	for(var i = startFrame; i <= endFrame; i++) {
		sequence.push(i);
	}

	this.playSequence(sequence, repeatTimes, onDone, onOneCycle);

	return this;
}

UIFrameAnimation.prototype.gotoAndPlayByName = function(name, repeatTimes, onDone, onOneCycle) {
	var range = this.getGroupRange(name);

	if(range.start !== undefined && range.end !== undefined) { 
		return this.gotoAndPlay(range.start, range.end, repeatTimes, onDone, onOneCycle);
	}
	else if(range && range.length){
		return this.playSequence(range, repeatTimes, onDone, onOneCycle);
	}
	else if(this.animations && name) {
		this.animate(name);
	}
}

UIFrameAnimation.prototype.play = UIFrameAnimation.prototype.gotoAndPlayByName;
UIFrameAnimation.prototype.gotoAndPlay = UIFrameAnimation.prototype.playRange;

UIFrameAnimation.prototype.nextFrame = function() {
	if(!this.frames || !this.frames.length || !this.runningSequence || !this.runningSequence.length) {
		return;
	}

	var current = this.current + 1;
	var n = this.runningSequence.length;

	if(current === n) {
		if(this.onOneCycle) {
			var onOneCycle = this.onOneCycle;

			try {
				onOneCycle(this);
			}catch(e) {
				console.log("onOneCycle: " + e.message);
			}
		}

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

			return;
		}
	}

	this.current = current % n;

	return;
}

UIFrameAnimation.prototype.getCurrentImage = function() {
	if(!this.frames || !this.frames.length) {
		return null;
	}

	if(!this.runningSequence || !this.runningSequence.length) {
		return this.frames[0];
	}

	if(this.current >= this.runningSequence.length) {
		this.current = 0;
	}

	var index =  this.runningSequence[this.current];

	return this.frames[index];
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
	}else {
		this.groups = {};
	}

	return this;
}

UIFrameAnimation.prototype.getGroupRange = function(name) {
	var range = null;

	if(this.groups && name) {
		range = this.groups[name];
	}
	
	if(!range) {
		range = {start:0, end:this.frames.length-1};
	}

	return range;
}

UIFrameAnimation.prototype.getImages = function() {
	var str = "";
	for(var key in this.images) {
		var iter = this.images[key];
		if(key.indexOf("option_image_") >= 0 && iter && iter.src) {
			str += iter.src + "\n";
		}
	}

	return str;
}

UIFrameAnimation.prototype.setImages = function(value) {
	var display = this.images.display;
	this.images = {};
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
	}
	this.syncImageFrames();
	
	return this;
}

UIFrameAnimation.prototype.getValue = function() {
	return this.current;
}

UIFrameAnimation.prototype.setValue = function(value) {
	this.current = Math.min(value, this.frames.length);

	return;
}

UIFrameAnimation.prototype.startAutoPlay = function() {
	if(this.defaultGroupName) {
		this.play(this.defaultGroupName, 0xFFFFFFF); 
	}
	else {
		this.gotoAndPlay(0, this.frames.length-1, 0xFFFFFFF);	
	}

	return;
}

UIFrameAnimation.prototype.onInit = function() {
	this.syncImageFrames();

	if(this.autoPlay && this.frames && this.frames.length) {
		this.startAutoPlay();
		if(this.autoPlayDelay) {
			this.nextUpdateTime += this.autoPlayDelay;
		}
	}

	return;
}

UIFrameAnimation.prototype.paintSelf = function(canvas) {
	
	if(this.playing && this.isVisible()) {
		var duration = this.getDuration();
		var nextUpdateTime = canvas.now + duration;

		if(canvas.now > this.nextUpdateTime) {
			this.nextFrame();
			this.nextUpdateTime = nextUpdateTime;
		}
		else {
			this.nextUpdateTime = Math.min(this.nextUpdateTime, nextUpdateTime);
		}

		canvas.needRedraw++;
	}
	
	return UIElement.prototype.paintSelf.call(this, canvas);
}

UIFrameAnimation.prototype.getFrameRate = function() {
	return this.frameRate ? this.frameRate : 5;
}

UIFrameAnimation.prototype.setFrameRate = function(frameRate) {
	this.frameRate = Math.max(1, Math.min(frameRate, 30));

	return this;
}

UIFrameAnimation.prototype.getDuration = function() {
	if(UIElement.timeScale) {
		return (1000/this.frameRate)/UIElement.timeScale;
	}
	else {
		return 0xffffff;
	}
}

UIFrameAnimation.prototype.shapeCanBeChild = UISprite.prototype.shapeCanBeChild;

UIFrameAnimation.prototype.drawImage = function(canvas) {
	var image = this.getCurrentImage();

	if(image) {
		var srcRect = image.getImageRect();
		var htmlImage = image.getImage();
		if(htmlImage) {
			this.drawImageAt(canvas, htmlImage, this.images.display, 0, 0, this.w, this.h, srcRect);
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

ShapeFactoryGet().addShapeCreator(new UIFrameAnimationCreator());

