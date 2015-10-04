/*
 * File:   ui-shaker.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  shaker 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 Holaverse Inc.
 * 
 */

function UIShaker() {
	return;
}

UIShaker.prototype = new UIImage();
UIShaker.prototype.isUIShaker = true;

UIShaker.prototype.initUIShaker = function(type, w, h) {
	this.initUIImage(type, w ,h);	

	return this;
}

UIShaker.prototype.setAmplitudeX = function(value) {
	this.amplitudeX = value;

	return this;
}

UIShaker.prototype.setAmplitudeY = function(value) {
	this.amplitudeY = value;

	return this;
}

UIShaker.prototype.setDuration = function(value) {
	this.duration = value;

	return this;
}

UIShaker.prototype.setTimes = function(value) {
	this.times = value;

	return this;
}

UIShaker.prototype.setAmplitudeModifier = function(value) {
	this.amplitudeModifier = value;

	return this;
}

UIShaker.prototype.getAmplitudeX = function() {
	return this.amplitudeX;
}

UIShaker.prototype.getAmplitudeY = function() {
	return this.amplitudeY;
}

UIShaker.prototype.getDuration = function() {
	return this.duration;
}

UIShaker.prototype.getTimes = function() {
	return this.times;
}

UIShaker.prototype.getAmplitudeModifier = function() {
	return this.amplitudeModifier;
}

UIShaker.prototype.setEnable = function(enable) {
	var parent = this.getParent();

	if(!parent || this.enable == enable) {
		return this;
	}

	if(!enable) {
		this.enable = enable;
		return this;
	}
	
	var me = this;
	var aX = this.amplitudeX ? this.amplitudeX : 0;
	var aY = this.amplitudeY ? this.amplitudeY : 0;
	var n = this.times ? this.times : 1;
	var duration = this.duration ? this.duration : 200;
	
	var startTime = Date.now();
	var oldPaintSelf = parent.paintSelf;
	var range = n * 2 * Math.PI;
	var am = this.amplitudeModifier;

	parent.paintSelf = function(canvas) {
		var dt = (Date.now() - startTime);

		if(dt < duration) {
			var factor = 1;
			var percent = dt/duration;
			var angle = range *  percent;
			var xo = aX * Math.cos(angle);
			var yo = aY * Math.sin(angle);

			if(am === "i") {
				factor = percent;
			}
			else if(am === "d") {
				factor = (1-percent);
			}
			else if(am === "i->d") {
				factor = 2 * (percent < 0.5 ? percent : (1-percent));
			}

			xo *= factor;
			yo *= factor;

			canvas.translate(xo, yo);
		}
		else {
			 parent.paintSelf = oldPaintSelf;
			 me.enable = false;
		}

		oldPaintSelf.call(parent, canvas);
	}
	
	return this;
}

function UIShakerCreator() {
	var args = ["ui-shaker", "ui-shaker", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIShaker();
		return g.initUIShaker(this.type, 80, 80);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIShakerCreator());

