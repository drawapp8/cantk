/*
 * File:   ui-footprint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  foot print
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIFootprint() {
	return;
}

UIFootprint.prototype = new UIElement();
UIFootprint.prototype.isUIFootprint = true;

UIFootprint.prototype.initUIFootprint = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);

	return this;
}

UIFootprint.prototype.paintSelfOnly = function(canvas) {
	if(this.mode === Shape.MODE_EDITING) {
		var x = this.w >> 1;
		var y = this.h >> 1;
		
		canvas.arc(x, y, 10, 0, 2 * Math.PI);
		canvas.fill();
	}

	return;
}

UIFootprint.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIFootprintCreator() {
	var args = ["ui-foot-print", "ui-foot-print", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIFootprint();
		return g.initUIFootprint(this.type, 200, 200, null);
	}
	
	return;
}
