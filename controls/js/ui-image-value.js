/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Use image to present a value, such as sound volume/battery status.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageValue() {
	return;
}

UIImageValue.prototype = new UIImage();
UIImageValue.prototype.isUIImageValue = true;

UIImageValue.prototype.initUIImageValue = function(type, w, h) {
	this.initUIImage(type, w, h, null);	
	this.value = 0;

	return this;
}

UIImageValue.prototype.getImageSrcByValue = function(value) {
	var type = "option_image_" + value; 

	return this.getImageSrcByType(type);
}

UIImageValue.prototype.getValue = function() {
	return this.value;
}

UIImageValue.prototype.setValue = function(value) {
	var src = this.getImageSrcByValue(value);

	if(src) {
		this.value = value;
		this.setImage(UIElement.IMAGE_DEFAULT, src);
	}

	return this.value;
}

UIImageValue.prototype.inc = function() {
	var value = this.value + 1;

	return this.setValue(value);	
}

UIImageValue.prototype.dec = function() {
	var value = this.value - 1;

	return this.setValue(value);	
}

UIImageValue.prototype.shapeCanBeChild = function(shape) {
	return false;
}


function UIImageValueCreator(w, h, defaultImage) {
	var args = ["ui-image-value", "ui-image-value", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageValue();
		return g.initUIImageValue(this.type, w, h, defaultImage);
	}
	
	return;
}
