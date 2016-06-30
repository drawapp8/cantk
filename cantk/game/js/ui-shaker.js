/*
 * File:   ui-shaker.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  shaker 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 Holaverse Inc.
 * 
 */

/**
 * @class UIShaker
 * @extends UIElement
 * 振动器。在启用时(setEnable(true))让所在的父控件(通常是场景)按指定参数振动，振动完成后自动进入禁用状态。
 *
 */
function UIShaker() {
	return;
}

UIShaker.prototype = new UIImage();
UIShaker.prototype.isUIShaker = true;

UIShaker.prototype.saveProps = ["amplitudeX", "amplitudeY", "times", "duration", "amplitudeModifier"];
UIShaker.prototype.initUIShaker = function(type, w, h) {
	this.initUIImage(type, w ,h);	

	return this;
}

/**
 * @method setAmplitudeX
 * 设置水平方向上的振幅。
 * @param {Number} value value为正向先向右动，为负向先向左动。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setAmplitudeX = function(value) {
	this.amplitudeX = value;

	return this;
}

/**
 * @method setAmplitudeY
 * 设置垂直方向上的振幅。
 * @param {Number} value 为正向先向下动，为负向先向上动。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setAmplitudeY = function(value) {
	this.amplitudeY = value;

	return this;
}

/**
 * @method setDuration
 * 设置振动持续的时间。
 * @param {Number} value 振动持续的时间。
 * @return {UIElement} 返回控件本身。
 */
UIShaker.prototype.setDuration = function(value) {
	this.duration = value;

	return this;
}

/**
 * @method setTimes
 * 设置振动的次数。
 * @param {Number} value 次数。
 * @return {UIElement} 返回控件本身。
 */
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

