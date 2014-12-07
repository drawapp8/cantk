/*
 * File:   ui-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIButton() {
	return;
}

UIButton.prototype = new UIElement();
UIButton.prototype.isUIButton = true;

UIButton.prototype.initUIButton = function(type, w, h) {
	this.initUIElement(type);	

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(50, 50);
	this.setAutoScaleFontSize(true);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setImage(UIElement.IMAGE_FOCUSED, null);
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
	this.setImage(UIElement.IMAGE_POINTER_OVER, null);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIButton.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUILabel || shape.isUIImage) {
		return true;
	}

	return false;
}

UIButton.prototype.paintSelfOnly =function(canvas) {
	if(this.pointerDown) {
		var image = this.getHtmlImageByType(UIElement.IMAGE_ACTIVE);

		if(!image) {
			canvas.fillRect(0, 0, this.w, this.h);
		}
	}

	return;
}

function UIButtonCreator(w, h) {
	var args = ["ui-button", "ui-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIButton();
		return g.initUIButton(this.type, w, h);
	}
	
	return;
}
