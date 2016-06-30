/*
 * File:   ui-timer.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic timer for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2015  Holaverse Inc.
 * 
 */

/**
 * @class UITimer
 * @extends UIElement
 * 定时器。用于实现定时操作，可以通过setEnable启用或关闭定时器。定时器用来代替javascript原生的setInterval和setTimeout方法，它会在窗口退到后台自动暂停，取消预览时自动停止。可以使用setEnable来启用或禁用定时器。
 */

/**
 * @property {Number} times
 * 触发的次数，默认为100000000。
 */

/**
 * @property {String} durationType 
 * "random"使用随机时长，否则使用固定时长。
 */

/**
 * @property {Number} duration 
 * 使用固定时长的时长，默认为500，单位为毫秒。
 */

/**
 * @property {Number} durationMin
 * 使用随机时长的最小时长。
 */

/**
 * @property {Number} durationMax
 * 使用随机时长的最大时长。
 */
function UITimer() {
	return;
}

UITimer.prototype = new UIElement();
UITimer.prototype.isUITimer = true;
UITimer.prototype.saveProps = ["times", "delayStart", "durationType", "duration", "durationMin", "durationMax"];

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
	var me = this;
	var win = this.win;

	function startTimer() {
		me.start();
		win.off("open", startTimer);
	}

	if(this.enable) {
		win.on("open", startTimer);

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
		if(!me.enable || !me.timerID || !me.parentShape || !me.win) {
			me.timerID = null;
			return;
		}

		if(me.paused) {
			me.timerID = setTimeout(onTimer, me.getDuration());
			return;
		}

		if(me.timeScaleIsZero()) {
			me.timerID = setTimeout(onTimer, me.getDuration());
			return;	
		}

		if(me.win.isVisible()) {
			me.callOnTimeoutHandler();
			me.times--;
		}

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

/**
 * @method pause
 * 暂停。
 * @return {UIElement} 返回控件本身。
 *
 */
UITimer.prototype.pause = function() {
	this.paused = true;

	return this;
}

/**
 * @method resume 
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */
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

