/*
 * File:   ui-point.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  foot print
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPoint() {
	return;
}

UIPoint.prototype = new UIElement();
UIPoint.prototype.isUIPoint = true;

UIPoint.prototype.initUIPoint = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);

	return this;
}

UIPoint.prototype.paintSelfOnly = function(canvas) {
	var x = this.w >> 1;
	var y = this.h >> 1;

	canvas.beginPath();
	canvas.arc(x, y, 10, 0, 2 * Math.PI);

	if(!this.isFillColorTransparent()) {
		canvas.fill();
	}
	if(!this.isStrokeColorTransparent()) {
		canvas.stroke();
	}

	return;
}

UIPoint.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIPointCreator() {
	var args = ["ui-point", "ui-point", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPoint();
		return g.initUIPoint(this.type, 20, 20, null);
	}
	
	return;
}
