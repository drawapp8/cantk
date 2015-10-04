/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */


function UIImage() {
	return;
}

UIImage.prototype = new UIElement();
UIImage.prototype.isUIImage = true;

UIImage.prototype.initUIImage = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
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
	this.addEventNames(["onDoubleClick", "onUpdateTransform"]);

	return this;
}

UIImage.prototype.setValue = function(value) {
	return this.setImageSrc(value);
}

UIImage.prototype.getValue = function() {
	return this.getImageSrc();
}

UIImage.prototype.setImageSrc = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return this;
}

UIImage.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getHtmlImage = function(type) {
	return this.getHtmlImageByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getImageSrcRect = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(this.srcRect) {
		return this.srcRect;
	}
	else if(image) {
		return image.getImageRect();
	}
	else {
		return null;
	}
}

UIImage.prototype.setImageSrcRect = function(x, y, w, h) {
	this.srcRect = {};
	this.srcRect.x = x;
	this.srcRect.y = y;
	this.srcRect.w = w;
	this.srcRect.h = h;

	return;
}

UIImage.prototype.drawBgImage =function(canvas) {
	var image = this.getBgHtmlImage();

	if(image) {
		var srcRect = this.getImageSrcRect();
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);
	}

	return;
}

UIImage.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

function UIImageCreator(type) {
	var args = [type, "ui-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImage();
		return g.initUIImage(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-image"));
ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-icon"));

//for compatible
UIImage.prototype.setBorderStyle = function(borderColor, borderWidth) {
	return;
}

UIImage.prototype.setClickedStyle = function(type, param) {

	return;
}

