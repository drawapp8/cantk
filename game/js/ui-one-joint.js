/*
 * File:   ui-one-joint.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  one anchor joint 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIOneJoint() {
	return;
}

UIOneJoint.prototype = new UIElement();
UIOneJoint.prototype.isUIJoint = true;
UIOneJoint.prototype.isUIOneJoint = true;

UIOneJoint.prototype.initUIOneJoint = function(type) {
	this.initUIElement(type);	

	this.setDefSize(20, 20);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_POINT, null);

	return this;
}

UIOneJoint.prototype.paintSelfOnly = function(canvas) {
	var pImage = this.getImageByType(UIElement.IMAGE_POINT);
	if(pImage && pImage.getImage()) {
		var image = pImage.getImage();
		var srcRect = pImage.getImageRect();
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);
	}
	else {
		var fillIt = !this.isFillColorTransparent();
		var strokeIt = !this.isStrokeColorTransparent();

		if(fillIt || strokeIt) {
			var x = this.w >> 1;
			var y = this.h >> 1;
			canvas.beginPath();
			canvas.arc(x, y, 10, 0, 2 * Math.PI);
			
			if(fillIt) {
				canvas.fillStyle = this.style.fillColor;
				canvas.fill();
			}

			if(strokeIt) {
				canvas.strokeStyle = this.style.lineColor;
				canvas.lineWidth = this.style.lineWidth;
				canvas.stroke();
			}
		}
	}

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
		return g.initUIOneJoint(this.type);
	}
	
	return;
}
