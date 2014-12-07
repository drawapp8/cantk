/*
 * File:   ui-sprite.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sprite for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISprite() {
	return;
}

UISprite.prototype = new UIElement();
UISprite.prototype.isUISprite = true;

UISprite.prototype.initUISprite = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onUpdateTransform", "onBeginContact", "onEndContact", "onMoved", "onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);


	return this;
}

UISprite.prototype.afterChildAppended = function(shape) {
	shape.xAttr = UIElement.X_CENTER_IN_PARENT;
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return;
}

UISprite.prototype.setValue = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return;
}

UISprite.prototype.setImageSrc = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return;
}

UISprite.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UISprite.prototype.getHtmlImage = function() {
	return this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
}

UISprite.prototype.getImageSrcRect = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(image) {
		return image.getImageRect();
	}
	else {
		return null;
	}
}

UISprite.prototype.drawImage =function(canvas) {
	var image = this.getBgHtmlImage();

	if(image) {
		var srcRect = this.getImageSrcRect();
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);
	}

	return;
}

UISprite.prototype.beforePaintChildren = function(canvas) {
	if(this.rotation) {
		var hw = this.w >> 1;
		var hh = this.h >> 1;

		canvas.translate(hw, hh);
		canvas.rotate(this.rotation);
		canvas.translate(-hw, -hh);
	}

	return;
}

UISprite.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPhysicsShape || shape.isUIMouseJoint || shape.isUISprite || shape.isUIStatus;
}

UISprite.prototype.onSized = UIImage.prototype.onSized;

function UISpriteCreator() {
	var args = ["ui-sprite", "ui-sprite", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISprite();
		return g.initUISprite(this.type, 200, 200, null);
	}
	
	return;
}
