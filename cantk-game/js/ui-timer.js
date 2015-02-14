/*
 * File:   ui-timer.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic timer for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
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
	
	this.times = 100000000;
	this.duration = 500;
	this.delayStart = 0;

	return this;
}

UITimer.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UITimer.prototype.onInit = function() {
	this.start();

	return;
}

UITimer.prototype.start = function() {
	if(this.timerID) {
		console.log("Timer is alread started:" + this.timerID);
		return;
	}

	var me = this;
	this.paused = false;
	this.startTime = Date.now();
	
	function onTimer() {
		if(me.paused) return;

		me.times--;

		if(me.parentShape) {
			me.callOnTimeoutHandler();
		}

		if(me.times <= 0 || !me.parentShape) {
			clearInterval(me.timerID);
			me.timerID = 0;
			console.log("timer stop " + me.name);
		}
	}

	if(this.delayStart) {
		setTimeout(function() {
			me.timerID = setInterval(onTimer, me.duration);
		}, this.delayStart);
	}
	else {
		this.timerID = setInterval(onTimer, me.duration);
	}

	return this;
}

UITimer.prototype.stop = function() {
	if(this.timerID) {
		clearInterval(this.timerID);
		this.timerID = 0;
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
