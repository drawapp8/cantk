/*
 * File:   ui-status.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Use color to present a value.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIStatus
 * @extends UIElement
 * 用来表示的事物状态，比如怪物的血量，角色的生命值。可以用setValue来改变当前的状态，value取值0-100。
 * 值为0触发onBecomeZero事件。
 * 值为100触发onBecomeFull事件。
 * 值有变化触发onChanged事件。
 *
 */

/**
 * @event onBecomeZero
 * value变为0时触发本事件。
 */

/**
 * @event onBecomeFull
 * value变为100时触发本事件。
 */

/**
 * @event onChanged
 * value变化时触发本事件。
 * @param {Number} value 当前的值。
 */

function UIStatus() {
	return;
}

UIStatus.prototype = new UIElement();
UIStatus.prototype.isUIStatus = true;

UIStatus.prototype.saveProps = ["horizonal", "realValue"];
UIStatus.prototype.initUIStatus = function(type, w, h) {
	this.initUIElement(type);	

	this.realValue = 0.5;
	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onBecomeZero", "onBecomeFull", "onChanged", "onUpdateTransform"]);

	return this;
}

UIStatus.prototype.shapeCanBeChild = function(shape) {
	return this.children.length===0 && shape.isUILabel;
}

UIStatus.prototype.setValue = function(value) {
	this.realValue = Math.max(0, Math.min(100, value))/100;

	if(this.realValue === 0) {
		this.callOnBecomeZeroHandler();
	}
	else if(this.realValue === 1) {
		this.callOnBecomeFullHandler();
	}

	this.callOnChangedHandler(this.getValue());

	return this.getValue();
}

UIStatus.prototype.getValue = function() {
	return Math.round(this.realValue * 100);
}

UIStatus.prototype.paintSelfOnly = function(canvas) {
	var value = this.realValue;
	var r = this.roundRadius;
	var bh = Math.round(value * this.h);
	var th = Math.round((1-value) * this.h);
	var lw = Math.round(value * this.w);
	var rw = Math.round((1-value) * this.w);

	canvas.save();
	canvas.beginPath();
	drawRoundRect(canvas, this.w, this.h, r);
	canvas.clip();

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.beginPath();
		if(this.horizonal) {
			canvas.translate(lw, 0);
			canvas.rect(0, 0, rw, this.h);
			canvas.translate(-lw, 0);
		}
		else {
			canvas.rect(0, 0, this.w, th);
		}
		canvas.fill();
	}

	if(!this.isTextColorTransparent()) {
		canvas.fillStyle = this.style.textColor;
		canvas.beginPath();
		if(this.horizonal) {
			canvas.rect(0, 0, lw, this.h);
		}
		else {
			canvas.translate(0, th);
			canvas.rect(0, 0, this.w, bh);
			canvas.translate(0, -th);
		}
		canvas.fill();
	}
	canvas.restore();

	if(!this.isStrokeColorTransparent() && this.style.lineWidth) {
		canvas.beginPath();
		canvas.lineWidth = this.style.lineWidth;
		canvas.strokeStyle = this.style.lineColor;
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.BL | RoundRect.BR | RoundRect.TL | RoundRect.TR);
		canvas.stroke();
	}
	canvas.beginPath();

	return;
}

function UIStatusCreator() {
	var args = ["ui-status", "ui-status", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIStatus();
		return g.initUIStatus(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIStatusCreator());

