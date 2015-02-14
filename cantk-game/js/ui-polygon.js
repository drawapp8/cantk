/*
 * File:   ui-polygon.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic polygon for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIPolygon() {
	return;
}

UIPolygon.prototype = new UIElement();
UIPolygon.prototype.isUIPolygon = true;
UIPolygon.prototype.isUIPhysicsShape = true;

UIPolygon.prototype.initUIPolygon = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.density = 1;
	this.friction = 0;
	this.restitution = 0;
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onBeginContact", "onEndContact", "onMoved"]);

	return this;
}

UIPolygon.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPoint;
}

UIPolygon.prototype.paintChildren = function(canvas) {
	var x0 = 0;
	var y0 = 0;

	this.defaultPaintChildren(canvas);

	canvas.beginPath();
	canvas.strokeStyle = this.style.lineColor;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		var x = iter.x + (iter.w >> 1);
		var y = iter.y + (iter.h >> 1);

		if(!i) {
			x0 = x;
			y0 = y;
			canvas.moveTo(x, y);
		}
		else {
			canvas.lineTo(x, y);
		}
	}
	canvas.lineTo(x0, y0);
	canvas.stroke();

	return;
}

UIPolygon.prototype.paintSelfOnly = function(canvas) {
	if(this.mode === Shape.MODE_EDITING || this.isIcon) {
		canvas.fillStyle = this.style.fillColor;
		canvas.strokeStyle = this.style.lineColor;
		canvas.rect(0, 0, this.w, this.h);
		canvas.fill();
		canvas.stroke();
	}

	return;
}

function UIPolygonCreator() {
	var args = ["ui-polygon", "ui-polygon", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPolygon();
		return g.initUIPolygon(this.type, 200, 200, null);
	}
	
	return;
}
