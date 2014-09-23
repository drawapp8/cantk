/*
 * File:   ui-one-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  one anchor joint 
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIOneJoint() {
	return;
}

UIOneJoint.prototype = new UIElement();
UIOneJoint.prototype.isUIJoint = true;
UIOneJoint.prototype.isUIOneJoint = true;

UIOneJoint.prototype.initUIOneJoint = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;
	this.setImage(CANTK_IMAGE_DEFAULT, bg);

	return this;
}

UIOneJoint.prototype.paintSelfOnly = function(canvas) {
	if(!this.runtimeVisible && this.mode != C_MODE_EDITING && !this.isIcon) {
		return;
	}

	var x = this.w >> 1;
	var y = this.h >> 1;

	canvas.fillStyle = this.style.fillColor;

	canvas.beginPath();
	canvas.arc(x, y, 10, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	return;
}

UIOneJoint.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIOneJointCreator() {
	var args = ["ui-one-joint", "ui-one-joint", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIOneJoint();
		return g.initUIOneJoint(this.type, 20, 20, null);
	}
	
	return;
}
