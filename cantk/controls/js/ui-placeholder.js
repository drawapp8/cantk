/*
 * File:   ui-placeholder.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Place Holder
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPlaceholder() {
	return;
}

UIPlaceholder.prototype = new UIElement();
UIPlaceholder.prototype.isUIPlaceholder = true;
UIPlaceholder.prototype.initUIPlaceholder = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setCanRectSelectable(false, false);

	return this;
}

UIPlaceholder.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPlaceholder.prototype.paintSelfOnly = function(canvas) {
	if(this.isInDesignMode()) {
		var x = this.vMargin;
		var y = this.hMargin;
		var w = this.getWidth(true);
		var h = this.getHeight(true);

		canvas.lineWidth = this.style.lineWidth;
		canvas.strokeStyle = this.style.lineColor;
		drawDashedRect(canvas, x, y, w, h);
		canvas.stroke();
	}

	return;
}

function UIVPlaceholderCreator(w, h) {
	var args = ["ui-v-placeholder", "ui-placeholder", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPlaceholder();

		g.initUIPlaceholder(this.type, w, h);
		g.widthAttr = UIElement.WIDTH_FILL_PARENT;
		g.MIN_SIZE = 4;
		g.setSizeLimit(20, 4);

		return g;
	}
	
	return;
}

function UIHPlaceholderCreator(w, h) {
	var args = ["ui-h-placeholder", "ui-placeholder", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPlaceholder();

		g.initUIPlaceholder(this.type, w, h);
		g.heightAttr = UIElement.HEIGHT_FILL_PARENT;
		g.MIN_SIZE = 4;
		g.setSizeLimit(4, 20);

		return g;
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIVPlaceholderCreator(100, 20));
ShapeFactoryGet().addShapeCreator(new UIHPlaceholderCreator(20, 100));

