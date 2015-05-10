/*
 * File:   ui-art-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic art-text for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIArtText() {
	return;
}

UIArtText.prototype = new UIElement();
UIArtText.prototype.isUIArtText = true;

UIArtText.prototype.initUIArtText = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	this.setImage(UIElement.IMAGE_DEFAULT, null);

	this.setCanRectSelectable(false, true);
	this.addEventNames(["onUpdateTransform"]);

	return this;
}

UIArtText.prototype.setText = function(text) {
	var url = null;
	if(this.text !== text) {
		this.text = text;
		this.setImage(UIElement.IMAGE_DEFAULT, null);
	}

	return this;
}

UIArtText.prototype.getBgImage = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);

	if((!image || !image.src) && this.text) {
		var url = UIElement.createArtTextImage(this.text, this.style);	
		this.setImage(UIElement.IMAGE_DEFAULT, url);
		image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	}

	return image;
}

UIArtText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIArtTextCreator() {
	var args = ["ui-art-text", "ui-art-text", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIArtText();
		return g.initUIArtText(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIArtTextCreator());

