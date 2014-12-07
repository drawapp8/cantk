/*
 * File:   ui-circle.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic circle for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICircle() {
	return;
}

UICircle.prototype = new UIElement();
UICircle.prototype.isUICircle = true;
UICircle.prototype.isUIPhysicsShape = true;

UICircle.prototype.initUICircle = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.density = 1;
	this.friction = 0;
	this.restitution = 0;
	this.addEventNames(["onBeginContact", "onEndContact", "onMoved"]);

	return this;
}

UICircle.prototype.shapeCanBeChild = function(shape) {
	return this.children.length===0 && shape.isUIMouseJoint;
}

UICircle.prototype.paintSelfOnly = function(canvas) {
	if(!this.runtimeVisible && this.mode != Shape.MODE_EDITING && !this.isIcon) {
		return;
	}
	var x = this.w >> 1;
	var y = this.h >> 1;
	var r = Math.min(x, y);

	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;

	canvas.beginPath();
	canvas.arc(x, y, r, 0, Math.PI * 2);
	canvas.fill();
	canvas.stroke();

	return;
}

function UICircleCreator() {
	var args = ["ui-circle", "ui-circle", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICircle();
		return g.initUICircle(this.type, 200, 200, null);
	}
	
	return;
}
