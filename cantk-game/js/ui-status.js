/*
 * File:   ui-status.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Use color to present a value.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIStatus() {
	return;
}

UIStatus.prototype = new UIElement();
UIStatus.prototype.isUIStatus = true;

UIStatus.prototype.initUIStatus = function(type, w, h) {
	this.initUIElement(type);	

	this.value = 0.5;
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
	this.value = Math.max(0, Math.min(100, value))/100;

	if(this.value === 0) {
		this.callOnBecomeZeroHandler();
	}
	else if(this.value === 1) {
		this.callOnBecomeFullHandler();
	}

	this.callOnChangedHandler(this.value);

	return this.getValue();
}

UIStatus.prototype.getValue = function() {
	return Math.round(this.value * 100);
}

UIStatus.prototype.paintSelfOnly = function(canvas) {
	var value = this.value;
	var r = this.roundRadius;
	var bh = Math.round(value * this.h);
	var th = Math.round((1-value) * this.h);
	var lw = Math.round(value * this.w);
	var rw = Math.round((1-value) * this.w);

	if(!this.isFillColorTransparent()) {
		canvas.fillStyle = this.style.fillColor;
		canvas.beginPath();
		if(this.horizonal) {
			canvas.translate(lw, 0);
			drawRoundRect(canvas, rw, this.h, r, RoundRect.TR | RoundRect.BR);
			canvas.translate(-lw, 0);
		}
		else {
			drawRoundRect(canvas, this.w, th, r, RoundRect.TL | RoundRect.TR);
		}
		canvas.fill();
	}

	if(!this.isTextColorTransparent()) {
		canvas.fillStyle = this.style.textColor;
		canvas.beginPath();
		if(this.horizonal) {
			drawRoundRect(canvas, lw, this.h, r, RoundRect.TL | RoundRect.BL);
		}
		else {
			canvas.translate(0, th);
			drawRoundRect(canvas, this.w, bh, r, RoundRect.BL | RoundRect.BR);
			canvas.translate(0, -th);
		}
		canvas.fill();
	}
	
	if(!this.isStrokeColorTransparent() && this.style.lineWidth) {
		canvas.beginPath();
		canvas.lineWidth = this.style.lineWidth;
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.BL | RoundRect.BR | RoundRect.TL | RoundRect.TR);
		canvas.stroke();
	}

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

