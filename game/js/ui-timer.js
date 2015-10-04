/*
 * File:   ui-timer.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic timer for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

function UITimer() {
	return;
}

UITimer.prototype = new UIElement();
UITimer.prototype.isUITimer = true;

UITimer.prototype.initUITimer = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_AUTO;
	this.addEventNames(["onTimeout"]);

	return this;
}

UITimer.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UITimer.prototype.onInit = function() {
	if(this.enable) {
		this.start();
		console.log("start timer.");
	}
	else {
		console.log("not start disable timer.");
	}

	return;
}

UITimer.prototype.setEnable = function(enable) {
	var parent = this.getParent();
	if(!parent || this.enable == enable) {
		return this;
	}
	
	this.enable = enable;
	if(enable) {
		this.start();
	}
	else {
		this.stop();
	}

	return;
}

UITimer.prototype.getDuration = function() {
	if(this.durationType === "random") {
		var duration = this.durationMin + Math.random() * (this.durationMax - this.durationMin);
		
		return duration;
	}
	else {
		return this.duration;
	}
}

UITimer.prototype.start = function() {
	if(!this.enable) {
		console.log("can not start disabled timer, please call setEnable first.");
	}

	if(this.timerID) {
		console.log("Timer is alread started:" + this.timerID);
		return;
	}

	var me = this;
	this.paused = false;
	this.startTime = Date.now();
	
	function onTimer() {
		if(!me.enable || !me.timerID || !me.parentShape) {
			me.timerID = null;
			return;
		}

		if(me.paused) {
			me.timerID = setTimeout(onTimer, me.getDuration());
			return;
		}

		me.callOnTimeoutHandler();

		me.times--;
		if(me.times <= 0) {
			me.timerID = null;
			console.log("timer stop " + me.name);
		}
		else {
			me.timerID = setTimeout(onTimer, me.getDuration());
		}
	}

	if(this.delayStart) {
		this.timerID = setTimeout(function() {
			me.timerID = setTimeout(onTimer, me.getDuration());
		}, this.delayStart);
	}
	else {
		this.timerID = setTimeout(onTimer, me.getDuration());
	}

	return this;
}

UITimer.prototype.stop = function() {
	if(this.timerID) {
		clearTimeout(this.timerID);
		this.timerID = null;
	}

	return this;
}

UITimer.prototype.pause = function() {
	this.paused = true;

	return this;
}

UITimer.prototype.resume = function() {
	this.paused = false;

	return this;
}

UITimer.prototype.getElapsedTime = function() {
	return Date.now() - this.startTime;
}

function UITimerCreator() {
	var args = ["ui-timer", "ui-timer", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITimer();
		return g.initUITimer(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITimerCreator());

