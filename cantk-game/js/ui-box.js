/*
 * File:   ui-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic box for game. 
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIBox() {
	return;
}

UIBox.prototype = new UIElement();
UIBox.prototype.isUIBox = true;
UIBox.prototype.isUIPhysicsShape = true;

UIBox.prototype.initUIBox = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.setImage(CANTK_IMAGE_DEFAULT, null);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;
	this.density = 1;
	this.friction = 0;
	this.restitution = 0;
	this.addEventNames(["onBeginContact", "onEndContact", "onMoved"]);

	return this;
}

UIBox.prototype.shapeCanBeChild = function(shape) {
	return this.children.length===0 && shape.isUIMouseJoint;
}

UIBox.prototype.paintSelfOnly = function(canvas) {
	if(!this.runtimeVisible && this.mode != C_MODE_EDITING && !this.isIcon) {
		return;
	}
	canvas.fillStyle = this.style.fillColor;
	canvas.strokeStyle = this.style.lineColor;
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.fill();
	canvas.stroke();

	return;
}

function UIBoxCreator() {
	var args = ["ui-box", "ui-box", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBox();
		return g.initUIBox(this.type, 200, 200, null);
	}
	
	return;
}
