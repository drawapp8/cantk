/*
 * File:   ui-image-button.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image Button
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageButton() {
	return;
}

UIImageButton.prototype = new UIElement();
UIImageButton.prototype.isUIImageButton = true;

UIImageButton.prototype.initUIImageButton = function(type, w, h) {
	this.initUIElement(type, w, h);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIImageButton.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UIImageButtonCreator(w, h) {
	var args = ["ui-image-button", "ui-image-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageButton();
		return g.initUIImageButton(this.type, w, h);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIImageButtonCreator(120, 90));

